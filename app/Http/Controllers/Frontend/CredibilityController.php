<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Credibility;

class CredibilityController extends Controller
{
    public function index()
    {
        $credibilities = Credibility::orderBy('order', 'asc')->get(['id', 'title', 'detail', 'icon', 'order']);
        return response()->json($credibilities);
    }
}
