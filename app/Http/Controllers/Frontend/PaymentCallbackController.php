<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Mail\BookingNotification;
use App\Mail\DepartureBookingNotification;
use App\Mail\PaymentSuccessNotification;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class PaymentCallbackController extends Controller
{
    public function success(Request $request)
    {
        Log::info('HBL Success Callback Received:', $request->all());

        $orderNo = $request->query('orderNo') ?? $request->input('orderNo');
        $payload = $request->all();

        // Check if there is a JOSE response (usually in a POST body or 'payload' field)
        // HBL often sends it back in the request body as a raw string or in a field
        $token = $request->input('payload') ?? $request->getContent();
        
        if ($token && str_contains($token, '.')) {
            try {
                $service = new \App\Services\HblPaymentService();
                $decrypted = $service->parseJoseToken($token);
                Log::info('HBL Success Decrypted:', $decrypted);
                
                // Extract order number from decrypted payload if available
                $orderNo = $decrypted['response']['Data']['paymentIncompleteResult']['orderNo'] ?? $orderNo;
                $payload['decrypted'] = $decrypted;
            } catch (\Exception $e) {
                Log::error('failed to decrypt HBL success callback: ' . $e->getMessage());
            }
        }
        
        if ($orderNo) {
            $log = \App\Models\PaymentLog::where('order_no', $orderNo)->first();
            if ($log) {
                $log->update(['status' => 'success', 'callback_payload' => $payload]);
            }

            // Check main bookings
            $booking = Booking::with('package')->where('order_no', $orderNo)->first();
            if ($booking) {
                $booking->update(['status' => 'paid']);

                // Notify admin that a package booking payment has been confirmed
                $mailTo = SiteSetting::first()?->mail_to ?? config('mail.from.address');
                try {
                    $booking->load(['package', 'bookingAddons.addonPackage', 'bookingAddons.addonItem']);
                    Mail::to($mailTo)->send(new BookingNotification($booking));
                } catch (\Exception $ex) {
                    Log::warning('Admin booking notification email failed: ' . $ex->getMessage());
                }

                try {
                    $mailData = [
                        'name' => $booking->name,
                        'email' => $booking->email,
                        'phone' => $booking->phone,
                        'order_no' => $booking->order_no,
                        'package_title' => $booking->package->title ?? 'N/A',
                        'preferred_travel_date' => $booking->preferred_travel_date,
                        'amount' => $booking->amount,
                        'total_amount' => $booking->total_amount,
                        'currency' => $booking->currency,
                        'payment_type' => $booking->payment_type,
                        'remaining_balance' => $booking->remaining_balance,
                    ];
                    Mail::to($booking->email)->send(new PaymentSuccessNotification($mailData));
                } catch (\Exception $ex) {
                    Log::warning('Customer payment success email failed for booking: ' . $ex->getMessage());
                }

                return redirect()->to("/booking/success?orderNo={$orderNo}");
            }

            // Check departure bookings
            $depBooking = \App\Models\DepartureBooking::with('departure.package')->where('order_no', $orderNo)->first();
            if ($depBooking) {
                $depBooking->update(['status' => 'paid']);

                // Notify admin that a departure booking payment has been confirmed
                $mailTo = SiteSetting::first()?->mail_to ?? config('mail.from.address');
                try {
                    $depBooking->load(['departure.package']);
                    Mail::to($mailTo)->send(new DepartureBookingNotification($depBooking));
                } catch (\Exception $ex) {
                    Log::warning('Admin departure booking notification email failed: ' . $ex->getMessage());
                }

                try {
                    $mailData = [
                        'name' => $depBooking->name,
                        'email' => $depBooking->email,
                        'phone' => $depBooking->phone,
                        'order_no' => $depBooking->order_no,
                        'package_title' => $depBooking->departure->package->title ?? 'N/A',
                        'departure_date' => $depBooking->departure->date ? $depBooking->departure->date->format('Y-m-d') : 'N/A',
                        'amount' => $depBooking->amount,
                        'total_amount' => $depBooking->total_amount,
                        'currency' => $depBooking->currency,
                        'payment_type' => $depBooking->payment_type,
                        'remaining_balance' => $depBooking->remaining_balance,
                    ];
                    Mail::to($depBooking->email)->send(new PaymentSuccessNotification($mailData));
                } catch (\Exception $ex) {
                    Log::warning('Customer payment success email failed for departure booking: ' . $ex->getMessage());
                }

                return redirect()->to("/booking/success?orderNo={$orderNo}&type=departure");
            }
        }
        
        return redirect()->to('/booking/success');
    }

    public function failed(Request $request)
    {
        Log::info('HBL Failed Callback Received:', $request->all());

        $orderNo = $request->query('orderNo') ?? $request->input('orderNo');
        $payload = $request->all();

        $token = $request->input('payload') ?? $request->getContent();
        if ($token && str_contains($token, '.')) {
            try {
                $service = new \App\Services\HblPaymentService();
                $decrypted = $service->parseJoseToken($token);
                Log::info('HBL Failed Decrypted:', $decrypted);
                $orderNo = $decrypted['response']['Data']['paymentIncompleteResult']['orderNo'] ?? $orderNo;
                $payload['decrypted'] = $decrypted;
            } catch (\Exception $e) {
                Log::error('failed to decrypt HBL failed callback: ' . $e->getMessage());
            }
        }
        
        if ($orderNo) {
            $log = \App\Models\PaymentLog::where('order_no', $orderNo)->first();
            $errorMessage = $payload['decrypted']['response']['ApiResponse']['MarketingDescription'] ?? $payload['decrypted']['response']['ApiResponse']['ResponseDescription'] ?? null;
            
            if ($log) {
                $log->update(['status' => 'failed', 'callback_payload' => $payload]);
            }

            $booking = Booking::where('order_no', $orderNo)->first();
            if ($booking) {
                $booking->update(['status' => 'failed']);
                $failedUrl = "/booking/failed?orderNo={$orderNo}";
                if ($errorMessage) $failedUrl .= "&message=" . urlencode($errorMessage);
                return redirect()->to($failedUrl);
            }

            $depBooking = \App\Models\DepartureBooking::where('order_no', $orderNo)->first();
            if ($depBooking) {
                $depBooking->update(['status' => 'failed']);
                $failedUrl = "/booking/failed?orderNo={$orderNo}&type=departure";
                if ($errorMessage) $failedUrl .= "&message=" . urlencode($errorMessage);
                return redirect()->to($failedUrl);
            }
        }
        
        return redirect()->to('/booking/failed');
    }

    public function cancel(Request $request)
    {
        $orderNo = $request->query('orderNo') ?? $request->input('orderNo');
        
        if ($orderNo) {
            $log = \App\Models\PaymentLog::where('order_no', $orderNo)->first();
            if ($log) {
                $log->update(['status' => 'cancelled', 'callback_payload' => $request->all()]);
            }
            
            $booking = Booking::where('order_no', $orderNo)->first();
            if ($booking) {
                $booking->update(['status' => 'cancelled']);
                return redirect()->to("/booking/failed?orderNo={$orderNo}&status=cancelled");
            }

            $depBooking = \App\Models\DepartureBooking::where('order_no', $orderNo)->first();
            if ($depBooking) {
                $depBooking->update(['status' => 'cancelled']);
                return redirect()->to("/booking/failed?orderNo={$orderNo}&status=cancelled&type=departure");
            }
        }
        
        return redirect()->to('/booking/failed?status=cancelled');
    }

    public function backend(Request $request)
    {
        Log::info('HBL Backend Notification Received:', $request->all());

        $orderNo = $request->input('orderNo') ?? $request->query('orderNo');
        if ($orderNo) {
            $log = \App\Models\PaymentLog::where('order_no', $orderNo)->first();
            if ($log) {
                // If it contains a signed payload, typically it's under something like 'payload'
                $callbacks = $log->callback_payload ?? [];
                $callbacks['backend_notification'] = $request->all();
                $log->update([
                    'callback_payload' => $callbacks
                ]);
            }
        }
        
        return response()->json(['status' => 'ok']);
    }
}
