<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RideRequest extends Model
{
    protected $fillable = [
        'passenger_id',
        'pickup_address',
        'dropoff_address',
        'requested_at',
        'service_type',
        'status',
    ];

    protected function casts(): array
    {
        return ['requested_at' => 'datetime'];
    }

    public function passenger()
    {
        return $this->belongsTo(Passenger::class);
    }
}
