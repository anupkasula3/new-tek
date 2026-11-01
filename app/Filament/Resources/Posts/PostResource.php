<?php

namespace App\Filament\Resources\Posts;

use App\Filament\Resources\Posts\Pages\CreatePost;
use App\Filament\Resources\Posts\Pages\EditPost;
use App\Filament\Resources\Posts\Pages\ListPosts;
use App\Filament\Resources\Posts\Schemas\PostForm;
use App\Filament\Resources\Posts\Tables\PostsTable;
use App\Models\Post;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;

use Filament\Support\Icons\Heroicon;
use AmidEsfahani\FilamentTinyEditor\TinyEditor;
use App\Models\Package;

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
use App\Models\User;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Components\Utilities\Set;
use UnitEnum;


class PostResource extends Resource
{
    protected static ?string $model = Post::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDocumentText;

    protected static ?string $recordTitleAttribute = 'title';

    protected static UnitEnum|string|null $navigationGroup = 'Content';
    protected static ?string $navigationLabel = 'Posts';
    protected static ?int $navigationSort = 4;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Tabs::make('Post')
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
                                ->unique(table: 'posts', column: 'slug', ignoreRecord: true)
                                ->helperText(fn ($state) => $state ? url('/blog/' . $state) : null),
                            TextInput::make('reading_time')
                                ->label('Reading Time (minutes)')
                                ->numeric()
                                ->required()
                                ->minValue('1'),
                            Select::make('author_id')
                                ->label('Assign Author')
                                ->placeholder('Select an author user...')
                                ->options(
                                    User::where('is_author', true)
                                        ->orderBy('name')
                                        ->pluck('name', 'id')
                                )
                                ->searchable()
                                ->nullable()
                                ->helperText('Select a registered author user. Only users marked as "Is Blog Author" appear here.')
                                ->afterStateUpdated(function (Set $set, ?int $state) {
                                    if ($state) {
                                        $user = User::find($state);
                                        if ($user) {
                                            $set('author', $user->name);
                                        }
                                    }
                                })
                                ->live(),
                            TextInput::make('author')
                                ->label('Author Name (override)')
                                ->nullable()
                                ->maxLength(255)
                                ->helperText('Auto-filled when an author is selected. You can override this text.'),
                            MediaPicker::make('featured_image')
                                ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                                ->required()
                                ->disk('direct_public')
                                ->directory('uploads')
                                ->visibility('public')
                                ->imageEditor()
                                ->helperText('Recommended size: 1200x630px (Standard OG size).'),
                            // Textarea::make('excerpt')
                            //     ->rows(3)
                            //     ->columnSpanFull(),
                            TinyEditor::make('overview')
                                ->label('Overview (Part 1)')
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
                                Select::make('content.related_product_ids')
                                ->label('Manually Link Products (Packages)')
                                ->options(Package::pluck('title', 'id'))
                                ->multiple()
                                ->preload()
                                ->searchable()
                                ->helperText('Select existing Packages to link as products. If empty, latest treks will show.')
                                ->columnSpanFull(),
                            TinyEditor::make('content.overview_2')
                                ->label('Overview (Part 2)')
                                ->nullable()
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
                    Tab::make('Taxonomy')
                        ->schema([
                            Select::make('categories')
                                ->relationship('categories', 'name')
                                ->multiple()
                                ->preload()
                                ->searchable()
                                ->createOptionForm([
                                    TextInput::make('name')
                                        ->required()
                                        ->live(onBlur: true)
                                        ->afterStateUpdated(fn (Set $set, ?string $state) => $set('slug', Str::slug($state))),
                                    TextInput::make('slug')
                                        ->required()
                                        ->unique(table: 'categories', column: 'slug', ignoreRecord: true),
                                ])
                                ->editOptionForm([
                                    TextInput::make('name')
                                        ->required()
                                        ->live(onBlur: true),
                                    TextInput::make('slug')
                                        ->required()
                                        ->unique(table: 'categories', column: 'slug', ignoreRecord: true),
                                ]),

                            Select::make('tags')
                                ->relationship('tags', 'name')
                                ->multiple()
                                ->preload()
                                ->searchable()
                                ->createOptionForm([
                                    TextInput::make('name')
                                        ->required()
                                        ->live(onBlur: true)
                                        ->afterStateUpdated(fn (Set $set, ?string $state) => $set('slug', Str::slug($state))),
                                    TextInput::make('slug')
                                        ->required()
                                        ->unique(table: 'tags', column: 'slug', ignoreRecord: true),
                                ])
                                ->editOptionForm([
                                    TextInput::make('name')
                                        ->required()
                                        ->live(onBlur: true),
                                    TextInput::make('slug')
                                        ->required()
                                        ->unique(table: 'tags', column: 'slug', ignoreRecord: true),
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
                                        ->required()
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
        return PostsTable::configure($table);
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
            'index' => ListPosts::route('/'),
            'create' => CreatePost::route('/create'),
            'edit' => EditPost::route('/{record}/edit'),
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
