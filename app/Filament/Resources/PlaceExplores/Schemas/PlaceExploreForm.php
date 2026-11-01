<?php

namespace App\Filament\Resources\PlaceExplores\Schemas;

use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\CheckboxList;
use App\Filament\Components\MediaPicker;
use AmidEsfahani\FilamentTinyEditor\TinyEditor;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Components\Utilities\Set;
use App\Models\Package;
use Illuminate\Support\Str;

class PlaceExploreForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('Place Explore Tabs')
                    ->columnSpanFull()
                    ->tabs([
                        // ---------------- Headings ----------------
                        Tab::make('Headings')
                            ->schema([
                                TextInput::make('title')->required()->placeholder('e.g., Kathmandu')
                                    ->live(debounce: 500)
                                    ->afterStateUpdated(fn(string $operation, Set $set, ?string $state) => $operation === 'create' ? $set('slug', Str::slug($state)) : null),
                                TextInput::make('slug')->required()->placeholder('e.g., kathmandu')
                                    ->live(debounce: 500)
                                    ->unique(table: 'place_explores', ignoreRecord: true)
                                    ->dehydrated()
                                    ->helperText(fn($state) => $state ? url('/places/' . $state) : null),
                                TextInput::make('location')->required()->placeholder('e.g., Nepal, India, etc.'),
                                TextInput::make('tags')->label('Tags (comma separated)')
                                    ->placeholder('e.g., trekking, adventure, nature'),
                                MediaPicker::make('featured_image')
                                    ->label('Featured Image')
                                    ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                                    ->disk('direct_public')
                                    ->directory('uploads')
                                    ->visibility('public')
                                    ->helperText('Recommended size: 1200x630px (Standard OG size).'),
                                TinyEditor::make('overview')
                                    ->label('Overview')
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
                            ->columns(2),

                        // ---------------- Publishing ----------------
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
                            ])
                            ->columns(2),

                        // ---------------- Resources / Pro Tips ----------------
                        Tab::make('Resources')
                            ->schema([
                                Repeater::make('content.pro_tips')
                                    ->label('Pro Tips')
                                    ->schema([
                                        Textarea::make('tip')
                                            ->required()
                                            ->rows(2)
                                            ->placeholder('e.g., Try traditional Newari food in Kathmandu...'),
                                    ])
                                    ->collapsible()
                                    ->columnSpanFull(),
                            ]),

                        // ---------------- Packages ----------------
                        Tab::make('Packages')
                            ->schema([
                                Select::make('content.related_product_ids')
                                    ->label('Manually Link Products (Packages)')
                                    ->options(Package::pluck('title', 'id'))
                                    ->multiple()
                                    ->preload()
                                    ->searchable()
                                    ->helperText('Select existing Packages to link as products.')
                                    ->columnSpanFull(),
                            ]),

                        // ---------------- CTA ----------------
                        Tab::make('CTA')
                            ->schema([
                                Repeater::make('content.cta')
                                    ->label('CTA Section')
                                    ->schema([
                                        TextInput::make('cta_title')
                                            ->label('CTA Title')
                                            ->placeholder('e.g., Ready to Explore Kathmandu?')
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

                        // ---------------- SEO ----------------
                        Tab::make('SEO')
                            ->schema([
                                \App\Filament\Forms\SeoMetadataForm::make()
                            ]),
                    ])

            ]);
    }
}
