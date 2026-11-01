<?php

namespace App\Filament\Resources\Packages\Schemas;

use Filament\Schemas\Schema;

class PackageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                \Filament\Forms\Components\Toggle::make('is_popular')
                    ->label('Popular Package')
                    ->default(false),
                \Filament\Forms\Components\Toggle::make('is_featured')
                    ->label('Featured Package')
                    ->default(false),
            ]);
    }
}
