<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    //
    protected $fillable = [
        'name',
        'country',
        'designation',
        'rating',
        'review_date',
        'review',
        'image',
    ];

    public function packages()
    {
        return $this->belongsToMany(Package::class);
    }
}
