<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\AdditionalInfo;

class AdditionalInfoController extends Controller
{
    public function index()
    {
        $additionalInfos = AdditionalInfo::with('seoMeta')->get();
        return response()->json($additionalInfos);
    }

    public function show($slug)
    {
        $additionalInfo = AdditionalInfo::with('seoMeta')->where('slug', $slug)->firstOrFail();
        return response()->json($additionalInfo);
    }
}
