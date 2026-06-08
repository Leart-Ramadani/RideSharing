<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    protected $fillable = ['user_id', 'balance'];

    protected $casts = [
        'balance' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transactions()
    {
        return $this->hasMany(WalletTransaction::class)->latest();
    }

    /**
     * Add funds to the wallet and record the transaction.
     */
    public function credit(float $amount, string $description = 'Top-up', ?int $rideId = null): WalletTransaction
    {
        $this->increment('balance', $amount);

        return $this->transactions()->create([
            'type'        => 'credit',
            'amount'      => $amount,
            'description' => $description,
            'ride_id'     => $rideId,
        ]);
    }

    /**
     * Deduct funds from the wallet and record the transaction.
     * Throws an exception if balance is insufficient.
     */
    public function debit(float $amount, string $description = 'Ride payment', ?int $rideId = null): WalletTransaction
    {
        if ($this->balance < $amount) {
            throw new \Exception('Insufficient wallet balance.');
        }

        $this->decrement('balance', $amount);

        return $this->transactions()->create([
            'type'        => 'debit',
            'amount'      => $amount,
            'description' => $description,
            'ride_id'     => $rideId,
        ]);
    }
}
