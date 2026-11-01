<?php

namespace App\Filament\Resources\Departures\Pages;

use App\Filament\Resources\Departures\DepartureResource;
use Filament\Actions\Action;
use Filament\Resources\Pages\CreateRecord;

class CreateDeparture extends CreateRecord
{
    protected static string $resource = DepartureResource::class;

    public bool $redirectToList = false;

    public function createAndGoToList(): void
    {
        $this->redirectToList = true;
        $this->create();
    }

    protected function getRedirectUrl(): string
    {
        if ($this->redirectToList) {
            return $this->getResource()::getUrl('index');
        }

        $resource = static::getResource();

        if ($resource::hasPage('edit') && $resource::canEdit($this->getRecord())) {
            return $this->getResource()::getUrl('edit', ['record' => $this->getRecord()]);
        }

        return $this->getResource()::getUrl('index');
    }

    protected function getHeaderActions(): array
    {
        return [
            $this->getCreateFormAction()
                ->label('Create')
                ->action('create')
                ->extraAttributes(['form' => 'form']),
            Action::make('createAndGoToList')
                ->label('Create and back to list')
                ->action('createAndGoToList')
                ->color('gray')
                ->icon('heroicon-m-arrow-left')
                ->extraAttributes(['form' => 'form']),
            $this->getCancelFormAction(),
        ];
    }

    protected function getFormActions(): array
    {
        return [];
    }
}
