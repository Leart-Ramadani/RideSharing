<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DriverPayout;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DriverPayoutController extends Controller
{
    public function index()
    {
        return response()->json(DriverPayout::with('driver')->latest()->get());
    }

    public function store(Request $request)
    {
        $v = Validator::make($request->all(), [
            'driver_id'    => 'required|exists:drivers,id',
            'period_start' => 'required|date',
            'period_end'   => 'required|date|after:period_start',
            'total_amount' => 'required|numeric|min:0',
            'commission'   => 'required|numeric|min:0',
            'net_amount'   => 'required|numeric|min:0',
            'status'       => 'nullable|in:Pending,Paid,Cancelled',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $payout = DriverPayout::create($v->validated());
        return response()->json($payout->load('driver'), 201);
    }

    public function show(DriverPayout $driverPayout)
    {
        return response()->json($driverPayout->load('driver'));
    }

    public function update(Request $request, DriverPayout $driverPayout)
    {
        $v = Validator::make($request->all(), [
            'period_start' => 'sometimes|date',
            'period_end'   => 'sometimes|date',
            'total_amount' => 'sometimes|numeric|min:0',
            'commission'   => 'sometimes|numeric|min:0',
            'net_amount'   => 'sometimes|numeric|min:0',
            'status'       => 'nullable|in:Pending,Paid,Cancelled',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $driverPayout->update($v->validated());
        return response()->json($driverPayout->load('driver'));
    }

    public function destroy(DriverPayout $driverPayout)
    {
        $driverPayout->delete();
        return response()->json(['message' => 'Payout deleted.']);
    }
}
