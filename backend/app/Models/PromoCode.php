<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PromoCode extends Model
{
    protected $fillable = [
        'code',
        'discount_percent',
        'max_value',
        'start_date',
        'expiry_date',
        'max_uses',
        'times_used',
        'status',
    ];

    public function rides()
    {
        return $this->hasMany(Ride::class);
    }
}
