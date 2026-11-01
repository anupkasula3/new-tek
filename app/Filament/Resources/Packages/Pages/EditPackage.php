<?php

namespace App\Filament\Resources\Packages\Pages;

use App\Filament\Resources\Packages\PackageResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditPackage extends EditRecord
{
    protected static string $resource = PackageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            $this->getSaveFormAction()
                ->label('Save changes')
                ->action('save')
                ->extraAttributes(['form' => 'form']),
            $this->getCancelFormAction(),
            DeleteAction::make()
                ->color('danger'),
        ];
    }

    protected function getFormActions(): array
    {
        return [];
    }
}
