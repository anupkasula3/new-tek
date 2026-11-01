<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PackageSeason extends Model
{
    protected $fillable = [
        'package_id','season','subtitle',
        'temperature','weather','description'
    ];

    public function package()
    {
        return $this->belongsTo(Package::class);
    }
}

