<?php

namespace App\Console\Commands;

use App\Models\Package;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use DOMDocument;
use DOMXPath;

class ScrapePackages extends Command
{
    protected $signature   = 'packages:scrape {--dry-run : Preview scraped data without saving}';
    protected $description = 'Scrape package listings from manaslutrekking.com and seed into the packages table';

    // Pages to scrape
    private array $seedUrls = [
        'https://manaslutrekking.com/',
        'https://manaslutrekking.com/trekking-packages',
        'https://manaslutrekking.com/expedition',
        'https://manaslutrekking.com/peak-climbing',
    ];

    public function handle(): int
    {
        $this->info('🏔  Starting package scraper for manaslutrekking.com...');
        $this->newLine();

        $packages = [];

        foreach ($this->seedUrls as $url) {
            $this->line("  → Fetching: {$url}");
            $scraped = $this->scrapePage($url);
            $packages = array_merge($packages, $scraped);
            $this->line("    Found " . count($scraped) . " packages");
        }

        // Deduplicate by slug
        $unique = [];
        foreach ($packages as $p) {
            $unique[$p['slug']] = $p;
        }
        $packages = array_values($unique);

        $this->newLine();
        $this->info("Total unique packages found: " . count($packages));
        $this->newLine();

        if (empty($packages)) {
            $this->warn('No packages found. The site structure may have changed.');
            return Command::FAILURE;
        }

        if ($this->option('dry-run')) {
            $this->table(
                ['Title', 'Price', 'Duration', 'Difficulty', 'Slug'],
                array_map(fn ($p) => [
                    Str::limit($p['title'], 50),
                    $p['price'] ?? 'N/A',
                    $p['duration_days'] ?? 'N/A',
                    $p['difficulty'] ?? 'N/A',
                    $p['slug'],
                ], $packages)
            );
            $this->info('Dry run complete — no data was saved.');
            return Command::SUCCESS;
        }

        $saved = 0;
        $bar   = $this->output->createProgressBar(count($packages));
        $bar->start();

        foreach ($packages as $data) {
            Package::updateOrCreate(
                ['slug' => $data['slug']],
                array_merge($data, [
                    'status'   => 'published',
                    'country'  => 'Nepal',
                ])
            );
            $saved++;
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->info("✅ Saved {$saved} packages successfully!");

        return Command::SUCCESS;
    }

    private function scrapePage(string $url): array
    {
        try {
            $response = Http::timeout(15)
                ->withHeaders(['User-Agent' => 'Mozilla/5.0 (compatible; LaravelBot/1.0)'])
                ->get($url);

            if (! $response->ok()) {
                $this->warn("  ⚠ HTTP {$response->status()} for {$url}");
                return [];
            }

            $html = $response->body();
            return $this->parsePackages($html, $url);

        } catch (\Exception $e) {
            $this->warn("  ⚠ Error fetching {$url}: " . $e->getMessage());
            return [];
        }
    }

    private function parsePackages(string $html, string $baseUrl): array
    {
        libxml_use_internal_errors(true);
        $dom = new DOMDocument();
        $dom->loadHTML($html, LIBXML_NOWARNING | LIBXML_NOERROR);
        $xpath = new DOMXPath($dom);

        $packages = [];

        // Strategy 1: look for article/post cards (common WordPress patterns)
        $cards = $xpath->query(
            '//*[contains(@class,"package") or contains(@class,"trek") or contains(@class,"tour") or contains(@class,"post")]'
        );

        foreach ($cards as $card) {
            $package = $this->extractFromCard($xpath, $card, $baseUrl);
            if ($package) {
                $packages[] = $package;
            }
        }

        // Strategy 2: JSON-LD structured data
        $jsonLdNodes = $xpath->query('//script[@type="application/ld+json"]');
        foreach ($jsonLdNodes as $node) {
            $json = json_decode($node->textContent, true);
            if ($json && isset($json['@type']) && in_array($json['@type'], ['Product', 'TouristTrip', 'Event'])) {
                $packages[] = $this->extractFromJsonLd($json);
            }
        }

        return array_filter($packages);
    }

    private function extractFromCard(DOMXPath $xpath, \DOMNode $card, string $baseUrl): ?array
    {
        // Try to find title
        $titleNode = $xpath->query('.//*[self::h1 or self::h2 or self::h3 or self::h4]', $card)->item(0);
        if (! $titleNode) {
            return null;
        }

        $title = trim($titleNode->textContent);
        if (strlen($title) < 5 || strlen($title) > 200) {
            return null;
        }

        $slug = Str::slug($title);
        if (empty($slug)) {
            return null;
        }

        // Price
        $priceText = $this->findText($xpath, $card, [
            './/*[contains(@class,"price")]',
            './/*[contains(text(),"USD") or contains(text(),"$")]',
        ]);
        $price = null;
        if ($priceText) {
            preg_match('/[\d,]+/', str_replace(',', '', $priceText), $matches);
            $price = isset($matches[0]) ? (float) $matches[0] : null;
        }

        // Duration
        $durationText = $this->findText($xpath, $card, [
            './/*[contains(@class,"duration") or contains(@class,"days")]',
            './/*[contains(text(),"days") or contains(text(),"Days") or contains(text(),"night")]',
        ]);
        $days = null;
        if ($durationText) {
            preg_match('/(\d+)\s*(days?|nights?)/i', $durationText, $m);
            $days = isset($m[1]) ? (int) $m[1] : null;
        }

        // Difficulty
        $difficultyText = $this->findText($xpath, $card, [
            './/*[contains(@class,"difficulty") or contains(@class,"grade")]',
            './/*[contains(text(),"Easy") or contains(text(),"Moderate") or contains(text(),"Challenging") or contains(text(),"Hard")]',
        ]);
        $difficulty = 'Moderate';
        if ($difficultyText) {
            if (stripos($difficultyText, 'easy') !== false) $difficulty = 'Easy';
            elseif (stripos($difficultyText, 'hard') !== false || stripos($difficultyText, 'strenuous') !== false) $difficulty = 'Challenging';
        }

        // Image
        $imgNode = $xpath->query('.//img[@src]', $card)->item(0);
        $imgSrc  = $imgNode ? $imgNode->getAttribute('src') : null;
        if ($imgSrc && ! str_starts_with($imgSrc, 'http')) {
            $imgSrc = rtrim($baseUrl, '/') . '/' . ltrim($imgSrc, '/');
        }

        return [
            'title'         => $title,
            'slug'          => $slug,
            'price'         => $price,
            'duration_days' => $days,
            'difficulty'    => $difficulty,
            'featured_image'=> $imgSrc,
            'best_season'   => 'March-May, September-November',
            'max_altitude'  => null,
        ];
    }

    private function extractFromJsonLd(array $json): array
    {
        $title = $json['name'] ?? $json['title'] ?? 'Unknown Package';
        $slug  = Str::slug($title);

        $price = null;
        if (isset($json['offers']['price'])) {
            $price = (float) $json['offers']['price'];
        }

        return [
            'title'         => $title,
            'slug'          => $slug,
            'price'         => $price,
            'duration_days' => null,
            'difficulty'    => 'Moderate',
            'best_season'   => 'March-May, September-November',
            'max_altitude'  => null,
        ];
    }

    private function findText(DOMXPath $xpath, \DOMNode $context, array $queries): ?string
    {
        foreach ($queries as $query) {
            $node = $xpath->query($query, $context)->item(0);
            if ($node) {
                $text = trim($node->textContent);
                if ($text) {
                    return $text;
                }
            }
        }
        return null;
    }
}
