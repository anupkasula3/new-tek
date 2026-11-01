<?php

namespace App\Filament\Resources\Departures\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Table;

use Filament\Tables\Columns\TextColumn;

class DeparturesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('package.title')
                    ->label('Package')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('date')
                    ->date('Y-m-d')
                    ->sortable(),
                TextColumn::make('price')
                    ->money('USD')
                    ->sortable(),
                TextColumn::make('total_seats')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('available_seats')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'available' => 'success',
                        'limited' => 'warning',
                        'fully_booked' => 'danger',
                        default => 'secondary',
                    }),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
