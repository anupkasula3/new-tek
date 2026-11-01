<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WhyChoose;

class WhyChooseController extends Controller
{
    public function index()
    {
        $data = WhyChoose::first();
        return response()->json($data);
    }
}
