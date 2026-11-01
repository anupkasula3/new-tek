<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Trip Plan Request</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #0066FF 0%, #004cc7 100%); padding: 32px 40px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }
        .header p { color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 13px; }
        .body { padding: 36px 40px; }
        .badge { display: inline-block; background: #eff6ff; color: #1d4ed8; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 999px; margin-bottom: 20px; border: 1px solid #bfdbfe; }
        .footer { background: #f9fafb; padding: 20px 40px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer p { color: #9ca3af; font-size: 12px; margin: 0; }
        table { width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5; }
        td { padding: 12px 0; vertical-align: top; border-bottom: 1px solid #e5e7eb; }
        td:first-child { font-weight: bold; color: #4b5563; width: 35%; }
        td:last-child { color: #111827; }
        .last-row td { border-bottom: none; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>🗺️ New Trip Plan Request</h1>
            <p>A customer has submitted a customized trip plan inquiry</p>
        </div>
        <div class="body">
            <span class="badge">Custom Trip Plan</span>

            <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-top: 10px;">
                <table>
                    <tr>
                        <td>Full Name</td>
                        <td>{{ $tripPlan->full_name }}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td><a href="mailto:{{ $tripPlan->email }}" style="color: #0066FF; text-decoration: none; font-weight: 500;">{{ $tripPlan->email }}</a></td>
                    </tr>
                    <tr>
                        <td>Phone</td>
                        <td>{{ $tripPlan->phone }}</td>
                    </tr>
                    @if($tripPlan->package)
                    <tr>
                        <td>Package</td>
                        <td>
                            <a href="{{ url('/' . $tripPlan->package->slug) }}" style="color: #0066FF; text-decoration: none; font-weight: bold;">
                                {{ $tripPlan->package->title }}
                            </a>
                        </td>
                    </tr>
                    @endif
                    @if($tripPlan->destination)
                    <tr>
                        <td>Destination</td>
                        <td>{{ $tripPlan->destination->name }}</td>
                    </tr>
                    @endif
                    <tr>
                        <td>Preferred Date</td>
                        <td>{{ $tripPlan->preferred_date ? $tripPlan->preferred_date->format('F j, Y') : 'N/A' }}</td>
                    </tr>
                    <tr>
                        <td>Group Size</td>
                        <td>{{ $tripPlan->group_size }}</td>
                    </tr>
                   
                    @if($tripPlan->additional_info)
                    <tr>
                        <td>Additional Info</td>
                        <td style="white-space: pre-wrap;">{{ $tripPlan->additional_info }}</td>
                    </tr>
                    @endif
                    <tr class="last-row">
                        <td>Submitted At</td>
                        <td>{{ now()->format('F j, Y \a\t g:i A') }}</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="footer">
            <p>Reply to <a href="mailto:{{ $tripPlan->email }}" style="color: #0066FF;">{{ $tripPlan->email }}</a> to follow up with the customer.</p>
        </div>
    </div>
</body>
</html>
