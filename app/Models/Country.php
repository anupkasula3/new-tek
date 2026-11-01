<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Destination;

class Country extends Model
{
    //
    protected $table = 'country';
     protected $fillable = ['name', 'slug', 'highest_peak', 'capital', 'population'];

    public function destination(): BelongsToMany
    {
        return $this->belongsToMany(Destination::class);
    }
}
