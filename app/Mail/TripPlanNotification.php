<?php

namespace App\Mail;

use App\Models\TripPlan;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TripPlanNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public TripPlan $tripPlan) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Trip Plan Request from ' . $this->tripPlan->full_name,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.trip-plan-notification',
        );
    }
}
