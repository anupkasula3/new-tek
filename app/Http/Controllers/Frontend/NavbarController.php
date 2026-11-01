<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Trek;
use App\Models\Destination;
use App\Models\SubDestination;
use App\Models\Experience;
use App\Models\Guide;

class NavbarController extends Controller
{
    public function index()
    {
        $treks = Trek::select('name', 'slug')->get();

        $destinations = Destination::select('name', 'slug')->get();

        $subDestinations = SubDestination::select('name', 'slug', 'destination_slug')->get();

        $destinationsWithSubs = $destinations->map(function ($destination) use ($subDestinations) {
            $subs = $subDestinations->where('destination_slug', $destination->slug)->values();
            return [
                'name' => $destination->name,
                'slug' => $destination->slug,
                'sub_destinations' => $subs,
            ];
        });
        $experiences = Experience::select('title', 'slug')->get();
        $guides = Guide::select('title', 'slug')->get();

        return response()->json([
            'treks' => $treks,
            'destinations' => $destinationsWithSubs,
            'experiences' => $experiences,
            'guides' => $guides,
            // 'sub_destinations' => $subDestinations,
        ]);
    }
}
