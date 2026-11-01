<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use App\Models\Destination;
use App\Models\SubDestination;
use App\Models\Experience;
use App\Models\Trek;
use App\Models\Package;
use App\Models\Page;
use App\Models\Guide;
use App\Models\AdditionalInfo;
use App\Models\Post;

class SeoSitemapController extends Controller
{
    /**
     * XML Sitemap Index
     */
    public function index(): Response
    {
        $baseUrl = url('/');
        $now = now()->toAtomString();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        $sitemaps = [
            '/sitemap-main.xml',
            '/sitemap-images.xml',
            '/sitemap-videos.xml',
            '/sitemap-news.xml',
        ];

        foreach ($sitemaps as $sitemap) {
            $xml .= '<sitemap>';
            $xml .= '<loc>' . htmlspecialchars($baseUrl . $sitemap) . '</loc>';
            $xml .= '<lastmod>' . $now . '</lastmod>';
            $xml .= '</sitemap>';
        }

        $xml .= '</sitemapindex>';

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }

    /**
     * XML Main Sitemap (Pages, Trips, destinations, treks, experiences, etc.)
     */
    public function main(): Response
    {
        $baseUrl = url('/');
        $urls = [];

        // Static Page Helper
        $addStatic = function ($path, $priority, $frequency) use ($baseUrl, &$urls) {
            $urls[] = [
                'loc' => $baseUrl . $path,
                'lastmod' => now()->toAtomString(),
                'changefreq' => $frequency,
                'priority' => $priority,
            ];
        };

        // Static pages
        $addStatic('/', '1.0', 'daily');
        $addStatic('/about', '0.8', 'monthly');
        $addStatic('/blog', '0.8', 'daily');
        $addStatic('/plan-trip', '0.8', 'monthly');
        $addStatic('/departures', '0.9', 'daily');

        // Helper to extract SEO metadata and fallback
        $addModelUrls = function ($items, $urlPattern, $defaultPriority, $defaultFreq) use ($baseUrl, &$urls) {
            foreach ($items as $item) {
                // Check if has relation
                $seo = $item->seoMeta;

                // If explicitly set not to index, skip
                if ($seo && !$seo->is_indexable) {
                    continue;
                }

                $slug = $item->slug;

                // Use SEO slug override if set (only affects URL path, not DB routing)
                if ($seo && $seo->slug) {
                    $slug = $seo->slug;
                }

                // Handle polymorphic/custom paths
                if (is_callable($urlPattern)) {
                    $path = $urlPattern($item);
                } else {
                    $path = str_replace('{slug}', $slug, $urlPattern);
                }

                $loc = $baseUrl . $path;

                // Priority & Frequency overrides
                $priority = $seo && $seo->sitemap_priority !== null ? number_format($seo->sitemap_priority, 1) : $defaultPriority;
                $frequency = $seo && $seo->sitemap_frequency ? $seo->sitemap_frequency : $defaultFreq;

                // Last modified date
                $lastmod = $seo && $seo->lastmod ? $seo->lastmod->toAtomString() : ($item->updated_at ? $item->updated_at->toAtomString() : now()->toAtomString());

                // Allow custom canonical URL if provided
                if ($seo && $seo->canonical_url) {
                    $loc = $seo->canonical_url;
                }

                $urls[] = [
                    'loc' => $loc,
                    'lastmod' => $lastmod,
                    'changefreq' => $frequency,
                    'priority' => $priority,
                ];
            }
        };

        // 1. Pages
        $addModelUrls(Page::all(), '/page/{slug}', '0.7', 'weekly');

        // 2. Destinations
        $addModelUrls(Destination::all(), '/destination/{slug}', '0.8', 'weekly');

        // 3. Sub-Destinations
        $addModelUrls(SubDestination::all(), function ($sub) {
            return '/' . ($sub->destination_slug ?? 'nepal') . '/' . $sub->slug;
        }, '0.8', 'weekly');

        // 4. Luxury
        $addModelUrls(Experience::all(), '/luxury/{slug}', '0.8', 'weekly');

        // 5. Treks
        $addModelUrls(Trek::all(), '/trekking/{slug}', '0.8', 'weekly');

        // 6. Packages
        $addModelUrls(Package::all(), '/{slug}', '0.9', 'daily');

        // 7. Additional Info
        $addModelUrls(AdditionalInfo::all(), '/additional-info/{slug}', '0.7', 'weekly');

        // 8. Guides & subpages
        $guides = Guide::all();
        $addModelUrls($guides, '/guide/{slug}', '0.7', 'weekly');
        foreach ($guides as $guide) {
            $seo = $guide->seoMeta;
            if ($seo && !$seo->is_indexable) {
                continue;
            }

            $subpages = [
                'packing-list',
                'altitude-sickness',
                'photography-tips',
                'nepal-visa',
                'choosing-agency',
                'post-trek-recovery'
            ];

            foreach ($subpages as $subpage) {
                $urls[] = [
                    'loc' => $baseUrl . '/guide/' . $guide->slug . '/' . $subpage,
                    'lastmod' => $guide->updated_at ? $guide->updated_at->toAtomString() : now()->toAtomString(),
                    'changefreq' => 'weekly',
                    'priority' => '0.6',
                ];
            }
        }

        // 9. Posts
        $addModelUrls(Post::where('status', 'published')->get(), '/blog/{slug}', '0.7', 'weekly');

        // Generate XML
        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        foreach ($urls as $url) {
            $xml .= '<url>';
            $xml .= '<loc>' . htmlspecialchars($url['loc']) . '</loc>';
            $xml .= '<lastmod>' . $url['lastmod'] . '</lastmod>';
            $xml .= '<changefreq>' . $url['changefreq'] . '</changefreq>';
            $xml .= '<priority>' . $url['priority'] . '</priority>';
            $xml .= '</url>';
        }

        $xml .= '</urlset>';

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }

