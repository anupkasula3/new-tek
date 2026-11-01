<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

use App\Traits\HasSeoMetadata;

class Post extends Model
{
    use SoftDeletes, HasSeoMetadata;

    protected $fillable = [
        'title','slug','content','excerpt','reading_time','author','featured_image','overview',
        'status','published_at','author_id',
        'is_featured','sticky','view_count','comment_enabled',
        'meta_title','meta_description','canonical_url',
        'noindex','nofollow',
        'og_title','og_description','og_image',
        'twitter_card','twitter_title','twitter_description','twitter_image',
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

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    public function toArray(): array
    {
        $array = parent::toArray();

        // If relation 'author' was eager-loaded as null (e.g. author_id is null),
        // parent::toArray() replaces the string 'author' column with null.
        // Fallback to raw string 'author' attribute if present.
        if (empty($array['author']) && !empty($this->attributes['author'])) {
            $array['author'] = $this->attributes['author'];
        }

        return $array;
    }
}

