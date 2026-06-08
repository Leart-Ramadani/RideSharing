<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ride extends Model
{
    protected $fillable = [
        'passenger_id',
        'driver_id',
        'vehicle_id',
        'fare_id',
        'promo_code_id',
        'ride_request_id',
        'pickup_lat',
        'pickup_lng',
        'dropoff_lat',
        'dropoff_lng',
        'pickup_address',
        'dropoff_address',
        'distance_km',
        'duration_min',
        'status',
        'total_fare',
    ];

    public function passenger()
    {
        return $this->belongsTo(Passenger::class);
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function fare()
    {
        return $this->belongsTo(Fare::class);
    }

    public function promoCode()
    {
        return $this->belongsTo(PromoCode::class);
    }

    public function rideRequest()
    {
        return $this->belongsTo(RideRequest::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }
}
