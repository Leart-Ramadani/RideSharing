<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Ride;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class RideController extends Controller
{
    private function driver()
    {
        return auth()->user()->driver;
    }

    public function index()
    {
        $driver = $this->driver();
        if (!$driver) return response()->json(['message' => 'Driver profile not found.'], 404);

        $rides = Ride::where('driver_id', $driver->id)
            ->with(['passenger.user', 'vehicle'])
            ->latest()
            ->get();

        return response()->json($rides);
    }

    public function show(Ride $ride)
    {
        $driver = $this->driver();
        if (!$driver || $ride->driver_id !== $driver->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        return response()->json($ride->load(['passenger.user', 'vehicle', 'payment', 'fare']));
    }

    /**
     * Update the status of a ride.
     * When status changes to Completed, the fare is calculated and a payment record is created.
     */
    public function updateStatus(Request $request, Ride $ride)
    {
        $driver = $this->driver();
        if (!$driver || $ride->driver_id !== $driver->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $v = Validator::make($request->all(), [
            'status'      => 'required|in:InProgress,Completed,Cancelled',
            'distance_km' => 'nullable|numeric|min:0',
            'duration_min'=> 'nullable|integer|min:0',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $newStatus = $request->status;

        // Validate status transitions
        $allowedTransitions = [
            'Accepted'   => ['InProgress', 'Cancelled'],
            'InProgress' => ['Completed', 'Cancelled'],
        ];

        if (!in_array($newStatus, $allowedTransitions[$ride->status] ?? [])) {
            return response()->json(['message' => "Cannot transition from '{$ride->status}' to '{$newStatus}'."], 422);
        }

        DB::transaction(function () use ($ride, $request, $newStatus) {
            $updates = ['status' => $newStatus];

            if ($request->filled('distance_km')) {
                $updates['distance_km'] = $request->distance_km;
            }
            if ($request->filled('duration_min')) {
                $updates['duration_min'] = $request->duration_min;
            }

            // Calculate and charge fare when the ride is completed
            if ($newStatus === 'Completed') {
                $totalFare = $this->calculateFare($ride, $request);
                $updates['total_fare'] = $totalFare;

                // Debit passenger's wallet and create payment record
                $passenger    = $ride->passenger;
                $passengerUser = $passenger->user;
                $wallet       = $passengerUser->wallet;

                if ($wallet && $wallet->balance >= $totalFare) {
                    $wallet->debit($totalFare, "Ride #{$ride->id} payment", $ride->id);

                    Payment::updateOrCreate(
                        ['ride_id' => $ride->id],
                        [
                            'amount'         => $totalFare,
                            'payment_method' => 'Wallet',
                            'paid_at'        => now(),
                            'status'         => 'Completed',
                            'reference'      => 'WALLET-' . strtoupper(uniqid()),
                        ]
                    );
                } else {
                    // Create a pending payment if wallet has insufficient funds
                    Payment::updateOrCreate(
                        ['ride_id' => $ride->id],
                        [
                            'amount'         => $totalFare,
                            'payment_method' => 'Cash',
                            'status'         => 'Pending',
                        ]
                    );
                }
            }

            $ride->update($updates);
        });

        return response()->json($ride->fresh()->load(['passenger.user', 'vehicle', 'payment', 'fare']));
    }

    /**
     * Calculate total fare based on distance, duration, and the fare configuration.
     */
    private function calculateFare(Ride $ride, Request $request): float
    {
        $fare = $ride->fare;

        if (!$fare) {
            // Fallback: flat rate if no fare config exists
            return 5.00;
        }

        $distanceKm  = (float) ($request->distance_km ?? $ride->distance_km ?? 0);
        $durationMin = (int)   ($request->duration_min ?? $ride->duration_min ?? 0);

        // Check for peak hours (07:00-09:00 and 17:00-19:00)
        $hour       = now()->hour;
        $isPeakHour = ($hour >= 7 && $hour < 9) || ($hour >= 17 && $hour < 19);
        $peakRate   = $isPeakHour ? $fare->peak_hour_rate : 1.0;

        $total = ($fare->base_price + ($fare->price_per_km * $distanceKm) + ($fare->price_per_min * $durationMin)) * $peakRate;

        // Apply promo code discount if one was used
        if ($ride->promoCode && $ride->promoCode->status === 'Active') {
            $discount = $total * ($ride->promoCode->discount_percent / 100);
            $maxDiscount = $ride->promoCode->max_value;
            $total -= min($discount, $maxDiscount);
        }

        return max(round($total, 2), 1.00); // Minimum fare of €1.00
    }
}
