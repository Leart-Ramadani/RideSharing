<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ride;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RideController extends Controller
{
    public function index()
    {
        return response()->json(
            Ride::with(['passenger', 'driver', 'vehicle', 'fare', 'promoCode'])->latest()->get()
        );
    }

    public function store(Request $request)
    {
        $v = Validator::make($request->all(), [
            'passenger_id'   => 'required|exists:passengers,id',
            'driver_id'      => 'nullable|exists:drivers,id',
            'vehicle_id'     => 'nullable|exists:vehicles,id',
            'fare_id'        => 'nullable|exists:fares,id',
            'promo_code_id'  => 'nullable|exists:promo_codes,id',
            'pickup_address' => 'required|string',
            'dropoff_address'=> 'required|string',
            'pickup_lat'     => 'nullable|numeric',
            'pickup_lng'     => 'nullable|numeric',
            'dropoff_lat'    => 'nullable|numeric',
            'dropoff_lng'    => 'nullable|numeric',
            'distance_km'    => 'nullable|numeric',
            'duration_min'   => 'nullable|integer',
            'status'         => 'nullable|in:Pending,Accepted,InProgress,Completed,Cancelled',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $ride = Ride::create($v->validated());
        return response()->json($ride->load(['passenger', 'driver', 'vehicle']), 201);
    }

    public function show(Ride $ride)
    {
        return response()->json($ride->load(['passenger', 'driver', 'vehicle', 'fare', 'promoCode', 'payment', 'ratings']));
    }

    public function update(Request $request, Ride $ride)
    {
        $v = Validator::make($request->all(), [
            'driver_id'     => 'nullable|exists:drivers,id',
            'vehicle_id'    => 'nullable|exists:vehicles,id',
            'fare_id'       => 'nullable|exists:fares,id',
            'promo_code_id' => 'nullable|exists:promo_codes,id',
            'distance_km'   => 'nullable|numeric',
            'duration_min'  => 'nullable|integer',
            'status'        => 'nullable|in:Pending,Accepted,InProgress,Completed,Cancelled',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $ride->update($v->validated());
        return response()->json($ride->load(['passenger', 'driver', 'vehicle']));
    }

    public function destroy(Ride $ride)
    {
        $ride->delete();
        return response()->json(['message' => 'Ride deleted.']);
    }
}
