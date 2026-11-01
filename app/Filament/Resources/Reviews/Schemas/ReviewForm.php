<?php

namespace App\Filament\Resources\Reviews\Schemas;

use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use AmidEsfahani\FilamentTinyEditor\TinyEditor;
use App\Filament\Components\MediaPicker;
use Filament\Forms\Components\DatePicker;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;

class ReviewForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Tabs::make('Review Tabs')
            ->columnSpanFull()
            ->tabs([
                Tab::make('Basic Information')
                ->schema([
                    \Filament\Forms\Components\Select::make('packages')
                        ->label('Target Packages')
                        ->relationship('packages', 'title')
                        ->preload()
                        ->searchable()
                        ->columnSpanFull()
                        ->helperText('Select which packages/tours this review will be displayed on.'),
                    MediaPicker::make('image')
                    ->label('Image')
                    ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                    ->disk('direct_public')
                    ->directory('uploads')
                    ->visibility('public')
                    ->helperText('Recommended size: 800x900px (8:9 ratio).'),
                    TextInput::make('name')
                        ->required()
                        ->placeholder('e.g., John Doe')
                        ->columnSpan(5),
                    TextInput::make('country')
                        ->required()
                        ->placeholder('e.g., Nepal, India, etc.')
                        ->columnSpan(2),
                    TextInput::make('designation')
                        ->required()
                        ->placeholder('e.g., Traveler, Guide, etc.')
                        ->columnSpan(2),
                    TextInput::make('rating')
                        ->required()
                        ->numeric()
                        ->placeholder('e.g., 1 to 5')
                        ->columnSpan(1),
                    DatePicker::make('review_date')
                        ->required()
                        ->columnSpan(1),
                    
                    TinyEditor::make('review')->required()
                        ->columnSpanFull(),

                ])
                ->columns(6),

            ])
        ]);
    }
}
