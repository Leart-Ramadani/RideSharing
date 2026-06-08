<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Passenger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PassengerController extends Controller
{
    public function index()
    {
        return response()->json(Passenger::latest()->get());
    }

    public function store(Request $request)
    {
        $v = Validator::make($request->all(), [
            'first_name'   => 'required|string|max:100',
            'last_name'    => 'required|string|max:100',
            'email'        => 'required|email|unique:passengers,email',
            'phone'        => 'nullable|string|max:20',
            'registered_at'=> 'nullable|date',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $data = $v->validated();
        $data['registered_at'] = $data['registered_at'] ?? now()->toDateString();
        $passenger = Passenger::create($data);

        return response()->json($passenger, 201);
    }

    public function show(Passenger $passenger)
    {
        return response()->json($passenger);
    }

    public function update(Request $request, Passenger $passenger)
    {
        $v = Validator::make($request->all(), [
            'first_name' => 'sometimes|string|max:100',
            'last_name'  => 'sometimes|string|max:100',
            'email'      => 'sometimes|email|unique:passengers,email,' . $passenger->id,
            'phone'      => 'nullable|string|max:20',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $passenger->update($v->validated());
        return response()->json($passenger);
    }

    public function destroy(Passenger $passenger)
    {
        $passenger->delete();
        return response()->json(['message' => 'Passenger deleted.']);
    }
}
