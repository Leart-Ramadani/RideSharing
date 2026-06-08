<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DriverPayout extends Model
{
    protected $fillable = [
        'driver_id',
        'period_start',
        'period_end',
        'total_amount',
        'commission',
        'net_amount',
        'status',
    ];

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }
}
