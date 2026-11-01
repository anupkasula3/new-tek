<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    public $timestamps = false;
    protected $fillable = ['package_id','question','answer'];

    public function package()
    {
        return $this->belongsTo(Package::class);
    }
}
