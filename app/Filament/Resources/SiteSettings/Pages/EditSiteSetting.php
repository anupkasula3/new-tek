<?php

namespace App\Filament\Resources\SiteSettings\Pages;

use App\Filament\Resources\SiteSettings\SiteSettingResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;


class EditSiteSetting extends EditRecord
{
    protected static string $resource = SiteSettingResource::class;


    protected function getHeaderActions(): array
    {
        return [
            $this->getSaveFormAction()
                ->label('Save changes')
                ->action('save')
                ->extraAttributes(['form' => 'form']),
        ];
    }

    protected function getFormActions(): array
    {
        return [];
    }
}
