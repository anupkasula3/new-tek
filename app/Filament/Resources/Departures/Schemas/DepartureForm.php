<?php

namespace App\Filament\Resources\Departures\Schemas;

use Filament\Schemas\Schema;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;

class DepartureForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('package_id')
                    ->relationship('package', 'title')
                    ->searchable()
                    ->preload()
                    ->required(),
                DatePicker::make('date')
                    ->required()
                    ->native(false)
                    ->minDate(now()->startOfDay())
                    ->displayFormat('Y-m-d')
                    ->unique(ignoreRecord: true, modifyRuleUsing: function ($rule, $get) {
                        return $rule->where('package_id', $get('package_id'));
                    }),
                TextInput::make('price')
                    ->numeric()
                    ->required()
                    ->minValue(0)
                    ->prefix('$'),
                TextInput::make('total_seats')
                    ->numeric()
                    ->required()
                    ->minValue(1)
                    ->default(10),
                TextInput::make('available_seats')
                    ->numeric()
                    ->required()
                    ->minValue(0)
                    ->default(10),
            ]);
    }
}
