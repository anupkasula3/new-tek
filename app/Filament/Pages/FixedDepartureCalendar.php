<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;

use BackedEnum;
use UnitEnum;

class FixedDepartureCalendar extends Page
{
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-map';
    protected static UnitEnum|string|null $navigationGroup = 'Tours & Destinations';
    protected static ?int $navigationSort = 7;
    protected static ?string $navigationLabel = 'Fixed Departures Calendar';

    public static function shouldRegisterNavigation(): bool
    {
        return false;
    }

    public function getTitle(): string
    {
        return 'Fixed Departures Calendar';
    }

    protected string $view = 'filament.pages.fixed-departure-calendar';
}
