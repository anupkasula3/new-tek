<?php
namespace App\Filament\Resources\Packages;

use App\Filament\Resources\Packages\Pages\CreatePackage;
use App\Filament\Resources\Packages\Pages\EditPackage;
use App\Filament\Resources\Packages\Pages\ListPackages;
use App\Filament\Resources\Packages\Pages\ViewPackage;
use App\Models\Package;
use BackedEnum;
use Filament\Forms\Components\DateTimePicker;
use App\Filament\Components\MediaPicker;
use AmidEsfahani\FilamentTinyEditor\TinyEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Repeater;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Grid;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use UnitEnum;
use Illuminate\Support\Str;
use App\Filament\Resources\Packages\RelationManagers\ItinerariesRelationManager;
use App\Filament\Resources\Packages\RelationManagers\IncludesRelationManager;
use App\Filament\Resources\Packages\RelationManagers\ExcludesRelationManager;
use App\Filament\Resources\Packages\RelationManagers\AddonPackagesRelationManager;
use Filament\Infolists\Components\TextEntry;

class PackageResource extends Resource
{
    protected static ?string $model = Package::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::Map;

    protected static UnitEnum|string|null $navigationGroup = 'Tours & Destinations';
    protected static ?int $navigationSort = 5;
    protected static ?string $modelLabel = 'Product';
    protected static ?string $pluralModelLabel = 'Products';
    protected static ?string $navigationLabel = 'Products';
    protected static ?string $recordTitleAttribute = 'title';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Tabs::make('Package Tabs')
                ->columnSpanFull()
                ->tabs([
                    self::basicInformationTab(),
                    self::packageTiersTab(),
                    self::dynamicPricingTab(),
                    self::includesExcludesTab(),
                    self::bannerInfoTab(),
                    self::mapTab(),
                    self::contentTab(),
                    self::itinerariesTab(),
                    self::trekGradingTab(),
                    self::seasonsTab(),
                    self::usefulInfoTab(),
                    self::packingListTab(),
                    self::faqsTab(),
                    self::reviewsTab(),
                    self::addonsTab(),
                    self::seoTab(),
                ]),
        ]);
    }

    // ─────────────────────────────────────────────
    // TAB BUILDERS
    // ─────────────────────────────────────────────

    private static function basicInformationTab(): Tab
    {
        return Tab::make('Basic Information')
            ->schema([
                Toggle::make('is_popular')
                    ->label('Popular Package')
                    ->default(false),
                Toggle::make('is_best_selling')
                    ->label('Best Selling Trip')
                    ->default(false),
                Select::make('status')
                    ->options([
                        'draft'     => 'Draft',
                        'published' => 'Published',
                        'scheduled' => 'Scheduled',
                        'private'   => 'Private',
                    ])
                    ->default('draft')
                    ->required(),
                DateTimePicker::make('published_at')
                    ->label('Published Date')
                    ->default(now()),
                TextInput::make('title')
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
                    ->unique(Package::class, 'slug', ignoreRecord: true)
                    ->dehydrated()
                    ->helperText(fn ($state) => $state ? url('/' . $state) : null),
                TextInput::make('country')->placeholder('eg. Nepal'),
                TextInput::make('region')->placeholder('eg. Expedition Series'),
                TextInput::make('duration_days')->placeholder('eg. 13 Nights 14 Days'),
                TextInput::make('price')->numeric()->prefix('$'),
                Toggle::make('allow_deposit')
                    ->label('Allow Deposit Payment')
                    ->default(false)
                    ->reactive(),
                TextInput::make('deposit_percentage')
                    ->label('Deposit Percentage')
                    ->numeric()
                    ->default(20)
                    ->suffix('%')
                    ->visible(fn ($get) => $get('allow_deposit')),
                Select::make('difficulty')
                    ->options([
                        'Easy'        => 'Easy',
                        'Moderate'    => 'Moderate',
                        'Challenging' => 'Challenging',
                    ]),
                Textarea::make('description')
                    ->label('Banner Description')
                    ->rows(3)
                    ->columnSpanFull(),
            ])
            ->columns(['md' => 2]);
    }

    private static function dynamicPricingTab(): Tab
    {
        return Tab::make('Dynamic Pricing')
            ->schema([
                Repeater::make('pax_pricing')
                    ->schema([
                        Select::make('tier')
                            ->label('Price Tier')
                            ->options(function (callable $get, ?Package $record) {
                                $tiers = $get('../../package_tiers') ?? $get('/package_tiers') ?? $record?->package_tiers ?? [];
                                $options = ['default' => 'Default (Base Package)'];
                                foreach ($tiers as $tier) {
                                    if (!empty($tier['name'])) {
                                        $slug = Str::slug($tier['name']);
                                        $options[$slug] = $tier['name'];
                                    }
                                }
                                return $options;
                            })
                            ->default('default')
                            ->live()
                            ->columnSpan(2),
                        TextInput::make('pax')
                            ->label('Pax (Up to)')
                            ->numeric()
                            ->placeholder('e.g. 2')
                            ->columnSpan(1),
                        TextInput::make('price')
                            ->label('Price per person')
                            ->numeric()
                            ->prefix('$')
                            ->placeholder('e.g. 1500')
                            ->columnSpan(1),
                    ])
                    ->columns(2)
                    ->reorderable()
                    ->columnSpanFull()
                    ->helperText('Define pricing ranges based on the number of people and Price Tier. If dynamic pricing is defined for a selected tier, it will override default/base dynamic pricing.'),
            ]);
    }

    private static function packageTiersTab(): Tab
    {
        return Tab::make('Price Tiers')
            ->schema([
                Repeater::make('package_tiers')
                    ->label('Pricing Tiers')
                    ->live()
                    ->schema([
                        TextInput::make('name')
                            ->label('Tier Name')
                            ->placeholder('e.g. Standard, Deluxe, Budget')
                            ->required()
                            ->columnSpan(1),
                        TextInput::make('price')
                            ->label('Price (USD)')
                            ->numeric()
                            ->prefix('$')
                            ->placeholder('e.g. 1200')
                            ->columnSpan(1),
                        Textarea::make('description')
                            ->label('Short Description')
                            ->placeholder('Brief description of what makes this tier special')
                            ->rows(2)
                            ->columnSpan(2),
                    ])
                    ->columns(2)
                    ->reorderable()
                    ->columnSpanFull()
                    ->helperText('Define different price tiers (e.g. Standard, Deluxe, Budget). Each tier can have its own price and includes/excludes set in the Includes & Excludes tab.'),
            ]);
    }

    private static function bannerInfoTab(): Tab
    {
        return Tab::make('Banner Info')
            ->schema([
                MediaPicker::make('banner_image')
                    ->image()
                    ->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                    ->disk('direct_public')
                    ->directory('uploads')
                    ->visibility('public')
                    ->label('Banner Image')
                    ->helperText('Recommended size: 1920x1080px (16:9 ratio).')
                    ->columnSpanFull()
                    ->required(),
                Repeater::make('banner_accordion_tags')
                    ->schema([
                        MediaPicker::make('icon')
                            ->image()
                            ->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                            ->disk('direct_public')
                            ->directory('uploads')
                            ->visibility('public')
                            ->columnSpan(1)
                            ->helperText('Recommended size: 64x64px (SVG or transparent PNG).'),
                        TextInput::make('title')->columnSpan(2),
                        TextInput::make('content')->columnSpan(3),
                    ])
                    ->reorderable()
                    ->columns(6)
                    ->columnSpanFull(),
            ]);
    }

    private static function mapTab(): Tab
    {
        return Tab::make('Map')
            ->schema([
                MediaPicker::make('map_image')
                    ->image()
                    ->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                    ->disk('direct_public')
                    ->directory('uploads')
                    ->visibility('public')
                    ->label('Trek Map Image')
                    ->helperText('Upload a route map or trail map image. Recommended size: 1200x800px.')
                    ->columnSpanFull(),
            ]);
    }

    private static function contentTab(): Tab
    {
        return Tab::make('Content')
            ->schema([
                TextInput::make('experience_title')->label('Experience Title'),
                TextInput::make('experience_subtitle')->label('Experience Subtitle'),
                TinyEditor::make('main_content')
                    ->label('Main Content (displayed before Quick Summary)')
                    ->columnSpanFull(),
                TextInput::make('quick_summary_title')
                    ->label('Quick Summary Title')
                    ->placeholder('e.g. Quick Summary')
                    ->columnSpanFull(),
                TinyEditor::make('quick_summary')->label('Quick Summary')->columnSpanFull(),
                TinyEditor::make('experience'),
                TextInput::make('experience_note_title')
                    ->label('Experience Note Title')
                    ->placeholder('e.g. Experience Note')
                    ->columnSpanFull(),
                Textarea::make('experience_note')
                    ->label('Experience Note (displayed below experience)')
                    ->placeholder('e.g. Please note that experience may change due to weather conditions...')
                    ->rows(3)
                    ->columnSpanFull(),
                TextInput::make('itinerary_title')
                    ->label('Itinerary Title')
                    ->placeholder('e.g. Your Daily Itinerary'),
                TextInput::make('itinerary_subtitle')
                    ->label('Itinerary Subtitle')
                    ->placeholder('e.g. Daily Breakdown'),
                Textarea::make('itinerary_description')
                    ->label('Itinerary Description (displayed below Itinerary Title)')
                    ->placeholder('e.g. A carefully planned journey...')
                    ->rows(2)
                    ->columnSpanFull(),
                TextInput::make('itinerary_note_title')
                    ->label('Itinerary Note Title')
                    ->placeholder('e.g. Itinerary Note')
                    ->columnSpanFull(),
                Textarea::make('itinerary_note')
                    ->label('Itinerary Note (displayed below Itinerary)')
                    ->placeholder('e.g. Please note that itineraries may change due to weather conditions...')
                    ->rows(3)
                    ->columnSpanFull(),
            ]);
    }

    private static function itinerariesTab(): Tab
    {
        return Tab::make('Itineraries')
            ->schema([
                Repeater::make('itineraries')
                    ->relationship('itineraries')
                    ->schema([
                        TextInput::make('day')->numeric(),
                        TextInput::make('title')->maxLength(255),
                        TextInput::make('distance_km'),
                        TextInput::make('walking_hours')->maxLength(255),
                        TextInput::make('altitude')->maxLength(255),
                        TextInput::make('accommodation')
                            ->placeholder('e.g. Overnight at a Guesthouse')
                            ->maxLength(255),
                        TextInput::make('meals')
                            ->placeholder('e.g. Breakfast, Lunch and Dinner included')
                            ->maxLength(255),
                        MediaPicker::make('image')
                            ->image()
                            ->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                            ->disk('direct_public')
                            ->directory('uploads')
                            ->visibility('public')
                            ->helperText('Recommended size: 1200x400px (3:1 landscape ratio).'),
                        TinyEditor::make('description')->columnSpanFull(),
                    ])
                    ->columns(['md' => 2])
                    ->columnSpanFull()
                    ->reorderable()
                    ->label('Itinerary'),
            ]);
    }

    private static function includesExcludesTab(): Tab
    {
        return Tab::make('Includes & Excludes')
            ->schema([
                Grid::make(2)->schema([
                    TinyEditor::make('includes_html')
                        ->label('Included Items')
                        ->columnSpan(1)
                        ->afterStateHydrated(function (TinyEditor $component, $record) {
                            $component->state($record?->includes()->whereNull('tier')->orWhere('tier', '')->first()?->title ?? '');
                        })
                        ->dehydrated(false)
                        ->saveRelationshipsUsing(function ($record, $state) {
                            $record->includes()->whereNull('tier')->orWhere('tier', '')->delete();
                            if (!empty($state)) {
                                $record->includes()->create(['tier' => null, 'title' => $state]);
                            }
                        }),

                    TinyEditor::make('excludes_html')
                        ->label('Excluded Items')
                        ->columnSpan(1)
                        ->afterStateHydrated(function (TinyEditor $component, $record) {
                            $component->state($record?->excludes()->whereNull('tier')->orWhere('tier', '')->first()?->title ?? '');
                        })
                        ->dehydrated(false)
                        ->saveRelationshipsUsing(function ($record, $state) {
                            $record->excludes()->whereNull('tier')->orWhere('tier', '')->delete();
                            if (!empty($state)) {
                                $record->excludes()->create(['tier' => null, 'title' => $state]);
                            }
                        }),
                ]),

                Section::make('Tier-specific Includes & Excludes')
                    ->description('Set includes/excludes for each pricing tier defined in the Price Tiers tab.')
                    ->schema([
                        self::tierIncludesExcludesRepeater(),
                    ])
                    ->collapsible(),
            ]);
    }

    private static function tierIncludesExcludesRepeater(): Repeater
    {
        return Repeater::make('tier_includes_excludes')
            ->label('Tier Includes & Excludes')
            ->schema([
                Select::make('tier')
                    ->label('Tier')
                    ->options(function (callable $get, ?Package $record) {
                        $tiers = $get('../../package_tiers') ?? $get('../../../package_tiers') ?? $get('/package_tiers') ?? $record?->package_tiers ?? [];
                        return collect($tiers)
                            ->filter(fn ($t) => !empty($t['name']))
                            ->mapWithKeys(fn ($t) => [
                                Str::slug($t['name']) => $t['name'],
                            ])
                            ->all();
                    })
                    ->columnSpan(2),
                TinyEditor::make('addons')
                    ->label('Addon this Tier')
                    ->columnSpanFull(),
                Grid::make(2)->schema([
                    TinyEditor::make('includes')
                        ->label("What's Included for this Tier")
                        ->columnSpan(1),
                    TinyEditor::make('excludes')
                        ->label("What's Excluded for this Tier")
                        ->columnSpan(1),
                ])->columnSpanFull(),
            ])
            ->columns(2)
            ->columnSpanFull()
            ->reorderable(false)
            ->afterStateHydrated(function (Repeater $component, $record) {
                if (!$record) return;
                $tiers = collect($record->package_tiers ?? [])
                    ->filter(fn ($t) => !empty($t['name']))
                    ->map(fn ($t) => Str::slug($t['name']))
                    ->values()
                    ->all();

                $rows = [];
                foreach ($tiers as $tierSlug) {
                    $inc = $record->includes()->where('tier', $tierSlug)->first();
                    $exc = $record->excludes()->where('tier', $tierSlug)->first();
                    $add = $record->addons()->where('tier', $tierSlug)->first();
                    $rows[] = [
                        'tier'     => $tierSlug,
                        'includes' => $inc?->title ?? '',
                        'excludes' => $exc?->title ?? '',
                        'addons'   => $add?->title ?? '',
                    ];
                }
                $component->state($rows);
            })
            ->dehydrated(false)
            ->saveRelationshipsUsing(function ($record, $state) {
                $record->includes()->whereNotNull('tier')->where('tier', '!=', '')->delete();
                $record->excludes()->whereNotNull('tier')->where('tier', '!=', '')->delete();
                $record->addons()->whereNotNull('tier')->where('tier', '!=', '')->delete();

                foreach (($state ?? []) as $row) {
                    $tier = $row['tier'] ?? null;
                    if (!$tier) continue;

                    if (!empty($row['includes'])) {
                        $record->includes()->create(['tier' => $tier, 'title' => $row['includes']]);
                    }
                    if (!empty($row['excludes'])) {
                        $record->excludes()->create(['tier' => $tier, 'title' => $row['excludes']]);
                    }
                    if (!empty($row['addons'])) {
                        $record->addons()->create(['tier' => $tier, 'title' => $row['addons']]);
                    }
                }
            });
    }

    private static function trekGradingTab(): Tab
    {
        return Tab::make('Trek Grading')
            ->schema([
                TextInput::make('difficulty_title')->default('Difficulty Level: Challenging'),
                TextInput::make('difficulty_subtitle')->default('Trek Grading'),
                Textarea::make('difficulty_description')
                    ->label('Difficulty Description')
                    ->columnSpanFull(),
                Section::make('Daily Walking')
                    ->schema([
                        TextInput::make('walking_title')->default('Daily Walking'),
                        TextInput::make('walking_subtitle')->placeholder('e.g. 5-7 hours per day on average'),
                    ])->columns(2),
                Section::make('Max Altitude')
                    ->schema([
                        TextInput::make('altitude_title')->default('Max Altitude'),
                        TextInput::make('altitude_subtitle')->placeholder('e.g. 5,545m at Kala Patthar'),
                    ])->columns(2),
                Section::make('Duration')
                    ->schema([
                        TextInput::make('duration_title')->default('Duration'),
                        TextInput::make('duration_subtitle')->placeholder('e.g. 14 days total trip'),
                    ])->columns(2),
                Section::make('Terrain')
                    ->schema([
                        TextInput::make('terrain_title')->default('Terrain'),
                        TextInput::make('terrain_subtitle')->placeholder('e.g. Rocky paths, stone steps'),
                    ])->columns(2),
                Section::make('Difficulty Metrics')
                    ->schema([
                        TextInput::make('physical_fitness')->numeric()->suffix('%')->maxValue(100)->minValue(0),
                        TextInput::make('technical_skill')->numeric()->suffix('%')->maxValue(100)->minValue(0),
                        TextInput::make('altitude_factor')->numeric()->suffix('%')->maxValue(100)->minValue(0),
                        TextInput::make('endurance')->numeric()->suffix('%')->maxValue(100)->minValue(0),
                    ])->columns(2),
            ])
            ->columns(['md' => 2]);
    }

    private static function seasonsTab(): Tab
    {
        return Tab::make('Seasons')
            ->schema([
                Repeater::make('seasons')
                    ->relationship('seasons')
                    ->schema([
                        Select::make('season')
                            ->options([
                                'Winter (Dec - Feb)' => 'Winter (Dec - Feb)',
                                'Spring (Mar - May)' => 'Spring (Mar - May)',
                                'Summer (Jun - Aug)' => 'Summer (Jun - Aug)',
                                'Autumn (Sep - Nov)' => 'Autumn (Sep - Nov)',
                            ])
                            ->reactive()
                            ->afterStateUpdated(fn ($state, callable $set) =>
                                $set('subtitle', match ($state) {
                                    'Spring (Mar - May)' => 'Vibrant & Blooming',
                                    'Autumn (Sep - Nov)' => 'Clear & Crisp',
                                    default              => null,
                                })
                            ),
                        TextInput::make('subtitle')
                            ->placeholder(fn (callable $get) => match ($get('season')) {
                                'Spring (Mar - May)' => 'Vibrant & Blooming',
                                'Autumn (Sep - Nov)' => 'Clear & Crisp',
                                'Winter (Dec - Feb)' => 'Snowy & Chill',
                                'Summer (Jun - Aug)' => 'Sunny & Sunny',
                                default              => 'Enter subtitle',
                            }),
                        TextInput::make('temperature')->placeholder('eg. Day: 10°C to 15°C | Night: -5°C to 5°C'),
                        TextInput::make('weather')->placeholder('eg. Moderate wind, clear mornings'),
                        TinyEditor::make('description')->columnSpanFull(),
                    ])
                    ->columns(['md' => 2])
                    ->reorderable()
                    ->columnSpanFull(),
            ]);
    }

    private static function usefulInfoTab(): Tab
    {
        return Tab::make('Useful Info')
            ->schema([
                Repeater::make('usefulInfos')
                    ->relationship('usefulInfos')
                    ->schema([
                        TextInput::make('title')
                            ->label('Useful Infos Title')
                            ->placeholder('e.g. Packing List Essentials'),
                        TinyEditor::make('content')->columnSpanFull(),
                    ])
                    ->reorderable()
                    ->columnSpanFull(),
            ]);
    }

    private static function packingListTab(): Tab
    {
        return Tab::make('Packing List')
            ->schema([
                TextInput::make('packing_list_note')
                    ->label('General Note / Information')
                    ->placeholder('e.g. Sleeping bags and down jackets can be rented in Kathmandu...')
                    ->columnSpanFull(),
                Repeater::make('packing_list')
                    ->label('Packing List Items')
                    ->schema([
                        MediaPicker::make('icon')
                            ->image()
                            ->acceptedFileTypes(['image/*', 'image/webp', 'image/avif', 'image/svg+xml'])
                            ->disk('direct_public')
                            ->directory('uploads')
                            ->visibility('public')
                            ->columnSpan(1)
                            ->helperText('Select or upload an icon (SVG recommended)'),
                        TextInput::make('title')
                            ->label('Title')
                            ->placeholder('e.g. Daily Wear')
                            ->required()
                            ->columnSpan(2),
                        TinyEditor::make('description')
                            ->label('Items Description')
                            ->placeholder('List of items...')
                            ->columnSpanFull(),
                    ])
                    ->columns(3)
                    ->reorderable()
                    ->columnSpanFull(),
            ]);
    }

    private static function faqsTab(): Tab
    {
        return Tab::make('FAQs')
            ->schema([
                Repeater::make('faqs')
                    ->relationship('faqs')
                    ->schema([
                        TextInput::make('question'),
                        TinyEditor::make('answer')->columnSpanFull(),
                    ])
                    ->reorderable()
                    ->columnSpanFull(),
            ]);
    }

    private static function reviewsTab(): Tab
    {
        return Tab::make('Reviews')
            ->schema([
                Select::make('reviews')
                    ->relationship('reviews', 'name')
                    ->multiple()
                    ->preload()
                    ->searchable(),
            ]);
    }

    private static function addonsTab(): Tab
    {
        return Tab::make('Add-ons')
            ->schema(fn ($record, $livewire) => $record && $record->exists ? [
                \Filament\Schemas\Components\Livewire::make(
                    AddonPackagesRelationManager::class,
                    [
                        'ownerRecord' => $record,
                        'pageClass' => get_class($livewire),
                    ]
                )
            ] : [
                TextEntry::make('addon_info')
                    ->label('')
                    ->state("Save the product first to manage add-on packages.")
                    ->columnSpanFull(),
            ]);
    }

    private static function seoTab(): Tab
    {
        return Tab::make('SEO')
            ->schema([
                \App\Filament\Forms\SeoMetadataForm::make(),
            ]);
    }

    // ─────────────────────────────────────────────
    // TABLE
    // ─────────────────────────────────────────────

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('title')->searchable()->sortable(),
                TextColumn::make('price')->money('USD')->sortable(),
                TextColumn::make('difficulty')->badge()->colors([
                    'Easy'     => 'success',
                    'Moderate' => 'warning',
                    'Difficult'=> 'danger',
                ])->sortable(),
                IconColumn::make('is_popular')->boolean(),
                IconColumn::make('is_best_selling')->boolean()->label('Best Selling'),
                IconColumn::make('status')->boolean(),
                TextColumn::make('published_at')->date()->sortable(),
            ])
            ->filters([
                //
            ])
            ->actions([
                // ViewAction::make(),
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
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
            'index'  => ListPackages::route('/'),
            'create' => CreatePackage::route('/create'),
            'view'   => ViewPackage::route('/{record}'),
            'edit'   => EditPackage::route('/{record}/edit'),
        ];
    }
}
