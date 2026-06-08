<?php

namespace App\Http\Controllers\Passenger;

use App\Http\Controllers\Controller;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class WalletController extends Controller
{
    /**
     * Get or create the wallet for the authenticated user, then return it with transactions.
     */
    public function show()
    {
        $user   = auth()->user();
        $wallet = $user->wallet ?? Wallet::create(['user_id' => $user->id, 'balance' => 0]);

        return response()->json([
            'balance'      => $wallet->balance,
            'transactions' => $wallet->transactions()->latest()->take(20)->get(),
        ]);
    }

    /**
     * Add funds to the wallet (simulates a top-up; in a real app this would go through a payment gateway).
     */
    public function topUp(Request $request)
    {
        $v = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:1|max:500',
        ]);

        if ($v->fails()) {
            return response()->json(['errors' => $v->errors()], 422);
        }

        $user   = auth()->user();
        $wallet = $user->wallet ?? Wallet::create(['user_id' => $user->id, 'balance' => 0]);

        DB::transaction(function () use ($wallet, $request) {
            $wallet->credit((float) $request->amount, 'Wallet top-up');
        });

        return response()->json([
            'message' => 'Wallet topped up successfully.',
            'balance' => $wallet->fresh()->balance,
        ]);
    }
}
