<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\HasSeoMetadata;

class PlaceExplore extends Model
{
    use HasSeoMetadata;

    protected $fillable = [
        'title',
        'slug',
        'location',
        'featured_image',
        'overview',
        'tags',
        'status',
        'published_at',
        'is_featured',
        'content',
    ];

    protected $casts = [
        'content' => 'array',
        'published_at' => 'datetime',
        'is_featured' => 'boolean',
    ];
}
