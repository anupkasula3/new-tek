<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;

class ReviewController extends Controller
{
    //
    public function index()
    {
        $reviews = Review::all();
        return response()->json($reviews);
    }
}
