<?php

namespace App\Filament\Resources\Departures\Pages;

use App\Filament\Resources\Departures\DepartureResource;
use Filament\Resources\Pages\Page;

class ListDepartures extends Page
{
    protected static string $resource = DepartureResource::class;

    protected string $view = 'filament.pages.fixed-departure-calendar';
}
