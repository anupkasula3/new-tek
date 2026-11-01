<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Page;

class PageController extends Controller
{
    //
    public function index()
    {
        $pages = Page::with('seoMeta')->get();
        return response()->json($pages);
    }
    public function show($slug)
    {
        $page = Page::with(['seoMeta', 'placeExplores'])->where('slug', $slug)->firstOrFail();
        return response()->json($page);
    }
   
}
