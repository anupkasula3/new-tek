<?php

namespace App\Filament\Resources\NavigationItems\Pages;

use App\Filament\Resources\NavigationItems\NavigationItemResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditNavigationItem extends EditRecord
{
    protected static string $resource = NavigationItemResource::class;

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
