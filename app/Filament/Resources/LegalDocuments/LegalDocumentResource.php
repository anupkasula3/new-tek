<?php

namespace App\Filament\Resources\LegalDocuments;

use App\Filament\Resources\LegalDocuments\Pages\CreateLegalDocument;
use App\Filament\Resources\LegalDocuments\Pages\EditLegalDocument;
use App\Filament\Resources\LegalDocuments\Pages\ListLegalDocuments;
use App\Filament\Resources\LegalDocuments\Tables\LegalDocumentsTable;
use App\Models\LegalDocument;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;
use Filament\Forms\Components\TextInput;
use App\Filament\Components\MediaPicker;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;

class LegalDocumentResource extends Resource
{
    protected static ?string $model = LegalDocument::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::AcademicCap;
    protected static UnitEnum|string|null $navigationGroup = 'Components';
    protected static ?int $navigationSort = 8;

    protected static ?string $recordTitleAttribute = 'title';
    protected static ?string $modelLabel = 'Legal Document';
    protected static ?string $pluralModelLabel = 'Legal Documents';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Tabs::make('Legal Document Tabs')
            ->columnSpanFull()
            ->tabs([
                Tab::make('Basic Information')
                ->schema([
                    TextInput::make('title')
                    ->required()
                    ->placeholder('e.g., Tourism Business License'),
                    TextInput::make('issuer')
                    ->placeholder('e.g., Nepal Tourism Board'),
                    TextInput::make('license_no')
                    ->placeholder('e.g., NTB-2024-1234'),
                    TextInput::make('valid_until')
                    ->placeholder('e.g., December 2025'),
                    MediaPicker::make('image')
                    ->label('License Preview Image')
                    ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                    ->disk('direct_public')
                    ->directory('uploads')
                    ->visibility('public')
                    ->helperText('Upload a clear image or scan of the license for the website preview. Recommended size: 800x900px.'),
                    MediaPicker::make('document_file')
                    ->label('Full Document File (PDF/Image)')
                    ->disk('direct_public')
                    ->directory('uploads')
                    ->visibility('public')
                    ->helperText('Upload the full document (PDF or Image) that users can download and view. PDF format is preferred.'),
                ])
                ->columns(['default' => 2]),

            ])
        ]);

    }

    public static function table(Table $table): Table
    {
        return LegalDocumentsTable::configure($table);
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
            'index' => ListLegalDocuments::route('/'),
            'create' => CreateLegalDocument::route('/create'),
            'edit' => EditLegalDocument::route('/{record}/edit'),
        ];
    }
}
