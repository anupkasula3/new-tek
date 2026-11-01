<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Experience;

class ExperienceController extends Controller
{
    //
    public function index()
    {
        $experiences = Experience::with('seoMeta')->get();
        return response()->json($experiences);
    }

    public function show($slug)
    {
        $experience = Experience::with([
                'seoMeta',
                'placeExplores',
                'packages' => function ($query) {
                    $query->select('packages.id', 'packages.title', 'packages.slug', 'packages.banner_image', 'packages.price', 'packages.duration_days', 'packages.difficulty', 'packages.country');
                },
            ])
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($experience);
    }
}
