<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    protected $fillable = [
        'user_id',
        'license_number',
        'license_expiry',
        'average_rating',
        'status',
        'profile_photo',
        'is_online',
    ];

    protected $casts = [
        'is_online' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function vehicles()
    {
        return $this->hasMany(Vehicle::class);
    }

    public function rides()
    {
        return $this->hasMany(Ride::class);
    }

    public function payouts()
    {
        return $this->hasMany(DriverPayout::class);
    }
}
