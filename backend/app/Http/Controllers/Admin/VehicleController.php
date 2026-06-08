<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VehicleController extends Controller
{
    public function index()
    {
        return response()->json(Vehicle::with('driver')->latest()->get());
    }

    public function store(Request $request)
    {
        $v = Validator::make($request->all(), [
            'driver_id'    => 'required|exists:drivers,id',
            'make'         => 'required|string|max:100',
            'model'        => 'required|string|max:100',
            'year'         => 'required|integer|min:2000|max:2030',
            'color'        => 'required|string|max:50',
            'plate_number' => 'required|string|unique:vehicles,plate_number',
            'seats'        => 'required|integer|min:1|max:20',
            'fuel_type'    => 'nullable|string',
            'status'       => 'nullable|in:Active,Inactive',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $vehicle = Vehicle::create($v->validated());
        return response()->json($vehicle->load('driver'), 201);
    }

    public function show(Vehicle $vehicle)
    {
        return response()->json($vehicle->load('driver'));
    }

    public function update(Request $request, Vehicle $vehicle)
    {
        $v = Validator::make($request->all(), [
            'driver_id'    => 'sometimes|exists:drivers,id',
            'make'         => 'sometimes|string|max:100',
            'model'        => 'sometimes|string|max:100',
            'year'         => 'sometimes|integer|min:2000|max:2030',
            'color'        => 'sometimes|string|max:50',
            'plate_number' => 'sometimes|string|unique:vehicles,plate_number,' . $vehicle->id,
            'seats'        => 'sometimes|integer|min:1|max:20',
            'fuel_type'    => 'nullable|string',
            'status'       => 'nullable|in:Active,Inactive',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $vehicle->update($v->validated());
        return response()->json($vehicle->load('driver'));
    }

    public function destroy(Vehicle $vehicle)
    {
        $vehicle->delete();
        return response()->json(['message' => 'Vehicle deleted.']);
    }
}
