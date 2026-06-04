<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory;

    protected $fillable = [
        'name',
        'last_name',
        'email',
        'password',
        'phone_number',
        'email_confirmed',
        'lockout_enabled',
        'access_failed_count',
        'status',
    ];

    protected $hidden = ['password'];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'email_confirmed' => 'boolean',
            'lockout_enabled' => 'boolean',
        ];
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles');
    }

    public function userRoles()
    {
        return $this->hasMany(UserRole::class);
    }

    public function claims()
    {
        return $this->hasMany(UserClaim::class);
    }

    public function userTokens()
    {
        return $this->hasMany(UserToken::class);
    }

    public function refreshTokens()
    {
        return $this->hasMany(RefreshToken::class);
    }

    public function driver()
    {
        return $this->hasOne(Driver::class);
    }

    public function passenger()
    {
        return $this->hasOne(Passenger::class);
    }

    public function wallet()
    {
        return $this->hasOne(Wallet::class);
    }

    public function hasRole(string $roleName): bool
    {
        return $this->roles()->where('normalized_name', strtoupper($roleName))->exists();
    }
}
