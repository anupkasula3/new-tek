<?php
namespace App\Filament\Resources\Pages\Schemas;

use App\Filament\Components\MediaPicker;
use Filament\Forms\Components\Repeater;
use AmidEsfahani\FilamentTinyEditor\TinyEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class PageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                //
                Tabs::make('Content')
                    ->tabs([
                        Tab::make('Banner')
                            ->schema([
                                MediaPicker::make('banner_image')
                                    ->label('Banner Image')
                                    ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                                    ->disk('direct_public')
                                    ->directory('uploads')
                                    ->visibility('public')
                                    ->imagePreviewHeight('250')
                                    ->columnSpan(4)
                                    ->helperText('Recommended size: 1920x1080px (16:9 ratio).'),
                                MediaPicker::make('icon')
                                    ->label('Icon')
                                    ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                                    ->disk('direct_public')
                                    ->directory('uploads')
                                    ->visibility('public')
                                    ->imagePreviewHeight('150')
                                    ->columnSpan(2)
                                    ->helperText('Recommended size: 64x64px (SVG or transparent PNG).'),
                                TextInput::make('top_title')->label('Top Title')->placeholder('e.g., Welcome to Our Website')->columnSpan(3),
                                TextInput::make('title')->label('Title')->required()->placeholder('e.g., About Us')
                                    ->live(debounce: 500)
                                    ->afterStateUpdated(function (string $operation, $state, callable $set) {
                                        if ($operation === 'create') {
                                            $set('slug', Str::slug($state));
                                        }
                                    })
                                    ->columnSpan(3),
                                TextInput::make('slug')->label('Slug')->required()->unique(ignoreRecord: true)->placeholder('e.g., about-us')
                                    ->live(debounce: 500)
                                    ->helperText(fn($state) => $state ? url('/page/' . $state) : null)
                                    ->columnSpan(3),
                                TextInput::make('highlight')->label('Highlight')->placeholder('e.g., Discover our story')->columnSpan(3),
                                TextInput::make('subtitle')->label('Subtitle')->columnSpanFull(),

                                Repeater::make('links')
                                    ->label('Links')
                                    ->schema([
                                        Select::make('type')
                                            ->label('Type')
                                            ->options([
                                                'primary' => 'Primary',
                                                'outline' => 'Outline',
                                            ])
                                            ->default('primary'),
                                        TextInput::make('label')->label('Label')->required()->placeholder('e.g., Home'),
                                        TextInput::make('url')->label('URL')->placeholder('e.g., https://example.com'),
                                    ])
                                    ->columns(['default' => 3])
                                    ->reorderable()

                                    ->columnSpanFull(),

                            ])
                            ->columns(6)
                            ->columnSpanFull(),
                        Tab::make('Content Blocks')->label('Content Blocks')
                            ->schema([
                                Repeater::make('content_blocks')
                                    ->label('Content Blocks')
                                    ->schema([
                                        TextInput::make('title')
                                            ->label('Title')
                                            ->placeholder('e.g., About Us'),
                                        TextInput::make('subtitle')
                                            ->label('Subtitle')
                                            ->placeholder('e.g., Our Story'),
                                        MediaPicker::make('image')
                                            ->label('Block Image (optional — enables 2-column layout with image on the right)')
                                            ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                                            ->disk('direct_public')
                                            ->directory('uploads')
                                            ->visibility('public')
                                            ->imagePreviewHeight('200')
                                            ->columnSpanFull(),
                                        TinyEditor::make('content')
                                            ->label('Content')
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
                                    ->reorderable()

                                    ->columnSpanFull(),
                            ]),
                        Tab::make('Additional Sections')
                            ->schema([
                                Select::make('additional_sections') // ✅ must match column name
                                    ->label('Additional Sections')
                                    ->options([
                                        'stats'         => 'Stats',
                                        'team'          => 'Teams',
                                        'advantage'     => 'Advantages',
                                        'review'        => 'Reviews',
                                        'credential'    => 'Credentials',
                                        'legal_info'    => 'Legal Documents',
                                        'why_choose_us' => 'Why Choose Us',
                                        'contact' => 'Contact Section',
                                    ])
                                    ->multiple()
                                    ->helperText('Note: "Place Explores" is only available and managed in the Luxury (Experience) section, not as an additional section here.'),
                            ])
                            ->columnSpanFull(),
                        Tab::make('Call To Action')
                            ->schema([
                                MediaPicker::make('cta.icon')
                                    ->label('CTA Icon')
                                    ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                                    ->disk('direct_public')
                                    ->directory('uploads')
                                    ->visibility('public')
                                    ->imagePreviewHeight('150')
                                    ->columnSpan(1)
                                    ->helperText('Recommended size: 64x64px (SVG or transparent PNG).'),
                                TextInput::make('cta.title')->label('CTA Title')->placeholder('e.g., Contact Us')->columnSpan(5),
                                TextInput::make('cta.subtitle')->label('CTA Subtitle')->placeholder('e.g., Get in touch with us')->columnSpanFull(),

                                TextInput::make('cta.primary.label')->label('CTA Label(Primary)')->placeholder('e.g., Contact Now')->columnSpan(3),
                                TextInput::make('cta.primary.url')->label('CTA URL(Primary)')->placeholder('e.g., https://example.com/contact')->columnSpan(3),
                                TextInput::make('cta.secondary.label')->label('CTA Label(Secondary)')->placeholder('e.g., Contact Now')->columnSpan(3),
                                TextInput::make('cta.secondary.url')->label('CTA URL(Secondary)')->placeholder('e.g., Contact Now')->columnSpan(3),
                            ])
                            ->columns(6)
                            ->columnSpanFull(),

                        Tab::make('Place Explores')
                            ->schema([
                                Select::make('placeExplores')
                                    ->relationship('placeExplores', 'title')
                                    ->multiple()
                                    ->preload()
                                    ->searchable()
                            ])
                            ->columnSpanFull(),

                        Tab::make('SEO')
                            ->schema([
                                \App\Filament\Forms\SeoMetadataForm::make()
                                    ->columnSpanFull(),
                            ])
                            ->columnSpanFull(),
                    ])
                    ->columns(['default' => 2])
                    ->columnSpanFull(),
            ]);
    }
}
