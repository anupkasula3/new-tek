<?php

namespace App\Filament\Resources\Credibilities\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Actions\DeleteAction;

class CredibilitiesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultPaginationPageOption(30)
            ->columns([
                ImageColumn::make('icon')
                    ->label('Icon')
                    ->disk('direct_public')
                    ->imageWidth(40)
                    ->imageHeight(40),
                TextColumn::make('title')->label('Title')->searchable()->sortable(),
                TextColumn::make('detail')->label('Detail')->searchable(),
                TextColumn::make('order')->label('Order')->sortable(),
                TextColumn::make('created_at')->label('Created')->dateTime()->sortable()->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')->label('Updated')->dateTime()->sortable()->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('order', 'asc')
            ->filters([
                //
            ])
            ->recordActions([
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
