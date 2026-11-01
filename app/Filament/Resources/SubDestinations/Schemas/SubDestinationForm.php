<?php
namespace App\Filament\Resources\SubDestinations\Schemas;

use AmidEsfahani\FilamentTinyEditor\TinyEditor;
use App\Models\Destination;
use App\Filament\Components\MediaPicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Fieldset;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class SubDestinationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Tabs::make('Major Activity')
                ->columnSpanFull()
                ->tabs([

                    /* ---------- BASIC INFO ---------- */
                    Tab::make('Basic Info')
                        ->schema([
                            TextInput::make('name')
                                ->required()
                                ->live(debounce: 500)
                                ->afterStateUpdated(function (string $operation, $state, callable $set) {
                                    if ($operation === 'create') {
                                        $set('slug', Str::slug($state));
                                    }
                                }),

                            TextInput::make('slug')
                                ->required()
                                ->live(debounce: 500)
                                ->unique(table: 'sub_destination', ignoreRecord: true)
                                ->dehydrated()
                                ->helperText(fn ($state, callable $get) => $state ? url('/' . ($get('destination_slug') ?? '{destination}') . '/' . $state) : null),
                            Select::make('destination_slug')
                                ->label('Destination')
                                ->options(
                                    Destination::all()->pluck('slug', 'slug')->toArray()
                                )
                                ->required()
                                ->live(),
                        ])
                        ->columns(2),

                    /* ---------- BANNER ACCORDION ---------- */
                    Tab::make('Banner Accordion')
                        ->schema([
                            TextInput::make('banner_accordions.title')
                                ->label('Title')
                                ->required(),

                            TextInput::make('banner_accordions.sub_title')
                                ->label('Sub Title'),

                            MediaPicker::make('banner_accordions.banner_icon')
                                ->label('Banner Icon(Optional)')
                                ->disk('direct_public')
                                ->directory('uploads')
                                ->visibility('public')
                                ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                                ->helperText('Recommended size: 64x64px (SVG or transparent PNG).'),
                            MediaPicker::make('banner_accordions.banner_image')
                                ->label('Banner Image')
                                ->disk('direct_public')
                                ->required()
                                ->directory('uploads')
                                ->visibility('public')
                                ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                                ->helperText('Recommended size: 1920x1080px (16:9 ratio).'),
                        ])
                        ->columns(2),

                    /* ---------- OVERVIEW ---------- */
                    Tab::make('Overview')
                        ->schema([
                            Repeater::make('overviews')
                                ->label('Overview Sections')
                                ->schema([
                                    TextInput::make('title'),
                                    TextInput::make('sub_title'),
                                    TextInput::make('quote_title'),
                                    TextInput::make('quote_text'),

                                    MediaPicker::make('image')
                                        ->label('Image')
                                        ->disk('direct_public')
                                        ->directory('uploads')
                                        ->visibility('public')
                                        ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                                        ->helperText('Recommended size: 800x900px (8:9 ratio).'),

                                    TinyEditor::make('content')
                                        ->label('Detail')
                                        ->columnSpanFull(),

                                    Fieldset::make('Tags')
                                        ->label('Tags')
                                        ->schema([
                                            Repeater::make('tags')
                                                ->schema([
                                                    TextInput::make('label') // just 'label', not 'tags.label'
                                                        ->label('Image Label')
                                                        ->required(),

                                                    MediaPicker::make('path') // just 'path', not 'tags.path'
                                                        ->label('Image')
                                                        ->disk('direct_public')
                                                        ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                                                        ->directory('uploads')
                                                        ->visibility('public')
                                                        ->required()
                                                        ->helperText('Recommended size: 800x900px (8:9 ratio).'),
                                                ])
                                                ->columns(2)
                                                ->reorderable()
                                                 ->columnSpanFull()
                                                ->createItemButtonLabel('Add Tag'), // optional, custom button text
                                        ])
                                        ->columnSpanFull(),
                                ])
                                ->columns(2)
                                ->reorderable()
                                ->columnSpanFull(),
                        ]),

                    /* ---------- ESSENTIAL INFO ---------- */
                    Tab::make('Essential Info')
                        ->schema([
                            Tabs::make('related_guides_tabs')
                                ->tabs([

                                    /* ================= BEST TIME TO VISIT ================= */
                                    Tab::make('Best Time to Visit')
                                        ->schema([
                                            TextInput::make('essential_info.best_time_to_visit.title')
                                                ->label('Title')
                                                ->helperText('Optional: Provide a custom title to replace the default "Best Time to Visit".'),

                                            Repeater::make('essential_info.best_time_to_visit.items')
                                                ->label('Best Seasons')
                                                ->schema([
                                                    MediaPicker::make('icon')
                                                        ->label('Icon')
                                                        ->disk('direct_public')
                                                        ->directory('uploads')
                                                        ->visibility('public')
                                                        ->imagePreviewHeight('100')
                                                        ->columnSpan(1)
                                                        ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif']),
                                                    TextInput::make('season')
                                                        ->columnSpan(5),

                                                    TinyEditor::make('description')
                                                        ->columnSpanFull(),
                                                ])
                                                ->columns(6)
                                                ->reorderable(),

                                            Textarea::make('essential_info.best_time_to_visit.off_season_considerations')
                                                ->label('Off-Season Considerations')
                                                ->columnSpanFull(),
                                        ])
                                        ->columns(1),

                                    /* ================= PERMITS & FEES ================= */
                                    Tab::make('Permits & Fees')
                                        ->schema([
                                            TextInput::make('essential_info.permits_and_fees.title')
                                                ->label('Title')
                                                ->helperText('Optional: Provide a custom title to replace the default "Permits & Fees".'),
                                            Repeater::make('essential_info.permits_and_fees.items')
                                                ->label('Permits')
                                                ->schema([
                                                    MediaPicker::make('icon')
                                                        ->label('Icon')
                                                        ->disk('direct_public')
                                                        ->directory('uploads')
                                                        ->visibility('public')
                                                        ->imagePreviewHeight('100')
                                                        ->columnSpan(1)
                                                        ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif']),
                                                    TextInput::make('label')->required()
                                                        ->columnSpan(3),
                                                    
                                                    TextInput::make('cost')
                                                        ->columnSpan(2),

                                                    TinyEditor::make('content')
                                                        ->columnSpanFull(),
                                                ])
                                                ->columns(6)
                                                ->reorderable(),

                                            TinyEditor::make('essential_info.permits_and_fees.note')
                                                ->label('Note')
                                                ->columnSpanFull(),
                                        ])
                                        ->columns(1),

                                    /* ================= FLIGHTS ================= */
                                    Tab::make('Flights')
                                        ->schema([
                                            TextInput::make('essential_info.flights.title')
                                                ->label('Title')
                                                ->helperText('Optional: Provide a custom title to replace the default "Flights Information".')
                                                ->columnSpanFull(),

                                            TinyEditor::make('essential_info.flights.contents')
                                                ->label('Flight Information'),
                                            TinyEditor::make('essential_info.flights.tips')
                                                ->label('Flight Tips'),
                                        ])

                                        ->columns(2),

                                ]),
                        ]),

                    /* ---------- FAQ ---------- */
                    Tab::make('FAQ')
                        ->schema([
                            Repeater::make('faq')
                                ->label('FAQ')
                                ->schema([
                                    TextInput::make('question')->required(),
                                    Textarea::make('answer')->rows(3)->required(),
                                ])
                                ->reorderable()
                                ->columnSpanFull(),
                        ]),

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
                                ->relationship('placeExplores', 'title')
                                ->multiple()
                                ->preload()
                                ->searchable()
                        ]),

                    // ---------------- SEO ----------------
                    Tab::make('SEO')
                        ->schema([
                            \App\Filament\Forms\SeoMetadataForm::make()
                        ]),
                ]),
        ]);
    }
}
