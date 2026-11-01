<?php

namespace App\Filament\Resources\PlaceExplores\Pages;

use App\Filament\Resources\PlaceExplores\PlaceExploreResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditPlaceExplore extends EditRecord
{
    protected static string $resource = PlaceExploreResource::class;

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
