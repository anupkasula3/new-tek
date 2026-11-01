<?php

namespace App\Filament\Resources\Packages\RelationManagers;

use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Forms\Components\TextInput;
use AmidEsfahani\FilamentTinyEditor\TinyEditor;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;

class ItinerariesRelationManager extends RelationManager
{
    protected static string $relationship = 'itineraries';

    protected static ?string $recordTitleAttribute = 'title';

    public function form(Schema $schema): Schema
    {
        return $schema->components([
                TextInput::make('day')
                    ->required()
                    ->numeric(),
                TextInput::make('title')
                    ->required()
                    ->maxLength(255),
                TextInput::make('distance_km')
                    ->numeric(),
                TextInput::make('walking_hours')
                    ->maxLength(255),
                TextInput::make('altitude')
                    ->maxLength(255),
                TinyEditor::make('description')
                    ->required()
                    ->columnSpanFull(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('day')
                    ->sortable(),
                Tables\Columns\TextColumn::make('title')
                    ->searchable(),
                Tables\Columns\TextColumn::make('altitude'),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                \Filament\Actions\CreateAction::make(),
            ])
            ->actions([
                // \Filament\Actions\ViewAction::make(),
                \Filament\Actions\EditAction::make(),
                \Filament\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('day', 'asc');
    }
}
