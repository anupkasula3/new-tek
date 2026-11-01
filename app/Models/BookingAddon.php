<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingAddon extends Model
{
    protected $fillable = [
        'booking_id',
        'addon_package_id',
        'addon_item_id',
        'price_at_booking',
        'qty',
    ];

    protected $casts = [
        'price_at_booking' => 'float',
        'qty' => 'integer',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function addonPackage(): BelongsTo
    {
        return $this->belongsTo(AddonPackage::class);
    }

    public function addonItem(): BelongsTo
    {
        return $this->belongsTo(AddonItem::class);
    }
}
