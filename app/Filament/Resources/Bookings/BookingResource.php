<?php

namespace App\Filament\Resources\Bookings;

use App\Filament\Resources\Bookings\Pages\EditBooking;
use App\Filament\Resources\Bookings\Pages\ListBookings;
use App\Filament\Resources\Bookings\Pages\ViewBooking;
use App\Models\Booking;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Actions\ViewAction;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Tables\Filters\SelectFilter;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TagsInput;
use Filament\Infolists\Components\TextEntry;
use UnitEnum;

class BookingResource extends Resource
{
    protected static ?string $model = Booking::class;
    protected static ?string $label = 'Regular Booking';
    protected static ?string $navigationLabel = 'Regular Bookings';
    protected static string|BackedEnum|null $navigationIcon = Heroicon::Ticket;
    protected static UnitEnum|string|null $navigationGroup = 'Bookings & Messages';
    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Select::make('package_id')
                ->relationship('package', 'title')
                ->required()
                ->suffixActions([
                    fn($state) => $state ? \Filament\Actions\Action::make('view_admin_package')
                        ->icon('heroicon-m-eye')
                        ->tooltip('View in Admin Panel')
                        ->url(\App\Filament\Resources\Packages\PackageResource::getUrl('view', ['record' => $state]))
                        ->openUrlInNewTab() : null,
                    fn($state) => $state ? \Filament\Actions\Action::make('view_public_package')
                        ->icon('heroicon-m-globe-alt')
                        ->tooltip('View on Frontend Website')
                        ->url(url('/' . \App\Models\Package::find($state)?->slug))
                        ->openUrlInNewTab() : null,
                ]),
            TextInput::make('name')->required(),
            TextInput::make('email')->email()->required(),
            TextInput::make('phone')->tel()->required(),
            TextInput::make('persons')->numeric()->required(),
            DatePicker::make('preferred_travel_date')
                ->label('Preferred Travel Date')
                ->native(false)
                ->minDate(now()->toDateString())
                ->displayFormat('M d, Y')
                ->nullable(),
            Select::make('status')
                ->options([
                    'pending' => 'Pending',
                    'paid' => 'Paid / Confirmed',
                    'failed' => 'Failed',
                    'cancelled' => 'Cancelled',
                ])
                ->default('pending')
                ->required(),
            TextInput::make('order_no')
                ->label('HBL Order No')
                ->readOnly(),
            TextInput::make('amount')
                ->label('Payment Amount')
                ->numeric()
                ->prefix('$')
                ->readOnly(),
            TextInput::make('currency')
                ->label('Currency')
                ->readOnly(),
            TextInput::make('payment_type')
                ->label('Payment Type')
                ->readOnly(),
            TextInput::make('total_amount')
                ->label('Total Price')
                ->prefix('$')
                ->readOnly(),
            TextInput::make('remaining_balance')
                ->label('Remaining Balance')
                ->prefix('$')
                ->readOnly(),
            Section::make('Traveller Details')
                ->schema([
                    TextInput::make('traveller_details.lead_traveller.name')
                        ->label('Lead Traveller')
                        ->readOnly(),
                    TagsInput::make('traveller_details.additional_travellers')
                        ->label('Additional Travellers')
                        ->placeholder('None')
                        ->disabled(),
                ])->columns(2),

