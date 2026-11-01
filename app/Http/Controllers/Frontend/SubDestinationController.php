<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SubDestination;
use App\Models\Trek;

class SubDestinationController extends Controller
{

    public function show($slug)
    {
    
      $subDestination = SubDestination::where('slug', $slug)
            ->with(['seoMeta', 'placeExplores', 'packages' => function ($query) {
                $query->select('packages.id', 'packages.title', 'packages.slug', 'packages.banner_image', 'packages.price', 'packages.duration_days', 'packages.difficulty','packages.country');
            }])
            ->firstOrFail();

        return response()->json($subDestination);
    }
}
