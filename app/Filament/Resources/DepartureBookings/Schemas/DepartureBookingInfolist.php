<?php

namespace App\Filament\Resources\DepartureBookings\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class DepartureBookingInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('order_no')
                    ->placeholder('-'),
                TextEntry::make('departure_id')
                    ->numeric(),
                TextEntry::make('name'),
                TextEntry::make('email')
                    ->label('Email address'),
                TextEntry::make('phone')
                    ->placeholder('-'),
                TextEntry::make('seats_booked')
                    ->numeric(),
                TextEntry::make('amount')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('total_amount')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('remaining_balance')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('currency'),
                TextEntry::make('payment_type')
                    ->placeholder('-'),
                TextEntry::make('status')
                    ->badge()
                    ->colors([
                        'warning' => 'pending',
                        'success' => fn ($state) => in_array($state, ['paid', 'confirmed']),
                        'danger' => fn ($state) => in_array($state, ['failed', 'cancelled']),
                    ]),
                \Filament\Schemas\Components\Section::make('Traveller Details')
                    ->schema([
                        TextEntry::make('traveller_details.lead_traveller.name')
                            ->label('Lead Traveller'),
                        TextEntry::make('traveller_details.additional_travellers')
                            ->label('Additional Travellers')
                            ->listWithLineBreaks()
                            ->bulleted()
                            ->placeholder('None'),
                    ])->columns(2),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
