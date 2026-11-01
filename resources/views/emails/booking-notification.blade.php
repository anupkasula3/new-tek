<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Package Booking</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #0044bb 0%, #0066FF 100%); padding: 32px 40px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }
        .header p { color: rgba(255,255,255,0.75); margin: 6px 0 0; font-size: 13px; }
        .body { padding: 36px 40px; }
        .label { font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; }
        .value { font-size: 15px; color: #111827; margin-bottom: 20px; padding: 10px 14px; background: #f9fafb; border-radius: 6px; border-left: 3px solid #0066FF; word-break: break-word; }
        .footer { background: #f9fafb; padding: 20px 40px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer p { color: #9ca3af; font-size: 12px; margin: 0; }
        .badge { display: inline-block; background: #eff6ff; color: #0066FF; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 999px; margin-bottom: 16px; border: 1px solid #bfdbfe; }
        .amount-box { background: linear-gradient(135deg, #eff6ff, #dbeafe); border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px; text-align: center; }
        .amount-box .amount { font-size: 28px; font-weight: 800; color: #0044bb; }
        .amount-box .amount-label { font-size: 13px; color: #0066FF; margin-top: 2px; }
        .divider { height: 1px; background: #e5e7eb; margin: 24px 0; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>🏔️ New Package Booking</h1>
            <p>A new booking has been placed on your website</p>
        </div>
        <div class="body">
            <div class="badge">Package Booking — {{ strtoupper($booking->status ?? 'Pending') }}</div>

            <div class="amount-box">
                <div class="amount">{{ $booking->currency ?? 'USD' }} {{ number_format($booking->amount, 2) }}</div>
                <div class="amount-label">
                    {{ ucfirst($booking->payment_type ?? 'full') }} payment
                    @if(isset($booking->total_amount) && $booking->total_amount != $booking->amount)
                        (Total: {{ $booking->currency ?? 'USD' }} {{ number_format($booking->total_amount, 2) }})
                    @endif
                </div>
            </div>

            <div class="label">Order Number</div>
            <div class="value">#{{ $booking->order_no }}</div>

            <div class="label">Package</div>
            <div class="value">{{ $booking->package->title ?? 'N/A' }}</div>

            <div class="divider"></div>

            <div class="label">Customer Name</div>
            <div class="value">{{ $booking->name }}</div>

            <div class="label">Email Address</div>
            <div class="value">{{ $booking->email }}</div>

            <div class="label">Phone</div>
            <div class="value">{{ $booking->phone }}</div>

            <div class="label">Number of Persons</div>
            <div class="value">{{ $booking->persons }}</div>

            @php
                $pkgPrice = $booking->package ? (float)str_replace(',', '', $booking->package->price ?? '0') : 0;
                $baseTotal = $booking->total_amount - ($booking->addon_total ?? 0);
                $pricePerPerson = $booking->persons > 0 ? ($baseTotal / $booking->persons) : $pkgPrice;
            @endphp
            <div class="label">Price per Person</div>
            <div class="value">${{ number_format($pricePerPerson, 2) }}</div>

            <div class="label">Base Total ({{ $booking->persons }} × ${{ number_format($pricePerPerson, 2) }})</div>
            <div class="value">${{ number_format($baseTotal, 2) }}</div>

            <div class="label">Preferred Travel Date</div>
            <div class="value">{{ \Carbon\Carbon::parse($booking->preferred_travel_date)->format('F j, Y') }}</div>
            @if($booking->bookingAddons && $booking->bookingAddons->isNotEmpty())
                <div class="label">Selected Add-ons</div>
                <div style="margin-bottom: 20px; overflow-x: auto; border-radius: 8px; border: 1px solid #e5e7eb;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                        <thead>
                            <tr style="background: #f3f4f6;">
                                <th style="padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.6px; border-bottom: 1px solid #e5e7eb;">Add-on Package</th>
                                <th style="padding: 10px 14px; text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.6px; border-bottom: 1px solid #e5e7eb;">Qty</th>
                                <th style="padding: 10px 14px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.6px; border-bottom: 1px solid #e5e7eb;">Price</th>
                                <th style="padding: 10px 14px; text-align: right; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.6px; border-bottom: 1px solid #e5e7eb;">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($booking->bookingAddons as $addon)
                                @php
                                    $qty = $addon->qty ?? 1;
                                    $subtotal = $addon->price_at_booking * $qty;
                                @endphp
                                <tr style="border-bottom: 1px solid #f3f4f6;">
                                    <td style="padding: 10px 14px; color: #111827; font-weight: 600;">{{ $addon->addonPackage->name ?? 'Addon' }}</td>
                                    <td style="padding: 10px 14px; text-align: center; color: #374151;">{{ $qty }}</td>
                                    <td style="padding: 10px 14px; text-align: right; color: #374151;">${{ number_format($addon->price_at_booking, 2) }}</td>
                                    <td style="padding: 10px 14px; text-align: right; color: #111827; font-weight: 700;">${{ number_format($subtotal, 2) }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                        <tfoot>
                            <tr style="background: #f9fafb; border-top: 2px solid #e5e7eb;">
                                <td colspan="3" style="padding: 10px 14px; text-align: right; font-weight: 700; color: #374151;">Grand Add-on Total:</td>
                                <td style="padding: 10px 14px; text-align: right; font-weight: 800; color: #0044bb;">${{ number_format($booking->addon_total, 2) }}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            @endif

            <div class="label">Grand Total</div>
            <div class="value" style="font-size: 18px; font-weight: 800; color: #0044bb;">${{ number_format($booking->total_amount, 2) }}</div>

            <div class="label">Booked At</div>
            <div class="value">{{ $booking->created_at->format('F j, Y \a\t g:i A') }}</div>
        </div>
        <div class="footer">
            <p>This booking was placed from your website. Log in to the admin panel to manage it.</p>
        </div>
    </div>
</body>
</html>
