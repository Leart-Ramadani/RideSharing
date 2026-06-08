<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    /**
     * Update the authenticated user's basic profile information.
     */
    public function update(Request $request)
    {
        $user = auth()->user();

        $v = Validator::make($request->all(), [
            'name'         => 'sometimes|string|max:100',
            'last_name'    => 'sometimes|string|max:100',
            'phone_number' => ['sometimes', 'string', 'max:20', Rule::unique('users')->ignore($user->id)],
        ]);

        if ($v->fails()) {
            return response()->json(['errors' => $v->errors()], 422);
        }

        $user->update($request->only(['name', 'last_name', 'phone_number']));

        return response()->json($user->fresh()->load('roles'));
    }

    /**
     * Change the authenticated user's password.
     */
    public function changePassword(Request $request)
    {
        $v = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'password'         => 'required|string|min:8|confirmed',
        ]);

        if ($v->fails()) {
            return response()->json(['errors' => $v->errors()], 422);
        }

        $user = auth()->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect.'], 422);
        }

        $user->update(['password' => $request->password]);

        return response()->json(['message' => 'Password changed successfully.']);
    }
}
