<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use App\Models\Role;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class DriverController extends Controller
{
    public function index()
    {
        return response()->json(Driver::with(['user', 'vehicles'])->latest()->get());
    }

    public function store(Request $request)
    {
        $v = Validator::make($request->all(), [
            'name'           => 'required|string|max:100',
            'last_name'      => 'required|string|max:100',
            'email'          => 'required|email|unique:users,email',
            'phone_number'   => 'required|string|max:20',
            'password'       => 'required|string|min:6',
            'license_number' => 'required|string|max:50',
            'license_expiry' => 'required|date',
            'status'         => 'nullable|in:Active,Suspended,Inactive',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        try {
            $driver = DB::transaction(function () use ($v) {
                $data = $v->validated();

                $user = User::create([
                    'name'         => $data['name'],
                    'last_name'    => $data['last_name'],
                    'email'        => $data['email'],
                    'password'     => Hash::make($data['password']),
                    'phone_number' => $data['phone_number'],
                    'status'       => 'Active',
                ]);

                $driverRole = Role::where('normalized_name', 'DRIVER')->first();
                if ($driverRole) {
                    UserRole::create(['user_id' => $user->id, 'role_id' => $driverRole->id]);
                }

                return Driver::create([
                    'user_id'        => $user->id,
                    'license_number' => $data['license_number'],
                    'license_expiry' => $data['license_expiry'],
                    'status'         => $data['status'] ?? 'Active',
                ]);
            });

            return response()->json($driver->load('user'), 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create driver.'], 500);
        }
    }

    public function show(Driver $driver)
    {
        return response()->json($driver->load(['user', 'vehicles']));
    }

    public function update(Request $request, Driver $driver)
    {
        $v = Validator::make($request->all(), [
            'license_number' => 'sometimes|string|max:50',
            'license_expiry' => 'sometimes|date',
            'status'         => 'nullable|in:Active,Suspended,Inactive',
            'name'           => 'sometimes|string|max:100',
            'last_name'      => 'sometimes|string|max:100',
            'phone_number'   => 'nullable|string|max:20',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $data = $v->validated();

        DB::transaction(function () use ($driver, $data) {
            $userFields = array_filter(
                array_intersect_key($data, array_flip(['name', 'last_name', 'phone_number'])),
                fn($v) => $v !== null
            );
            if ($userFields) {
                $driver->user->update($userFields);
            }

            $driverFields = array_filter(
                array_intersect_key($data, array_flip(['license_number', 'license_expiry', 'status'])),
                fn($v) => $v !== null
            );
            if ($driverFields) {
                $driver->update($driverFields);
            }
        });

        return response()->json($driver->fresh()->load('user'));
    }

    public function destroy(Driver $driver)
    {
        $driver->user?->delete();
        return response()->json(['message' => 'Driver deleted.']);
    }
}
