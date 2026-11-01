<?php

namespace App\Filament\Resources\Advantages;

use App\Filament\Resources\Advantages\Pages\CreateAdvantage;
use App\Filament\Resources\Advantages\Pages\EditAdvantage;
use App\Filament\Resources\Advantages\Pages\ListAdvantages;
use App\Filament\Resources\Advantages\Schemas\AdvantageForm;
use App\Filament\Resources\Advantages\Tables\AdvantagesTable;
use App\Models\Advantage;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;
use Filament\Forms\Components\TextInput;
use App\Filament\Components\MediaPicker;
use AmidEsfahani\FilamentTinyEditor\TinyEditor;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;

class AdvantageResource extends Resource
{
    protected static ?string $model = Advantage::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::Megaphone;
    protected static ?int $navigationSort = 3;

    protected static UnitEnum|string|null $navigationGroup = 'Components';

    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Tabs::make('Advantage Tabs')
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
                    TinyEditor::make('description')                    ->required()                    ->columnSpanFull(),
                ])
                ->columns(6),

            ])
        ]);
    }

    public static function table(Table $table): Table
    {
        return AdvantagesTable::configure($table);
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
            'index' => ListAdvantages::route('/'),
            'create' => CreateAdvantage::route('/create'),
            'edit' => EditAdvantage::route('/{record}/edit'),
        ];
    }
}
