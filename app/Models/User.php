<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Filament\Models\Contracts\HasAvatar;
use Illuminate\Support\Facades\Storage;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class User extends Authenticatable implements HasAvatar
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar_url',
        'slug',
        'designation',
        'bio',
        'social_links',
        'is_author',
    ];

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($user) {
            if (empty($user->slug) && !empty($user->name)) {
                $user->slug = Str::slug($user->name);
            }
        });
    }

    public function getFilamentAvatarUrl(): ?string
    {
        return $this->avatar_url ? asset($this->avatar_url) : null;
    }

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class, 'author_id');
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'social_links' => 'array',
            'is_author' => 'boolean',
        ];
    }
}

