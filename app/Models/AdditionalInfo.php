<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasSeoMetadata;

class AdditionalInfo extends Model
{
    use HasSeoMetadata;

    protected $table = 'additional_infos';

    protected $fillable = [
        'title',
        'slug',
        'subtitle',
        'heading',
        'subheading',
        'cover_image',
        'icon',
        'description',
        'quick_facts',
        'expert_tips',
    ];

    protected $casts = [
        'quick_facts' => 'array',
        'expert_tips' => 'array',
    ];
}
