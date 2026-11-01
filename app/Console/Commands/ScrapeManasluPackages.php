<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\Package;
use App\Models\PackageItinerary;
use App\Models\PackageInclude;
use App\Models\PackageExclude;
use Illuminate\Support\Facades\Log;
use DOMDocument;
use DOMXPath;

class ScrapeManasluPackages extends Command
{
    protected $signature = 'scrape:manaslu-packages';
    protected $description = 'Scrape package data from manaslutrek.com';

    protected $urls = [
        'https://www.manaslutrek.com/manaslu-circuit-trek.html',
        'https://www.manaslutrek.com/tsum-valley-trek.html',
        'https://www.manaslutrek.com/lower-manaslu-trek.html',
        'https://www.manaslutrek.com/rupina-la-pass-trek.html',
        'https://www.manaslutrek.com/larkya-peak-climbing.html',
        'https://www.manaslutrek.com/manaslu-high-passes-trekking.html',
        'https://www.manaslutrek.com/manaslu-expedition.html',
        'https://www.manaslutrek.com/tsum-valley-and-manaslu-trek.html',
    ];

    public function handle()
    {
        $this->info('Starting scraping...');

        foreach ($this->urls as $url) {
            $this->info("Scraping: $url");
            try {
                $response = Http::get($url);
                if ($response->failed()) {
                    $this->error("Failed to fetch $url");
                    continue;
                }

                $html = $response->body();
                $this->processPage($html, $url);

            } catch (\Throwable $e) {
                $this->error("Error scraping $url: " . $e->getMessage());
                Log::error("Error scraping $url: " . $e->getMessage(), [
                    'exception' => $e,
                    'url' => $url
                ]);
            }
        }

        $this->info('Scraping completed.');
    }

