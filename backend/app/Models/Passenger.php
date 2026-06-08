<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Passenger extends Model
{
    protected $fillable = [
        'user_id',
        'registered_at',
        'average_rating',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function rides()
    {
        return $this->hasMany(Ride::class);
    }

    public function rideRequests()
    {
        return $this->hasMany(RideRequest::class);
    }
}
