<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class RedirectRule extends Model
{
    protected $fillable = [
        'source_url',
        'destination_url',
        'status_code',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'status_code' => 'integer',
    ];

    protected static function booted()
    {
        static::saved(function () {
            Cache::forget('redirect_rules');
        });

        static::deleted(function () {
            Cache::forget('redirect_rules');
        });
    }
}
