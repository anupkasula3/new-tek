<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PackageUsefulInfo extends Model
{
    protected $fillable = ['package_id','title','content'];

    public function package()
    {
        return $this->belongsTo(Package::class);
    }
}
