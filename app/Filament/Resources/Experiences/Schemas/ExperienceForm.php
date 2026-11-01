<?php
namespace App\Filament\Resources\Experiences\Schemas;

use App\Models\Experience;
use App\Models\Package;
use App\Models\PlaceExplore;
use App\Models\Trek;
use App\Filament\Components\MediaPicker;
use Filament\Forms\Components\Repeater;
use AmidEsfahani\FilamentTinyEditor\TinyEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ExperienceForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                //
                Tabs::make('Experience Tabs')
                    ->columnSpanFull()
                    ->tabs([
                        Tab::make('Basic Information')
                            ->schema([
                                TextInput::make('title')->required()
                                    ->placeholder('e.g., Everest Base Camp Trek')
                                    ->live(debounce: 500)
                                    ->afterStateUpdated(function (string $operation, $state, callable $set) {
                                        if ($operation === 'create') {
                                            $set('slug', Str::slug($state));
                                        }
                                    }),
                                TextInput::make('slug')->required()->placeholder('e.g., everest-base-camp-trek')
                                    ->live(debounce: 500)
                                    ->unique(Experience::class, 'slug', ignoreRecord: true)
                                    ->dehydrated()
                                    ->helperText(fn ($state) => $state ? url('/luxury/' . $state) : null),
                                MediaPicker::make('image')
                                    ->label('Image')
                                    ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                                    ->disk('direct_public')
                                    ->directory('uploads')
                                    ->visibility('public')
                                    ->helperText('Recommended size: 800x900px (8:9 ratio).'),
                                MediaPicker::make('icon')->label('Icon (Heroicon name)')
                                    ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                                    ->disk('direct_public')
                                    ->directory('uploads')
                                    ->visibility('public')
                                    ->helperText('Recommended size: 64x64px (SVG or transparent PNG).'),
                                TinyEditor::make('description')->label('Banner Description')->columnSpanFull(),
                            ])
                            ->columns(2),
                        Tab::make('Details')
                            ->schema([
                                Repeater::make('details')
                                    ->schema([
                                        TextInput::make('title'),
                                        TextInput::make('overview'),
                                        MediaPicker::make('image')
                                            ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                                            ->disk('direct_public')
                                            ->directory('uploads')
                                            ->visibility('public')
                                            ->helperText('Recommended size: 800x900px (8:9 ratio).'),
                                        TinyEditor::make('notes')->label('Note (Image bottom)')->columnSpanFull(),
                                        TinyEditor::make('content')->label('Description')->columnSpanFull(),
                                    ])
                                    ->reorderable()
                                    
                                    ->columns(3),
                            ]),
                        Tab::make('Places to Explore')
                            ->schema([
                                Select::make('placeExplores')
                                    ->label('Linked Place Explores')
                                    ->multiple()
                                    ->relationship('placeExplores', 'title')
                                    ->preload()
                                    ->columnSpanFull(),
                            ]),
                        Tab::make('Best Time to Visit')
                            ->schema([

                                Repeater::make('best_time')
                                    ->schema([
                                        Toggle::make('recommended')->label('Recommended to Visit?')->columnSpanFull(),
                                        TextInput::make('best_time')->label('Best Time to Visit')->placeholder('e.g., September to November'),
                                        TextInput::make('temperature')->label('Temperature')->placeholder('e.g., 10°C to 25°C'),
                                        TinyEditor::make('best_time_description')->label('Description')->columnSpanFull(),
                                    ])
                                    ->reorderable()
                                    
                                    ->columns(2),
                            ]),
                        Tab::make('Advantages')
                            ->schema([
                                Repeater::make('advantages')
                                    ->schema([

                                        // MediaPicker::make('advantages_icon')
                                        //     ->label('Advantages Icon')
                                        //     ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                                        //     ->disk('direct_public')
                                        //     ->directory('uploads')
                                        //     ->visibility('public')
                                        //     ->imagePreviewHeight('100')
                                        //     ->columnSpan(1)
                                        //     ->helperText('Recommended size: 64x64px (SVG or transparent PNG).'),

                                        // MediaPicker::make('background_image')
                                        //     ->label('Background Image')
                                        //     ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                                        //     ->disk('direct_public')
                                        //     ->directory('uploads')
                                        //     ->visibility('public')
                                        //     ->imagePreviewHeight('120')
                                        //     ->columnSpan(3)
                                        //     ->helperText('Recommended size: 1920x1080px (16:9 ratio).'),

                                        TextInput::make('advantages_title')
                                            ->label('Advantages Title')
                                            ->placeholder('e.g., Why Choose This Experience?')
                                            ->columnSpan(2),
                                        TextInput::make('advantages_content')
                                            ->label('Advantages subtitle')
                                            ->columnSpanFull(),
                                        Repeater::make('advantages_list')
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
                                                    ->columnSpan(5),
                                                TextInput::make('content')
                                                    ->label("Short Description")
                                                    ->columnSpanFull(),
                                            ])
                                            ->reorderable()
                                            ->columns(6)
                                            
                                            ->columnSpanFull(),
                                        // TextInput::make('advantages_cta')->label('CTA Label')->columnSpanFull(),

                                        // Repeater::make('advantages_cta_links')
                                        //     ->schema([
                                        //         Select::make('type')
                                        //             ->options([
                                        //                 'primary' => 'Primary',
                                        //                 'outline' => 'Outline',
                                        //             ])
                                        //             ->default('primary'),
                                        //         TextInput::make('title'),
                                        //         TextInput::make('link'),

                                        //     ])
                                        //     ->reorderable()
                                            
                                        //     ->columns(3)
                                        //     ->columnSpanFull(),

                                    ])
                                    ->reorderable()
                                    
                                    ->columns(2),
                            ])->columnSpanFull(),
                        Tab::make('CTA')
                            ->schema([
                                Repeater::make('cta')
                                    ->schema([
                                        TextInput::make('cta_title')->label('CTA Title')->placeholder('e.g., Ready to Embark on Your Adventure?'),
                                        TextInput::make('cta_details')->label('CTA Details')->columnSpanFull(),
                                        Repeater::make('cta_links')
                                            ->schema([
                                                Select::make('type')
                                                    ->options([
                                                        'primary' => 'Primary',
                                                        'outline' => 'Outline',
                                                    ])
                                                    ->default('primary'),
                                                TextInput::make('title'),
                                                TextInput::make('link'),

                                            ])
                                            ->reorderable()
                                            
                                            ->columns(3)
                                            ->columnSpanFull(),
                                    ])
                                    ->reorderable()
                                    
                                    ->columns(2)
                                    ->columnSpanFull(),

                            ])
                            ->columns(2)
                            ->columnSpanFull(),

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

                        // ---------------- SEO ----------------
                        Tab::make('SEO')
                            ->schema([
                                \App\Filament\Forms\SeoMetadataForm::make()
                            ]),
                    ]),
            ]);
    }
}
