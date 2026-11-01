<?php

namespace App\Filament\Resources\Experiences\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Actions\DeleteAction;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;

class ExperiencesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->defaultPaginationPageOption(30)
            ->columns([
                //
                TextColumn::make('title')->label('Title')->sortable()->searchable(),
                TextColumn::make('slug')->label('Slug')->sortable()->searchable(),
                TextColumn::make('created_at')->label('Created At')->dateTime()->sortable(),
                TextColumn::make('updated_at')->label('Updated At')->dateTime()->sortable(),
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
