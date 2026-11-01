<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AddonPackage extends Model
{
    protected $fillable = [
        'package_id',
        'name',
        'description',
        'price',
        'images',
        'badge',
        'short_label',
        'min_qty',
        'max_qty',
        'selection_type',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'images'    => 'array',
        'is_active' => 'boolean',
        'price'     => 'decimal:2',
        'min_qty'   => 'integer',
        'max_qty'   => 'integer',
    ];

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }

    public function addonItems(): HasMany
    {
        return $this->hasMany(AddonItem::class)->orderBy('sort_order');
    }

    public function activeItems(): HasMany
    {
        return $this->hasMany(AddonItem::class)->where('is_active', true)->orderBy('sort_order');
    }

    public function bookingAddons(): HasMany
    {
        return $this->hasMany(BookingAddon::class);
    }
}
