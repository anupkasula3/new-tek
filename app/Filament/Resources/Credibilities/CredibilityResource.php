<?php

namespace App\Filament\Resources\Credibilities;

use App\Filament\Resources\Credibilities\Pages\CreateCredibility;
use App\Filament\Resources\Credibilities\Pages\EditCredibility;
use App\Filament\Resources\Credibilities\Pages\ListCredibilities;
use App\Filament\Resources\Credibilities\Tables\CredibilitiesTable;
use App\Models\Credibility;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;
use Filament\Forms\Components\TextInput;
use App\Filament\Components\MediaPicker;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;

class CredibilityResource extends Resource
{
    protected static ?string $model = Credibility::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::ShieldCheck;
    protected static ?int $navigationSort = 6;
    protected static ?string $navigationLabel = 'Credibility';
    protected static UnitEnum|string|null $navigationGroup = 'Components';

    protected static ?string $recordTitleAttribute = 'title';
    protected static ?string $modelLabel = 'Credibility Item';
    protected static ?string $pluralModelLabel = 'Credibility Items';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Tabs::make('Credibility Tabs')
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
                    ->placeholder('e.g., 100+ or Best Price'),
                    TextInput::make('detail')
                    ->required()
                    ->placeholder('e.g., Destinations or Guarantee'),
                    TextInput::make('order')
                    ->numeric()
                    ->default(0)
                    ->required()
                    ->placeholder('Sorting order'),
                ])
                ->columns(2),
            ])
        ]);
    }

    public static function table(Table $table): Table
    {
        return CredibilitiesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListCredibilities::route('/'),
            'create' => CreateCredibility::route('/create'),
            'edit' => EditCredibility::route('/{record}/edit'),
        ];
    }
}
