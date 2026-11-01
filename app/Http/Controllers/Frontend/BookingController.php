<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Mail\BookingInquiryNotification;
use App\Models\Booking;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'package_id' => 'required|exists:packages,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'persons' => 'required|integer|min:1',
            'preferred_travel_date' => 'required|date|after_or_equal:today',
            'payment_type' => 'nullable|string|in:full,advance',
            'traveller_details' => 'nullable|array',
            'addon_selections' => 'nullable|array',
            'addon_selections.*.addon_package_id' => 'required|exists:addon_packages,id',
            'addon_selections.*.price_at_booking' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $package = \App\Models\Package::findOrFail($request->package_id);
            
            // Validate addon selections
            $addonSelections = $request->input('addon_selections', []);
            $addonErrors = $this->validateAddonSelections($package, $addonSelections);
            if (!empty($addonErrors)) {
                return response()->json([
                    'success' => false,
                    'errors' => ['addon_selections' => $addonErrors]
                ], 422);
            }

            // Calculate Addon Total
            $addonTotal = 0;
            $addonsToSave = [];
            foreach ($addonSelections as $selection) {
                $addonPkg = \App\Models\AddonPackage::where('id', $selection['addon_package_id'])->firstOrFail();
                $qty = intval($selection['qty'] ?? 1);
                $addonTotal += $addonPkg->price * $qty;
                $addonsToSave[] = [
                    'addon_package_id' => $selection['addon_package_id'],
                    'price_at_booking' => $addonPkg->price,
                    'qty' => $qty,
                ];
            }

            $tierSlug = $request->input('tier', null);

            $baseAmount = $package->calculatePrice($request->persons, $tierSlug) * $request->persons;
            $totalAmount = $baseAmount + $addonTotal;
            
            $paymentType = $request->input('payment_type', 'full');
            $paymentAmount = $totalAmount;
            
            if ($paymentType === 'advance' && $package->allow_deposit) {
                $depositPercentage = $package->deposit_percentage ?? 20;
                $paymentAmount = ($totalAmount * $depositPercentage) / 100;
            } else {
                $paymentType = 'full';
            }

            $remainingBalance = $totalAmount - $paymentAmount;
            
            $now = \Carbon\Carbon::now();
            $orderNo = $now->getPreciseTimestamp(3); // unique order no

            $booking = Booking::create(array_merge($request->except('addon_selections'), [
                'order_no' => $orderNo,
                'amount' => $paymentAmount,
                'total_amount' => $totalAmount,
                'addon_total' => $addonTotal,
                'remaining_balance' => $remainingBalance,
                'payment_type' => $paymentType,
                'tier' => $tierSlug,
                'currency' => env('HBL_CURRENCY', 'USD'),
                'status' => 'pending'
            ]));

            // Save booking addons
            foreach ($addonsToSave as $addonData) {
                $booking->bookingAddons()->create($addonData);
            }

            // Initiate payment
            $paymentService = new \App\Services\HblPaymentService();
            $baseUrl = url('/');
            $paymentUrl = $paymentService->initiatePayment(
                $booking->id,
                $orderNo,
                $paymentAmount,
                env('HBL_CURRENCY', 'USD'),
                $baseUrl . '/payment/success',
                $baseUrl . '/payment/failed',
                $baseUrl . '/payment/cancel',
                $baseUrl . '/payment/backend',
                "Booking (" . ucfirst($paymentType) . ") for " . $package->title
            );

            return response()->json([
                'success' => true,
                'payment_url' => $paymentUrl,
                'message' => 'Redirecting to payment...'
            ], 201);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("HBL Payment Error: " . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Failed to initiate payment: ' . $e->getMessage()
            ], 500);
        }
    }

    public function inquiry(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'package_id' => 'required|exists:packages,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'persons' => 'required|integer|min:1',
            'preferred_travel_date' => 'required|date|after_or_equal:today',
            'addon_selections' => 'nullable|array',
            'addon_selections.*.addon_package_id' => 'required|exists:addon_packages,id',
            'addon_selections.*.price_at_booking' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $package = \App\Models\Package::findOrFail($request->package_id);

            // Validate addon selections
            $addonSelections = $request->input('addon_selections', []);
            $addonErrors = $this->validateAddonSelections($package, $addonSelections);
            if (!empty($addonErrors)) {
                return response()->json([
                    'success' => false,
                    'errors' => ['addon_selections' => $addonErrors]
                ], 422);
            }

            // Fetch selected addon items for summary
            $selectedAddonsSummary = [];
            $addonTotal = 0;
            foreach ($addonSelections as $selection) {
                $pkg = \App\Models\AddonPackage::findOrFail($selection['addon_package_id']);
                $qty = intval($selection['qty'] ?? 1);
                $selectedAddonsSummary[] = [
                    'package_name' => $pkg->name,
                    'qty'          => $qty,
                    'unit_price'   => $pkg->price,
                    'price'        => $pkg->price * $qty
                ];
                $addonTotal += $pkg->price * $qty;
            }
            
            $tierSlug = $request->input('tier', null);

            $now = \Carbon\Carbon::now();
            $orderNo = $now->getPreciseTimestamp(3); // unique order no

            // Create temporary/inquiry booking to save user selected addons correctly
            $baseAmountInq = $package->calculatePrice($request->persons, $tierSlug) * $request->persons;
            $booking = Booking::create(array_merge($request->except('addon_selections'), [
                'order_no' => $orderNo,
                'amount' => 0,
                'total_amount' => $baseAmountInq + $addonTotal,
                'addon_total' => $addonTotal,
                'remaining_balance' => $baseAmountInq + $addonTotal,
                'payment_type' => 'full',
                'tier' => $tierSlug,
                'currency' => env('HBL_CURRENCY', 'USD'),
                'status' => 'pending'
            ]));

            // Save booking addons
            foreach ($addonSelections as $selection) {
                $pkg = \App\Models\AddonPackage::findOrFail($selection['addon_package_id']);
                $qty = intval($selection['qty'] ?? 1);
                $booking->bookingAddons()->create([
                    'addon_package_id' => $selection['addon_package_id'],
                    'price_at_booking' => $pkg->price,
                    'qty' => $qty,
                ]);
            }

            $mailTo = SiteSetting::first()?->mail_to ?? 'noreply@himalayantrekking.com';
            
            $data = [
                'type' => 'package',
                'package_title' => $package->title,
                'package_slug' => $package->slug,
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'persons' => $request->persons,
                'preferred_date' => $request->preferred_travel_date,
                'selected_addons' => $selectedAddonsSummary,
                'addon_total' => $addonTotal,
                'package_price' => $package->calculatePrice($request->persons),
                'grand_total' => ($package->calculatePrice($request->persons) * $request->persons) + $addonTotal,
            ];

            try {
                Mail::to($mailTo)->send(new BookingInquiryNotification($data));
            } catch (\Exception $mailEx) {
                \Illuminate\Support\Facades\Log::warning('Booking inquiry notification email failed: ' . $mailEx->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Thank you! Your inquiry has been sent successfully.'
            ], 200);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Booking Inquiry Error: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to send inquiry: ' . $e->getMessage()
            ], 500);
        }
    }

    protected function validateAddonSelections($package, array $addonSelections): array
    {
        $errors = [];
        $activePackages = $package->activeAddonPackages()->get();

        // Group selections by addon_package_id
        $selectedPkgIds = array_column($addonSelections, 'addon_package_id');
        $selectionsByPkgId = [];
        foreach ($addonSelections as $selection) {
            $selectionsByPkgId[$selection['addon_package_id']] = $selection;
        }

        foreach ($activePackages as $addonPackage) {
            // Check if required based on min_qty >= 1
            if ($addonPackage->min_qty >= 1 && !in_array($addonPackage->id, $selectedPkgIds)) {
                $errors[] = "The addon '{$addonPackage->name}' is required.";
            }

            // Check min/max qty limits if selected
            if (in_array($addonPackage->id, $selectedPkgIds)) {
                $qty = intval($selectionsByPkgId[$addonPackage->id]['qty'] ?? 1);
                if ($qty < $addonPackage->min_qty) {
                    $errors[] = "The addon '{$addonPackage->name}' quantity must be at least {$addonPackage->min_qty}.";
                }
                if ($qty > $addonPackage->max_qty) {
                    $errors[] = "The addon '{$addonPackage->name}' quantity cannot exceed {$addonPackage->max_qty}.";
                }
            }
        }

        return $errors;
    }

    public function show($orderNo)
    {
        $booking = Booking::with(['package', 'bookingAddons.addonPackage', 'bookingAddons.addonItem'])->where('order_no', $orderNo)->firstOrFail();
        return response()->json($booking);
    }
}
