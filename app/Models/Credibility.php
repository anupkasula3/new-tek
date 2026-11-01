<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Credibility extends Model
{
    protected $table = 'credibilities';

    protected $fillable = [
        'title',
        'detail',
        'icon',
        'order',
    ];
}
