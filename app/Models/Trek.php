<?php

namespace App\Models;

use App\Traits\HasSeoMetadata;
use Illuminate\Database\Eloquent\Model;

class Trek extends Model
{
    use HasSeoMetadata;

    protected $fillable = [
        'name',
        'slug',
        'banner_accordions',
        'overviews',
        'essential_info',
        'faq',
    ];

    protected $casts = [
        'banner_accordions' => 'array',
        'overviews' => 'array',
        'essential_info' => 'array',
        'faq' => 'array',
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