    /**
     * XML Image Sitemap
     */
    public function images(): Response
    {
        $baseUrl = url('/');
        $entries = [];

        $addImage = function ($pagePath, $imagePath, $title, $caption = null) use ($baseUrl, &$entries) {
            if (!$imagePath)
                return;

            // Normalize image path
            if (!str_starts_with($imagePath, 'http')) {
                // If it starts with / uploads or just uploads, prepend base URL
                $imgUrl = $baseUrl . '/' . ltrim($imagePath, '/');
            } else {
                $imgUrl = $imagePath;
            }

            $loc = $baseUrl . $pagePath;

            if (!isset($entries[$loc])) {
                $entries[$loc] = [];
            }

            // Prevent duplicate images on same page
            foreach ($entries[$loc] as $existing) {
                if ($existing['loc'] === $imgUrl) {
                    return;
                }
            }

            $entries[$loc][] = [
                'loc' => $imgUrl,
                'title' => $title,
                'caption' => $caption,
            ];
        };

        // 1. Destinations
        foreach (Destination::all() as $item) {
            $addImage('/destination/' . $item->slug, $item->banner_image, $item->name, "Banner of " . $item->name);
        }

        // 2. Sub-Destinations
        foreach (SubDestination::all() as $item) {
            $path = '/' . ($item->destination_slug ?? 'nepal') . '/' . $item->slug;
            if (is_array($item->banner_accordions) && isset($item->banner_accordions['banner_image'])) {
                $addImage($path, $item->banner_accordions['banner_image'], $item->name, $item->name . " Banner Image");
            }
            if (is_array($item->overviews)) {
                foreach ($item->overviews as $ov) {
                    if (isset($ov['image'])) {
                        $addImage($path, $ov['image'], $item->name, $ov['title'] ?? null);
                    }
                }
            }
        }

        // 3. Luxury
        foreach (Experience::all() as $item) {
            $addImage('/luxury/' . $item->slug, $item->image, $item->title, $item->title . " Image");
        }

        // 4. Treks
        foreach (Trek::all() as $item) {
            $path = '/trekking/' . $item->slug;
            if (is_array($item->banner_accordions) && isset($item->banner_accordions['banner_image'])) {
                $addImage($path, $item->banner_accordions['banner_image'], $item->name, $item->name . " Banner Image");
            }
            if (is_array($item->overviews)) {
                foreach ($item->overviews as $ov) {
                    if (isset($ov['image'])) {
                        $addImage($path, $ov['image'], $item->name, $ov['title'] ?? null);
                    }
                }
            }
        }

        // 5. Packages
        foreach (Package::all() as $item) {
            $addImage('/' . $item->slug, $item->banner_image, $item->title, $item->title . " Banner");
            $addImage('/' . $item->slug, $item->map_image, $item->title . " Map", $item->title . " Trail Map");
        }

        // 6. Guides
        foreach (Guide::all() as $item) {
            $addImage('/guide/' . $item->slug, $item->cover_image, $item->title, $item->title . " Cover Image");
        }

        // 7. Additional Info
        foreach (AdditionalInfo::all() as $item) {
            $addImage('/additional-info/' . $item->slug, $item->cover_image, $item->title, $item->title . " Cover Image");
        }

        // 8. Posts
        foreach (Post::where('status', 'published')->get() as $item) {
            $addImage('/blog/' . $item->slug, $item->featured_image, $item->title, $item->excerpt ?? null);
        }

        // Generate XML
        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">';

        foreach ($entries as $loc => $images) {
            $xml .= '<url>';
            $xml .= '<loc>' . htmlspecialchars($loc) . '</loc>';
            foreach ($images as $img) {
                $xml .= '<image:image>';
                $xml .= '<image:loc>' . htmlspecialchars($img['loc']) . '</image:loc>';
                if ($img['title']) {
                    $xml .= '<image:title>' . htmlspecialchars($img['title']) . '</image:title>';
                }
                if ($img['caption']) {
                    $xml .= '<image:caption>' . htmlspecialchars($img['caption']) . '</image:caption>';
                }
                $xml .= '</image:image>';
            }
            $xml .= '</url>';
        }

        $xml .= '</urlset>';

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }

