<?php

namespace App\Filament\Resources\Credentials\Pages;

use App\Filament\Resources\Credentials\CredentialResource;
use Filament\Resources\Pages\CreateRecord;

class CreateCredential extends CreateRecord
{
    protected static string $resource = CredentialResource::class;

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
