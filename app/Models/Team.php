<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Team extends Model
{
    //
    protected $fillable = [
        'name',
        'role',
        'position',
        'image',
        'bio',
        'experience',
        'specialty',
        'certificates',
    ];

    protected $casts = [
        'certificates' => 'array',
    ];

    protected static function booted()
    {
        static::updating(function ($team) {
            // Team member image
            $oldImage = $team->getOriginal('image');
            if (! empty($oldImage) && $team->image !== $oldImage) {
                Storage::disk('direct_public')->delete($oldImage);
            }
        });
    }

}
