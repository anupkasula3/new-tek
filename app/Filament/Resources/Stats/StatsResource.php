<?php
namespace App\Filament\Resources\Stats;

use App\Filament\Resources\Stats\Pages\CreateStats;
use App\Filament\Resources\Stats\Pages\EditStats;
use App\Filament\Resources\Stats\Pages\ListStats;
use App\Filament\Resources\Stats\Tables\StatsTable;
use App\Models\Stats;
use BackedEnum;
use App\Filament\Components\MediaPicker;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class StatsResource extends Resource
{
    protected static ?string $model = Stats::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::ChartBar;

    protected static UnitEnum|string|null $navigationGroup = 'Components';
    protected static ?int $navigationSort = 1;

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Tabs::make('Stats Tabs')
            ->columnSpanFull()
            ->tabs([
                Tab::make('Basic Information')
                ->schema([
                    MediaPicker::make('icon')
                    ->label('Icon')
                    ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                    ->disk('direct_public')
                    ->directory('uploads')
                    ->visibility('public')
                    ->helperText('Recommended size: 64x64px (SVG or transparent PNG).'),
                    TextInput::make('title')
                    ->required()
                    ->placeholder('e.g., Total Treks, Happy Clients, etc.')
                    ->columnSpan(5),
                    TextInput::make('position')->required()->numeric()->placeholder('e.g., 1,2')->columnSpan(2),
                    TextInput::make('number')->required()->numeric()->placeholder('e.g., 100, 5000, etc.')->columnSpan(2),
                    TextInput::make('symbol')->required()->placeholder('e.g., +, %, etc.')->columnSpan(2),
                ])
                ->columns(6),

            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return StatsTable::configure($table);
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
            'index' => ListStats::route('/'),
            'create' => CreateStats::route('/create'),
            'edit' => EditStats::route('/{record}/edit'),
        ];
    }
}
