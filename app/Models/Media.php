<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    protected $fillable = [
        'filename',
        'original_name',
        'path',
        'url',
        'mime_type',
        'size',
        'width',
        'height',
        'title',
        'alt',
    ];

    /**
     * Get the URL for the media item, replacing the staging URL with the production URL.
     */
    public function getUrlAttribute($value)
    {
        if (empty($value)) {
            return $value;
        }

        return str_replace(
            [
                'https://lightskyblue-hyena-667273.hostingersite.com',
                'http://lightskyblue-hyena-667273.hostingersite.com'
            ],
            'https://himalayantrekking.com',
            $value
        );
    }
}
