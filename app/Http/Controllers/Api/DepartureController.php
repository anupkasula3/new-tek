<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Departure;
use App\Models\DepartureBooking;
use App\Models\DepartureSetting;
use App\Models\Package;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use App\Mail\BookingInquiryNotification;
use App\Mail\DepartureBookingNotification;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Mail;

class DepartureController extends Controller
{
    // ─────────────────────────────────────────────
    // DEPARTURES
    // ─────────────────────────────────────────────

    /**
     * GET /api/departures?year=YYYY&month=MM&package_slug=slug
     */
    public function index(Request $request): JsonResponse
    {
        $year        = $request->query('year');
        $month       = $request->query('month');
        $packageSlug = $request->query('package_slug');

        $query = Departure::query()->with('package')->orderBy('date');

        if ($year)  $query->whereYear('date', $year);
        if ($month) $query->whereMonth('date', $month);

        if ($packageSlug) {
            $package = Package::where('slug', $packageSlug)->first();
            if ($package) {
                $query->where('package_id', $package->id);
            }
        }

        $departures = $query->get()->map(fn (Departure $d) => $this->formatDeparture($d));

        // Resolve package info for response
        $packageInfo = null;
        if ($packageSlug) {
            $pkg = Package::where('slug', $packageSlug)
                ->with(['includes', 'excludes'])
                ->first();
            if ($pkg) {
                $packageInfo = [
                    'id'                 => $pkg->id,
                    'title'              => $pkg->title,
                    'slug'               => $pkg->slug,
                    'banner_image'       => $pkg->banner_image,
                    'featured_image'     => $pkg->featured_image,
                    'price'              => (float) str_replace(',', '', $pkg->price),
                    'pax_pricing'        => $pkg->pax_pricing ?? [],
                    'allow_deposit'      => (bool) $pkg->allow_deposit,
                    'deposit_percentage' => (float) ($pkg->deposit_percentage ?? 20),
                    'duration_days'      => $pkg->duration_days,
                    'region'             => $pkg->region,
                    'difficulty'         => $pkg->difficulty,
                    'includes'           => $pkg->includes->pluck('title'),
                    'excludes'           => $pkg->excludes->pluck('title'),
                ];
            }
        }

        return response()->json([
            'data'      => $departures,
            'threshold' => (int) (DepartureSetting::get('limited_threshold') ?? 5),
            'package'   => $packageInfo,
        ]);
    }

    /**
     * GET /api/departures/{id}
     */
    public function show(int $id): JsonResponse
    {
        $departure = Departure::with(['package.activeAddonPackages'])->findOrFail($id);
        return response()->json(['data' => $this->formatDeparture($departure)]);
    }

    /**
     * POST /api/departures
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'package_id'      => 'required|exists:packages,id',
            'date'            => [
                'required',
                'date',
                \Illuminate\Validation\Rule::unique('departures', 'date')->where('package_id', $request->package_id),
            ],
            'price'           => 'required|numeric|min:0',
            'total_seats'     => 'required|integer|min:1',
            'available_seats' => 'required|integer|min:0|lte:total_seats',
        ]);

        $departure = Departure::create($validated);
        $departure->recalculateStatus();

        return response()->json(['data' => $this->formatDeparture($departure)], 201);
    }

    /**
     * PUT /api/departures/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $departure = Departure::findOrFail($id);

        $validated = $request->validate([
            'package_id'      => 'nullable|exists:packages,id',
            'date'            => [
                'sometimes',
                'date',
                \Illuminate\Validation\Rule::unique('departures', 'date')
                    ->where('package_id', $request->package_id ?? $departure->package_id)
                    ->ignore($id),
            ],
            'price'           => 'sometimes|numeric|min:0',
            'total_seats'     => 'sometimes|integer|min:1',
            'available_seats' => 'sometimes|integer|min:0',
        ]);

        $departure->update($validated);
        $departure->recalculateStatus();

        return response()->json(['data' => $this->formatDeparture($departure)]);
    }

    /**
     * DELETE /api/departures/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        Departure::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    // ─────────────────────────────────────────────
    // BULK ACTIONS
    // ─────────────────────────────────────────────

    /**
     * POST /api/departures/bulk
     */
    public function bulk(Request $request): JsonResponse
    {
        $request->validate([
            'package_id'               => 'required|exists:packages,id',
            'dates'                    => 'required|array|min:1',
            'dates.*.date'             => 'required|date',
            'dates.*.price'            => 'required|numeric|min:0',
            'dates.*.total_seats'      => 'required|integer|min:1',
            'dates.*.available_seats'  => 'required|integer|min:0',
        ]);

        $results = [];
        $packageId = $request->package_id;

        DB::transaction(function () use ($request, $packageId, &$results) {
            foreach ($request->dates as $item) {
                $departure = Departure::updateOrCreate(
                    ['date' => $item['date'], 'package_id' => $packageId],
                    [
                        'package_id'      => $packageId,
                        'price'           => $item['price'],
                        'total_seats'     => $item['total_seats'],
                        'available_seats' => $item['available_seats'],
                    ]
                );
                $departure->recalculateStatus();
                $results[] = $this->formatDeparture($departure);
            }
        });

        return response()->json(['data' => $results]);
    }

