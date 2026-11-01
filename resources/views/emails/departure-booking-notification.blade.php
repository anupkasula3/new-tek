<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Departure Booking</title>
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
            <h1>🗓️ New Fixed Departure Booking</h1>
            <p>A group departure booking has been placed on your website</p>
        </div>
        <div class="body">
            <div class="badge">Fixed Departure Booking — {{ strtoupper($booking->status ?? 'Pending') }}</div>

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

            <div class="label">Package / Departure Date</div>
            <div class="value">
                <strong>{{ $booking->departure->package->title ?? 'N/A' }}</strong><br>
                📅 Date: {{ $booking->departure->date ? $booking->departure->date->format('F j, Y') : 'N/A' }}
            </div>

            <div class="divider"></div>

            <div class="label">Customer Name</div>
            <div class="value">{{ $booking->name }}</div>

            <div class="label">Email Address</div>
            <div class="value">{{ $booking->email }}</div>

            <div class="label">Phone</div>
            <div class="value">{{ $booking->phone }}</div>

            <div class="label">Seats Booked</div>
            <div class="value">{{ $booking->seats_booked }}</div>

            @php
                $unitPrice = $booking->departure->price > 0
                    ? (float)$booking->departure->price
                    : (float)str_replace(',', '', $booking->departure->package->price ?? '0');
                $baseTotal = $unitPrice * $booking->seats_booked;
            @endphp

            <div class="label">Price per Person</div>
            <div class="value">${{ number_format($unitPrice, 2) }}</div>

            <div class="label">Base Total ({{ $booking->seats_booked }} × ${{ number_format($unitPrice, 2) }})</div>
            <div class="value">${{ number_format($baseTotal, 2) }}</div>

            @if($booking->addon_selections && count($booking->addon_selections) > 0)
            <div class="label">Selected Add-ons</div>
            <div class="value" style="padding-left: 20px;">
                <ul style="margin: 0; padding: 0 0 0 15px;">
                    @foreach($booking->addon_selections as $addon)
                    <li>
                        <strong>{{ $addon['name'] ?? 'Addon' }}</strong> : Qty: {{ $addon['qty'] ?? 1 }} X ${{ number_format($addon['price_at_booking'] ?? 0, 2) }} = ${{ number_format(($addon['subtotal'] ?? 0), 2) }}
                    </li>
                    @endforeach
                </ul>
                <div style="margin-top: 8px; font-size: 13px;">
                    Add-on Total: <strong>${{ number_format($booking->addon_total ?? 0, 2) }}</strong>
                </div>
            </div>
            @endif

            <div class="label">Grand Total</div>
            <div class="value" style="font-size: 18px; font-weight: 800; color: #0044bb;">${{ number_format($booking->total_amount, 2) }}</div>

            <div class="label">Booked At</div>
            <div class="value">{{ $booking->created_at->format('F j, Y \a\t g:i A') }}</div>
        </div>
        <div class="footer">
            <p>This booking was placed from your website. Log in to the admin panel to manage group departure bookings.</p>
        </div>
    </div>
</body>
</html>
