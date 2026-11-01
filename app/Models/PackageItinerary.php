<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PackageItinerary extends Model
{
    protected $fillable = [
        'package_id','day','title','description','image',
         'distance_km','walking_hours','altitude',
         'accommodation', 'meals'
    ];

    public function package()
    {
        return $this->belongsTo(Package::class);
    }
}
