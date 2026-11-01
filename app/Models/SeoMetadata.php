<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class SeoMetadata extends Model
{
    protected $table = 'seo_metadata';

    protected $fillable = [
        'seo_title',
        'seo_description',
        'seo_keywords',
        'focus_keyword',
        'slug',
        'canonical_url',
        'meta_robots',
        'og_title',
        'og_description',
        'og_image',
        'twitter_title',
        'twitter_description',
        'twitter_image',
        'schema_type',
        'is_indexable',
        'is_followable',
        'sitemap_priority',
        'sitemap_frequency',
        'lastmod',
    ];

    protected $casts = [
        'is_indexable'     => 'boolean',
        'is_followable'    => 'boolean',
        'sitemap_priority' => 'float',
        'lastmod'          => 'datetime',
    ];

    public function seoable(): MorphTo
    {
        return $this->morphTo();
    }
}
