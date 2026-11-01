<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Guide;

class GuideController extends Controller
{
    //
    public function index()
    {
        $guides = Guide::with('seoMeta')->get();
        return response()->json($guides);
    }

    public function show($slug)
    {
        $guide = Guide::with(['seoMeta', 'relatedGuides'])->where('slug', $slug)->firstOrFail();
        
        // Resolve linked guides' default titles from the RelatedGuide model (legacy JSON support)
        if ($guide->related_guides && isset($guide->related_guides['linked_pages']) && is_array($guide->related_guides['linked_pages'])) {
            $linkedPages = $guide->related_guides['linked_pages'];
            $slugs = array_filter(array_column($linkedPages, 'guide_slug'));
            if (!empty($slugs)) {
                $relatedGuidesList = \App\Models\RelatedGuide::whereIn('slug', $slugs)->get(['title', 'slug'])->keyBy('slug');
                foreach ($linkedPages as &$linkedPage) {
                    if (empty($linkedPage['custom_title']) && isset($relatedGuidesList[$linkedPage['guide_slug']])) {
                        $linkedPage['title'] = $relatedGuidesList[$linkedPage['guide_slug']]->title;
                    } else {
                        $linkedPage['title'] = $linkedPage['custom_title'] ?? '';
                    }
                }
                $related_guides = $guide->related_guides;
                $related_guides['linked_pages'] = $linkedPages;
                $guide->related_guides = $related_guides;
            }
        }

        // Append the relationship-based related guides as a clean list
        $data = $guide->toArray();
        $data['related_guides_list'] = $guide->relatedGuides->map(function ($rg) {
            return [
                'id'             => $rg->id,
                'title'          => $rg->title,
                'slug'           => $rg->slug,
                'excerpt'        => $rg->excerpt,
                'featured_image' => $rg->featured_image,
            ];
        })->values();

        return response()->json($data);
    }
}

