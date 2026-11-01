<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    public function show($slug)
    {
        $package = Package::where('slug', $slug)
            ->with([
                'seoMeta',
                'itineraries',
                'includes',
                'excludes',
                'addons',
                'seasons',
                'usefulInfos',
                'faqs',
                'reviews',
                'activeAddonPackages' => function ($q) {
                    $q->with(['activeItems']);
                },
            ])
            ->firstOrFail();

        return response()->json($package);
    }

    public function packages()
    {
        return response()->json(Package::all());
    }
    public function popular_packages()
    {
        $popular_packages = Package::where('is_popular', true)->get();
        return response()->json($popular_packages);
    }

    public function best_selling_packages()
    {
        $packages = Package::where('is_best_selling', true)->get();
        return response()->json($packages);
    }
}
