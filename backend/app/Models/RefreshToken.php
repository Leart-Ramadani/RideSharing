<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RefreshToken extends Model
{
    protected $fillable = ['user_id', 'token', 'expires', 'created', 'revoked'];

    protected function casts(): array
    {
        return [
            'expires' => 'datetime',
            'created' => 'datetime',
            'revoked' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function isExpired(): bool
    {
        return $this->expires->isPast();
    }

    public function isRevoked(): bool
    {
        return $this->revoked !== null;
    }
}
