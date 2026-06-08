<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Fare;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FareController extends Controller
{
    public function index()
    {
        return response()->json(Fare::all());
    }

    public function store(Request $request)
    {
        $v = Validator::make($request->all(), [
            'service_type'  => 'required|string|max:100',
            'base_price'    => 'required|numeric|min:0',
            'price_per_km'  => 'required|numeric|min:0',
            'price_per_min' => 'required|numeric|min:0',
            'peak_hour_rate'=> 'nullable|numeric|min:1',
            'status'        => 'nullable|in:Active,Inactive',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $fare = Fare::create($v->validated());
        return response()->json($fare, 201);
    }

    public function show(Fare $fare)
    {
        return response()->json($fare);
    }

    public function update(Request $request, Fare $fare)
    {
        $v = Validator::make($request->all(), [
            'service_type'  => 'sometimes|string|max:100',
            'base_price'    => 'sometimes|numeric|min:0',
            'price_per_km'  => 'sometimes|numeric|min:0',
            'price_per_min' => 'sometimes|numeric|min:0',
            'peak_hour_rate'=> 'nullable|numeric|min:1',
            'status'        => 'nullable|in:Active,Inactive',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $fare->update($v->validated());
        return response()->json($fare);
    }

    public function destroy(Fare $fare)
    {
        $fare->delete();
        return response()->json(['message' => 'Fare deleted.']);
    }
}
