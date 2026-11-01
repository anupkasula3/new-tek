<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'package_id','name','email','phone','persons','preferred_travel_date','status', 'order_no', 'amount', 'currency', 'payment_type', 'total_amount', 'addon_total', 'remaining_balance', 'traveller_details'
    ];

    protected $casts = [
        'preferred_travel_date' => 'date',
        'traveller_details'     => 'array',
    ];

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public function paymentLogs()
    {
        return $this->hasMany(PaymentLog::class);
    }

    public function bookingAddons()
    {
        return $this->hasMany(BookingAddon::class);
    }
}
