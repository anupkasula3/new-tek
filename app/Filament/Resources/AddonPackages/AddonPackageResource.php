<?php

namespace App\Filament\Resources\AddonPackages;

use App\Filament\Resources\AddonPackages\Pages\CreateAddonPackage;
use App\Filament\Resources\AddonPackages\Pages\EditAddonPackage;
use App\Filament\Resources\AddonPackages\Pages\ListAddonPackages;
use App\Filament\Resources\AddonPackages\RelationManagers\AddonItemsRelationManager;
use App\Models\AddonPackage;
use BackedEnum;
use App\Filament\Components\MediaPicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use UnitEnum;

class AddonPackageResource extends Resource
{
    protected static ?string $model = AddonPackage::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::PuzzlePiece;

    protected static UnitEnum|string|null $navigationGroup = 'Tours & Destinations';

    protected static ?int $navigationSort = 6;

    protected static ?string $modelLabel = 'Add-on Package';

    protected static ?string $pluralModelLabel = 'Add-on Packages';

    protected static ?string $navigationLabel = 'Add-on Packages';

    protected static bool $shouldRegisterNavigation = false;

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('')
                ->schema([
                    Select::make('package_id')
                        ->label('Product / Package')
                        ->relationship('package', 'title')
                        ->searchable()
                        ->preload()
                        ->required()
                        ->columnSpanFull(),

                    TextInput::make('name')
                        ->label('Addon title')
                        ->required()
                        ->maxLength(255)
                        ->placeholder('e.g. Airport Transfer'),

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
                ])
                ->columns(2)
                ->columnSpanFull(),

        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('package_id')
            ->columns([
                TextColumn::make('package.title')
                    ->label('Product')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('name')
                    ->label('Add-on Package')
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
            ->filters([
                //
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

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListAddonPackages::route('/'),
            'create' => CreateAddonPackage::route('/create'),
            'edit'   => EditAddonPackage::route('/{record}/edit'),
        ];
    }
}

