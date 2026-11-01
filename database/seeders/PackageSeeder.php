<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PackageSeeder extends Seeder
{
    public function run(): void
    {
        $packages = [
            [
                'title'                => 'Everest Base Camp Trek',
                'slug'                 => 'everest-base-camp-trek',
                'country'              => 'Nepal',
                'region'               => 'Khumbu',
                'category'             => 'Trekking',
                'difficulty'           => 'Moderate',
                'duration_days'        => '14 Days',
                'active_trekking_days' => 12,
                'max_altitude_location'=> 'Everest Base Camp (5,364m)',
                'distance_km'          => 130,
                'price'                => 1450,
                'featured_image'       => null,
                'banner_image'         => null,
                'is_popular'           => true,
                'is_featured'          => true,
                'status'               => 'published',
                'published_at'         => now(),
                'description'          => 'The classic Everest Base Camp trek takes you through the heart of the Khumbu region, offering breathtaking views of the world\'s highest peaks.',
                'meta_title'           => 'Everest Base Camp Trek | 14 Days | From $1450',
                'meta_description'     => 'Trek to Everest Base Camp in 14 days. Experience the iconic Himalayan journey through Namche Bazaar, Tengboche, and Gorak Shep.',
            ],
            [
                'title'                => 'Annapurna Circuit Trek',
                'slug'                 => 'annapurna-circuit-trek',
                'country'              => 'Nepal',
                'region'               => 'Annapurna',
                'category'             => 'Trekking',
                'difficulty'           => 'Moderate',
                'duration_days'        => '16 Days',
                'active_trekking_days' => 14,
                'max_altitude_location'=> 'Thorong La Pass (5,416m)',
                'distance_km'          => 160,
                'price'                => 1250,
                'featured_image'       => null,
                'banner_image'         => null,
                'is_popular'           => true,
                'is_featured'          => true,
                'status'               => 'published',
                'published_at'         => now(),
                'description'          => 'One of the world\'s greatest treks, the Annapurna Circuit circumnavigates the Annapurna massif crossing the high Thorong La pass.',
                'meta_title'           => 'Annapurna Circuit Trek | 16 Days | From $1250',
                'meta_description'     => 'Complete the legendary Annapurna Circuit in 16 days, crossing Thorong La Pass at 5416m with incredible mountain scenery.',
            ],
            [
                'title'                => 'Langtang Valley Trek',
                'slug'                 => 'langtang-valley-trek',
                'country'              => 'Nepal',
                'region'               => 'Langtang',
                'category'             => 'Trekking',
                'difficulty'           => 'Easy',
                'duration_days'        => '9 Days',
                'active_trekking_days' => 7,
                'max_altitude_location'=> 'Tserko Ri (4,984m)',
                'distance_km'          => 65,
                'price'                => 950,
                'featured_image'       => null,
                'banner_image'         => null,
                'is_popular'           => true,
                'is_featured'          => false,
                'status'               => 'published',
                'published_at'         => now(),
                'description'          => 'The Langtang Valley trek offers a stunning mix of high Himalayan scenery, Tibetan-influenced culture, and rich wildlife in Langtang National Park.',
                'meta_title'           => 'Langtang Valley Trek | 9 Days | From $950',
                'meta_description'     => 'Explore the beautiful Langtang Valley in 9 days — a perfect mix of culture, wildlife, and Himalayan scenery close to Kathmandu.',
            ],
            [
                'title'                => 'Manaslu Circuit Trek',
                'slug'                 => 'manaslu-circuit-trek',
                'country'              => 'Nepal',
                'region'               => 'Mansiri Himal',
                'category'             => 'Trekking',
                'difficulty'           => 'Hard',
                'duration_days'        => '18 Days',
                'active_trekking_days' => 16,
                'max_altitude_location'=> 'Larkya La Pass (5,106m)',
                'distance_km'          => 177,
                'price'                => 1650,
                'featured_image'       => null,
                'banner_image'         => null,
                'is_popular'           => false,
                'is_featured'          => true,
                'status'               => 'published',
                'published_at'         => now(),
                'description'          => 'A remote and challenging trek around the world\'s 8th highest peak. The Manaslu Circuit offers raw Himalayan beauty away from the tourist crowds.',
                'meta_title'           => 'Manaslu Circuit Trek | 18 Days | From $1650',
                'meta_description'     => 'Trek the remote Manaslu Circuit in 18 days crossing the challenging Larkya La Pass at 5106m with spectacular views of Manaslu (8163m).',
            ],
            [
                'title'                => 'Gokyo Lakes Trek',
                'slug'                 => 'gokyo-lakes-trek',
                'country'              => 'Nepal',
                'region'               => 'Khumbu',
                'category'             => 'Trekking',
                'difficulty'           => 'Moderate',
                'duration_days'        => '12 Days',
                'active_trekking_days' => 10,
                'max_altitude_location'=> 'Gokyo Ri (5,357m)',
                'distance_km'          => 110,
                'price'                => 1350,
                'featured_image'       => null,
                'banner_image'         => null,
                'is_popular'           => true,
                'is_featured'          => false,
                'status'               => 'published',
                'published_at'         => now(),
                'description'          => 'The Gokyo Lakes trek leads to the world\'s highest freshwater lakes with panoramic views of Everest, Lhotse, Makalu, and Cho Oyu from Gokyo Ri.',
                'meta_title'           => 'Gokyo Lakes Trek | 12 Days | From $1350',
                'meta_description'     => 'Trek to the stunning turquoise Gokyo Lakes in 12 days and summit Gokyo Ri for 360° views of four 8000m peaks including Everest.',
            ],
        ];

        foreach ($packages as $data) {
            $data['experience'] = $data['experience'] ?? '';
            Package::firstOrCreate(
                ['slug' => $data['slug']],
                $data
            );
        }

        $this->command->info('✅ 5 trekking packages seeded successfully!');
    }
}
