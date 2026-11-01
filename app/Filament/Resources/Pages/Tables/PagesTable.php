<?php

namespace App\Filament\Resources\Pages\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;


class PagesTable
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
                // \Filament\Actions\ViewAction::make(),
                \Filament\Actions\EditAction::make(),
                \Filament\Actions\DeleteAction::make()
                    ->hidden(fn ($record) => in_array($record->slug, ['homepage', 'home','contact','about','terms-and-conditions','privacy-policy','contact-us','about-us'])),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()
                        ->action(fn (\Illuminate\Database\Eloquent\Collection $records) => $records
                            ->reject(fn ($record) => in_array($record->slug, ['homepage', 'home', 'contact','about','terms-and-conditions','privacy-policy','contact-us','about-us']))
                            ->each(fn ($record) => $record->delete())
                        ),
                ]),
            ]);
    }
}
