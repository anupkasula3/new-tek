<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Booking Inquiry</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #0044bb 0%, #0066FF 100%); padding: 32px 40px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }
        .header p { color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 13px; }
        .body { padding: 36px 40px; }
        .badge { display: inline-block; background: #eff6ff; color: #0066FF; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 999px; margin-bottom: 20px; border: 1px solid #bfdbfe; }
        .label { font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; }
        .value { font-size: 15px; color: #111827; margin-bottom: 20px; padding: 10px 14px; background: #f9fafb; border-radius: 6px; border-left: 3px solid #0066FF; word-break: break-word; }
        .divider { height: 1px; background: #e5e7eb; margin: 24px 0; }
        .footer { background: #f9fafb; padding: 20px 40px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer p { color: #9ca3af; font-size: 12px; margin: 0; }
        .type-tag { display: inline-block; padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; }
        .type-package { background: #eff6ff; color: #0066FF; }
        .type-departure { background: #eff6ff; color: #0044bb; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>📋 New Booking Inquiry</h1>
            <p>Someone is interested — they need more information before paying</p>
        </div>
        <div class="body">
            <div>
                <span class="badge">Inquiry (No Payment Yet)</span>
                @if(!empty($data['type']))
                    &nbsp;
                    <span class="type-tag {{ $data['type'] === 'departure' ? 'type-departure' : 'type-package' }}">
                        {{ $data['type'] === 'departure' ? 'Fixed Departure' : 'Package Booking' }}
                    </span>
                @endif
            </div>

            <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-top: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
                <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5;">
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 12px 0; font-weight: bold; color: #4b5563; width: 30%; vertical-align: top;">Package / Trip</td>
                        <td style="padding: 12px 0; color: #111827; vertical-align: top;">
                            @if(!empty($data['package_slug']))
                                <a href="{{ url('/' . $data['package_slug']) }}" style="color: #0066FF; text-decoration: none; font-weight: bold;">{{ $data['package_title'] ?? 'N/A' }}</a>
                            @else
                                <strong style="color: #0066FF;">{{ $data['package_title'] ?? 'N/A' }}</strong>
                            @endif
                            @if(!empty($data['departure_date']))
                                <br><span style="font-size: 12px; color:#6b7280">Departure: {{ $data['departure_date'] }}</span>
                            @endif
                            @if(!empty($data['preferred_date']))
                                <br><span style="font-size: 12px; color:#6b7280">Preferred Date: {{ $data['preferred_date'] }}</span>
                            @endif
                        </td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 12px 0; font-weight: bold; color: #4b5563; vertical-align: top;">Full Name</td>
                        <td style="padding: 12px 0; color: #111827; vertical-align: top;">{{ $data['name'] ?? 'N/A' }}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 12px 0; font-weight: bold; color: #4b5563; vertical-align: top;">Email Address</td>
                        <td style="padding: 12px 0; color: #111827; vertical-align: top;"><a href="mailto:{{ $data['email'] ?? '' }}" style="color: #0066FF; text-decoration: none; font-weight: 500;">{{ $data['email'] ?? 'N/A' }}</a></td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 12px 0; font-weight: bold; color: #4b5563; vertical-align: top;">Phone</td>
                        <td style="padding: 12px 0; color: #111827; vertical-align: top;">{{ $data['phone'] ?? 'N/A' }}</td>
                    </tr>
                    @if(!empty($data['persons']))
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 12px 0; font-weight: bold; color: #4b5563; vertical-align: top;">Number of Persons</td>
                        <td style="padding: 12px 0; color: #111827; vertical-align: top;">{{ $data['persons'] }}</td>
                    </tr>
                    @endif
                    @if(!empty($data['seats_booked']))
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 12px 0; font-weight: bold; color: #4b5563; vertical-align: top;">Seats Requested</td>
                        <td style="padding: 12px 0; color: #111827; vertical-align: top;">{{ $data['seats_booked'] }}</td>
                    </tr>
                    @endif
                    @php
                        // Unify package vs departure parameters
                        $personsCount = $data['persons'] ?? ($data['seats_booked'] ?? 0);
                        $perPersonPrice = $data['package_price'] ?? ($data['price_per_seat'] ?? 0);
                        $baseTotal = ($perPersonPrice > 0) ? ($perPersonPrice * $personsCount) : ($data['base_total'] ?? 0);
                    @endphp

                    @if($perPersonPrice > 0)
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 12px 0; font-weight: bold; color: #4b5563; vertical-align: top;">Price per Person</td>
                        <td style="padding: 12px 0; color: #111827; vertical-align: top;">${{ number_format($perPersonPrice, 2) }}</td>
                    </tr>
                    @endif

                    @if($baseTotal > 0)
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 12px 0; font-weight: bold; color: #4b5563; vertical-align: top;">Base Total</td>
                        <td style="padding: 12px 0; color: #111827; vertical-align: top;">${{ number_format($baseTotal, 2) }} ({{ $personsCount }} × ${{ number_format($perPersonPrice, 2) }})</td>
                    </tr>
                    @endif

                    @if(!empty($data['selected_addons']))
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 12px 0; font-weight: bold; color: #4b5563; vertical-align: top;">Selected Add-ons</td>
                        <td style="padding: 12px 0; color: #111827; vertical-align: top;">
                            <ul style="margin: 0; padding-left: 20px;">
                                @foreach($data['selected_addons'] as $addon)
                                    <li><strong>{{ $addon['package_name'] }}</strong> : Qty: {{ $addon['qty'] ?? 1 }} X ${{ number_format($addon['unit_price'] ?? ($addon['price'] / ($addon['qty'] ?? 1)), 2) }} = ${{ number_format($addon['price'], 2) }}</li>
                                @endforeach
                            </ul>
                            <div style="margin-top: 8px; font-size: 13px;">
                                <span>Add-on Total: <strong>${{ number_format($data['addon_total'], 2) }}</strong></span><br>
                                <span>Grand Total: <strong style="color: #0066FF; font-size: 15px;">${{ number_format($data['grand_total'], 2) }}</strong></span>
                            </div>
                        </td>
                    </tr>
                    @endif

                    @if(empty($data['selected_addons']) && !empty($data['grand_total']))
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 12px 0; font-weight: bold; color: #4b5563; vertical-align: top;">Grand Total</td>
                        <td style="padding: 12px 0; font-weight: bold; font-size: 16px; color: #0044bb; vertical-align: top;">${{ number_format($data['grand_total'], 2) }}</td>
                    </tr>
                    @endif
                    <tr>
                        <td style="padding: 12px 0 0 0; font-weight: bold; color: #4b5563; vertical-align: top;">Submitted At</td>
                        <td style="padding: 12px 0 0 0; color: #111827; vertical-align: top;">{{ now()->format('F j, Y \a\t g:i A') }}</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="footer">
            <p>This is an inquiry — no payment has been made. Reply to {{ $data['email'] ?? 'the customer' }} to follow up.</p>
        </div>
    </div>
</body>
</html>
