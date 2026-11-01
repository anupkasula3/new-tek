<?php

namespace App\Filament\Resources\Treks\Pages;

use App\Filament\Resources\Treks\TrekResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListTreks extends ListRecords
{
    protected static string $resource = TrekResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
