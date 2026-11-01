<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PaymentSuccessNotification extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @param array $data  Booking details to show in the confirmation email
     */
    public function __construct(public array $data) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Payment Confirmed – Your Booking is Secured! 🎉',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.payment-success-notification',
        );
    }
}
