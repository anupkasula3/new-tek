<?php

namespace App\Filament\Resources\Categories\Schemas;

use Filament\Schemas\Schema;

class CategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                \Filament\Forms\Components\TextInput::make('name')
                    ->required()
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn (string $operation, $state, callable $set) => $operation === 'create' ? $set('slug', \Illuminate\Support\Str::slug($state)) : null),
                \Filament\Forms\Components\TextInput::make('slug')
                    ->required()
                    ->live(onBlur: true)
                    ->unique(table: 'categories', column: 'slug', ignoreRecord: true),
                \Filament\Forms\Components\Textarea::make('description')
                    ->columnSpanFull(),
            ]);
    }
}
