<?php

namespace App\Filament\Resources\AdditionalInfos;

use App\Filament\Resources\AdditionalInfos\Pages\CreateAdditionalInfo;
use App\Filament\Resources\AdditionalInfos\Pages\EditAdditionalInfo;
use App\Filament\Resources\AdditionalInfos\Pages\ListAdditionalInfos;
use App\Filament\Resources\AdditionalInfos\Schemas\AdditionalInfoForm;
use App\Filament\Resources\AdditionalInfos\Tables\AdditionalInfosTable;
use App\Models\AdditionalInfo;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class AdditionalInfoResource extends Resource
{
    protected static ?string $model = AdditionalInfo::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::DocumentText;

    protected static UnitEnum|string|null $navigationGroup = 'Content';
    protected static ?int $navigationSort = 4;

    protected static ?string $navigationLabel = 'Additional Information';

    protected static ?string $modelLabel = 'Additional Information';
    protected static ?string $pluralModelLabel = 'Additional Information';

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        return AdditionalInfoForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return AdditionalInfosTable::configure($table);
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
            'index' => ListAdditionalInfos::route('/'),
            'create' => CreateAdditionalInfo::route('/create'),
            'edit' => EditAdditionalInfo::route('/{record}/edit'),
        ];
    }
}
