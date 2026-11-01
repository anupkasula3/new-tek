<?php

namespace App\Filament\Resources\Packages\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Table;

class PackagesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultPaginationPageOption(30)
            ->columns([
                \Filament\Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable(),
                \Filament\Tables\Columns\TextColumn::make('price')
                    ->money('USD')
                    ->sortable(),
                \Filament\Tables\Columns\ToggleColumn::make('is_popular')
                    ->label('Popular'),
                \Filament\Tables\Columns\ToggleColumn::make('is_featured')
                    ->label('Featured'),
                \Filament\Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->sortable()
                    ->colors([
                        'success' => 'published',
                        'warning' => 'draft',
                        'danger' => 'private',
                    ]),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                \Filament\Actions\EditAction::make(),
                \Filament\Actions\DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
