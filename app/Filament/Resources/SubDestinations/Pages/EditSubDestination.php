<?php

namespace App\Filament\Resources\SubDestinations\Pages;

use App\Filament\Resources\SubDestinations\SubDestinationResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditSubDestination extends EditRecord
{
    protected static string $resource = SubDestinationResource::class;

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
