<?php

namespace App\Models;

use App\Traits\HasSeoMetadata;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Destination extends Model
{
    use HasSeoMetadata;

    protected $fillable = [
        'name',
        'slug',
        'region',
        'country',
        'description',
        'banner_image',
        'banner_accordion_tags',
        'destination_details',
        'best_season_title',
        'best_season_accordions',
        'must_visit_title',
        'must_visit_accordions',
        'practical_information_title',
        'practical_information_accordions',
        'essential_tips',
        'cultural_etiquette',
    ];

    protected $casts = [
        'banner_accordion_tags'            => 'array',
        'destination_details'              => 'array',
        'best_season_accordions'           => 'array',
        'must_visit_accordions'            => 'array',
        'practical_information_accordions' => 'array',
        'essential_tips'                   => 'array',
        'cultural_etiquette'               => 'array',
    ];

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function packages()
    {
        return $this->morphToMany(Package::class, 'packageable');
    }

    // ----------------- File Deletion -----------------
    protected static function booted()
    {
       static::updating(function ($destination) {
    // Banner image
    $oldBanner = $destination->getOriginal('banner_image');
    if (!empty($oldBanner) && $destination->banner_image !== $oldBanner) {
        Storage::disk('direct_public')->delete($oldBanner);
    }

    // Repeaters
    $repeaterFields = [
        'banner_accordion_tags',
        'destination_details',
        'best_season_accordions',
        'must_visit_accordions',
        'practical_information_accordions',
    ];

    foreach ($repeaterFields as $field) {
        $oldItems = $destination->getOriginal($field) ?? [];
        $newItems = $destination->{$field} ?? [];

        foreach ($oldItems as $index => $oldItem) {
            if (!isset($newItems[$index])) {
                foreach ($oldItem as $key => $value) {
                    if (($key === 'image' || $key === 'icon') && !empty($value)) {
                        Storage::disk('direct_public')->delete($value);
                    }
                }
            } else {
                foreach ($oldItem as $key => $value) {
                    if (($key === 'image' || $key === 'icon') && !empty($value)) {
                        if (!isset($newItems[$index][$key]) || $newItems[$index][$key] !== $value) {
                            Storage::disk('direct_public')->delete($value);
                        }
                    }
                }
            }
        }
    }

    // If the file was removed in Filament, null the attribute
    if (empty($destination->banner_image)) {
        $destination->banner_image = null;
    }
});

    static::deleting(function ($destination) {
        if ($destination->banner_image) {
            Storage::disk('direct_public')->delete($destination->banner_image);
        }

        $repeaterFields = [
            'banner_accordion_tags',
            'destination_details',
            'best_season_accordions',
            'must_visit_accordions',
            'practical_information_accordions',
        ];

        foreach ($repeaterFields as $field) {
            $items = $destination->{$field} ?? [];
            foreach ($items as $item) {
                foreach ($item as $key => $value) {
                    if (($key === 'image' || $key === 'icon') && !empty($value)) {
                        Storage::disk('direct_public')->delete($value);
                    }
                }
            }
        }
    });
    }

    public function placeExplores()
    {
        return $this->morphToMany(\App\Models\PlaceExplore::class, 'exploreable', 'place_exploreables');
    }
}
