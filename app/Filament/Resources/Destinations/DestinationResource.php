<?php

namespace App\Filament\Resources\Destinations;

use App\Filament\Resources\Destinations\Pages\CreateDestination;
use App\Filament\Resources\Destinations\Pages\EditDestination;
use App\Filament\Resources\Destinations\Pages\ListDestinations;
use App\Filament\Resources\Destinations\Pages\ViewDestination;
use App\Filament\Resources\Destinations\Schemas\DestinationForm;
use App\Filament\Resources\Destinations\Tables\DestinationsTable;
use App\Models\Destination;
use BackedEnum;
use AmidEsfahani\FilamentTinyEditor\TinyEditor;

use Filament\Forms\Form;
// use Filament\Forms\Components\Card;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Repeater;
use App\Filament\Components\MediaPicker;
use Filament\Forms\Components\Select;
use Filament\Schemas\Components\Tabs;

use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Components\Card;

use Filament\Resources\Resource;

use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use App\Models\Package;
use UnitEnum;
use Illuminate\Support\Str;

class DestinationResource extends Resource
{
    protected static ?string $model = Destination::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedGlobeAlt;
    protected static UnitEnum|string|null $navigationGroup = 'Tours & Destinations';
    protected static ?int $navigationSort = 1;

    protected static ?string $recordTitleAttribute = 'name';

