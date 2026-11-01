<?php

namespace App\Filament\Resources\WhyChooses\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;

class WhyChoosesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultPaginationPageOption(30)
            ->columns([
                //
                TextColumn::make('title')->label('Title')->sortable()->searchable(),
                TextColumn::make('created_at')->label('Created At')->dateTime()->sortable(),
                TextColumn::make('updated_at')->label('Updated At')->dateTime()->sortable(),
            ])
            ->actions([
                EditAction::make(),
            ])
            ->bulkActions([
                DeleteBulkAction::make(),
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
