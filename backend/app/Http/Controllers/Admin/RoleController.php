<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RoleController extends Controller
{
    public function index()
    {
        return response()->json(Role::all());
    }

    public function store(Request $request)
    {
        $v = Validator::make($request->all(), [
            'name'            => 'required|string|max:100',
            'description'     => 'nullable|string',
            'normalized_name' => 'required|string|unique:roles,normalized_name',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $role = Role::create($v->validated());
        return response()->json($role, 201);
    }

    public function show(Role $role)
    {
        return response()->json($role);
    }

    public function update(Request $request, Role $role)
    {
        $v = Validator::make($request->all(), [
            'name'            => 'sometimes|string|max:100',
            'description'     => 'nullable|string',
            'normalized_name' => 'sometimes|string|unique:roles,normalized_name,' . $role->id,
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $role->update($v->validated());
        return response()->json($role);
    }

    public function destroy(Role $role)
    {
        $role->delete();
        return response()->json(['message' => 'Role deleted.']);
    }
}
