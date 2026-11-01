<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Confirmed</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .wrapper {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .header {
            background: linear-gradient(135deg, #0044bb 0%, #0066FF 100%);
            padding: 40px;
            text-align: center;
        }

        .header h1 {
            color: #ffffff;
            margin: 0 0 6px;
            font-size: 26px;
            font-weight: 800;
        }

        .header p {
            color: rgba(255, 255, 255, 0.8);
            margin: 0;
            font-size: 14px;
        }

        .tick {
            font-size: 52px;
            margin-bottom: 12px;
            display: block;
        }

        .body {
            padding: 40px;
        }

        .label {
            font-size: 11px;
            font-weight: 700;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-bottom: 4px;
        }

        .value {
            font-size: 15px;
            color: #111827;
            margin-bottom: 20px;
            padding: 10px 14px;
            background: #f9fafb;
            border-radius: 6px;
            border-left: 3px solid #0066FF;
            word-break: break-word;
        }

        .amount-box {
            background: linear-gradient(135deg, #eff6ff, #dbeafe);
            border: 1px solid #bfdbfe;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 28px;
            text-align: center;
        }

        .amount-box .amount {
            font-size: 32px;
            font-weight: 800;
            color: #0044bb;
        }

        .amount-box .amount-label {
            font-size: 13px;
            color: #0066FF;
            margin-top: 4px;
        }

        .divider {
            height: 1px;
            background: #e5e7eb;
            margin: 24px 0;
        }

        .footer {
            background: #f9fafb;
            padding: 24px 40px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }

        .footer p {
            color: #9ca3af;
            font-size: 12px;
            margin: 4px 0;
            line-height: 1.6;
        }

        .highlight {
            color: #0066FF;
            font-weight: 700;
        }

        .greeting {
            font-size: 17px;
            color: #111827;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .subtext {
            font-size: 14px;
            color: #6b7280;
            line-height: 1.6;
            margin-bottom: 28px;
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="header">
            <span class="tick">✅</span>
            <h1>Payment Confirmed!</h1>
            <p>Your adventure is officially booked</p>
        </div>
        <div class="body">
            <p class="greeting">Dear {{ $data['name'] ?? 'Traveller' }},</p>
            <p class="subtext">
                Thank you for booking with <strong>Himalayan Bespoke</strong>! Your payment has been successfully
                processed and your spot is now secured. We are excited to have you join us on this incredible journey.
            </p>

            <div class="amount-box">
                <div class="amount">{{ $data['currency'] ?? 'USD' }}
                    {{ number_format((float) ($data['amount'] ?? 0), 2) }}</div>
                <div class="amount-label">
                    {{ ucfirst($data['payment_type'] ?? 'Full') }} Payment — Confirmed
                    @if(!empty($data['total_amount']) && ($data['total_amount'] != $data['amount']))
                        <br>Total Trip Cost: {{ $data['currency'] ?? 'USD' }}
                        {{ number_format((float) $data['total_amount'], 2) }}
                    @endif
                </div>
            </div>

            <div class="label">Order Number</div>
            <div class="value">#{{ $data['order_no'] ?? 'N/A' }}</div>

            <div class="label">Package / Trip</div>
            <div class="value">{{ $data['package_title'] ?? 'N/A' }}
                @if(!empty($data['departure_date']))
                    <br><small style="color:#6b7280">Departure: {{ $data['departure_date'] }}</small>
                @endif
                @if(!empty($data['preferred_travel_date']))
                    <br><small style="color:#6b7280">Travel Date: {{ $data['preferred_travel_date'] }}</small>
                @endif
            </div>

            <div class="divider"></div>

            <div class="label">Your Name</div>
            <div class="value">{{ $data['name'] ?? 'N/A' }}</div>

            <div class="label">Email</div>
            <div class="value">{{ $data['email'] ?? 'N/A' }}</div>

            <div class="label">Phone</div>
            <div class="value">{{ $data['phone'] ?? 'N/A' }}</div>

            @php
                $personsCount = $data['persons'] ?? ($data['seats_booked'] ?? 1);
                $perPersonPrice = $data['package_price'] ?? ($data['price_per_seat'] ?? 0);
                if ($perPersonPrice <= 0 && !empty($data['total_amount'])) {
                    $addonCost = $data['addon_total'] ?? 0;
                    $baseTotal = $data['total_amount'] - $addonCost;
                    $perPersonPrice = $personsCount > 0 ? ($baseTotal / $personsCount) : 0;
                }
                $baseTotal = $perPersonPrice * $personsCount;
            @endphp

            @if($personsCount > 1)
                <div class="label">Number of Persons</div>
                <div class="value">{{ $personsCount }} persons</div>
            @endif

            @if($perPersonPrice > 0)
                <div class="label">Price per Person</div>
                <div class="value">${{ number_format($perPersonPrice, 2) }}</div>

                <div class="label">Base Total ({{ $personsCount }} × ${{ number_format($perPersonPrice, 2) }})</div>
                <div class="value">${{ number_format($baseTotal, 2) }}</div>
            @endif

            @if(!empty($data['remaining_balance']) && $data['remaining_balance'] > 0)
                <div
                    style="padding: 14px 16px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; margin-bottom: 20px; font-size: 13px; color: #92400e;">
                    ⚠️ <strong>Remaining Balance:</strong> {{ $data['currency'] ?? 'USD' }}
                    {{ number_format((float) $data['remaining_balance'], 2) }} — due before departure.
                </div>
            @endif
        </div>
        <div class="footer">
            <p>If you have any questions, reply to this email or contact our team.</p>
            <p>🏔️ <span class="highlight">Himalayan Bespoke</span> — Your adventure awaits!</p>
            <p style="margin-top:8px; font-size:11px; color:#d1d5db;">noreply@himalayantrekking.com</p>
        </div>
    </div>
</body>

</html>