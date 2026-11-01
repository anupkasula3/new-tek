<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class GlobalDataController extends Controller
{
    public function settings()
    {
        $settings = \Illuminate\Support\Facades\Cache::rememberForever('site_settings', function () {
            return \App\Models\SiteSetting::first() ?? new \stdClass();
        });
        
        return response()->json($settings);
    }

    public function navigation()
    {
        $navigation = \Illuminate\Support\Facades\Cache::rememberForever('global_navigation', function () {
            // Load active root items and their active children
            $items = \App\Models\NavigationItem::whereNull('parent_id')
                ->where('is_active', true)
                ->with(['children' => function($query) {
                    $query->where('is_active', true);
                }])
                ->orderBy('order')
                ->get();

            return [
                'header' => $items->filter(fn($i) => in_array($i->location, ['header', 'both']))->values(),
                'footer' => $items->filter(fn($i) => in_array($i->location, ['footer', 'both']))->values(),
                'footer_bottom' => $items->filter(fn($i) => $i->location === 'footer_bottom')->values(),
            ];
        });

        return response()->json($navigation);
    }
}
