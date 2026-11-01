<?php

namespace App\Filament\Resources\LegalDocuments\Pages;

use App\Filament\Resources\LegalDocuments\LegalDocumentResource;
use Filament\Resources\Pages\CreateRecord;

class CreateLegalDocument extends CreateRecord
{
    protected static string $resource = LegalDocumentResource::class;

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
