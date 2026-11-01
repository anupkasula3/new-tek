<?php

namespace App\Filament\Resources\WhyChooses\Pages;

use App\Filament\Resources\WhyChooses\WhyChooseResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListWhyChooses extends ListRecords
{
    protected static string $resource = WhyChooseResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
