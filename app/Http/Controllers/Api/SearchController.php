<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('q');

        if (!$query) {
            return response()->json([]);
        }

        $packages = \App\Models\Package::where('title', 'LIKE', "%{$query}%")
            ->orWhere('country', 'LIKE', "%{$query}%")
            ->orWhere('region', 'LIKE', "%{$query}%")
            ->orWhere('difficulty', 'LIKE', "%{$query}%")
            ->select('id', 'title', 'slug', 'banner_image', 'duration_days', 'difficulty', 'price', 'country')
            ->limit(10)
            ->get();

        return response()->json($packages);
    }
}
