<?php

namespace App\Filament\Resources\SiteSettings\Pages;

use App\Filament\Resources\SiteSettings\SiteSettingResource;
use Filament\Actions\Action;
use Filament\Resources\Pages\CreateRecord;

class CreateSiteSetting extends CreateRecord
{
    protected static string $resource = SiteSettingResource::class;



    public bool $redirectToList = false;

    public function createAndGoToList(): void
    {
        $this->redirectToList = true;
        $this->create();
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('edit', ['record' => $this->getRecord()]);
    }

    protected function getHeaderActions(): array
    {
        return [
            $this->getCreateFormAction()
                ->label('Create')
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
