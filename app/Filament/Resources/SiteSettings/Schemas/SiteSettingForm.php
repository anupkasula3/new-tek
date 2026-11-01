<?php

namespace App\Filament\Resources\SiteSettings\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Grid;
use App\Filament\Components\MediaPicker;

class SiteSettingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('General Information')->schema([
                    MediaPicker::make('logo')
                        ->label('Default Logo')
                        ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                        ->disk('direct_public')
                        ->directory('uploads')
                        ->visibility('public')
                        ->helperText('Recommended size: 512x512px (SVG or transparent PNG). Used when header is transparent/dark.'),
                    MediaPicker::make('sticky_logo')
                        ->label('Sticky Header Logo')
                        ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                        ->disk('direct_public')
                        ->directory('uploads')
                        ->visibility('public')
                        ->helperText('Recommended size: 512x512px (SVG or transparent PNG). Used when header is sticky/scrolled (white background).'),
                    MediaPicker::make('favicon')
                        ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                        ->disk('direct_public')
                        ->directory('uploads')
                        ->visibility('public')
                        ->helperText('Recommended size: 32x32px (ICO or PNG).'),
                    TextInput::make('site_name')
                        ->default(null)
                        ->columnSpanFull(),
                    TextInput::make('mail_to')
                        ->label('Notification Email (Mail To)')
                        ->email()
                        ->helperText('Emails from contact form and package booking submissions will be sent to this address.')
                        ->columnSpanFull(),
                ])->columns(['md' => 3]),

                Grid::make(['md' => 1])->schema([
                    Section::make('Footer Information')->schema([
                        Textarea::make('about_text')
                            ->label('About Us Summary (Footer Text)')
                            ->rows(4)
                            ->default(null)
                            ->columnSpanFull(),
                    ]),

                    Section::make('Opening Hours')->schema([
                        TextInput::make('opening_hours_days')
                            ->label('Working Days')
                            ->placeholder('e.g., Sunday - Friday')
                            ->default('Sunday - Friday'),
                        TextInput::make('opening_hours_time')
                            ->label('Working Hours')
                            ->placeholder('e.g., 9:00 AM - 6:00 PM')
                            ->default('9:00 AM - 6:00 PM'),
                        TextInput::make('opening_hours_off_day')
                            ->label('Off Day Text')
                            ->placeholder('e.g., Saturday: Closed')
                            ->default('Saturday: Closed'),
                    ])->columns(['md' => 1]),
                ]),

                Section::make('Contact Page Information')->schema([
                    TextInput::make('address')
                        ->default(null),
                    TextInput::make('primary_phone')
                        ->tel()
                        ->default(null),
                    TextInput::make('secondary_phone')
                        ->tel()
                        ->default(null),
                    TextInput::make('primary_email')
                        ->email()
                        ->default(null),
                    Textarea::make('location_info')
                        ->label('Location Description (Sentence)')
                        ->rows(2)
                        ->placeholder("Our office is located in the heart of Thamel...")
                        ->columnSpanFull(),
                    Textarea::make('map_embed_url')
                        ->label('Google Maps Embed iframe URL')
                        ->default(null)
                        ->columnSpanFull(),
                ])->columns(['md' => 2]),

                Section::make('Social Media Links')->schema([
                    TextInput::make('facebook_url')
                        ->label('Facebook URL')
                        ->url()
                        ->placeholder('https://facebook.com/yourpage')
                        ->default(null),
                    TextInput::make('twitter_url')
                        ->label('Twitter / X URL')
                        ->url()
                        ->placeholder('https://twitter.com/yourhandle')
                        ->default(null),
                    TextInput::make('instagram_url')
                        ->label('Instagram URL')
                        ->url()
                        ->placeholder('https://instagram.com/yourpage')
                        ->default(null),
                    TextInput::make('youtube_url')
                        ->label('YouTube URL')
                        ->url()
                        ->placeholder('https://youtube.com/@yourchannel')
                        ->default(null),
                ])->columns(['md' => 2]),
                Section::make('Associated with')->schema([
                    FileUpload::make('footer_gallery')
                        ->label('Gallery Images')
                        ->helperText('Upload up to 6 images displayed as a small photo grid below the Newsletter section in the footer. Recommended: square or landscape images (e.g. 400x400px).')
                        ->image()
                        ->multiple()
                        ->reorderable()
                        ->maxFiles(6)
                        ->disk('direct_public')
                        ->directory('uploads/gallery')
                        ->visibility('public')
                        ->imagePreviewHeight('80')
                        ->columnSpanFull(),
                ])->columnSpanFull(),
                Section::make('Review Buttons')->schema([
                    TextInput::make('google_review_url')
                        ->label('Google Review URL')
                        ->url()
                        ->placeholder('https://maps.google.com/place/...')
                        ->helperText('Paste your Google Maps / Google Business review link. The Google icon will be shown automatically.')
                        ->default(null),
                    TextInput::make('tripadvisor_review_url')
                        ->label('TripAdvisor Review URL')
                        ->url()
                        ->placeholder('https://tripadvisor.com/...')
                        ->helperText('Paste your TripAdvisor review page link. The TripAdvisor icon will be shown automatically.')
                        ->default(null),
                ])->columns(['md' => 2])->columnSpanFull(),

                Section::make('Custom Embed Code & Scripts')->schema([
                    Repeater::make('custom_code_scripts')
                        ->label('Custom Scripts Injection')
                        ->helperText('Paste custom code scripts (e.g., Google Analytics, Meta Pixel, custom stylesheets/scripts) to be pasted exactly in your application.')
                        ->schema([
                            TextInput::make('label')
                                ->label('Information Label')
                                ->placeholder('e.g., Google Analytics tag')
                                ->required(),
                            Textarea::make('code')
                                ->label('Custom Code / Scripts')
                                ->rows(8)
                                ->placeholder("e.g., <script>\n  // Your custom JS code\n</script>")
                                ->required(),
                        ])
                        ->reorderable()
                        ->collapsible()
                        ->columnSpanFull(),
                ])->columnSpanFull(),
            ]);
    }
}
