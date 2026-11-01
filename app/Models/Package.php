<?php

namespace App\Models;

use App\Traits\HasSeoMetadata;
use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    use HasSeoMetadata;

    protected $fillable = [
        'title','slug','country','region','category','banner_image',
        'description', 'difficulty_title', 'difficulty_subtitle',
        'duration_days', 'active_trekking_days', 'max_altitude', 'max_altitude_location', 'distance_km',
        'best_season','price','difficulty', 'difficulty_description', 'experience_title', 'experience_subtitle', 'experience', 'main_content', 'quick_summary', 'quick_summary_title',

        'walking_title', 'walking_subtitle', 'walking_per_day', 
        'altitude_title', 'altitude_subtitle', 'max_altitude', 'max_altitude_location',
        'duration_title', 'duration_subtitle', 'duration_days', 'active_trekking_days',
        'terrain_title', 'terrain_subtitle', 'terrain',
        'physical_fitness', 'technical_skill', 'altitude_factor', 'endurance',

        'featured_image', 'is_featured', 'is_popular', 'is_best_selling', 'status', 'published_at', 'sticky',
        'banner_accordion_tags', 'pax_pricing',
        'allow_deposit', 'deposit_percentage',
        'meta_title', 'meta_description', 'canonical_url', 'noindex',
        'map_image', 'limited_seats_threshold',
        'package_tiers', 'packing_list', 'packing_list_note', 'experience_note', 'experience_note_title', 'itinerary_title', 'itinerary_subtitle', 'itinerary_description', 'itinerary_note', 'itinerary_note_title',
    ];

    protected $casts = [
        'banner_accordion_tags' => 'array',
        'pax_pricing' => 'array',
        'package_tiers' => 'array',
        'packing_list' => 'array',
        'published_at' => 'datetime',
        'allow_deposit' => 'boolean',
        'deposit_percentage' => 'float',
        'is_popular' => 'boolean',
        'is_best_selling' => 'boolean',
    ];

    public function calculatePrice(int $persons, ?string $tierSlug = null): float
    {
        $basePrice = (float)str_replace(',', '', $this->price);

        if (empty($this->pax_pricing) || !is_array($this->pax_pricing)) {
            return $basePrice;
        }

        $allPaxPricing = collect($this->pax_pricing);

        // If a tier slug is given, try tier-specific rows first
        if ($tierSlug) {
            $tierRows = $allPaxPricing
                ->filter(fn ($p) => isset($p['tier']) && $p['tier'] === $tierSlug
                    && isset($p['pax']) && $p['pax'] !== ''
                    && isset($p['price']) && $p['price'] !== '')
                ->sortBy('pax');

            if ($tierRows->isNotEmpty()) {
                $match = $tierRows->first(fn ($p) => $persons <= (int)$p['pax']);
                return $match
                    ? (float)str_replace(',', '', $match['price'])
                    : (float)str_replace(',', '', $tierRows->last()['price']);
            }

            // No tier-specific rows — try to use the tier's own base price from package_tiers
            $packageTiers = collect($this->package_tiers ?? []);
            $tierDef = $packageTiers->first(fn ($t) =>
                !empty($t['name']) && \Illuminate\Support\Str::slug($t['name']) === $tierSlug
            );
            if ($tierDef && isset($tierDef['price']) && $tierDef['price'] !== '') {
                return (float)str_replace(',', '', $tierDef['price']);
            }
        }

        // Fallback: use pax_pricing rows that have no tier (or all rows if none without tier)
        $defaultRows = $allPaxPricing
            ->filter(fn ($p) => (empty($p['tier']) || $p['tier'] === 'default')
                && isset($p['pax']) && $p['pax'] !== ''
                && isset($p['price']) && $p['price'] !== '')
            ->sortBy('pax');

        if ($defaultRows->isEmpty()) {
            $defaultRows = $allPaxPricing
                ->filter(fn ($p) => isset($p['pax']) && $p['pax'] !== ''
                    && isset($p['price']) && $p['price'] !== '')
                ->sortBy('pax');
        }

        if ($defaultRows->isEmpty()) {
            return $basePrice;
        }

        $match = $defaultRows->first(fn ($p) => $persons <= (int)$p['pax']);
        return $match
            ? (float)str_replace(',', '', $match['price'])
            : (float)str_replace(',', '', $defaultRows->last()['price']);
    }

    public function itineraries()    { return $this->hasMany(PackageItinerary::class); }
    public function includes()        { return $this->hasMany(PackageInclude::class); }
    public function excludes()        { return $this->hasMany(PackageExclude::class); }
    public function addons()          { return $this->hasMany(PackageAddon::class); }
    public function seasons()         { return $this->hasMany(PackageSeason::class); }
    public function usefulInfos()     { return $this->hasMany(PackageUsefulInfo::class); }
    public function faqs()            { return $this->hasMany(Faq::class); }
    public function reviews()         { return $this->belongsToMany(Review::class); }
    public function bookings()        { return $this->hasMany(Booking::class); }
    public function departures()      { return $this->hasMany(Departure::class); }

    // Polymorphic relationships
    public function destinations()    { return $this->morphedByMany(Destination::class,    'packageable'); }
    public function subDestinations() { return $this->morphedByMany(SubDestination::class,  'packageable'); }
    public function experiences()     { return $this->morphedByMany(Experience::class,      'packageable'); }
    public function treks()           { return $this->morphedByMany(Trek::class,            'packageable'); }

    public function placeExplores()
    {
        return $this->morphToMany(\App\Models\PlaceExplore::class, 'exploreable', 'place_exploreables');
    }

    public function addonPackages()
    {
        return $this->hasMany(AddonPackage::class)->orderBy('sort_order');
    }

    public function activeAddonPackages()
    {
        return $this->hasMany(AddonPackage::class)
            ->where('is_active', true)
            ->orderBy('sort_order');
    }
}
