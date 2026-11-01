<?php

namespace App\Filament\Resources\SubDestinations;

use App\Filament\Resources\SubDestinations\Pages\CreateSubDestination;
use App\Filament\Resources\SubDestinations\Pages\EditSubDestination;
use App\Filament\Resources\SubDestinations\Pages\ListSubDestinations;
use App\Filament\Resources\SubDestinations\Schemas\SubDestinationForm;
use App\Filament\Resources\SubDestinations\Tables\SubDestinationsTable;
use App\Models\SubDestination;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class SubDestinationResource extends Resource
{
    protected static ?string $model = SubDestination::class;
    protected static UnitEnum|string|null $navigationGroup = 'Tours & Destinations';
    protected static ?int $navigationSort = 2;
    protected static ?string $recordTitleAttribute = 'name';

    public static function getNavigationLabel(): string
    {
        return 'Major Activities';
    }

    public static function getPluralModelLabel(): string
    {
        return 'Major Activities';
    }

    public static function getModelLabel(): string
    {
        return 'Major Activity';
    }

    public static function getNavigationItems(): array
    {
        return [
            \Filament\Navigation\NavigationItem::make(static::getNavigationLabel())
                ->group(static::getNavigationGroup())
                ->icon(static::getNavigationIcon())
                ->activeIcon(static::getActiveNavigationIcon())
                ->isActiveWhen(fn () => request()->routeIs(static::getRouteBaseName() . '.*'))
                ->sort(static::getNavigationSort())
                ->badge(static::getNavigationBadge(), color: static::getNavigationBadgeColor())
                ->url(static::getNavigationUrl())
                ->extraAttributes([
                    'class' => 'inner-nav-item',
                ]),
        ];
    }

    public static function form(Schema $schema): Schema
    {
        return SubDestinationForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SubDestinationsTable::configure($table);
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
            'index' => ListSubDestinations::route('/'),
            'create' => CreateSubDestination::route('/create'),
            'edit' => EditSubDestination::route('/{record}/edit'),
        ];
    }
}
