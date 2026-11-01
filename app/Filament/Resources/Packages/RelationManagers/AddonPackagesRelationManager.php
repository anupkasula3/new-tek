<?php

namespace App\Filament\Resources\Packages\RelationManagers;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use App\Filament\Components\MediaPicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class AddonPackagesRelationManager extends RelationManager
{
    protected static string $relationship = 'addonPackages';

    protected static ?string $recordTitleAttribute = 'name';

    public function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('name')
                ->label('Addon title')
                ->required()
                ->maxLength(255)
                ->placeholder('e.g. Airport Transfer')
                ->columnSpanFull(),

            TextInput::make('price')
                ->label('Price')
                ->numeric()
                ->prefix('$')
                ->required()
                ->minValue(0),

            TextInput::make('sort_order')
                ->label('Sort Order')
                ->numeric()
                ->required()
                ->minValue(0)
                ->helperText('Lower numbers appear first.'),

            TextInput::make('min_qty')
                ->label('Min Selectable')
                ->numeric()
                ->default(0)
                ->required()
                ->helperText('Minimum items/quantity a customer must select.'),

            TextInput::make('max_qty')
                ->label('Max Selectable')
                ->numeric()
                ->default(1)
                ->required()
                ->helperText('Maximum items/quantity a customer can select.'),

            TextInput::make('badge')
                ->label('Badge (Optional)')
                ->maxLength(50)
                ->placeholder('e.g. Popular, Recommended'),

            TextInput::make('short_label')
                ->label('Short Label (Optional)')
                ->maxLength(100)
                ->placeholder('e.g. Shared, Private'),

            Toggle::make('is_active')
                ->label('Active')
                ->default(true),

            Textarea::make('description')
                ->label('Description')
                ->rows(2)
                ->nullable()
                ->columnSpanFull()
                ->placeholder('Optional description shown to the customer.'),

            Repeater::make('images')
                ->label('Multiple Images')
                ->schema([
                    MediaPicker::make('url')
                        ->label('Image')
                        ->image()
                        ->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                        ->disk('direct_public')
                        ->directory('uploads/addons')
                        ->visibility('public'),
                ])
                ->reorderable()
                ->columnSpanFull()
                ->defaultItems(0)
                ->helperText('Add one or more images for this add-on.'),
        ])->columns(2);
    }

    public function table(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->columns([
                TextColumn::make('name')
                    ->label('Addon title')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('price')
                    ->label('Price')
                    ->money('USD')
                    ->sortable(),

                IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean(),

                TextColumn::make('sort_order')
                    ->label('Sort')
                    ->sortable(),
            ])
            ->headerActions([
                CreateAction::make(),
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}

