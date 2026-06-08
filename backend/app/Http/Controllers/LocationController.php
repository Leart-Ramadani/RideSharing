<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LocationController extends Controller
{
    public function index()
    {
        return response()->json(Location::latest()->get());
    }

    public function store(Request $request)
    {
        $v = Validator::make($request->all(), [
            'name'      => 'required|string|max:150',
            'address'   => 'required|string',
            'latitude'  => 'required|numeric',
            'longitude' => 'required|numeric',
            'type'      => 'nullable|string',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $location = Location::create($v->validated());
        return response()->json($location, 201);
    }

    public function show(Location $location)
    {
        return response()->json($location);
    }

    public function update(Request $request, Location $location)
    {
        $v = Validator::make($request->all(), [
            'name'      => 'sometimes|string|max:150',
            'address'   => 'sometimes|string',
            'latitude'  => 'sometimes|numeric',
            'longitude' => 'sometimes|numeric',
            'type'      => 'nullable|string',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $location->update($v->validated());
        return response()->json($location);
    }

    public function destroy(Location $location)
    {
        $location->delete();
        return response()->json(['message' => 'Location deleted.']);
    }
}
