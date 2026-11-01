<?php

namespace App\Filament\Resources;

use App\Models\RedirectRule;
use Filament\Resources\Resource;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Toggle;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Support\Icons\Heroicon;
use Filament\Schemas\Schema;

class RedirectRuleResource extends Resource
{
    protected static ?string $model = RedirectRule::class;

    protected static \BackedEnum|string|null $navigationIcon = 'heroicon-o-arrow-path-rounded-square';

    protected static ?string $navigationLabel = 'Redirects';

    protected static \UnitEnum|string|null $navigationGroup = 'Settings';

    protected static ?int $navigationSort = 10;

    protected static ?string $recordTitleAttribute = 'source_url';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('source_url')
                    ->label('Source Path')
                    ->required()
                    ->placeholder('e.g., /old-about-us')
                    ->helperText('The relative path matching the incoming request (always starts with /).')
                    ->unique(ignoreRecord: true),
                TextInput::make('destination_url')
                    ->label('Destination URL')
                    ->required()
                    ->placeholder('e.g., /about or https://example.com')
                    ->helperText('Can be a relative path or an absolute external URL.'),
                Select::make('status_code')
                    ->label('HTTP Status Code')
                    ->options([
                        301 => '301 - Permanent Redirect',
                        302 => '302 - Temporary Redirect',
                    ])
                    ->default(301)
                    ->required(),
                Toggle::make('is_active')
                    ->label('Active')
                    ->default(true)
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('source_url')
                    ->label('Source')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('destination_url')
                    ->label('Destination')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('status_code')
                    ->label('Type')
                    ->badge()
                    ->color(fn(int $state): string => match ($state) {
                        301 => 'success',
                        302 => 'warning',
                        default => 'gray',
                    })
                    ->sortable(),
                IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean()
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => \App\Filament\Resources\RedirectRuleResource\Pages\ListRedirectRules::route('/'),
            'create' => \App\Filament\Resources\RedirectRuleResource\Pages\CreateRedirectRule::route('/create'),
            'edit' => \App\Filament\Resources\RedirectRuleResource\Pages\EditRedirectRule::route('/{record}/edit'),
        ];
    }
}
