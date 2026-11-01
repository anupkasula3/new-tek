<?php

namespace App\Filament\Resources\Users\Pages;

use App\Filament\Resources\Users\UserResource;
use Filament\Actions\Action;
use Filament\Resources\Pages\CreateRecord;

class CreateUser extends CreateRecord
{
    protected static string $resource = UserResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function getHeaderActions(): array
    {
        return [
            $this->getCreateFormAction()
                ->label('Create')
                ->action('create')
                ->extraAttributes(['form' => 'form']),
            Action::make('cancel')
                ->label('Cancel')
                ->url($this->getResource()::getUrl('index'))
                ->color('gray'),
        ];
    }

    protected function getFormActions(): array
    {
        return [];
    }
}
