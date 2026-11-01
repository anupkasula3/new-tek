<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = [
        'site_name',
        'mail_to',
        'logo',
        'sticky_logo',
        'favicon',
        'about_text',
        'address',
        'primary_phone',
        'secondary_phone',
        'primary_email',
        'map_embed_url',
        'facebook_url',
        'twitter_url',
        'instagram_url',
        'youtube_url',
        'opening_hours_days',
        'opening_hours_time',
        'opening_hours_off_day',
        'location_info',
        'footer_gallery',
        'review_buttons',
        'custom_code_scripts',
        'google_review_url',
        'tripadvisor_review_url',
    ];

    protected $casts = [
        'footer_gallery' => 'array',
        'review_buttons' => 'array',
        'custom_code_scripts' => 'array',
    ];

    protected $appends = ['logo_url', 'sticky_logo_url', 'favicon_url', 'footer_gallery_urls'];

    public function getLogoUrlAttribute()
    {
        return $this->logo ? asset($this->logo) : asset('assets/images/himalayan-white-logo.png');
    }

    public function getStickyLogoUrlAttribute()
    {
        return $this->sticky_logo ? asset($this->sticky_logo) : asset('assets/images/himalayan-white-logo.png');
    }

    public function getFaviconUrlAttribute()
    {
        return $this->favicon ? asset($this->favicon) : null;
    }

    public function getFooterGalleryUrlsAttribute()
    {
        $images = $this->footer_gallery ?? [];
        return array_values(array_filter(array_map(fn($path) => $path ? asset($path) : null, $images)));
    }

    protected static function booted()
    {
        static::saved(function ($setting) {
            \Illuminate\Support\Facades\Cache::forget('site_settings');
        });

        static::deleted(function ($setting) {
            \Illuminate\Support\Facades\Cache::forget('site_settings');
        });
    }
}
