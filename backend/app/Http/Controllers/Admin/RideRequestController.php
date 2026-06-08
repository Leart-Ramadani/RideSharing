<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RideRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RideRequestController extends Controller
{
    public function index()
    {
        return response()->json(RideRequest::with('passenger')->latest()->get());
    }

    public function store(Request $request)
    {
        $v = Validator::make($request->all(), [
            'passenger_id'   => 'required|exists:passengers,id',
            'pickup_address' => 'required|string',
            'dropoff_address'=> 'required|string',
            'service_type'   => 'nullable|string',
            'status'         => 'nullable|in:Pending,Accepted,Cancelled',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $rr = RideRequest::create($v->validated());
        return response()->json($rr->load('passenger'), 201);
    }

    public function show(RideRequest $rideRequest)
    {
        return response()->json($rideRequest->load('passenger'));
    }

    public function update(Request $request, RideRequest $rideRequest)
    {
        $v = Validator::make($request->all(), [
            'pickup_address' => 'sometimes|string',
            'dropoff_address'=> 'sometimes|string',
            'service_type'   => 'nullable|string',
            'status'         => 'nullable|in:Pending,Accepted,Cancelled',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $rideRequest->update($v->validated());
        return response()->json($rideRequest->load('passenger'));
    }

    public function destroy(RideRequest $rideRequest)
    {
        $rideRequest->delete();
        return response()->json(['message' => 'Ride request deleted.']);
    }
}
