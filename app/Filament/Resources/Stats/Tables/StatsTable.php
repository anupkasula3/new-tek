<?php

namespace App\Filament\Resources\Stats\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;

class StatsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultPaginationPageOption(30)
            ->columns([
                TextColumn::make('title')->label('Title')->searchable()->sortable(),
                TextColumn::make('number')->label('Number')->searchable()->sortable(),
                TextColumn::make('position')->label('Position')->searchable()->sortable(),
                TextColumn::make('created_at')->label('Created')->dateTime()->sortable()->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')->label('Updated')->dateTime()->sortable()->toggleable(isToggledHiddenByDefault: true),

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
