<?php

namespace App\Filament\Resources\Categories\Pages;

use App\Filament\Resources\Categories\CategoryResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditCategory extends EditRecord
{
    protected static string $resource = CategoryResource::class;

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
