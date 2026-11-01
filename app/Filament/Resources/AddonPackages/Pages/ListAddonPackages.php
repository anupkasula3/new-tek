<?php

namespace App\Filament\Resources\AddonPackages\Pages;

use App\Filament\Resources\AddonPackages\AddonPackageResource;
use Filament\Resources\Pages\ListRecords;

class ListAddonPackages extends ListRecords
{
    protected static string $resource = AddonPackageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            \Filament\Actions\CreateAction::make(),
        ];
    }
}
