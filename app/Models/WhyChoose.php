<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WhyChoose extends Model
{
    //
    protected $fillable = [
        'title',
        'subtitle',
        'items',
    ];
    protected $casts = [
        'items' => 'array',
    ];
}
