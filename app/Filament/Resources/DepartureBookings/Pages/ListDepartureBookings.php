<?php

namespace App\Filament\Resources\DepartureBookings\Pages;

use App\Filament\Resources\DepartureBookings\DepartureBookingResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListDepartureBookings extends ListRecords
{
    protected static string $resource = DepartureBookingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
