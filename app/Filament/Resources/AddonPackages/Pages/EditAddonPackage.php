<?php

namespace App\Filament\Resources\AddonPackages\Pages;

use App\Filament\Resources\AddonPackages\AddonPackageResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditAddonPackage extends EditRecord
{
    protected static string $resource = AddonPackageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
