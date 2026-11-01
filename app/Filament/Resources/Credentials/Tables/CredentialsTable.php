<?php

namespace App\Filament\Resources\Credentials\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Actions\ViewAction;
use Filament\Actions\DeleteAction;

class CredentialsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultPaginationPageOption(30)
            ->columns([
                //
                TextColumn::make('title')->label('Title')->searchable()->sortable(),
                TextColumn::make('created_at')->label('Created')->dateTime()->sortable()->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')->label('Updated')->dateTime()->sortable()->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                // ViewAction::make(),
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
