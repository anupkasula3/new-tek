<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Mail\TripPlanNotification;
use App\Models\SiteSetting;
use App\Models\TripPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class TripPlanController extends Controller
{
    public function store(Request $request)
    {
        $input = $request->all();
        if (isset($input['destination_id']) && ($input['destination_id'] === 'undefined' || $input['destination_id'] === 'null' || $input['destination_id'] === '')) {
            $input['destination_id'] = null;
            $request->merge(['destination_id' => null]);
        }

        $validator = Validator::make($input, [
            'full_name'       => 'required|string|max:255',
            'email'           => 'required|email|max:255',
            'phone'           => 'required|string|max:20',
            'package_id'      => 'required|exists:packages,id',
            'destination_id'  => 'nullable|exists:destinations,id',
            'duration'        => 'nullable|string',
            'group_size'      => 'required|string',
            'preferred_date'  => 'required|date|after_or_equal:today',
            'budget_range'    => 'nullable|string',
            'interests'       => 'nullable|array',
            'additional_info' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            $tripPlan = TripPlan::create($request->only([
                'full_name', 'email', 'phone', 'package_id', 'destination_id',
                'duration', 'group_size', 'preferred_date', 'budget_range',
                'interests', 'additional_info',
            ]));

            // Load relationships for the email
            $tripPlan->load(['package', 'destination']);

            // Send notification email to admin
            $mailTo = SiteSetting::first()?->mail_to ?? config('mail.from.address');
            try {
                Mail::to($mailTo)->send(new TripPlanNotification($tripPlan));
            } catch (\Exception $e) {
                Log::warning('Trip plan notification email failed: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Your trip request has been submitted successfully. We will contact you soon!',
                'data'    => $tripPlan,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Trip plan store failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong. Please try again later.',
                'debug'   => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
