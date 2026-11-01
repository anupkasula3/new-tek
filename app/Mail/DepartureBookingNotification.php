<?php

namespace App\Mail;

use App\Models\DepartureBooking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DepartureBookingNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public DepartureBooking $booking) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Fixed Departure Booking from ' . $this->booking->name,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.departure-booking-notification',
        );
    }
}
