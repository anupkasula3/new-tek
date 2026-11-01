<?php

namespace App\Filament\Resources\TripPlans\Pages;

use App\Filament\Resources\TripPlans\TripPlanResource;
use Filament\Resources\Pages\ListRecords;

class ListTripPlans extends ListRecords
{
    protected static string $resource = TripPlanResource::class;

    protected function getHeaderActions(): array
    {
        return [];
    }
}
