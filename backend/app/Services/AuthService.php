<?php

namespace App\Services;

use App\Models\Driver;
use App\Models\Passenger;
use App\Models\RefreshToken;
use App\Models\Role;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthService
{
    public function register(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name'            => $data['name'],
                'last_name'       => $data['last_name'],
                'email'           => $data['email'],
                'password'        => $data['password'],
                'phone_number'    => $data['phone_number'] ?? null,
                'email_confirmed' => false,
                'status'          => 'Active',
            ]);

            $roleName = $data['role'] ?? 'Passenger';
            $role = Role::where('normalized_name', strtoupper($roleName))->firstOrFail();
            UserRole::create(['user_id' => $user->id, 'role_id' => $role->id]);

            if (strtoupper($roleName) === 'DRIVER') {
                Driver::create([
                    'user_id'        => $user->id,
                    'license_number' => $data['license_number'],
                    'license_expiry' => $data['license_expiry'],
                    'status'         => 'Active',
                ]);
            } elseif (strtoupper($roleName) === 'PASSENGER') {
                Passenger::create([
                    'user_id'       => $user->id,
                    'registered_at' => now()->toDateString(),
                ]);
            }

            $token   = JWTAuth::fromUser($user);
            $refresh = $this->createRefreshToken($user);

            return [
                'user'          => $user->load('roles'),
                'access_token'  => $token,
                'refresh_token' => $refresh->token,
                'token_type'    => 'bearer',
                'expires_in'    => config('jwt.ttl') * 60,
            ];
        });
    }

    public function login(string $email, string $password): ?array
    {
        $token = JWTAuth::attempt(['email' => $email, 'password' => $password]);

        if (!$token) {
            return null;
        }

        $user = JWTAuth::user();

        if ($user->status !== 'Active') {
            return null;
        }

        $user->update(['access_failed_count' => 0]);
        $refresh = $this->createRefreshToken($user);

        return [
            'user'          => $user->load('roles'),
            'access_token'  => $token,
            'refresh_token' => $refresh->token,
            'token_type'    => 'bearer',
            'expires_in'    => config('jwt.ttl') * 60,
        ];
    }

    public function refresh(string $refreshToken): ?array
    {
        $record = RefreshToken::where('token', $refreshToken)->first();

        if (!$record || $record->isExpired() || $record->isRevoked()) {
            return null;
        }

        $record->update(['revoked' => now()]);
        $user        = $record->user;
        $token       = JWTAuth::fromUser($user);
        $newRefresh  = $this->createRefreshToken($user);

        return [
            'access_token'  => $token,
            'refresh_token' => $newRefresh->token,
            'token_type'    => 'bearer',
            'expires_in'    => config('jwt.ttl') * 60,
        ];
    }

    public function logout(): void
    {
        JWTAuth::invalidate(JWTAuth::getToken());
    }

    private function createRefreshToken(User $user): RefreshToken
    {
        return RefreshToken::create([
            'user_id' => $user->id,
            'token'   => Str::random(80),
            'expires' => now()->addDays(30),
            'created' => now(),
        ]);
    }
}
