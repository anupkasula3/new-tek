<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\HasSeoMetadata;

class RelatedGuide extends Model
{
    use SoftDeletes, HasSeoMetadata;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt',
        'featured_image',
        'overview',
        'status',
        'published_at',
        'is_featured',
        'sticky',
        'view_count',
        'comment_enabled',
        'meta_title',
        'meta_description',
        'canonical_url',
        'noindex',
        'nofollow',
        'og_title',
        'og_description',
        'og_image',
        'twitter_card',
        'twitter_title',
        'twitter_description',
        'twitter_image',
    ];

    protected $casts = [
        'content' => 'array',
        'published_at' => 'datetime',
        'is_featured' => 'boolean',
        'sticky' => 'boolean',
        'comment_enabled' => 'boolean',
        'noindex' => 'boolean',
        'nofollow' => 'boolean',
    ];

    public function guides()
    {
        return $this->belongsToMany(Guide::class, 'guide_related_guide', 'related_guide_id', 'guide_id')
                    ->withPivot('sort_order');
    }
}

