<?php

namespace App\Filament\Resources\DepartureBookings\Pages;

use App\Filament\Resources\DepartureBookings\DepartureBookingResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditDepartureBooking extends EditRecord
{
    protected static string $resource = DepartureBookingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
