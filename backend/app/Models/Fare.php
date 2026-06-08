<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fare extends Model
{
    protected $fillable = [
        'service_type',
        'base_price',
        'price_per_km',
        'price_per_min',
        'peak_hour_rate',
        'status',
    ];

    public function rides()
    {
        return $this->hasMany(Ride::class);
    }
}
