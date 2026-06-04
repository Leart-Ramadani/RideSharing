<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UserRole;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserRoleController extends Controller
{
    public function index()
    {
        return response()->json(UserRole::with(['user', 'role'])->get());
    }

    public function store(Request $request)
    {
        $v = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'role_id' => 'required|exists:roles,id',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $exists = UserRole::where($v->validated())->exists();
        if ($exists) {
            return response()->json(['message' => 'User already has this role.'], 409);
        }

        $userRole = UserRole::create($v->validated());
        return response()->json($userRole->load(['user', 'role']), 201);
    }

    public function destroy(UserRole $userRole)
    {
        $userRole->delete();
        return response()->json(['message' => 'Role removed from user.']);
    }
}
