<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

use Symfony\Component\HttpFoundation\Response;

use App\Models\Package;
use App\Models\Post;
use App\Models\Destination;
use App\Models\SubDestination;
use App\Models\Experience;
use App\Models\Page;
use App\Models\Guide;
use App\Models\AdditionalInfo;
use App\Models\RelatedGuide;
use App\Models\SiteSetting;
use App\Models\PlaceExplore;
use App\Models\User;

/**
 * InjectSeoMeta
 *
 * Runs on every SPA (app.blade.php) request.
 * Matches the URL path against known frontend routes, fetches the
 * corresponding model's seoMeta relationship from the DB, and shares
 * the resolved values with the blade view as `$seo`.
 *
 * This makes <title>, <meta name="description">, og:* and twitter:*
 * tags appear in view-source even though the app is a React SPA.
 */
class InjectSeoMeta
{
    private const FALLBACK_IMAGE = '/assets/images/logo.png';
    private const SITE_NAME      = 'Himalayan Bespoke';
    private const SITE_URL       = 'https://himalayantrekking.com';

    public function handle(Request $request, Closure $next): Response
    {
        $path = '/' . ltrim($request->path(), '/');

        // Resolve SEO data directly — no cache, always fresh
        $seo = $this->resolveSeo($path, $request);

        // Share with blade
        view()->share('seo', $seo);

        return $next($request);
    }

    /**
     * Match the path to a model and extract SEO fields.
     * Returns a flat array ready for use in blade.
     */
    private function resolveSeo(string $path, Request $request): array
    {
        $segments = array_values(array_filter(explode('/', $path)));
        $count    = count($segments);
        $meta     = null;
        $entity   = null;

        try {
            if ($count === 0 || $path === '/') {
                // Home page — use the "homepage" Page record if it exists
                $entity = Page::with('seoMeta')->where('slug', 'homepage')->first();

            } elseif ($count === 2 && $segments[0] === 'blog') {
                // /blog/:slug
                $entity = Post::with('seoMeta')
                    ->where('slug', $segments[1])
                    ->where('status', 'published')
                    ->first();

            } elseif ($count === 2 && $segments[0] === 'destination') {
                // /destination/:slug
                $entity = Destination::with('seoMeta')->where('slug', $segments[1])->first();

            } elseif ($count === 2 && $segments[0] === 'luxury') {
                // /luxury/:slug
                $entity = Experience::with('seoMeta')->where('slug', $segments[1])->first();

            } elseif ($count === 2 && $segments[0] === 'trekking') {
                // /trekking/:slug  → SubDestination
                $entity = SubDestination::with('seoMeta')->where('slug', $segments[1])->first();

            } elseif ($count === 2 && $segments[0] === 'guide') {
                // /guide/:slug
                $entity = Guide::with('seoMeta')->where('slug', $segments[1])->first();

            } elseif ($count === 2 && $segments[0] === 'additional-info') {
                // /additional-info/:slug
                $entity = AdditionalInfo::with('seoMeta')->where('slug', $segments[1])->first();

            } elseif ($count === 2 && $segments[0] === 'related-guides') {
                // /related-guides/:slug
                $entity = RelatedGuide::with('seoMeta')->where('slug', $segments[1])->first();

            } elseif ($count === 2 && $segments[0] === 'places') {
                // /places/:slug
                $entity = PlaceExplore::with('seoMeta')->where('slug', $segments[1])->first();

            } elseif ($count === 2 && $segments[0] === 'author') {
                // /author/:slug — User has no seoMeta, use name as fallback
                $entity = User::where('slug', $segments[1])->where('is_author', true)->first();

            } elseif ($count === 2 && $segments[0] === 'page') {
                // /page/:slug
                $entity = Page::with('seoMeta')->where('slug', $segments[1])->first();

            } elseif ($count === 2) {
                // /:destinationSlug/:slug  (SubDestination) OR /:slug package
                // Try SubDestination first (two segments not matching above patterns)
                $entity = SubDestination::with('seoMeta')->where('slug', $segments[1])->first();

                if (!$entity) {
                    // Fallback: treat first segment as package slug
                    $entity = Package::with('seoMeta')->where('slug', $segments[0])->first();
                }

            } elseif ($count === 1) {
                // /:slug — could be a Package
                $entity = Package::with('seoMeta')->where('slug', $segments[0])->first();
            }

        } catch (\Throwable $e) {
            // Never crash the page if SEO lookup fails
            $entity = null;
        }

        // Extract seoMeta from the resolved entity
        if ($entity && $entity->seoMeta) {
            $meta = $entity->seoMeta;
        }

        return $this->buildSeoArray($meta, $entity, $request);
    }

    /**
     * Build a flat SEO array from a nullable SeoMetadata model.
     * Falls back gracefully when no specific data is available.
     */
    private function buildSeoArray($meta, $entity, Request $request): array
    {
        $siteName   = self::SITE_NAME;
        $siteUrl    = self::SITE_URL;
        $currentUrl = $siteUrl . '/' . ltrim($request->path(), '/');

        // Resolve title — empty when no entity found so blade @if suppresses the tag
        $rawTitle   = $meta?->seo_title
            ?? ($entity ? ($entity->title ?? $entity->name ?? null) : null);
        $title      = $rawTitle ? "{$rawTitle} | {$siteName}" : '';

        // Resolve description
        $description = $meta?->seo_description ?? '';

        // Resolve canonical — only when seoMeta has explicit value or entity was resolved
        $canonical = $meta?->canonical_url ?? ($entity ? $currentUrl : '');

        // Resolve image
        $ogImageRaw = $meta?->og_image ?? null;
        if (!$ogImageRaw && $entity) {
            $ogImageRaw = $entity->banner_image
                ?? $entity->featured_image
                ?? $entity->cover_image
                ?? $entity->image
                ?? $entity->og_image
                ?? null;
        }
        $ogImage = $this->resolveImageUrl($ogImageRaw, $siteUrl);

        // Resolve robots — only render when seoMeta record actually exists
        $robots = '';
        if ($meta) {
            $isIndex  = $meta->is_indexable  ?? true;
            $isFollow = $meta->is_followable ?? true;
            $robots   = ($isIndex ? 'index' : 'noindex') . ', ' . ($isFollow ? 'follow' : 'nofollow');
        }

        // OG / Twitter
        $ogTitle            = $meta?->og_title       ?? $rawTitle ?? '';
        $ogDescription      = $meta?->og_description ?? $description;
        $twitterTitle       = $meta?->twitter_title  ?? $ogTitle;
        $twitterDescription = $meta?->twitter_description ?? $ogDescription;
        $twitterImage       = $this->resolveImageUrl($meta?->twitter_image ?? $meta?->og_image ?? $ogImageRaw, $siteUrl);

        return compact(
            'title',
            'description',
            'canonical',
            'ogImage',
            'ogTitle',
            'ogDescription',
            'twitterTitle',
            'twitterDescription',
            'twitterImage',
            'robots',
            'siteName',
        );
    }

    private function resolveImageUrl(?string $path, string $origin): string
    {
        if (!$path) {
            return $origin . self::FALLBACK_IMAGE;
        }
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }
        return $origin . '/' . ltrim($path, '/');
    }
}
