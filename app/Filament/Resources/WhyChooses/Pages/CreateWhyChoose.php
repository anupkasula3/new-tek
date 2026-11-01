<?php

namespace App\Filament\Resources\WhyChooses\Pages;

use App\Filament\Resources\WhyChooses\WhyChooseResource;
use Filament\Resources\Pages\CreateRecord;

class CreateWhyChoose extends CreateRecord
{
    protected static string $resource = WhyChooseResource::class;

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