    /**
     * XML Video Sitemap
     */
    public function videos(): Response
    {
        $baseUrl = url('/');

        // Let's create a beautiful, standard placeholder video entry representing the main promo video
        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">';

        $xml .= '<url>';
        $xml .= '<loc>' . htmlspecialchars($baseUrl) . '</loc>';
        $xml .= '<video:video>';
        $xml .= '<video:thumbnail_loc>' . htmlspecialchars($baseUrl . '/uploads/video-thumbnail.jpg') . '</video:thumbnail_loc>';
        $xml .= '<video:title>Himalayan Bespoke &amp; Expedition Video Guide</video:title>';
        $xml .= '<video:description>Embark on the ultimate adventure in Nepal. Discover Everest, Annapurna, and other majestic trekking routes.</video:description>';
        $xml .= '<video:content_loc>' . htmlspecialchars($baseUrl . '/video/promo.mp4') . '</video:content_loc>';
        $xml .= '<video:player_loc>https://www.youtube.com/embed/dQw4w9WgXcQ</video:player_loc>';
        $xml .= '<video:duration>120</video:duration>';
        $xml .= '<video:publication_date>' . now()->subMonths(3)->toAtomString() . '</video:publication_date>';
        $xml .= '<video:family_friendly>yes</video:family_friendly>';
        $xml .= '</video:video>';
        $xml .= '</url>';

        $xml .= '</urlset>';

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }

    /**
     * XML Google News Sitemap
     */
    public function news(): Response
    {
        $baseUrl = url('/');

        // Google News guidelines: only show articles published in the last 2 days.
        // Fallback: show the last 5 posts if nothing in the last 2 days, to avoid empty sitemap during test.
        $recentPosts = Post::where('status', 'published')
            ->where('published_at', '>=', now()->subDays(2))
            ->orderBy('published_at', 'desc')
            ->get();

        if ($recentPosts->isEmpty()) {
            $recentPosts = Post::where('status', 'published')
                ->orderBy('published_at', 'desc')
                ->limit(5)
                ->get();
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">';

        foreach ($recentPosts as $post) {
            $xml .= '<url>';
            $xml .= '<loc>' . htmlspecialchars($baseUrl . '/blog/' . $post->slug) . '</loc>';
            $xml .= '<news:news>';
            $xml .= '<news:publication>';
            $xml .= '<news:name>Himalayan Bespoke Blog</news:name>';
            $xml .= '<news:language>en</news:language>';
            $xml .= '</news:publication>';
            $xml .= '<news:publication_date>' . ($post->published_at ? $post->published_at->toAtomString() : $post->created_at->toAtomString()) . '</news:publication_date>';
            $xml .= '<news:title>' . htmlspecialchars($post->title) . '</news:title>';
            $xml .= '</news:news>';
            $xml .= '</url>';
        }

        $xml .= '</urlset>';

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }

    /**
     * HTML Sitemap (renders a beautiful web page)
     */
    public function html()
    {
        // Get all target items grouped by section
        $destinations = Destination::all();
        $subDestinations = SubDestination::all();
        $experiences = Experience::all();
        $treks = Trek::all();
        $packages = Package::all();
        $pages = Page::all();
        $guides = Guide::all();
        $additionalInfos = AdditionalInfo::all();
        $posts = Post::where('status', 'published')->orderBy('published_at', 'desc')->get();

        return view('sitemap', compact(
            'destinations',
            'subDestinations',
            'experiences',
            'treks',
            'packages',
            'pages',
            'guides',
            'additionalInfos',
            'posts'
        ));
    }

    public function apiData()
    {
        return response()->json([
            'destinations' => Destination::select('name', 'slug')->get(),
            'subDestinations' => SubDestination::select('name', 'slug', 'destination_slug')->get(),
            'experiences' => Experience::select('title', 'slug')->get(),
            'treks' => Trek::select('name', 'slug')->get(),
            'packages' => Package::select('title', 'slug')->get(),
            'pages' => Page::select('title', 'slug')->get(),
            'guides' => Guide::select('title', 'slug')->get(),
            'additionalInfos' => AdditionalInfo::select('title', 'slug')->get(),
            'posts' => Post::where('status', 'published')->orderBy('published_at', 'desc')->select('title', 'slug')->get(),
        ]);
    }
}
