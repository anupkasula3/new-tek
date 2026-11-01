<?php

namespace App\Filament\Resources\Treks;

use App\Filament\Resources\Treks\Pages\CreateTrek;
use App\Filament\Resources\Treks\Pages\EditTrek;
use App\Filament\Resources\Treks\Pages\ListTreks;
use App\Filament\Resources\Treks\Schemas\TrekForm;
use App\Filament\Resources\Treks\Tables\TreksTable;
use App\Models\Trek;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;


class TrekResource extends Resource
{
    protected static ?string $model = Trek::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::Briefcase;
     protected static UnitEnum|string|null $navigationGroup = 'Tours & Destinations';
    protected static ?int $navigationSort = 3;

    protected static ?string $modelLabel = 'Trekking';
    protected static ?string $pluralModelLabel = 'Trekking';
    protected static ?string $navigationLabel = 'Trekking';

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return TrekForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return TreksTable::configure($table);
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
            'index' => ListTreks::route('/'),
            'create' => CreateTrek::route('/create'),
            'edit' => EditTrek::route('/{record}/edit'),
        ];
    }
}
