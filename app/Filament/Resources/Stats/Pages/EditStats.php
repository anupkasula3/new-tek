<?php

namespace App\Filament\Resources\Stats\Pages;

use App\Filament\Resources\Stats\StatsResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditStats extends EditRecord
{
    protected static string $resource = StatsResource::class;

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
