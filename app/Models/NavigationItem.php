<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NavigationItem extends Model
{
    protected $fillable = ['label', 'url', 'parent_id', 'order', 'is_active', 'location'];

    public function children()
    {
        return $this->hasMany(NavigationItem::class, 'parent_id')->orderBy('order');
    }

    public function parent()
    {
        return $this->belongsTo(NavigationItem::class, 'parent_id');
    }

    protected static function booted()
    {
        static::saved(function () {
            \Illuminate\Support\Facades\Cache::forget('global_navigation');
        });

        static::deleted(function () {
            \Illuminate\Support\Facades\Cache::forget('global_navigation');
        });
    }
}
