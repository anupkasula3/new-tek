<?php

namespace App\Filament\Forms;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\DateTimePicker;
use Filament\Schemas\Components\Section;
use App\Filament\Components\MediaPicker;

class SeoMetadataForm
{
    public static function make(): Section
    {
        return Section::make('SEO & Social Media Metadata')
            ->description('Configure search engine visibility, meta descriptions, open graph tags, and sitemaps.')
            ->collapsible()
            ->collapsed()
            ->relationship('seoMeta')
            ->schema([
                TextInput::make('seo_title')
                    ->label('SEO Title (max 60 characters recommended)')
                    ->placeholder('Leave empty to use default title'),
                TextInput::make('focus_keyword')
                    ->label('Focus Keyword (max 100 characters recommended)')
                    ->placeholder('eg: Annapurna Base Camp Trek'),
                TextInput::make('slug')
                    ->label('SEO Slug Override')
                    ->placeholder('e.g., annapurna-base-camp-trek'),
                Textarea::make('seo_description')
                    ->label('SEO Meta Description (max 160 characters recommended)')
                    ->placeholder('Leave empty to use default description')
                    ->rows(2)
                    ->columnSpanFull(),

                TextInput::make('seo_keywords')
                    ->label('SEO Keywords (comma-separated, max 255 characters recommended)')
                    ->placeholder('comma-separated, e.g., trekking, nepal, everest')
                    ->columnSpanFull(),

                TextInput::make('canonical_url')
                    ->label('Canonical URL')
                    ->url()
                    ->placeholder('Leave empty to auto-generate based on slug')
                    ->columnSpanFull(),

                Section::make('Social Sharing (Open Graph & Twitter)')
                    ->collapsible()
                    ->collapsed()
                    ->schema([
                        Section::make('Facebook / Open Graph')
                            ->schema([
                                TextInput::make('og_title')->label('OG Title'),
                                Textarea::make('og_description')->label('OG Description')->rows(2),
                                MediaPicker::make('og_image')
                                    ->label('OG Image')
                                    ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                                    ->disk('direct_public')
                                    ->directory('seo/og-images')
                                    ->visibility('public')
                                    ->imagePreviewHeight('150'),
                            ])->columns(1),
                        Section::make('Twitter / X')
                            ->schema([
                                TextInput::make('twitter_title')->label('Twitter Title'),
                                Textarea::make('twitter_description')->label('Twitter Description')->rows(2),
                                MediaPicker::make('twitter_image')
                                    ->label('Twitter Image')
                                    ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                                    ->disk('direct_public')
                                    ->directory('seo/twitter-images')
                                    ->visibility('public')
                                    ->imagePreviewHeight('150'),
                            ])->columns(1),
                    ])->columns(2)->columnSpanFull(),

                Section::make('Indexing & Sitemap Configuration')
                    ->collapsible()
                    ->schema([
                        Toggle::make('is_indexable')
                            ->label('Allow Indexing (index)')
                            ->default(true),
                        Toggle::make('is_followable')
                            ->label('Allow Following Links (follow)')
                            ->default(true),
                        Select::make('sitemap_frequency')
                            ->label('Change Frequency')
                            ->options([
                                'always' => 'Always',
                                'hourly' => 'Hourly',
                                'daily' => 'Daily',
                                'weekly' => 'Weekly',
                                'monthly' => 'Monthly',
                                'yearly' => 'Yearly',
                                'never' => 'Never',
                            ])->default('daily'),
                        TextInput::make('sitemap_priority')
                            ->label('Sitemap Priority')
                            ->numeric()
                            ->minValue(0.0)
                            ->maxValue(1.0)
                            ->step(0.1)
                            ->default(0.8),
                        TextInput::make('schema_type')
                            ->label('Schema Type')
                            ->placeholder('e.g., Article, TouristAttraction, TravelAgency')
                            ->default('WebPage'),
                        DateTimePicker::make('lastmod')
                            ->label('Last Modified Time (lastmod)')
                            ->default(fn() => now()),
                    ])->columns(3)->columnSpanFull(),
            ])->columns(2)->columnSpanFull();
    }
}
