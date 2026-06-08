<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Fare;
use App\Models\Ride;
use App\Models\RideRequest;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class RideRequestController extends Controller
{
    private function driver()
    {
        return auth()->user()->driver;
    }

    /**
     * Show all pending ride requests that this driver can accept.
     * Only shown when the driver is online and has an active vehicle.
     */
    public function index()
    {
        $driver = $this->driver();

        if (!$driver) {
            return response()->json(['message' => 'Driver profile not found.'], 404);
        }

        $requests = RideRequest::where('status', 'Pending')
            ->with(['passenger.user'])
            ->latest()
            ->get();

        return response()->json($requests);
    }

    /**
     * Accept a pending ride request.
     * This creates an actual Ride record and links it to the request.
     */
    public function accept(Request $request, RideRequest $rideRequest)
    {
        $driver = $this->driver();

        if (!$driver) {
            return response()->json(['message' => 'Driver profile not found.'], 404);
        }

        if ($rideRequest->status !== 'Pending') {
            return response()->json(['message' => 'This request is no longer available.'], 422);
        }

        // Find the driver's active vehicle
        $vehicle = $driver->vehicles()->where('status', 'Active')->first();
        if (!$vehicle) {
            return response()->json(['message' => 'You need an active vehicle to accept rides.'], 422);
        }

        // Match fare by service type
        $fare = Fare::where('service_type', $rideRequest->service_type)
            ->where('status', 'Active')
            ->first();

        $ride = DB::transaction(function () use ($rideRequest, $driver, $vehicle, $fare) {
            // Mark request as accepted so no other driver can grab it
            $rideRequest->update(['status' => 'Accepted']);

            // Create the actual ride record
            return Ride::create([
                'passenger_id'    => $rideRequest->passenger_id,
                'driver_id'       => $driver->id,
                'vehicle_id'      => $vehicle->id,
                'fare_id'         => $fare?->id,
                'ride_request_id' => $rideRequest->id,
                'pickup_address'  => $rideRequest->pickup_address,
                'dropoff_address' => $rideRequest->dropoff_address,
                'status'          => 'Accepted',
            ]);
        });

        return response()->json($ride->load(['passenger.user', 'vehicle', 'fare']), 201);
    }

    /**
     * Reject a pending ride request (marks it as Cancelled from the driver's side).
     */
    public function reject(RideRequest $rideRequest)
    {
        $driver = $this->driver();

        if (!$driver) {
            return response()->json(['message' => 'Driver profile not found.'], 404);
        }

        if ($rideRequest->status !== 'Pending') {
            return response()->json(['message' => 'This request is no longer available.'], 422);
        }

        $rideRequest->update(['status' => 'Cancelled']);

        return response()->json(['message' => 'Request rejected.']);
    }
}
