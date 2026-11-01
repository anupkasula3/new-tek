<?php

namespace App\Filament\Widgets;

use App\Models\Destination;
use App\Models\SubDestination;
use App\Models\Experience;
use App\Models\Trek;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsCategory extends BaseWidget
{
    protected ?string $heading = 'Category Overview';

    protected function getStats(): array
    {
        return [
            Stat::make('Destinations', Destination::count())
                ->description('Main regions')
                ->descriptionIcon('heroicon-m-globe-asia-australia')
                ->color('primary'),
            Stat::make('Major Activities', SubDestination::count())
                ->description('Secondary regions')
                ->descriptionIcon('heroicon-m-map-pin')
                ->color('warning'),
            Stat::make('Luxury', Experience::count())
                ->description('Available luxury experiences')
                ->descriptionIcon('heroicon-m-sparkles')
                ->color('success'),
            Stat::make('Trekking', Trek::count())
                ->description('Trek packages')
                ->descriptionIcon('heroicon-m-academic-cap')
                ->color('info'),
        ];
    }
}
