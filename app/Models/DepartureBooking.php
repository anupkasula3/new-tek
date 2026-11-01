<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DepartureBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'departure_id',
        'order_no',
        'name',
        'email',
        'phone',
        'seats_booked',
        'amount',
        'addon_total',
        'total_amount',
        'remaining_balance',
        'currency',
        'payment_type',
        'status',
        'traveller_details',
        'addon_selections',
    ];

    protected $casts = [
        'seats_booked'      => 'integer',
        'traveller_details' => 'array',
        'addon_total'       => 'float',
        'addon_selections'  => 'array',
    ];

    protected static function booted()
    {
        static::created(function ($booking) {
            if ($booking->status === 'paid') {
                $departure = $booking->departure;
                if ($departure) {
                    $departure->decrement('available_seats', $booking->seats_booked);
                    $departure->recalculateStatus();
                }
            }
        });

        static::updating(function ($booking) {
            $oldStatus = $booking->getOriginal('status');
            $newStatus = $booking->status;

            if ($oldStatus !== $newStatus) {
                $departure = $booking->departure;
                if ($departure) {
                    if ($newStatus === 'paid') {
                        $departure->decrement('available_seats', $booking->seats_booked);
                        $departure->recalculateStatus();
                    } elseif ($oldStatus === 'paid') {
                        $departure->increment('available_seats', $booking->seats_booked);
                        $departure->recalculateStatus();
                    }
                }
            }
        });

        static::deleted(function ($booking) {
            if ($booking->status === 'paid') {
                $departure = $booking->departure;
                if ($departure) {
                    $departure->increment('available_seats', $booking->seats_booked);
                    $departure->recalculateStatus();
                }
            }
        });
    }

    public function departure()
    {
        return $this->belongsTo(Departure::class);
    }

    public function bookingAddons()
    {
        return $this->hasMany(\App\Models\BookingAddon::class, 'booking_id');
    }
}
