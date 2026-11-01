<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Traits\HasSeoMetadata;

class Guide extends Model
{
    use HasSeoMetadata;

    protected $fillable = [
        'title',
        'slug',
        'subtitle',
        'heading',
        'cover_image',
        'icon',
        'description',
        'quick_facts',
        'related_guides',
        'expert_tips',
    ];

    protected $casts = [
        'quick_facts' => 'array',
        'related_guides' => 'array',
        'expert_tips' => 'array',
    ];

    public function relatedGuides()
    {
        return $this->belongsToMany(RelatedGuide::class, 'guide_related_guide', 'guide_id', 'related_guide_id')
                    ->withPivot('sort_order')
                    ->orderBy('sort_order');
    }
}
