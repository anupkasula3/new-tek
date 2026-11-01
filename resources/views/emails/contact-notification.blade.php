<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Message</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #0044bb 0%, #0066FF 100%); padding: 32px 40px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }
        .header p { color: rgba(255,255,255,0.75); margin: 6px 0 0; font-size: 13px; }
        .body { padding: 36px 40px; }
        .label { font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; }
        .value { font-size: 15px; color: #111827; margin-bottom: 20px; padding: 10px 14px; background: #f9fafb; border-radius: 6px; border-left: 3px solid #0066FF; word-break: break-word; }
        .message-value { white-space: pre-wrap; line-height: 1.6; }
        .footer { background: #f9fafb; padding: 20px 40px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer p { color: #9ca3af; font-size: 12px; margin: 0; }
        .badge { display: inline-block; background: #eff6ff; color: #0066FF; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 999px; margin-bottom: 16px; border: 1px solid #bfdbfe; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>📬 New Contact Message</h1>
            <p>Someone reached out through your website</p>
        </div>
        <div class="body">
            <div class="badge">Contact Form Submission</div>

            <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-top: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
                <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5;">
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 12px 0; font-weight: bold; color: #4b5563; width: 30%; vertical-align: top;">Full Name</td>
                        <td style="padding: 12px 0; color: #111827; vertical-align: top;">{{ $contact->full_name }}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 12px 0; font-weight: bold; color: #4b5563; vertical-align: top;">Email Address</td>
                        <td style="padding: 12px 0; color: #111827; vertical-align: top;"><a href="mailto:{{ $contact->email }}" style="color: #0066FF; text-decoration: none; font-weight: 500;">{{ $contact->email }}</a></td>
                    </tr>
                    @if($contact->telephone)
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 12px 0; font-weight: bold; color: #4b5563; vertical-align: top;">Telephone</td>
                        <td style="padding: 12px 0; color: #111827; vertical-align: top;">{{ $contact->telephone }}</td>
                    </tr>
                    @endif
                    @if($contact->nationality)
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 12px 0; font-weight: bold; color: #4b5563; vertical-align: top;">Nationality</td>
                        <td style="padding: 12px 0; color: #111827; vertical-align: top;">{{ $contact->nationality }}</td>
                    </tr>
                    @endif
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 12px 0; font-weight: bold; color: #4b5563; vertical-align: top;">Submitted At</td>
                        <td style="padding: 12px 0; color: #111827; vertical-align: top;">{{ $contact->created_at->format('F j, Y \a\t g:i A') }}</td>
                    </tr>
                    <tr>
                        <td style="padding: 16px 0 4px 0; font-weight: bold; color: #4b5563; vertical-align: top;" colspan="2">Message</td>
                    </tr>
                    <tr>
                        <td style="padding: 0 0 8px 0; color: #111827; white-space: pre-wrap; line-height: 1.6; vertical-align: top;" colspan="2">{{ $contact->message }}</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="footer">
            <p>This email was sent from the contact form on your website. Reply directly to {{ $contact->email }} to respond.</p>
        </div>
    </div>
</body>
</html>
