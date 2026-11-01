<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Models\RedirectRule;
use Symfony\Component\HttpFoundation\Response;

class HandleRedirects
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Don't redirect API, admin panel/filament routes
        if ($request->is('api/*') || $request->is('admin*') || $request->is('_tailwind*') || $request->is('run-migrations')) {
            return $next($request);
        }

        $path = '/' . ltrim($request->getPathInfo(), '/');
        
        $redirectRules = Cache::rememberForever('redirect_rules', function () {
            return RedirectRule::where('is_active', true)->get(['source_url', 'destination_url', 'status_code']);
        });

        foreach ($redirectRules as $rule) {
            $source = '/' . ltrim($rule->source_url, '/');
            if (strcasecmp($path, $source) === 0) {
                $destination = $rule->destination_url;
                
                // Keep query string if it exists
                $queryString = $request->getQueryString();
                if ($queryString) {
                    $destination .= (str_contains($destination, '?') ? '&' : '?') . $queryString;
                }
                
                return redirect($destination, $rule->status_code);
            }
        }

        return $next($request);
    }
}