     public static function form(Schema $schema): Schema
{
    return $schema->components([

Tabs::make('Destination Tabs')
                ->columnSpanFull()
                ->tabs([

                    // ---------------- General Info ----------------
                    Tab::make('General Info')
                        ->schema([
                            TextInput::make('name')->required()
                            ->live(debounce: 500)
                            ->afterStateUpdated(function (string $operation, $state, callable $set) {
                                if ($operation === 'create') {
                                    $set('slug', Str::slug($state));
                                }
                            }),
                            TextInput::make('slug')->required()
                            ->live(debounce: 500)
                            ->unique(Destination::class, 'slug', ignoreRecord: true)
                            ->dehydrated()
                            ->helperText(fn ($state) => $state ? url('/destination/' . $state) : null),
                            TextInput::make('region')->required(),
                            TextInput::make('country')->required(),
                             MediaPicker::make('banner_image')
                                ->label('Banner Image')
                                ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                                ->disk('direct_public')
                                ->directory('uploads')
                                ->visibility('public')
                                ->helperText('Recommended size: 1920x1080px (16:9 ratio).'),
                            TinyEditor::make('description')->required()->columnSpanFull(),
                            ])->columns(['default' => 2]),

                    // ---------------- Banner Info ----------------
                    Tab::make('Banner Information')
                        ->schema([

                            Repeater::make('banner_accordion_tags')
                                ->schema([
                                    MediaPicker::make('icon')
                                        ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                                        ->disk('direct_public')
                                        ->directory('uploads')
                                        ->visibility('public')
                                        ->imagePreviewHeight('100')
                                        ->columnSpan(1)
                                        ->helperText('Recommended size: 64x64px (SVG or transparent PNG).'),
                                    TextInput::make('title')
                                        ->columnSpan(2)
                                        ->required(),
                                    TextInput::make('content')
                                        ->columnSpan(3)
                                        ->required()->label('Subtitle'),
                                ])
                                ->columns(6)
                                ->reorderable(),
                        ]),

                    // ---------------- Destination Details ----------------
                        Tab::make('Details')
                                ->schema([
                                    Repeater::make('destination_details')
                                        ->schema([
                                            
                                            TextInput::make('title')->required(),
                                            MediaPicker::make('image')
                                            ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                                            ->disk('direct_public')
                                            ->directory('uploads')
                                            ->visibility('public')
                                            ->helperText('Recommended size: 800x900px (8:9 ratio).'),
                                            // RichEditor::make('additional')
                                            //     ->label('Leave Blank if nothing is extra is not to add')
                                            //         ->columnSpanFull(),
                                            TinyEditor::make('description')
                                                ->required()
                                                ->columnSpanFull(),
                                        ])
                                        ->columns(['default' => 2])
                                        ->reorderable(),
                                ]),


                    // ---------------- Best Season ----------------
                    Tab::make('Best Season')
                        ->schema([
                            TextInput::make('best_season_title'),
                            Repeater::make('best_season_accordions')
                                ->schema([
                                    TextInput::make('title')->required()->placeholder('e.g., Spring (March - May)'),
                                    TextInput::make('season')->required()->placeholder('e.g., Peak Trekking Season'),
                                    MediaPicker::make('icon')
                                        ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                                        ->disk('direct_public')
                                        ->directory('uploads')
                                        ->visibility('public')
                                        ->helperText('Recommended size: 64x64px (SVG or transparent PNG).'),
                                    TinyEditor::make('content')->required()
                                    ->label('Description')
                                    ->columnSpanFull(),
                                ])
                                ->columns(['default' => 3])
                                ->reorderable(),
                        ]),

                    // ---------------- Must Visit ----------------
                    Tab::make('Must Visit')
                        ->schema([
                            TextInput::make('must_visit_title'),
                            Repeater::make('must_visit_accordions')
                                ->schema([
                                    TextInput::make('title')->required(),
                                    MediaPicker::make('image')
                                    ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                                    ->disk('direct_public')
                                    ->directory('uploads')
                                    ->visibility('public')
                                    ->helperText('Recommended size: 800x900px (8:9 ratio).'),
                                    TinyEditor::make('content')->required()
                                    ->label('Description')
                                    ->columnSpanFull(),
                                ])
                                ->columns(['default' => 2])
                                ->reorderable(),
                        ]),

                    // ---------------- Practical Info ----------------
                    Tab::make('Practical Info')
                        ->schema([
                            TextInput::make('practical_information_title'),
                            Repeater::make('practical_information_accordions')
                                ->schema([
                                    TextInput::make('title')->required(),
                                    TextInput::make('content')->required()
                                    ->label('subtitle'),
                                    MediaPicker::make('icon')
                                    ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                                    ->disk('direct_public')
                                    ->directory('uploads')
                                    ->visibility('public')
                                    ->helperText('Recommended size: 64x64px (SVG or transparent PNG).'),
                                ])
                                ->columns(['default' => 3])
                                ->reorderable(),
                        ]),

                    // ---------------- Tips ----------------
                    Tab::make('Tips & Etiquette')
                        ->schema([
                            Repeater::make('essential_tips')
                                ->schema([
                                    TextInput::make('tip')->required(),
                                ])
                                ->reorderable(),

                            Repeater::make('cultural_etiquette')
                                ->schema([
                                    TextInput::make('rule')->required(),
                                ])
                                ->reorderable(),
                        ])->columns(['default' => 2]),

                    // ---------------- Packages ----------------
                    Tab::make('Packages')
                        ->schema([
                            Select::make('packages')
                                ->label('Assign Packages')
                                ->multiple()
                                ->relationship('packages', 'title')
                                ->preload()
                                ->columnSpanFull(),
                        ]),

                    // ---------------- Place Explores ----------------
                    Tab::make('Place Explores')
                        ->schema([
                            Select::make('placeExplores')
                                ->label('Linked Place Explores')
                                ->multiple()
                                ->relationship('placeExplores', 'title')
                                ->preload()
                                ->columnSpanFull(),
                        ]),

                    // ---------------- SEO ----------------
                    Tab::make('SEO')
                        ->schema([
                            \App\Filament\Forms\SeoMetadataForm::make()
                        ]),
                ]),
        ]);
}

    public static function table(Table $table): Table
    {
        return DestinationsTable::configure($table);
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
            'index' => ListDestinations::route('/'),
            'create' => CreateDestination::route('/create'),
            'view' => ViewDestination::route('/{record}'),
            'edit' => EditDestination::route('/{record}/edit'),
        ];
    }
}
