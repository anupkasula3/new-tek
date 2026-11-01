<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Team;

class TeamController extends Controller
{
    //
        public function index()
        {
            $teamMembers = Team::orderBy('position', 'asc')->get();
            return response()->json($teamMembers);
        }
}
