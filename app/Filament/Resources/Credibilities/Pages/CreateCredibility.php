<?php

namespace App\Filament\Resources\Credibilities\Pages;

use App\Filament\Resources\Credibilities\CredibilityResource;
use Filament\Resources\Pages\CreateRecord;

class CreateCredibility extends CreateRecord
{
    protected static string $resource = CredibilityResource::class;

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
