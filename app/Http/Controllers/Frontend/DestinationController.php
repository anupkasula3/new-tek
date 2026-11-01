<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Destination;

class DestinationController extends Controller
{
    public function index()
    {
        $destinations = Destination::with('seoMeta')->get();
        return response()->json([
            'destination' => $destinations
        ]);
    }

    public function show($slug)
    {
        $destination = Destination::where('slug', $slug)
            ->with(['seoMeta', 'placeExplores', 'packages' => function ($query) {
                $query->select('packages.id', 'packages.title', 'packages.slug', 'packages.banner_image', 'packages.price', 'packages.duration_days', 'packages.difficulty','packages.country');
            }])
            ->firstOrFail();

        return response()->json($destination);
    }
}
