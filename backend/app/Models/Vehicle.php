<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    protected $fillable = [
        'driver_id',
        'make',
        'model',
        'year',
        'color',
        'plate_number',
        'seats',
        'fuel_type',
        'status',
    ];

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }

    public function rides()
    {
        return $this->hasMany(Ride::class);
    }
}
