<?php

namespace App\Http\Controllers\Passenger;

use App\Http\Controllers\Controller;
use App\Models\Rating;
use App\Models\Ride;

class RideController extends Controller
{
    private function passenger()
    {
        return auth()->user()->passenger;
    }

    public function index()
    {
        $passenger = $this->passenger();
        if (!$passenger) return response()->json(['message' => 'Passenger profile not found.'], 404);

        $rides = Ride::where('passenger_id', $passenger->id)
            ->with(['driver.user', 'vehicle', 'payment', 'fare'])
            ->latest()
            ->get()
            ->map(function ($ride) {
                // Tell the frontend if this ride has already been rated
                $ride->already_rated = Rating::where('ride_id', $ride->id)
                    ->where('rater_id', auth()->id())
                    ->exists();
                return $ride;
            });

        return response()->json($rides);
    }

    public function show(Ride $ride)
    {
        $passenger = $this->passenger();
        if (!$passenger || $ride->passenger_id !== $passenger->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $ride->load(['driver.user', 'vehicle', 'payment', 'fare']);
        $ride->already_rated = Rating::where('ride_id', $ride->id)
            ->where('rater_id', auth()->id())
            ->exists();

        return response()->json($ride);
    }
}
