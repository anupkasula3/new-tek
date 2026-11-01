<?php

namespace App\Filament\Resources\SubDestinations\Pages;

use App\Filament\Resources\SubDestinations\SubDestinationResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSubDestinations extends ListRecords
{
    protected static string $resource = SubDestinationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
