<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    public function index()
    {
        return response()->json(Payment::with('ride')->latest()->get());
    }

    public function store(Request $request)
    {
        $v = Validator::make($request->all(), [
            'ride_id'        => 'required|exists:rides,id',
            'amount'         => 'required|numeric|min:0',
            'payment_method' => 'nullable|string',
            'paid_at'        => 'nullable|date',
            'status'         => 'nullable|in:Pending,Completed,Failed,Refunded',
            'reference'      => 'nullable|string',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $payment = Payment::create($v->validated());
        return response()->json($payment->load('ride'), 201);
    }

    public function show(Payment $payment)
    {
        return response()->json($payment->load('ride'));
    }

    public function update(Request $request, Payment $payment)
    {
        $v = Validator::make($request->all(), [
            'amount'         => 'sometimes|numeric|min:0',
            'payment_method' => 'nullable|string',
            'paid_at'        => 'nullable|date',
            'status'         => 'nullable|in:Pending,Completed,Failed,Refunded',
            'reference'      => 'nullable|string',
        ]);

        if ($v->fails()) return response()->json(['errors' => $v->errors()], 422);

        $payment->update($v->validated());
        return response()->json($payment->load('ride'));
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();
        return response()->json(['message' => 'Payment deleted.']);
    }
}
