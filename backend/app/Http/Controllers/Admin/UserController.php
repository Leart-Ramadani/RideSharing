<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->latest()->get();
        return response()->json($users);
    }

    public function store(Request $request)
    {
        $v = Validator::make($request->all(), [
            'name'         => 'required|string|max:100',
            'last_name'    => 'required|string|max:100',
            'email'        => 'required|email|unique:users,email',
            'password'     => 'required|string|min:6',
            'phone_number' => 'nullable|string|max:20',
            'status'       => 'nullable|in:Active,Suspended,Inactive',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $data = $v->validated();
        $user = User::create($data);

        return response()->json($user->load('roles'), 201);
    }

    public function show(User $user)
    {
        return response()->json($user->load('roles'));
    }

    public function update(Request $request, User $user)
    {
        $v = Validator::make($request->all(), [
            'name'         => 'sometimes|string|max:100',
            'last_name'    => 'sometimes|string|max:100',
            'email'        => 'sometimes|email|unique:users,email,' . $user->id,
            'phone_number' => 'nullable|string|max:20',
            'status'       => 'nullable|in:Active,Suspended,Inactive',
            'password'     => 'nullable|string|min:6',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $data = collect($v->validated())->reject(fn($v) => is_null($v))->toArray();
        $user->update($data);

        return response()->json($user->load('roles'));
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User deleted.']);
    }

    public function toggleStatus(User $user)
    {
        $user->update([
            'status' => $user->status === 'Active' ? 'Suspended' : 'Active',
        ]);
        return response()->json($user);
    }
}
