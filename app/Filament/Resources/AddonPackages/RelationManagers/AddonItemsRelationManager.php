<?php

namespace App\Filament\Resources\AddonPackages\RelationManagers;

use App\Filament\Components\MediaPicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Actions\CreateAction;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;

class AddonItemsRelationManager extends RelationManager
{
    protected static string $relationship = 'addonItems';

    protected static ?string $recordTitleAttribute = 'heading';

    public function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('heading')
                ->label('Item Heading')
                ->required()
                ->maxLength(255)
                ->placeholder('e.g. Private Airport Pickup')
                ->columnSpanFull(),

            TextInput::make('price')
                ->label('Price')
                ->numeric()
                ->prefix('$')
                ->required()
                ->default(0),

            TextInput::make('sort_order')
                ->label('Sort Order')
                ->numeric()
                ->default(0),

            Toggle::make('is_active')
                ->label('Active')
                ->default(true),

            TextInput::make('badge')
                ->label('Badge (Optional)')
                ->maxLength(50)
                ->placeholder('e.g. Most Popular'),

            TextInput::make('short_label')
                ->label('Short Label (Optional)')
                ->maxLength(100)
                ->placeholder('e.g. Shared'),

            Textarea::make('description')
                ->label('Description')
                ->rows(2)
                ->nullable()
                ->columnSpanFull()
                ->placeholder('Optional description shown to the customer.'),

            // Multiple images stored as JSON array of URLs
            Repeater::make('images')
                ->label('Images')
                ->schema([
                    MediaPicker::make('url')
                        ->label('Image')
                        ->image()
                        ->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                        ->disk('direct_public')
                        ->directory('uploads/addon-items')
                        ->visibility('public'),
                ])
                ->reorderable()
                ->columnSpanFull()
                ->defaultItems(0)
                ->helperText('Add one or more images for this add-on item.'),
        ])->columns(3);
    }

    public function table(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->columns([
                TextColumn::make('heading')
                    ->label('Item')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('price')
                    ->label('Price')
                    ->money('USD')
                    ->sortable(),

                TextColumn::make('badge')
                    ->label('Badge')
                    ->placeholder('—'),

                TextColumn::make('short_label')
                    ->label('Short Label')
                    ->placeholder('—'),

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
