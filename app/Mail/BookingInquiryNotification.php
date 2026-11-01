<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingInquiryNotification extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @param array $data  The inquiry data (name, email, phone, package title, persons, date, type, etc.)
     */
    public function __construct(public array $data) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Booking Inquiry from ' . ($this->data['name'] ?? 'Unknown'),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.booking-inquiry-notification',
        );
    }
}
