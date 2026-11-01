<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Seo extends Model
{
    protected $fillable = [
        'title',
        'description',
        'image',
        'author',
        'robots',
        'canonical_url',
        'keyword',
        'schema',
    ];

    protected $casts = [
        'schema' => 'array',
    ];

    public function model()
    {
        return $this->morphTo();
    }
}
