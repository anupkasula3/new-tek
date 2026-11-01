<?php

namespace App\Filament\Resources\AdditionalInfos\Pages;

use App\Filament\Resources\AdditionalInfos\AdditionalInfoResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListAdditionalInfos extends ListRecords
{
    protected static string $resource = AdditionalInfoResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
