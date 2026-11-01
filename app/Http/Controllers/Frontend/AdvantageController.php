<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Advantage;

class AdvantageController extends Controller
{
    //
        public function index()
        {
            $advantages = Advantage::get();
            return response()->json($advantages);
        }
}
