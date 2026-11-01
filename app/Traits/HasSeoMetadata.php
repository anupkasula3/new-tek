<?php

namespace App\Traits;

use App\Models\SeoMetadata;
use Illuminate\Database\Eloquent\Relations\MorphOne;

trait HasSeoMetadata
{
    /**
     * Get the SEO metadata for this model.
     * withDefault() ensures we always get a SeoMetadata instance,
     * even if none exists in the database yet (avoids null checks everywhere).
     */
    public function seoMeta(): MorphOne
    {
        return $this->morphOne(SeoMetadata::class, 'seoable')->withDefault([
            'seo_title'         => null,
            'seo_description'   => null,
            'seo_keywords'      => null,
            'focus_keyword'     => null,
            'slug'              => null,
            'canonical_url'     => null,
            'meta_robots'       => 'index, follow',
            'og_title'          => null,
            'og_description'    => null,
            'og_image'          => null,
            'twitter_title'     => null,
            'twitter_description' => null,
            'twitter_image'     => null,
            'schema_type'       => 'WebPage',
            'is_indexable'      => true,
            'is_followable'     => true,
            'sitemap_priority'  => 0.80,
            'sitemap_frequency' => 'daily',
            'lastmod'           => null,
        ]);
    }
}
