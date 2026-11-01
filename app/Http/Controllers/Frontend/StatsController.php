<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Stats;

class StatsController extends Controller
{
    //
     public function index()
    {
        $stats = Stats::orderBy('position', 'asc')->get();
        return response()->json($stats);
    }

}
