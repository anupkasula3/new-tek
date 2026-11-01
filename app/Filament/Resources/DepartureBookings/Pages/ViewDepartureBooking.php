<?php

namespace App\Filament\Resources\DepartureBookings\Pages;

use App\Filament\Resources\DepartureBookings\DepartureBookingResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewDepartureBooking extends ViewRecord
{
    protected static string $resource = DepartureBookingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