    /**
     * POST /api/departures/bulk-delete
     */
    public function bulkDelete(Request $request): JsonResponse
    {
        $request->validate([
            'package_id' => 'nullable|exists:packages,id',
            'dates'      => 'required|array|min:1',
            'dates.*'    => 'required|date',
        ]);

        $query = Departure::whereIn('date', $request->dates);
        
        if ($request->package_id) {
            $query->where('package_id', $request->package_id);
        }

        $count = $query->delete();

        return response()->json([
            'message' => "Successfully deleted {$count} departures."
        ]);
    }

    // ─────────────────────────────────────────────
    // BOOKINGS
    // ─────────────────────────────────────────────

    /**
     * POST /api/departure-bookings
     * Accepts: departure_id, name, email, phone, seats_booked, payment_type
     */
    public function book(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'departure_id'                            => 'required|exists:departures,id',
            'name'                                    => 'required|string|max:255',
            'email'                                   => 'required|email|max:255',
            'phone'                                   => 'required|string|max:50',
            'seats_booked'                            => 'required|integer|min:1',
            'payment_type'                            => 'nullable|in:full,advance',
            'traveller_details'                       => 'nullable|array',
            'addon_selections'                        => 'nullable|array',
            'addon_selections.*.addon_package_id'     => 'required|exists:addon_packages,id',
            'addon_selections.*.qty'                  => 'required|integer|min:1',
            'addon_selections.*.price_at_booking'     => 'required|numeric',
        ]);

        try {
            $booking = DB::transaction(function () use ($validated, $request) {
                $departure = Departure::lockForUpdate()->findOrFail($validated['departure_id']);

                if ($departure->available_seats < $validated['seats_booked']) {
                    throw ValidationException::withMessages([
                        'seats_booked' => ["Only {$departure->available_seats} seat(s) available."]
                    ]);
                }

                $package = $departure->package;
                if (!$package) {
                    throw new \Exception("Departure has no associated package.");
                }

                // Price calculation: Use departure price if set, otherwise fallback to package dynamic pricing
                $unitPrice = $departure->price > 0
                    ? $departure->price
                    : $package->calculatePrice($validated['seats_booked']);

                $baseTotal = $unitPrice * $validated['seats_booked'];

                // Calculate addon total
                $addonSelections = $request->input('addon_selections', []);
                $addonTotal = 0;
                $addonSummary = [];
                foreach ($addonSelections as $sel) {
                    $addonPkg = \App\Models\AddonPackage::find($sel['addon_package_id']);
                    if ($addonPkg) {
                        $qty = intval($sel['qty'] ?? 1);
                        $addonTotal += $addonPkg->price * $qty;
                        $addonSummary[] = [
                            'addon_package_id'  => $sel['addon_package_id'],
                            'name'              => $addonPkg->name,
                            'qty'               => $qty,
                            'price_at_booking'  => (float) $addonPkg->price,
                            'subtotal'          => $addonPkg->price * $qty,
                        ];
                    }
                }

                $totalAmount  = $baseTotal + $addonTotal;
                $paymentType  = $validated['payment_type'] ?? 'full';
                $paymentAmount = $totalAmount;

                if ($paymentType === 'advance' && $package->allow_deposit) {
                    $depositPercentage = $package->deposit_percentage ?? 20;
                    $paymentAmount = ($totalAmount * $depositPercentage) / 100;
                } else {
                    $paymentType = 'full';
                }

                $remainingBalance = $totalAmount - $paymentAmount;
                $orderNo = \Carbon\Carbon::now()->getPreciseTimestamp(3);

                $booking = DepartureBooking::create([
                    'departure_id'      => $validated['departure_id'],
                    'name'              => $validated['name'],
                    'email'             => $validated['email'],
                    'phone'             => $validated['phone'],
                    'seats_booked'      => $validated['seats_booked'],
                    'traveller_details' => $validated['traveller_details'] ?? null,
                    'order_no'          => $orderNo,
                    'amount'            => $paymentAmount,
                    'addon_total'       => $addonTotal,
                    'addon_selections'  => $addonSummary,
                    'total_amount'      => $totalAmount,
                    'remaining_balance' => $remainingBalance,
                    'payment_type'      => $paymentType,
                    'currency'          => env('HBL_CURRENCY', 'USD'),
                    'status'            => 'pending',
                ]);

                return $booking;
            });

            // Initiate payment
            $paymentService = new \App\Services\HblPaymentService();
            $baseUrl = url('/');
            $isLimited = $booking->departure->available_seats <= 5;
            $limitedText = $isLimited ? " [Limited Seats]" : "";

            $paymentUrl = $paymentService->initiatePayment(
                $booking->id,
                $booking->order_no,
                $booking->amount,
                $booking->currency,
                $baseUrl . '/payment/success',
                $baseUrl . '/payment/failed',
                $baseUrl . '/payment/cancel',
                $baseUrl . '/payment/backend',
                "Fixed Departure Booking (" . ucfirst($booking->payment_type) . ") for " . $booking->departure->package->title . " (" . $booking->departure->date->format('Y-m-d') . ")" . $limitedText
            );

            return response()->json([
                'success'     => true,
                'payment_url' => $paymentUrl,
                'message'     => 'Redirecting to payment...'
            ], 201);

        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Departure Payment Error: " . $e->getMessage() . "\n" . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Failed to initiate payment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * POST /api/departure-bookings/inquiry
     */
    public function inquiry(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'departure_id'                        => 'required|exists:departures,id',
            'name'                                => 'required|string|max:255',
            'email'                               => 'required|email|max:255',
            'phone'                               => 'required|string|max:50',
            'seats_booked'                        => 'required|integer|min:1',
            'traveller_details'                   => 'nullable|array',
            'addon_selections'                    => 'nullable|array',
            'addon_selections.*.addon_package_id' => 'required|exists:addon_packages,id',
            'addon_selections.*.qty'              => 'required|integer|min:1',
        ]);

        try {
            $departure = Departure::with('package')->findOrFail($validated['departure_id']);
            $mailTo = SiteSetting::first()?->mail_to ?? 'noreply@himalayantrekking.com';

            $package    = $departure->package;
            $unitPrice  = $departure->price > 0
                ? (float) $departure->price
                : (float) str_replace(',', '', $package->price ?? '0');
            $seats      = $validated['seats_booked'];
            $baseTotal  = $unitPrice * $seats;

            // Build addon summary
            $addonSelections = $request->input('addon_selections', []);
            $addonTotal = 0;
            $selectedAddonsSummary = [];
            foreach ($addonSelections as $sel) {
                $addonPkg = \App\Models\AddonPackage::find($sel['addon_package_id']);
                if ($addonPkg) {
                    $qty = intval($sel['qty'] ?? 1);
                    $subtotal = $addonPkg->price * $qty;
                    $addonTotal += $subtotal;
                    $selectedAddonsSummary[] = [
                        'addon_package_id'  => $sel['addon_package_id'],
                        'name'              => $addonPkg->name,
                        'qty'               => $qty,
                        'price_at_booking'  => (float) $addonPkg->price,
                        'subtotal'          => (float) $subtotal,
                    ];
                }
            }

            $grandTotal = $baseTotal + $addonTotal;
            $orderNo = \Carbon\Carbon::now()->getPreciseTimestamp(3);

            // Save inquiry booking to database
            $booking = DepartureBooking::create([
                'departure_id'      => $validated['departure_id'],
                'name'              => $validated['name'],
                'email'             => $validated['email'],
                'phone'             => $validated['phone'],
                'seats_booked'      => $seats,
                'traveller_details' => $validated['traveller_details'] ?? null,
                'order_no'          => $orderNo,
                'amount'            => 0,
                'addon_total'       => $addonTotal,
                'addon_selections'  => $selectedAddonsSummary,
                'total_amount'      => $grandTotal,
                'remaining_balance' => $grandTotal,
                'payment_type'      => 'full',
                'currency'          => env('HBL_CURRENCY', 'USD'),
                'status'            => 'pending',
            ]);

            // Email data uses the order number
            $emailAddonsSummary = [];
            foreach ($selectedAddonsSummary as $addon) {
                $emailAddonsSummary[] = [
                    'package_name' => $addon['name'],
                    'qty'          => $addon['qty'],
                    'unit_price'   => $addon['price_at_booking'],
                    'price'        => $addon['subtotal'],
                ];
            }

            /** @var \Carbon\Carbon $departureDate */
            $departureDate = $departure->date;
            $data = [
                'type'            => 'departure',
                'package_title'   => $package->title ?? 'Adventure Trek',
                'package_slug'    => $package->slug ?? '',
                'departure_date'  => $departureDate->format('F j, Y'),
                'name'            => $validated['name'],
                'email'           => $validated['email'],
                'phone'           => $validated['phone'],
                'seats_booked'    => $seats,
                'price_per_seat'  => $unitPrice,
                'base_total'      => $baseTotal,
                'selected_addons' => $emailAddonsSummary,
                'addon_total'     => $addonTotal,
                'grand_total'     => $grandTotal,
                'order_no'        => $orderNo,
            ];

            try {
                Mail::to($mailTo)->send(new BookingInquiryNotification($data));
            } catch (\Exception $mailEx) {
                \Illuminate\Support\Facades\Log::warning('Departure inquiry notification email failed: ' . $mailEx->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Thank you! Your inquiry has been sent successfully.'
            ], 200);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Departure Inquiry Error: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to send inquiry: ' . $e->getMessage()
            ], 500);
        }
    }

    // ─────────────────────────────────────────────
    // PACKAGES LIST (for selector dropdown)
    // ─────────────────────────────────────────────


    /**
     * GET /api/departure-packages
     * Returns a slim list of all packages for the package selector
     */
    public function packages(): JsonResponse
    {
        $packages = Package::select('id', 'title', 'slug', 'price', 'pax_pricing',
                                   'allow_deposit', 'deposit_percentage', 'duration_days',
                                   'region', 'featured_image', 'banner_image')
            ->orderBy('title')
            ->get()
            ->map(fn ($p) => [
                'id'                 => $p->id,
                'title'              => $p->title,
                'slug'               => $p->slug,
                'price'              => (float) str_replace(',', '', $p->price ?? '0'),
                'pax_pricing'        => $p->pax_pricing ?? [],
                'allow_deposit'      => (bool) $p->allow_deposit,
                'deposit_percentage' => (float) ($p->deposit_percentage ?? 20),
                'duration_days'      => $p->duration_days,
                'region'             => $p->region,
                'featured_image'     => $p->featured_image,
                'banner_image'       => $p->banner_image,
            ]);

        return response()->json(['data' => $packages]);
    }

    // ─────────────────────────────────────────────
    // SETTINGS
    // ─────────────────────────────────────────────

    public function getSettings(Request $request): JsonResponse
    {
        if ($request->package_id) {
            $package = Package::find($request->package_id);
            $threshold = (int) ($package->limited_seats_threshold ?? 5);
        } else {
            $threshold = (int) (DepartureSetting::get('limited_threshold') ?? 5);
        }
        return response()->json(['limited_threshold' => $threshold]);
    }

    public function updateSettings(Request $request): JsonResponse
    {
        $request->validate([
            'limited_threshold' => 'required|integer|min:1|max:100',
            'package_id'        => 'nullable|exists:packages,id',
        ]);

        if ($request->package_id) {
            $package = Package::find($request->package_id);
            if ($package) {
                $package->update(['limited_seats_threshold' => $request->limited_threshold]);
                Departure::where('package_id', $package->id)->get()->each(fn ($d) => $d->recalculateStatus());
            }
        } else {
            DepartureSetting::set('limited_threshold', $request->limited_threshold);
            Departure::whereNull('package_id')->get()->each(fn ($d) => $d->recalculateStatus());
        }

        return response()->json([
            'message'           => 'Settings updated successfully.',
            'limited_threshold' => $request->limited_threshold,
        ]);
    }

    // ─────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────

    private function formatDeparture(Departure $d): array
    {
        /** @var \Carbon\Carbon $date */
        $date = $d->date;
        $result = [
            'id'              => $d->id,
            'package_id'      => $d->package_id,
            'date'            => $date->format('Y-m-d'),
            'price'           => (float) $d->price,
            'total_seats'     => $d->total_seats,
            'available_seats' => $d->available_seats,
            'status'          => $d->status,
        ];

        if ($d->package) {
            $addonPackages = [];
            if ($d->package->relationLoaded('activeAddonPackages')) {
                $addonPackages = $d->package->activeAddonPackages->map(fn ($ap) => [
                    'id'             => $ap->id,
                    'name'           => $ap->name,
                    'description'    => $ap->description,
                    'price'          => (float) $ap->price,
                    'images'         => $ap->images ?? [],
                    'badge'          => $ap->badge,
                    'short_label'    => $ap->short_label,
                    'min_qty'        => $ap->min_qty,
                    'max_qty'        => $ap->max_qty,
                    'selection_type' => $ap->selection_type,
                    'sort_order'     => $ap->sort_order,
                ])->values()->toArray();
            }

            $result['package'] = [
                'id'                    => $d->package->id,
                'title'                 => $d->package->title ?? 'Adventure Trek',
                'slug'                  => $d->package->slug,
                'price'                 => $d->package->price,
                'pax_pricing'           => $d->package->pax_pricing ?? [],
                'allow_deposit'         => (bool) $d->package->allow_deposit,
                'deposit_percentage'    => (float) ($d->package->deposit_percentage ?? 20),
                'featured_image'        => $d->package->featured_image,
                'banner_image'          => $d->package->banner_image,
                'duration_days'         => $d->package->duration_days,
                'region'                => $d->package->region,
                'active_addon_packages' => $addonPackages,
            ];
        }

        return $result;
    }
}
