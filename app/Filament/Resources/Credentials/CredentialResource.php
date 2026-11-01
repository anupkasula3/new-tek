<?php

namespace App\Filament\Resources\Credentials;

use App\Filament\Resources\Credentials\Pages\CreateCredential;
use App\Filament\Resources\Credentials\Pages\EditCredential;
use App\Filament\Resources\Credentials\Pages\ListCredentials;
use App\Filament\Resources\Credentials\Schemas\CredentialForm;
use App\Filament\Resources\Credentials\Tables\CredentialsTable;
use App\Models\Credential;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;
use Filament\Forms\Components\TextInput;
use App\Filament\Components\MediaPicker;
use AmidEsfahani\FilamentTinyEditor\TinyEditor;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;

class CredentialResource extends Resource
{
    protected static ?string $model = Credential::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::ViewfinderCircle;
    protected static ?int $navigationSort = 5;
    protected static ?string $navigationLabel = 'Credentials';
    protected static UnitEnum|string|null $navigationGroup = 'Components';

    protected static ?string $recordTitleAttribute = 'title';
    protected static ?string $modelLabel = 'Credential';
    protected static ?string $pluralModelLabel = 'Credentials';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Tabs::make('Credential Tabs')
            ->columnSpanFull()
            ->tabs([
                Tab::make('Basic Information')
                ->schema([
                    MediaPicker::make('icon')
                    ->label('Icon')
                    ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                    ->disk('direct_public')
                    ->directory('uploads')
                    ->visibility('public')
                    ->helperText('Recommended size: 64x64px (SVG or transparent PNG).'),
                    TextInput::make('title')->required()->placeholder('e.g., Fully Licensed & Insured'),
                    TinyEditor::make('description')->required()->columnSpanFull(),
                ])
                ->columns(2),

            ])
        ]);

    }

    public static function table(Table $table): Table
    {
        return CredentialsTable::configure($table);
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
            'index' => ListCredentials::route('/'),
            'create' => CreateCredential::route('/create'),
            'edit' => EditCredential::route('/{record}/edit'),
        ];
    }
}
