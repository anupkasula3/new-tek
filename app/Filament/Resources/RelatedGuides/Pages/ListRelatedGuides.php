<?php

namespace App\Filament\Resources\RelatedGuides\Pages;

use App\Filament\Resources\RelatedGuides\RelatedGuideResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListRelatedGuides extends ListRecords
{
    protected static string $resource = RelatedGuideResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
