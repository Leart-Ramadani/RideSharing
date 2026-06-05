<?php

namespace App\Http\Controllers\Passenger;

use App\Http\Controllers\Controller;
use App\Models\Rating;
use App\Models\Ride;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class RatingController extends Controller
{
    private function passenger()
    {
        return auth()->user()->passenger;
    }

    /**
     * Submit a rating for a completed ride's driver.
     */
    public function store(Request $request, Ride $ride)
    {
        $passenger = $this->passenger();

        if (!$passenger || $ride->passenger_id !== $passenger->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        if ($ride->status !== 'Completed') {
            return response()->json(['message' => 'You can only rate completed rides.'], 422);
        }

        if (!$ride->driver_id) {
            return response()->json(['message' => 'No driver to rate for this ride.'], 422);
        }

        // Prevent duplicate ratings
        $existingRating = Rating::where('ride_id', $ride->id)
            ->where('rater_id', auth()->id())
            ->first();

        if ($existingRating) {
            return response()->json(['message' => 'You have already rated this ride.'], 422);
        }

        $v = Validator::make($request->all(), [
            'score'   => 'required|numeric|min:1|max:5',
            'comment' => 'nullable|string|max:500',
        ]);

        if ($v->fails()) {
            return response()->json(['errors' => $v->errors()], 422);
        }

        $rating = DB::transaction(function () use ($ride, $request, $passenger) {
            $driver      = $ride->driver;
            $driverUserId = $driver->user_id;

            $rating = Rating::create([
                'ride_id'  => $ride->id,
                'rater_id' => auth()->id(),
                'rated_id' => $driverUserId,
                'score'    => $request->score,
                'comment'  => $request->comment,
                'rated_at' => now(),
            ]);

            // Recalculate the driver's average rating
            $avgScore = Rating::where('rated_id', $driverUserId)->avg('score');
            $driver->update(['average_rating' => round($avgScore, 2)]);

            return $rating;
        });

        return response()->json($rating, 201);
    }

    /**
     * Check if the passenger has already rated a specific ride.
     */
    public function show(Ride $ride)
    {
        $passenger = $this->passenger();

        if (!$passenger || $ride->passenger_id !== $passenger->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $rating = Rating::where('ride_id', $ride->id)
            ->where('rater_id', auth()->id())
            ->first();

        return response()->json(['rated' => (bool) $rating, 'rating' => $rating]);
    }
}
