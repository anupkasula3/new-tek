<?php

namespace App\Filament\Resources\DepartureBookings\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class DepartureBookingsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->defaultPaginationPageOption(50)
            ->columns([
                TextColumn::make('sn')
                    ->label('S.N.')
                    ->rowIndex(),
                TextColumn::make('name')
                    ->label('Name')
                    ->sortable()
                    ->searchable(),
                TextColumn::make('email')
                    ->label('Email')
                    ->searchable(),
                TextColumn::make('phone')
                    ->label('Phone')
                    ->searchable(),
                TextColumn::make('type')
                    ->label('Booking Type')
                    ->default('Fixed Departure')
                    ->badge()
                    ->color('info'),
                TextColumn::make('departure.package.title')
                    ->label('Package')
                    ->sortable()
                    ->searchable(),
                TextColumn::make('departure.date')
                    ->label('Departure Date')
                    ->date('M d, Y')
                    ->sortable(),
                TextColumn::make('seats_booked')->label('Pax')->numeric()->sortable(),
                TextColumn::make('amount')
                    ->label('Paid/Deposit')
                    ->money(fn ($record) => $record->currency ?? 'USD')
                    ->sortable(),
                TextColumn::make('status')
                    ->badge()
                    ->colors([
                        'warning' => 'pending',
                        'success' => fn ($state) => in_array($state, ['paid', 'confirmed']),
                        'danger' => fn ($state) => in_array($state, ['failed', 'cancelled']),
                    ]),
                TextColumn::make('created_at')->dateTime()->sortable(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
