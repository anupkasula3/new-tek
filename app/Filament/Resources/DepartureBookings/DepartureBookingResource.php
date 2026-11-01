<?php

namespace App\Filament\Resources\DepartureBookings;

use App\Filament\Resources\DepartureBookings\Pages\CreateDepartureBooking;
use App\Filament\Resources\DepartureBookings\Pages\EditDepartureBooking;
use App\Filament\Resources\DepartureBookings\Pages\ListDepartureBookings;
use App\Filament\Resources\DepartureBookings\Pages\ViewDepartureBooking;
use App\Filament\Resources\DepartureBookings\Schemas\DepartureBookingForm;
use App\Filament\Resources\DepartureBookings\Schemas\DepartureBookingInfolist;
use App\Filament\Resources\DepartureBookings\Tables\DepartureBookingsTable;
use App\Models\DepartureBooking;
use BackedEnum;
use UnitEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class DepartureBookingResource extends Resource
{
    protected static ?string $model = DepartureBooking::class;
    protected static ?string $label = 'Fixed Departure Booking';
    protected static ?string $navigationLabel = 'Fixed Departure Bookings';
    protected static UnitEnum|string|null $navigationGroup = 'Bookings & Messages';
    protected static ?int $navigationSort = 2;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::Ticket;

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return DepartureBookingForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return DepartureBookingInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return DepartureBookingsTable::configure($table);
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
            'index' => ListDepartureBookings::route('/'),
            'create' => CreateDepartureBooking::route('/create'),
            'view' => ViewDepartureBooking::route('/{record}'),
            'edit' => EditDepartureBooking::route('/{record}/edit'),
        ];
    }
}
