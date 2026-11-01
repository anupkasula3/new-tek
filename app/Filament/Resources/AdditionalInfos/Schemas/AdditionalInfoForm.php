<?php
namespace App\Filament\Resources\AdditionalInfos\Schemas;

use App\Filament\Components\MediaPicker;
use Filament\Forms\Components\Repeater;
use AmidEsfahani\FilamentTinyEditor\TinyEditor;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;

use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class AdditionalInfoForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Tabs::make('Additional Info Tabs')
            ->columnSpanFull()
            ->tabs([
                // ---------------- General Info ----------------
                Tab::make('General Info')
                ->schema([
                    TextInput::make('title')->required()
                                ->live(debounce: 500)
                                ->afterStateUpdated(function (string $operation, $state, callable $set) {
                                    if ($operation === 'create') {
                                        $set('slug', Str::slug($state));
                                    }
                                }),
                    TextInput::make('slug')->required()
                                ->live(debounce: 500)
                                ->unique(table: 'additional_infos', ignoreRecord: true)
                                ->dehydrated()
                                ->helperText(fn ($state) => $state ? url('/additional-info/' . $state) : null),
                    TextInput::make('subtitle')->columnSpanFull(),
                    MediaPicker::make('cover_image')
                    ->label('Cover Image')
                    ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                    ->disk('direct_public')
                    ->directory('uploads')
                    ->visibility('public')
                    ->helperText('Recommended size: 800x900px (8:9 ratio).'),
                    MediaPicker::make('icon')
                    ->label('Icon')
                    ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                    ->disk('direct_public')
                    ->directory('uploads')
                    ->visibility('public')
                    ->helperText('Recommended size: 64x64px (SVG or transparent PNG).'),
                    TextInput::make('heading')->columnSpanFull(),
                    TextInput::make('subheading')->columnSpanFull(),
                    TinyEditor::make('description')
                    ->columnSpanFull(),
                ])
                ->columns(2),
                
                // ---------------- Quick Facts ----------------
                Tab::make('Quick Facts')
                ->schema([
                    Repeater::make('quick_facts')
                    ->schema([
                        TextInput::make('label')->placeholder('e.g., Duration'),
                        TextInput::make('fact')->placeholder('e.g., Best Season: Spring & Autumn'),
                    ])
                    ->columns(2)
                    ->reorderable(),
                ]),
                
                // ---------------- Expert Tips ----------------
                Tab::make('Expert Tips')
                ->schema([
                    Repeater::make('expert_tips')
                    ->schema([
                        MediaPicker::make('icon')
                        ->label('Icon')
                        ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                        ->disk('direct_public')
                        ->directory('uploads')
                        ->visibility('public')
                        ->helperText('Recommended size: 64x64px (SVG or transparent PNG).'),
                        TextInput::make('title')->placeholder('e.g., Expert Tip from Our Lead Guide'),
                        TextInput::make('guide')->placeholder('e.g., Pemba Sherpa, Lead Guide (15+ years experience)'),
                        TinyEditor::make('content')->columnSpanFull()->placeholder('e.g., Always carry a good quality rain jacket...')
                        ->columnSpanFull(),
                    ])
                    ->columns(3)
                    ->reorderable()
                    ->columnSpanFull(),
                ]),

                Tab::make('SEO')
                    ->schema([
                        \App\Filament\Forms\SeoMetadataForm::make()
                    ]),
            ]),
        ]);
    }
}
