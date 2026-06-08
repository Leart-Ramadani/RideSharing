<?php

namespace App\Http\Controllers\Passenger;

use App\Http\Controllers\Controller;
use App\Models\RideRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RideRequestController extends Controller
{
    private function passenger()
    {
        return auth()->user()->passenger;
    }

    public function index()
    {
        $passenger = $this->passenger();
        if (!$passenger) return response()->json(['message' => 'Passenger profile not found.'], 404);

        $requests = RideRequest::where('passenger_id', $passenger->id)
            ->latest()
            ->get();

        return response()->json($requests);
    }

    public function store(Request $request)
    {
        $passenger = $this->passenger();
        if (!$passenger) return response()->json(['message' => 'Passenger profile not found.'], 404);

        $v = Validator::make($request->all(), [
            'pickup_address'  => 'required|string|max:255',
            'dropoff_address' => 'required|string|max:255',
            'service_type'    => 'required|in:Standard,Premium,XL',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $rideRequest = RideRequest::create([
            'passenger_id'    => $passenger->id,
            'pickup_address'  => $request->pickup_address,
            'dropoff_address' => $request->dropoff_address,
            'service_type'    => $request->service_type,
            'requested_at'    => now(),
            'status'          => 'Pending',
        ]);

        return response()->json($rideRequest, 201);
    }

    public function show(RideRequest $rideRequest)
    {
        $passenger = $this->passenger();
        if (!$passenger || $rideRequest->passenger_id !== $passenger->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        return response()->json($rideRequest);
    }

    public function cancel(RideRequest $rideRequest)
    {
        $passenger = $this->passenger();
        if (!$passenger || $rideRequest->passenger_id !== $passenger->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        if ($rideRequest->status !== 'Pending') {
            return response()->json(['message' => 'Only pending requests can be cancelled.'], 422);
        }

        $rideRequest->update(['status' => 'Cancelled']);

        return response()->json($rideRequest->fresh());
    }
}
