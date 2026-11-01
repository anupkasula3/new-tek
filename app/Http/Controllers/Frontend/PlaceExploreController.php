<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\PlaceExplore;

class PlaceExploreController extends Controller
{
    public function index()
    {
        return response()->json(PlaceExplore::with('seoMeta')->get());
    }

    public function show($slug)
    {
        $place = PlaceExplore::with('seoMeta')
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($place);
    }
}
