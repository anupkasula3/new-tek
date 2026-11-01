<?php

namespace App\Filament\Resources\Destinations\Tables;


use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Tables;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;


class DestinationsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->defaultPaginationPageOption(30)
   ->columns([
                TextColumn::make('name')
                    ->label('Destination')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('slug')
                    ->searchable()
                    ->sortable()
                    ->toggleable(),

                TextColumn::make('region')
                    ->sortable()
                    ->toggleable(),

                TextColumn::make('country')
                    ->sortable()
                    ->toggleable(),
                TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime('d M Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
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
