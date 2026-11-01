<?php

namespace App\Filament\Resources\PlaceExplores;

use App\Filament\Resources\PlaceExplores\Pages\CreatePlaceExplore;
use App\Filament\Resources\PlaceExplores\Pages\EditPlaceExplore;
use App\Filament\Resources\PlaceExplores\Pages\ListPlaceExplores;
use App\Filament\Resources\PlaceExplores\Schemas\PlaceExploreForm;
use App\Filament\Resources\PlaceExplores\Tables\PlaceExploresTable;
use App\Models\PlaceExplore;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

use UnitEnum;

class PlaceExploreResource extends Resource
{
    protected static ?string $model = PlaceExplore::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::Map;

    protected static ?string $recordTitleAttribute = 'title';
        protected static ?int $navigationSort = 7;
        protected static UnitEnum|string|null $navigationGroup = 'Components';
    protected static ?string $navigationLabel = 'Place Explores';
    

    public static function form(Schema $schema): Schema
    {
        return PlaceExploreForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PlaceExploresTable::configure($table);
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
            'index' => ListPlaceExplores::route('/'),
            'create' => CreatePlaceExplore::route('/create'),
            'edit' => EditPlaceExplore::route('/{record}/edit'),
        ];
    }
}
