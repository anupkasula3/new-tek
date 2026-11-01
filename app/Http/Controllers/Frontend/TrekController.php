<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Trek;

class TrekController extends Controller
{
    public function index($slug)
    {
        $trek = Trek::where('slug', $slug)
            ->with(['seoMeta', 'placeExplores', 'packages'])
            ->firstOrFail();

        return response()->json($trek);
    }

    public function show()
    {
        $treks = Trek::with(['seoMeta', 'packages'])->latest()->get();
        return response()->json($treks);
    }
}
