<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PackageInclude extends Model
{
    public $timestamps = false;
    protected $fillable = ['package_id', 'tier', 'title'];

    public function package()
    {
        return $this->belongsTo(Package::class);
    }
}

