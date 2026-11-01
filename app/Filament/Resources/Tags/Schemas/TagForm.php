<?php

namespace App\Filament\Resources\Tags\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class TagForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required()
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn (string $operation, $state, callable $set) => $operation === 'create' ? $set('slug', \Illuminate\Support\Str::slug($state)) : null),
                TextInput::make('slug')
                    ->required()
                    ->live(onBlur: true)
                    ->unique(table: 'tags', column: 'slug', ignoreRecord: true),
                TextInput::make('type'),
                TextInput::make('order_column')
                    ->numeric(),
            ]);
    }
}
