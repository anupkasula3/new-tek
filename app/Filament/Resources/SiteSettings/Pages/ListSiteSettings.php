<?php

namespace App\Filament\Resources\SiteSettings\Pages;

use App\Filament\Resources\SiteSettings\SiteSettingResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSiteSettings extends ListRecords
{
    protected static string $resource = SiteSettingResource::class;

    public function mount(): void
    {
        parent::mount();

        $record = static::getResource()::getModel()::first();
        if ($record) {
            redirect()->to(static::getResource()::getUrl('edit', ['record' => $record]));
            return;
        }

        redirect()->to(static::getResource()::getUrl('create'));
    }

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