    protected function processPage($html, $url)
    {
        libxml_use_internal_errors(true);
        $dom = new DOMDocument();
        $dom->loadHTML($html);
        $xpath = new DOMXPath($dom);

        // 1. Extract Title
        $titleNode = $xpath->query('//h1')->item(0);
        $title = $titleNode ? trim($titleNode->nodeValue) : 'Unknown Package';

        // 2. Extract Duration and other facts
        $duration = '0';
        $difficulty = 'Moderate';
        $max_altitude = '0';
        $best_season = 'Spring and Autumn';

        $factRows = $xpath->query('//div[contains(@class, "table-row")]');
        foreach ($factRows as $row) {
            $dataTitle = $xpath->query('.//div[contains(@class, "data-title")]', $row)->item(0);
            $dataText = $xpath->query('.//div[contains(@class, "data-text")]/h4', $row)->item(0);
            
            if ($dataTitle && $dataText) {
                $label = trim($dataTitle->nodeValue);
                $value = trim($dataText->nodeValue);

                if (Str::contains($label, 'Trip Duration')) {
                    $duration = preg_replace('/[^0-9]/', '', $value);
                } elseif (Str::contains($label, 'Trip Grade')) {
                    $difficulty = $value;
                } elseif (Str::contains($label, 'Max. Alt')) {
                    $max_altitude = preg_replace('/[^0-9]/', '', $value);
                } elseif (Str::contains($label, 'Best Season')) {
                    $best_season = $value;
                }
            }
        }

        // 3. Extract Experience (Overview)
        $experienceNode = $xpath->query('//section[contains(@class, "about-us")]//div[contains(@class, "col-xl-7")]')->item(0);
        if (!$experienceNode) {
            $experienceNode = $xpath->query('//section[contains(@class, "about-us")]//div[contains(@class, "col-md-7")]')->item(0);
        }
        
        $experience = '';
        if ($experienceNode) {
            $experience = $this->getInnerHtml($experienceNode);
            // Remove the sub-title span if it exists
            $experience = preg_replace('/<h1>.*?<\/h1>/si', '', $experience);
            $experience = trim($experience);
        }

        if (empty($experience)) {
            // Fallback to JSON-LD description
            foreach ($jsonLdNodes as $node) {
                $data = json_decode($node->nodeValue, true);
                if (isset($data['description'])) {
                    $experience = $data['description'];
                    break;
                }
            }
        }

        // 4. Extract Price from JSON-LD or Table
        $price = '0';
        $jsonLdNodes = $xpath->query('//script[@type="application/ld+json"]');
        foreach ($jsonLdNodes as $node) {
            $data = json_decode($node->nodeValue, true);
            if (isset($data['@type']) && $data['@type'] === 'Product' && isset($data['offers']['price'])) {
                $price = $data['offers']['price'];
                break;
            }
        }

        // 4. Extract Featured Image
        $featured_image = null;
        $ogImage = $xpath->query('//meta[@property="og:image"]/@content')->item(0);
        if ($ogImage) {
            $imageUrl = $ogImage->nodeValue;
            $featured_image = $this->downloadImage($imageUrl, $title);
        }

        // Create or update Package
        $package = Package::updateOrCreate(
            ['title' => $title],
            [
                'slug' => Str::slug($title),
                'country' => 'Nepal',
                'region' => 'Manaslu',
                'category' => 'Trekking',
                'duration_days' => $duration ?: 0,
                'max_altitude' => $max_altitude ?: 0,
                'best_season' => $best_season,
                'price' => $price ?: 0,
                'difficulty' => $difficulty,
                'experience' => $experience ?: $title,
                'featured_image' => $featured_image,
                'is_featured' => true,
                'status' => 'published',
                'published_at' => now(),
            ]
        );

        // 5. Extract Itinerary
        $package->itineraries()->delete();
        $itineraryHeaders = $xpath->query('//div[contains(@class, "accordion-header")]');
        $itineraryBodies = $xpath->query('//div[contains(@class, "accordion-body")]');

        for ($i = 0; $i < $itineraryHeaders->length; $i++) {
            $h2 = $xpath->query('.//h2', $itineraryHeaders->item($i))->item(0);
            if ($h2) {
                $headText = trim($h2->nodeValue);
                // Extract Day X
                preg_match('/Day\s*(\d+)/i', $headText, $dayMatch);
                $day = $dayMatch ? $dayMatch[1] : ($i + 1);
                $dayTitle = trim(preg_replace('/Day\s*\d+[:\s]*/i', '', $headText));

                $description = '';
                if ($itineraryBodies->item($i)) {
                    $description = $this->getInnerHtml($itineraryBodies->item($i));
                    // Cleanup description
                    $description = preg_replace('/<strong>\s*Transfer:.*?<\/strong>/i', '', $description);
                    $description = preg_replace('/<strong>\s*Accommodation:.*?<\/strong>/i', '', $description);
                    $description = preg_replace('/<strong>\s*Meal:.*?<\/strong>/i', '', $description);
                    $description = trim($description);
                }

                $package->itineraries()->create([
                    'day' => $day,
                    'title' => $dayTitle,
                    'description' => $description,
                ]);
            }
        }

        // 6. Extract Inclusions
        $package->includes()->delete();
        $includeList = $xpath->query('//div[contains(@class, "cost_include")]//li');
        foreach ($includeList as $li) {
            $item = trim($li->nodeValue);
            if ($item) {
                $package->includes()->create(['title' => $item]);
            }
        }

        // 7. Extract Exclusions
        $package->excludes()->delete();
        $excludeList = $xpath->query('//div[contains(@class, "cost_exclude")]//li');
        foreach ($excludeList as $li) {
            $item = trim($li->nodeValue);
            if ($item && !Str::contains($item, 'Please feel free to ask')) {
                $package->excludes()->create(['title' => $item]);
            }
        }

        $this->info("Saved package: $title");
    }

    protected function downloadImage($url, $title)
    {
        try {
            if (!$url) return null;
            if (Str::startsWith($url, 'theme/')) {
                // Handle relative URLs if base tag is used, but Http::get should probably handle absolute
                // Actually base is https://manaslutrek.com/
                $url = 'https://manaslutrek.com/' . $url;
            }

            $response = Http::get($url);
            if ($response->successful()) {
                $extension = pathinfo($url, PATHINFO_EXTENSION) ?: 'webp';
                $filename = Str::slug($title) . '-' . time() . '.' . $extension;
                $path = 'packages/' . $filename;
                Storage::disk('direct_public')->put($path, $response->body());
                return 'storage/' . $path;
            }
        } catch (\Exception $e) {
            $this->warn("Failed to download image for $title: " . $e->getMessage());
        }
        return null;
    }

    protected function getInnerHtml($node)
    {
        $innerHTML = "";
        $children = $node->childNodes;
        foreach ($children as $child) {
            $innerHTML .= $node->ownerDocument->saveHTML($child);
        }
        return $innerHTML;
    }
}
