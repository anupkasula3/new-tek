<?php

namespace App\Filament\Resources\Credibilities\Pages;

use App\Filament\Resources\Credibilities\CredibilityResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListCredibilities extends ListRecords
{
    protected static string $resource = CredibilityResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
