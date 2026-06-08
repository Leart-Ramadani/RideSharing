<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Ride;

class ProfileController extends Controller
{
    /**
     * Return the driver's full profile, including stats needed for the dashboard.
     */
    public function me()
    {
        $user   = auth()->user();
        $driver = $user->driver;

        if (!$driver) return response()->json(['message' => 'Driver profile not found.'], 404);

        // Calculate earnings from completed rides
        $totalEarnings = Payment::whereHas('ride', fn($q) => $q->where('driver_id', $driver->id))
            ->where('status', 'Completed')
            ->sum('amount');

        $profile = $driver->load(['user', 'vehicles']);
        $profile->total_earnings = round($totalEarnings, 2);

        return response()->json($profile);
    }
}
