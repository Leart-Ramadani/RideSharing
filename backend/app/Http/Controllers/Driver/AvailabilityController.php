<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;

class AvailabilityController extends Controller
{
    /**
     * Toggle the driver's online/offline status.
     */
    public function toggle()
    {
        $driver = auth()->user()->driver;

        if (!$driver) {
            return response()->json(['message' => 'Driver profile not found.'], 404);
        }

        $driver->update(['is_online' => !$driver->is_online]);

        return response()->json([
            'is_online' => $driver->is_online,
            'message'   => $driver->is_online ? 'You are now online.' : 'You are now offline.',
        ]);
    }
}
