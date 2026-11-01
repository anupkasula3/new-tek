<?php

namespace App\Filament\Resources\LegalDocuments\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;

class LegalDocumentsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultPaginationPageOption(30)
            ->columns([
                TextColumn::make('title')->label('Title')->searchable()->sortable(),
                TextColumn::make('issuer')->label('Issuer')->searchable()->sortable(),
                TextColumn::make('license_no')->label('License No')->searchable()->sortable(),
                TextColumn::make('valid_until')->label('Valid Until')->sortable(),
                ImageColumn::make('image')->label('Preview')->disk('direct_public'),
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
