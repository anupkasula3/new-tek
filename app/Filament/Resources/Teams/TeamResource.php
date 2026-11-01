<?php

namespace App\Filament\Resources\Teams;

use App\Filament\Resources\Teams\Pages\CreateTeam;
use App\Filament\Resources\Teams\Pages\EditTeam;
use App\Filament\Resources\Teams\Pages\ListTeams;
use App\Filament\Resources\Teams\Schemas\TeamForm;
use App\Filament\Resources\Teams\Tables\TeamsTable;
use App\Models\Team;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;
use Filament\Forms\Components\TextInput;
use App\Filament\Components\MediaPicker;
use AmidEsfahani\FilamentTinyEditor\TinyEditor;

class TeamResource extends Resource
{
    protected static ?string $model = Team::class;


    protected static string|BackedEnum|null $navigationIcon = Heroicon::Users;

    protected static UnitEnum|string|null $navigationGroup = 'Components';
    protected static ?int $navigationSort = 2;

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            \Filament\Schemas\Components\Tabs::make('Team Member Details')
                ->columnSpanFull()
                ->tabs([
                    \Filament\Schemas\Components\Tabs\Tab::make('Basic')
                        ->schema([
                            MediaPicker::make('image')
                                ->label('Team Member Image')
                                ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                                ->disk('direct_public')
                                ->directory('uploads')
                                ->visibility('public')
                                ->helperText('Recommended size: 800x900px (8:9 ratio).'),
                            TextInput::make('name')->required()->columnSpan(3),
                            TextInput::make('position')->required()
                                ->numeric()
                                ->label('Order')
                                ->placeholder('e.g., 1, 2, 3')
                                ->columnSpan(1),
                            TextInput::make('role')->required()->columnSpan(2),
                            TextInput::make('experience')->nullable()->columnSpan(1),
                            TextInput::make('specialty')->nullable()->columnSpan(2),
                            TinyEditor::make('bio')->nullable()->columnSpanFull(),
                        ])
                        ->columns(4),
                    \Filament\Schemas\Components\Tabs\Tab::make('Certificate')
                        ->schema([
                            \Filament\Forms\Components\Repeater::make('certificates')
                                ->label('Certificates')
                                ->schema([
                                    TextInput::make('title')
                                        ->label('Certificate Title')
                                        ->required(),
                                    MediaPicker::make('file')
                                        ->label('Certificate File (PDF Only)')
                                        ->acceptedFileTypes(['application/pdf'])
                                        ->disk('direct_public')
                                        ->directory('uploads/certificates')
                                        ->visibility('public')
                                        ->required(),
                                ])
                                ->columns(2)
                                ->columnSpanFull()
                                ->reorderable(),
                        ]),
                ]),
        ]);
    }


    public static function table(Table $table): Table
    {
        return TeamsTable::configure($table);
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
            'index' => ListTeams::route('/'),
            'create' => CreateTeam::route('/create'),
            'edit' => EditTeam::route('/{record}/edit'),
        ];
    }
}
