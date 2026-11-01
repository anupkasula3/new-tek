<?php

namespace App\Filament\Resources\TripPlans;

use App\Filament\Resources\TripPlans\Pages\EditTripPlan;
use App\Filament\Resources\TripPlans\Pages\ListTripPlans;
use App\Filament\Resources\TripPlans\Pages\ViewTripPlan;
use App\Filament\Resources\TripPlans\Tables\TripPlansTable;
use App\Models\TripPlan;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TagsInput;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;

class TripPlanResource extends Resource
{
    protected static ?string $model = TripPlan::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::Calendar;
    protected static ?string $navigationLabel = 'Trip Plans';
    protected static UnitEnum|string|null $navigationGroup = 'Bookings & Messages';
    protected static ?int $navigationSort = 6;
    protected static ?string $recordTitleAttribute = 'full_name';
    protected static ?string $modelLabel = 'Trip Plan';
    protected static ?string $pluralModelLabel = 'Trip Plans';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Tabs::make('Trip Plan Details')
                ->columnSpanFull()
                ->tabs([
                    Tab::make('Contact Info')
                        ->schema([
                            TextInput::make('full_name'),
                            TextInput::make('email'),
                            TextInput::make('phone'),
                            Select::make('status')
                                ->options([
                                    'pending' => 'Pending',
                                    'reviewed' => 'Reviewed',
                                    'contacted' => 'Contacted',
                                    'completed' => 'Completed',
                                    'cancelled' => 'Cancelled',
                                ])
                                ->required(),
                        ])
                        ->columns(['default' => 2]),
                    Tab::make('Trip Details')
                        ->schema([
                            Select::make('package_id')
                                ->label('Associated Package')
                                ->relationship('package', 'title')
                                ->searchable()
                                ->preload()
                                ->placeholder('No Package Selected')
                                ->helperText('If linked to a specific package/product.')
                                ->suffixActions([
                                    fn ($state) => $state ? \Filament\Actions\Action::make('view_admin_package')
                                        ->icon('heroicon-m-eye')
                                        ->tooltip('View in Admin Panel')
                                        ->url(\App\Filament\Resources\Packages\PackageResource::getUrl('view', ['record' => $state]))
                                        ->openUrlInNewTab() : null,
                                    fn ($state) => $state ? \Filament\Actions\Action::make('view_public_package')
                                        ->icon('heroicon-m-globe-alt')
                                        ->tooltip('View on Frontend Website')
                                        ->url(url('/' . \App\Models\Package::find($state)?->slug))
                                        ->openUrlInNewTab() : null,
                                ]),
                            Select::make('destination_id')
                                ->label('Target Destination')
                                ->relationship('destination', 'name')
                                ->searchable()
                                ->preload()
                                ->placeholder('Select destination')
                                ->suffixActions([
                                    fn ($state) => $state ? \Filament\Actions\Action::make('view_admin_dest')
                                        ->icon('heroicon-m-eye')
                                        ->tooltip('View in Admin Panel')
                                        ->url(\App\Filament\Resources\Destinations\DestinationResource::getUrl('view', ['record' => $state]))
                                        ->openUrlInNewTab() : null,
                                    fn ($state) => $state ? \Filament\Actions\Action::make('view_public_dest')
                                        ->icon('heroicon-m-globe-alt')
                                        ->tooltip('View on Frontend Website')
                                        ->url(url('/destination/' . \App\Models\Destination::find($state)?->slug))
                                        ->openUrlInNewTab() : null,
                                ]),
                            TextInput::make('duration'),
                            TextInput::make('group_size'),
                            DatePicker::make('preferred_date'),
                            TextInput::make('budget_range'),
                            TagsInput::make('interests'),
                        ])
                        ->columns(['default' => 2]),
                    Tab::make('Additional Info')
                        ->schema([
                            Textarea::make('additional_info')->columnSpanFull(),
                        ]),
                ])
        ]);
    }

    public static function table(Table $table): Table
    {
        return TripPlansTable::configure($table);
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
            'index' => ListTripPlans::route('/'),
            'view' => ViewTripPlan::route('/{record}'),
            'edit' => EditTripPlan::route('/{record}/edit'),
        ];
    }
}
