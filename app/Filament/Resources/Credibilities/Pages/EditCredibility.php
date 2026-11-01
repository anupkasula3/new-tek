<?php

namespace App\Filament\Resources\Credibilities\Pages;

use App\Filament\Resources\Credibilities\CredibilityResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditCredibility extends EditRecord
{
    protected static string $resource = CredibilityResource::class;

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
