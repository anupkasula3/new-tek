<?php

namespace App\Filament\Widgets;

use App\Models\Package;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsProducts extends BaseWidget
{
    protected ?string $heading = 'Products Overview';

    protected function getStats(): array
    {
        return [
            Stat::make('Products', Package::count())
                ->description('Total adventure packages')
                ->descriptionIcon('heroicon-m-shopping-bag')
                ->color('success'),
        ];
    }
}
