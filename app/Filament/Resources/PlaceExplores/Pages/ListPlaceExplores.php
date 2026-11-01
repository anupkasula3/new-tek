<?php

namespace App\Filament\Resources\PlaceExplores\Pages;

use App\Filament\Resources\PlaceExplores\PlaceExploreResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListPlaceExplores extends ListRecords
{
    protected static string $resource = PlaceExploreResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
