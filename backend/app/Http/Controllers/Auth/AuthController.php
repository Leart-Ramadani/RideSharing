<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function __construct(private AuthService $authService) {}

    public function register(Request $request)
    {
        $rules = [
            'name'         => 'required|string|max:100',
            'last_name'    => 'required|string|max:100',
            'email'        => 'required|email|unique:users,email',
            'password'     => 'required|string|min:6|confirmed',
            'phone_number' => 'required|string|max:20',
            'role'         => 'required|in:Driver,Passenger',
        ];

        if ($request->input('role') === 'Driver') {
            $rules['license_number'] = 'required|string|max:50';
            $rules['license_expiry'] = 'required|date|after:today';
        }

        $v = Validator::make($request->all(), $rules);

        if ($v->fails()) {
            return response()->json(['errors' => $v->errors()], 422);
        }

        try {
            $result = $this->authService->register($v->validated());
            return response()->json($result, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Registration failed. Please try again.'], 500);
        }
    }

    public function login(Request $request)
    {
        $v = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if ($v->fails()) {
            return response()->json(['errors' => $v->errors()], 422);
        }

        $result = $this->authService->login($request->email, $request->password);

        if (!$result) {
            return response()->json(['message' => 'Invalid credentials or account is inactive.'], 401);
        }

        return response()->json($result);
    }

    public function refresh(Request $request)
    {
        $v = Validator::make($request->all(), [
            'refresh_token' => 'required|string',
        ]);

        if ($v->fails()) {
            return response()->json(['errors' => $v->errors()], 422);
        }

        $result = $this->authService->refresh($request->refresh_token);

        if (!$result) {
            return response()->json(['message' => 'Invalid or expired refresh token.'], 401);
        }

        return response()->json($result);
    }

    public function logout()
    {
        $this->authService->logout();
        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function me()
    {
        return response()->json(auth()->user()->load('roles'));
    }
}
