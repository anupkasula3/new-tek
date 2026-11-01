<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ContactNotification;
use App\Models\ContactMessage;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'full_name'   => ['required', 'string', 'max:255'],
            'nationality' => ['nullable', 'string', 'max:100'],
            'email'       => ['required', 'email', 'max:255'],
            'telephone'   => ['nullable', 'string', 'max:30'],
            'message'     => ['required', 'string', 'max:5000'],
        ]);

        $contact = ContactMessage::create($validated);

        // Send notification email to the configured mail_to address
        $mailTo = SiteSetting::first()?->mail_to ?? 'noreply@himalayantrekking.com';
        try {
            Mail::to($mailTo)->send(new ContactNotification($contact));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning('Contact notification email failed: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Thank you for contacting us! We will get back to you soon.',
            'data'    => ['id' => $contact->id],
        ], 201);
    }
}

