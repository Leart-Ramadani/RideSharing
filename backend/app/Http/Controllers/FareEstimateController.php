<?php

namespace App\Http\Controllers\Passenger;

use App\Http\Controllers\Controller;
use App\Models\Fare;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FareEstimateController extends Controller
{
    /**
     * Return an estimated fare for all service types given a distance.
     * The frontend can call this before the passenger submits a ride request.
     */
    public function estimate(Request $request)
    {
        $v = Validator::make($request->all(), [
            'distance_km'  => 'required|numeric|min:0.1',
            'duration_min' => 'nullable|integer|min:1',
        ]);

        if ($v->fails()) {
            return response()->json(['errors' => $v->errors()], 422);
        }

        $distanceKm  = (float) $request->distance_km;
        $durationMin = (int)   ($request->duration_min ?? 10);

        $hour       = now()->hour;
        $isPeakHour = ($hour >= 7 && $hour < 9) || ($hour >= 17 && $hour < 19);

        $fares      = Fare::where('status', 'Active')->get();
        $estimates  = [];

        foreach ($fares as $fare) {
            $peakRate = $isPeakHour ? $fare->peak_hour_rate : 1.0;
            $total    = ($fare->base_price + ($fare->price_per_km * $distanceKm) + ($fare->price_per_min * $durationMin)) * $peakRate;

            $estimates[] = [
                'service_type' => $fare->service_type,
                'estimated'    => round(max($total, 1.00), 2),
                'is_peak_hour' => $isPeakHour,
            ];
        }

        return response()->json($estimates);
    }
}
