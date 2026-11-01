<?php

namespace App\Filament\Resources\Stats\Pages;

use App\Filament\Resources\Stats\StatsResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListStats extends ListRecords
{
    protected static string $resource = StatsResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
