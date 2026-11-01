<?php

namespace App\Filament\Resources\PaymentLogs;

use App\Filament\Resources\PaymentLogs\Pages;
use App\Models\PaymentLog;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Support\Icons\Heroicon;
use Filament\Actions\ViewAction;
use Filament\Actions\EditAction;

class PaymentLogResource extends Resource
{
    protected static ?string $model = PaymentLog::class;
    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-currency-dollar';
    protected static \UnitEnum|string|null $navigationGroup = 'Bookings & Messages';
    protected static ?int $navigationSort = 3;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('booking_id')
                    ->relationship('booking', 'id')
                    ->searchable()
                    ->preload()
                    ->label('Booking ID')
                    ->disabled()
                    ->suffixActions([
                        fn ($state) => $state ? \Filament\Actions\Action::make('view_booking_admin')
                            ->icon('heroicon-m-eye')
                            ->tooltip('View Booking in Admin')
                            ->url(\App\Filament\Resources\Bookings\BookingResource::getUrl('view', ['record' => $state]))
                            ->openUrlInNewTab() : null,
                    ]),
                TextInput::make('order_no')
                    ->label('Order number')
                    ->readOnly(),
                TextInput::make('amount')
                    ->numeric()
                    ->prefix('$')
                    ->readOnly(),
                TextInput::make('currency')
                    ->readOnly(),
                TextInput::make('status')
                    ->readOnly(),
                \Filament\Forms\Components\Textarea::make('request_payload')
                    ->columnSpanFull()
                    ->label('Request Payload (Sent to HBL)')
                    ->rows(8)
                    ->formatStateUsing(fn ($state) => is_array($state) ? json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) : $state)
                    ->readOnly(),
                \Filament\Forms\Components\Textarea::make('response_payload')
                    ->columnSpanFull()
                    ->label('Response Payload (Received directly)')
                    ->rows(8)
                    ->formatStateUsing(fn ($state) => is_array($state) ? json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) : $state)
                    ->readOnly(),
                \Filament\Forms\Components\Textarea::make('callback_payload')
                    ->columnSpanFull()
                    ->label('Callback Payload (Webhook/Redirects)')
                    ->rows(8)
                    ->formatStateUsing(fn ($state) => is_array($state) ? json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) : $state)
                    ->readOnly(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->defaultPaginationPageOption(50)
            ->columns([
                TextColumn::make('sn')
                    ->label('S.N.')
                    ->rowIndex(),
                TextColumn::make('booking.name')
                    ->label('Customer Name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('booking.email')
                    ->label('Email')
                    ->searchable(),
                TextColumn::make('booking.phone')
                    ->label('Phone')
                    ->searchable(),
                TextColumn::make('booking.package.title')
                    ->label('Package')
                    ->searchable()
                    ->sortable()
                    ->url(fn (PaymentLog $record) => $record->booking?->package_id ? \App\Filament\Resources\Packages\PackageResource::getUrl('view', ['record' => $record->booking->package_id]) : null)
                    ->openUrlInNewTab(),
                TextColumn::make('order_no')
                    ->label('Order No.')
                    ->searchable(),
                TextColumn::make('amount')
                    ->label('Amount')
                    ->money(fn ($record) => $record->currency ?? 'USD')
                    ->sortable(),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->colors([
                        'warning' => 'pending',
                        'success' => fn ($state) => in_array($state, ['success', 'paid', 'confirmed']),
                        'danger' => fn ($state) => in_array($state, ['failed', 'cancelled', 'error']),
                    ]),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'success' => 'Success',
                        'failed' => 'Failed',
                        'cancelled' => 'Cancelled',
                    ]),
            ])
            ->actions([
                ViewAction::make(),
                EditAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManagePaymentLogs::route('/'),
        ];
    }
}
