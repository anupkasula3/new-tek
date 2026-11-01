<?php

namespace App\Filament\Resources\AdditionalInfos\Pages;

use App\Filament\Resources\AdditionalInfos\AdditionalInfoResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditAdditionalInfo extends EditRecord
{
    protected static string $resource = AdditionalInfoResource::class;

    protected function getHeaderActions(): array
    {
        return [
            $this->getSaveFormAction()
                ->label('Save changes')
                ->action('save')
                ->extraAttributes(['form' => 'form']),
            $this->getCancelFormAction(),
            DeleteAction::make(),
        ];
    }

    protected function getFormActions(): array
    {
        return [];
    }
}
