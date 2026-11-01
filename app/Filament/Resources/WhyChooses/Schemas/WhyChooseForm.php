<?php

namespace App\Filament\Resources\WhyChooses\Schemas;

use Filament\Schemas\Schema;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Forms\Components\TextInput;
use AmidEsfahani\FilamentTinyEditor\TinyEditor;
use Filament\Forms\Components\Repeater;
use App\Filament\Components\MediaPicker;
use Filament\Forms\Components\TextArea;



class WhyChooseForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
            Tabs::make('Why Choose Tabs')
            ->columnSpanFull()
            ->tabs([
                Tab::make('General Info')
                ->schema([
                    TextInput::make('title')->required(),
                    TinyEditor::make('subtitle')->columnSpanFull()->label('Subtitle'),
                    Repeater::make('items')
                    ->schema([
                        MediaPicker::make('item_icon')
                        ->label('Icon')
                        ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                        ->disk('direct_public')
                        ->directory('uploads')
                        ->visibility('public')
                        ->helperText('Recommended size: 64x64px (SVG or transparent PNG).'),
                        TextInput::make('item_title')
                        ->placeholder('e.g., Expert Local Guides')
                        ->required()
                        ->columnSpan(5),
                        TinyEditor::make('item_description')->placeholder('e.g., Our team of expert local guides has an in-depth knowledge of the Himalayas')->columnSpanFull()->label('Description'),
                    ])
                    ->columns(6)
                    ->columnSpanFull()
                    ->reorderable(),
                ]),
            ])
        ]);
    }
}
