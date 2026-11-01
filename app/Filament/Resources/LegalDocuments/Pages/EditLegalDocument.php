<?php

namespace App\Filament\Resources\LegalDocuments\Pages;

use App\Filament\Resources\LegalDocuments\LegalDocumentResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditLegalDocument extends EditRecord
{
    protected static string $resource = LegalDocumentResource::class;

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
