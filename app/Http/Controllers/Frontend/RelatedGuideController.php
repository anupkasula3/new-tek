<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\RelatedGuide;

class RelatedGuideController extends Controller
{
    public function show()
    {
        $guides = RelatedGuide::with([
            'seoMeta',
        ])
            ->where('status', 'published')
            ->latest('published_at')
            ->paginate(30);

        return response()->json($guides);
    }

    public function index($slug)
    {
        $guide = RelatedGuide::with(['seoMeta'])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();
        return response()->json($guide);
    }
}
