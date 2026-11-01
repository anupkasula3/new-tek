<?php

namespace App\Filament\Resources\DepartureBookings\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\TagsInput;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class DepartureBookingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('order_no')
                    ->default(null),
                TextInput::make('departure_id')
                    ->required()
                    ->numeric(),
                TextInput::make('name')
                    ->required(),
                TextInput::make('email')
                    ->label('Email address')
                    ->email()
                    ->required(),
                TextInput::make('phone')
                    ->tel()
                    ->default(null),
                TextInput::make('seats_booked')
                    ->required()
                    ->numeric(),
                TextInput::make('amount')
                    ->numeric()
                    ->default(null),
                TextInput::make('total_amount')
                    ->numeric()
                    ->default(null),
                TextInput::make('remaining_balance')
                    ->numeric()
                    ->default(null),
                TextInput::make('currency')
                    ->required()
                    ->default('USD'),
                TextInput::make('payment_type')
                    ->default(null),
                Select::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'paid' => 'Paid / Confirmed',
                        'failed' => 'Failed',
                        'cancelled' => 'Cancelled',
                    ])
                    ->required()
                    ->default('pending'),
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
                                if (!$record || empty($record->addon_selections)) {
                                    return new \Illuminate\Support\HtmlString('<div style="color:#6b7280; padding: 8px 0;">No add-ons selected for this booking.</div>');
                                }

                                $rowsHtml = '';
                                foreach ($record->addon_selections as $addon) {
                                    $pkgName = e($addon['name'] ?? 'Unknown Package');
                                    $price = number_format($addon['price_at_booking'] ?? 0, 2);
                                    $qty = $addon['qty'] ?? 1;
                                    $subtotal = number_format(($addon['price_at_booking'] ?? 0) * $qty, 2);

                                    $rowsHtml .= "
                                        <tr style=\"border-bottom: 1px solid #e5e7eb; background: #ffffff;\">
                                            <td style=\"padding: 12px 16px; font-weight: 600; color: #111827;\">{$pkgName}</td>
                                            <td style=\"padding: 12px 16px; text-align: center; color: #111827;\">{$qty}</td>
                                            <td style=\"padding: 12px 16px; text-align: right; color: #374151;\">\${$price}</td>
                                            <td style=\"padding: 12px 16px; text-align: right; font-weight: 700; color: #111827;\">\${$subtotal}</td>
                                        </tr>
                                    ";
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
                            ->columnSpanFull(),
                    ])
                    ->collapsible()
                    ->collapsed(fn ($record) => !$record || empty($record->addon_selections)),
            ]);
    }
}
