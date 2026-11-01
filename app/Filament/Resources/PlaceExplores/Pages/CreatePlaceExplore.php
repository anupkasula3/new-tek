<?php

namespace App\Filament\Resources\PlaceExplores\Pages;

use App\Filament\Resources\PlaceExplores\PlaceExploreResource;
use Filament\Resources\Pages\CreateRecord;

class CreatePlaceExplore extends CreateRecord
{
    protected static string $resource = PlaceExploreResource::class;

    protected function getHeaderActions(): array
    {
        return [
            $this->getCreateFormAction()
                ->action('create')
                ->extraAttributes(['form' => 'form']),
            $this->getCancelFormAction(),
        ];
    }

    protected function getFormActions(): array
    {
        return [];
    }
}
