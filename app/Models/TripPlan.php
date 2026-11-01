<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Package;
use App\Models\Destination;

class TripPlan extends Model
{
    protected $fillable = [
        'full_name',
        'email',
        'phone',
        'package_id',
        'destination_id',
        'duration',
        'group_size',
        'preferred_date',
        'budget_range',
        'interests',
        'additional_info',
        'status',
    ];

    protected $casts = [
        'interests' => 'array',
        'preferred_date' => 'date',
    ];

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }

}
