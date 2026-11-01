<?php

namespace App\Models;

use App\Traits\HasSeoMetadata;
use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    use HasSeoMetadata;

    protected $fillable = [
        'title',
        'description',
        'image',
        'icon',
        'slug',
        'details',
        'popular_adventures',
        'places_explore',
        'best_time',
        'advantages',
        'cta',
    ];
    protected $casts = [
        'details' => 'array',
        'popular_adventures' => 'array',
        'places_explore' => 'array',
        'best_time' => 'array',
        'advantages' => 'array',
        'cta' => 'array',
    ];

    public function packages()
    {
        return $this->morphToMany(Package::class, 'packageable');
    }

    public function placeExplores()
    {
        return $this->morphToMany(\App\Models\PlaceExplore::class, 'exploreable', 'place_exploreables');
    }
}
