<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'ride_id',
        'amount',
        'payment_method',
        'paid_at',
        'status',
        'reference',
    ];

    protected function casts(): array
    {
        return ['paid_at' => 'datetime'];
    }

    public function ride()
    {
        return $this->belongsTo(Ride::class);
    }
}
