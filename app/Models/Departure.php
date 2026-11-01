<?php

namespace App\Models;

use App\Traits\HasSeoMetadata;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Departure extends Model
{
    use HasFactory, HasSeoMetadata;

    protected $fillable = [
        'package_id',
        'date',
        'price',
        'total_seats',
        'available_seats',
        'status',
    ];

    protected $casts = [
        'date'            => 'date',
        'price'           => 'float',
        'total_seats'     => 'integer',
        'available_seats' => 'integer',
    ];

    public function bookings()
    {
        return $this->hasMany(DepartureBooking::class);
    }

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    /**
     * Recalculate and persist the status based on threshold setting.
     */
    public function recalculateStatus(): void
    {
        $threshold = 5;
        if ($this->package_id) {
            $threshold = (int) ($this->package->limited_seats_threshold ?? 5);
        } else {
            $threshold = (int) (DepartureSetting::get('limited_threshold') ?? 5);
        }

        if ($this->available_seats <= 0) {
            $this->status = 'fully_booked';
        } elseif ($this->available_seats <= $threshold) {
            $this->status = 'limited';
        } else {
            $this->status = 'available';
        }

        $this->save();
    }
}
