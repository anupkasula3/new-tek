<?php

namespace App\Filament\Resources\PlaceExplores\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;

class PlaceExploresTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultPaginationPageOption(30)
            ->columns([
                //
                TextColumn::make('title')->label('Title')->sortable()->searchable(),
                TextColumn::make('location')->label('location')->sortable()->searchable(),
                TextColumn::make('created_at')->label('Created At')->dateTime()->sortable(),
                TextColumn::make('updated_at')->label('Updated At')->dateTime()->sortable(),
            ])
            ->filters([
                //

            ])
            ->recordActions([
                // \Filament\Actions\ViewAction::make(),
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
