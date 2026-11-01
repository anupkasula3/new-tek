<?php

namespace App\Filament\Resources\NavigationItems\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class NavigationItemForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('label')
                    ->required(),
                TextInput::make('url')
                    ->default(null),
                \Filament\Forms\Components\Select::make('parent_id')
                    ->label('Parent Link (For Dropdowns)')
                    ->relationship('parent', 'label')
                    ->searchable()
                    ->preload()
                    ->default(null),
                TextInput::make('order')
                    ->required()
                    ->numeric()
                    ->default(0),
                \Filament\Forms\Components\Select::make('location')
                    ->options([
                        'header' => 'Header Only',
                        'footer' => 'Footer Only',
                        'footer_bottom' => 'Footer Bottom',
                        'both' => 'Both Header & Footer',
                    ])
                    ->default('header')
                    ->required(),
                Toggle::make('is_active')
                    ->required(),
            ]);
    }
}
