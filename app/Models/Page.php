<?php

namespace App\Models;

use App\Traits\HasSeoMetadata;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    use HasSeoMetadata;

    protected $fillable = [
        'top_title',
        'title',
        'highlight',
        'slug',
        'subtitle',
        'icon',
        'banner_image',
        'links',
        'content_blocks',
        'additional_sections',
        'cta',
    ];
    protected $casts = [
        'links' => 'array',
        'content_blocks' => 'array',
        'additional_sections' => 'array',
        'cta' => 'array',
    ];

    public function placeExplores()
    {
        return $this->morphToMany(\App\Models\PlaceExplore::class, 'exploreable', 'place_exploreables');
    }
}
