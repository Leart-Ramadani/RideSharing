<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    protected $fillable = [
        'ride_id',
        'rater_id',
        'rated_id',
        'score',
        'comment',
        'rated_at',
    ];

    protected function casts(): array
    {
        return ['rated_at' => 'datetime'];
    }

    public function ride()
    {
        return $this->belongsTo(Ride::class);
    }

    public function rater()
    {
        return $this->belongsTo(User::class, 'rater_id');
    }

    public function rated()
    {
        return $this->belongsTo(User::class, 'rated_id');
    }
}