            Section::make('Selected Add-ons')
                ->schema([
                    TextEntry::make('addon_summary')
                        ->label('')
                        ->state(function ($record) {
                            if (!$record || $record->bookingAddons->isEmpty()) {
                                return new \Illuminate\Support\HtmlString('<div class="text-gray-500 dark:text-gray-400 py-2">No add-ons selected for this booking.</div>');
                            }

                            $rowsHtml = '';
                            $grouped = $record->bookingAddons->load(['addonPackage', 'addonItem'])
                                ->groupBy('addon_package_id');

                            foreach ($grouped as $pkgId => $addons) {
                                $pkgName = e($addons->first()->addonPackage->name ?? 'Unknown Package');
                                foreach ($addons as $addon) {
                                    $price = number_format($addon->price_at_booking, 2);
                                    $qty = $addon->qty ?? 1;
                                    $subtotal = number_format($addon->price_at_booking * $qty, 2);

                                    $rowsHtml .= "
                                        <tr style=\"border-bottom: 1px solid #e5e7eb; background: #ffffff;\">
                                            <td style=\"padding: 12px 16px; font-weight: 600; color: #111827;\">{$pkgName}</td>
                                            <td style=\"padding: 12px 16px; text-align: center; color: #111827;\">{$qty}</td>
                                            <td style=\"padding: 12px 16px; text-align: right; color: #374151;\">\${$price}</td>
                                            <td style=\"padding: 12px 16px; text-align: right; font-weight: 700; color: #111827;\">\${$subtotal}</td>
                                        </tr>
                                    ";
                                }
                            }

                            $addonTotal = number_format($record->addon_total ?? 0, 2);

                            $html = "
                                <div style=\"overflow-x: auto; border: 1px solid #e5e7eb; border-radius: 10px; background: #ffffff;\">
                                    <table style=\"width: 100%; border-collapse: collapse; font-size: 13px; background: #ffffff;\">
                                        <thead style=\"background: #f9fafb; border-bottom: 1px solid #e5e7eb;\">
                                            <tr>
                                                <th style=\"padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: 0.6px;\">Add-on Package</th>
                                                <th style=\"padding: 10px 16px; text-align: center; font-size: 11px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: 0.6px;\">Qty</th>
                                                <th style=\"padding: 10px 16px; text-align: right; font-size: 11px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: 0.6px;\">Price</th>
                                                <th style=\"padding: 10px 16px; text-align: right; font-size: 11px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: 0.6px;\">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody style=\"background: #ffffff;\">
                                            {$rowsHtml}
                                        </tbody>
                                        <tfoot style=\"background: #f9fafb; border-top: 2px solid #e5e7eb;\">
                                            <tr>
                                                <td colspan=\"3\" style=\"padding: 12px 16px; text-align: right; font-weight: 700; color: #374151;\">Grand Add-on Total:</td>
                                                <td style=\"padding: 12px 16px; text-align: right; font-size: 15px; font-weight: 800; color: #065f46;\">\${$addonTotal}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            ";

                            return new \Illuminate\Support\HtmlString($html);
                        })
                        ->html()
                        ->columnSpanFull(),
                ])
                ->collapsible()
                ->collapsed(fn($record) => !$record || $record->bookingAddons->isEmpty()),
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
                    ->default('Regular')
                    ->badge()
                    ->color('gray'),
                TextColumn::make('package.title')
                    ->sortable()
                    ->searchable()
                    ->url(fn(Booking $record) => $record->package_id ? \App\Filament\Resources\Packages\PackageResource::getUrl('view', ['record' => $record->package_id]) : null)
                    ->openUrlInNewTab(),
                TextColumn::make('persons')->numeric()->sortable(),
                TextColumn::make('preferred_travel_date')
                    ->label('Travel Date')
                    ->date('M d, Y')
                    ->sortable()
                    ->placeholder('—'),
                TextColumn::make('order_no')
                    ->label('Order No.')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('amount')
                    ->label('Paid/Deposit')
                    ->money(fn($record) => $record->currency ?? 'USD')
                    ->sortable(),
                TextColumn::make('payment_type')
                    ->label('Type')
                    ->badge()
                    ->formatStateUsing(fn($state) => ucfirst($state))
                    ->sortable(),
                TextColumn::make('total_amount')
                    ->label('Total')
                    ->money(fn($record) => $record->currency ?? 'USD')
                    ->sortable(),
                TextColumn::make('remaining_balance')
                    ->label('Balance')
                    ->money(fn($record) => $record->currency ?? 'USD')
                    ->sortable(),
                TextColumn::make('status')
                    ->badge()
                    ->colors([
                        'warning' => 'pending',
                        'success' => fn($state) => in_array($state, ['paid', 'confirmed']),
                        'danger' => fn($state) => in_array($state, ['failed', 'cancelled']),
                    ]),
                TextColumn::make('created_at')->dateTime()->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'paid' => 'Paid / Confirmed',
                        'failed' => 'Failed',
                        'cancelled' => 'Cancelled',
                    ]),
            ])
            ->actions([
                ViewAction::make(),
                EditAction::make(),
                DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListBookings::route('/'),
            'view' => ViewBooking::route('/{record}'),
            'edit' => EditBooking::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): \Illuminate\Database\Eloquent\Builder
    {
        return parent::getEloquentQuery()->with(['bookingAddons.addonPackage', 'bookingAddons.addonItem']);
    }
}
