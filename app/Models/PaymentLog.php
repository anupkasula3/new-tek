<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentLog extends Model
{
    protected $fillable = [
        'booking_id', 'order_no', 'amount', 'currency', 'status',
        'request_payload', 'response_payload', 'callback_payload'
    ];

    protected $casts = [
        'request_payload' => 'array',
        'response_payload' => 'array',
        'callback_payload' => 'array',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
