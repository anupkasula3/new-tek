<?php

namespace App\Filament\Resources\RelatedGuides;

use App\Filament\Resources\RelatedGuides\Pages\CreateRelatedGuide;
use App\Filament\Resources\RelatedGuides\Pages\EditRelatedGuide;
use App\Filament\Resources\RelatedGuides\Pages\ListRelatedGuides;
use App\Filament\Resources\RelatedGuides\Tables\RelatedGuidesTable;
use App\Models\RelatedGuide;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;

use Filament\Support\Icons\Heroicon;
use AmidEsfahani\FilamentTinyEditor\TinyEditor;

use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Forms;
use Filament\Forms\Get;
use Illuminate\Support\Str;
use Filament\Forms\Components\DateTimePicker;
use App\Filament\Components\MediaPicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Fieldset;
use Filament\Forms\Components\Repeater;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Components\Utilities\Set;
use UnitEnum;

class RelatedGuideResource extends Resource
{
    protected static ?string $model = RelatedGuide::class;


    protected static ?string $recordTitleAttribute = 'title';

    protected static UnitEnum|string|null $navigationGroup = 'Content';
    protected static ?int $navigationSort = 3;

    protected static ?string $label = 'Related Guide';
    protected static ?string $pluralLabel = 'Related Guides';

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
        return $schema->components([
            Tabs::make('Related Guide')
                ->columnSpanFull()
                ->tabs([
                    Tab::make('Headings')
                        ->schema([
                            TextInput::make('title')
                                ->required()
                                ->maxLength(255)
                                ->live(onBlur: true)
                                ->afterStateUpdated(fn (string $operation, Set $set, ?string $state) => $operation === 'create' ? $set('slug', Str::slug($state)) : null),
                            TextInput::make('slug')
                                ->required()
                                ->maxLength(255)
                                ->live(debounce: 500)
                                ->unique(table: 'related_guides', column: 'slug', ignoreRecord: true)
                                ->helperText(fn ($state) => $state ? url('/related-guides/' . $state) : null),
                            MediaPicker::make('featured_image')
                                ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                                ->required()
                                ->disk('direct_public')
                                ->directory('uploads')
                                ->visibility('public')
                                ->imageEditor()
                                ->helperText('Recommended size: 1200x630px (Standard OG size).'),
                            TinyEditor::make('overview')
                                ->label('Overview')
                                ->required()
                                ->columnSpanFull()
                                ->profile('full')
                                ->setCustomConfigs([
                                    'extended_valid_elements' => 'iframe[*],video[*],source[*],object[*],embed[*]',
                                    'valid_elements' => '*[*]',
                                    'relative_urls' => false,
                                    'remove_script_host' => false,
                                    'convert_urls' => true,
                                    'media_live_embeds' => true,
                                    'media_filter_html' => false,
                                ]),
                        ])
                        ->columns(['default' => 2]),            
                    Tab::make('Publishing')
                        ->schema([
                            Select::make('status')
                                ->options([
                                    'draft' => 'Draft',
                                    'published' => 'Published',
                                    'scheduled' => 'Scheduled',
                                    'private' => 'Private',
                                ])
                                ->required()
                                ->live()
                                ->afterStateUpdated(function (Set $set, ?string $state) {
                                    if ($state === 'published') {
                                        $set('published_at', now()->format('Y-m-d H:i'));
                                    }
                                }),

                            DateTimePicker::make('published_at')
                                ->seconds(false)
                                ->helperText('Auto-filled when status is set to Published. This date shows on the frontend.'),

                            Toggle::make('is_featured'),
                            Toggle::make('sticky'),
                        ])
                        ->columns(['default' => 2]),

                    Tab::make('Resources')
                        ->schema([
                            Repeater::make('content.pro_tips')
                                ->label('Pro Tips')
                                ->schema([
                                    Textarea::make('tip')
                                        ->rows(2)
                                        ->placeholder('e.g., Start your gear shopping 2-3 months before departure...'),
                                ])
                                ->collapsible()
                                ->columnSpanFull(),
                        ]),

                    Tab::make('CTA')
                        ->schema([
                            Repeater::make('content.cta')
                                ->label('CTA Section')
                                ->schema([
                                    TextInput::make('cta_title')
                                        ->label('CTA Title')
                                        ->placeholder('e.g., Ready to Embark on Your Adventure?')
                                        ->columnSpanFull(),
                                    TinyEditor::make('cta_details')
                                        ->label('CTA Details')
                                        ->columnSpanFull(),
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

                    Tab::make('SEO')
                        ->schema([
                            \App\Filament\Forms\SeoMetadataForm::make()
                        ]),

                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return RelatedGuidesTable::configure($table);
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
            'index' => ListRelatedGuides::route('/'),
            'create' => CreateRelatedGuide::route('/create'),
            'edit' => EditRelatedGuide::route('/{record}/edit'),
        ];
    }

    public static function getRecordRouteBindingEloquentQuery(): Builder
    {
        return parent::getRecordRouteBindingEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }
}
