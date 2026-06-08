<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RatingController extends Controller
{
    public function index()
    {
        return response()->json(Rating::with(['ride', 'rater', 'rated'])->latest()->get());
    }

    public function store(Request $request)
    {
        $v = Validator::make($request->all(), [
            'ride_id'  => 'required|exists:rides,id',
            'rater_id' => 'required|exists:users,id',
            'rated_id' => 'required|exists:users,id',
            'score'    => 'required|integer|min:1|max:5',
            'comment'  => 'nullable|string',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $rating = Rating::create($v->validated());
        return response()->json($rating->load(['ride', 'rater', 'rated']), 201);
    }

    public function show(Rating $rating)
    {
        return response()->json($rating->load(['ride', 'rater', 'rated']));
    }

    public function update(Request $request, Rating $rating)
    {
        $v = Validator::make($request->all(), [
            'score'   => 'sometimes|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $rating->update($v->validated());
        return response()->json($rating->load(['ride', 'rater', 'rated']));
    }

    public function destroy(Rating $rating)
    {
        $rating->delete();
        return response()->json(['message' => 'Rating deleted.']);
    }
}
