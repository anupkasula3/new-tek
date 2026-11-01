<?php

namespace App\Filament\Resources\Teams\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;

class TeamsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultPaginationPageOption(30)
            ->columns([
                //
                TextColumn::make('name')->label('Name')->searchable()->sortable(),
                TextColumn::make('role')->label('Role')->searchable()->sortable(),
                TextColumn::make('position')->label('Order')->searchable()->sortable(),
                TextColumn::make('experience')->label('Experience')->searchable()->sortable(),
                TextColumn::make('specialty')->label('Specialty')->searchable()->sortable(),
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
