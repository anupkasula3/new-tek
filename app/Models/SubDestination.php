<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\HasSeoMetadata;
use Illuminate\Database\Eloquent\Model;

class SubDestination extends Model
{
    use HasFactory, HasSeoMetadata;

    protected $table = 'sub_destination';

    protected $fillable = [
        'name',
        'slug',
        'destination_slug',
        'banner_image',
        'description',
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
