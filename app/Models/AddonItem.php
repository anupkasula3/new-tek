<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AddonItem extends Model
{
    protected $fillable = [
        'addon_package_id',
        'heading',
        'description',
        'price',
        'images',
        'badge',
        'short_label',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'images'    => 'array',
        'price'     => 'float',
        'is_active' => 'boolean',
    ];

    public function addonPackage(): BelongsTo
    {
        return $this->belongsTo(AddonPackage::class);
    }

    public function bookingAddons(): HasMany
    {
        return $this->hasMany(BookingAddon::class);
    }
}
