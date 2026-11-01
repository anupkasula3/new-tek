<?php
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Frontend\PostController;
use App\Http\Controllers\Frontend\RelatedGuideController;
use App\Http\Controllers\Frontend\DestinationController;
use App\Http\Controllers\Frontend\SubDestinationController;
use App\Http\Controllers\Frontend\TrekController;
use App\Http\Controllers\Frontend\NavbarController;
use App\Http\Controllers\Frontend\PageController;
use App\Http\Controllers\Frontend\GuideController;
use App\Http\Controllers\Frontend\AdditionalInfoController;
use App\Http\Controllers\Frontend\WhyChooseController;
use App\Http\Controllers\Frontend\ReviewController;
use App\Http\Controllers\Frontend\ExperienceController;
use App\Http\Controllers\Frontend\StatsController;
use App\Http\Controllers\Frontend\TeamController;
use App\Http\Controllers\Frontend\AdvantageController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Frontend\PackageController;
use App\Http\Controllers\Frontend\BookingController;
use App\Http\Controllers\Frontend\TripPlanController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Frontend\PlaceExploreController;
use App\Http\Controllers\Frontend\AuthorController;

Route::apiResource('media', MediaController::class);

Route::post('/bookings', [BookingController::class, 'store']);
Route::post('/bookings/inquiry', [BookingController::class, 'inquiry']);
Route::get('/booking/details/{orderNo}', [BookingController::class, 'show']);

Route::get('/posts', function () {
    return 'API Posts Endpoint';
});
Route::get('/blog/{slug}', [PostController::class, 'index']);
Route::get('/blogs', [PostController::class, 'show']);
Route::get('/related-guide/{slug}', [RelatedGuideController::class, 'index']);
Route::get('/related-guides', [RelatedGuideController::class, 'show']);
Route::get('/destination/{slug}', [DestinationController::class, 'show']);
Route::get('/destination', [DestinationController::class, 'index']);
Route::get('/sub-destination/{slug}', [SubDestinationController::class, 'show']);
Route::get('/package/{slug}', [PackageController::class, 'show']);
Route::get('/trek/{slug}', [TrekController::class, 'index']);
Route::get('/treks', [TrekController::class, 'show']);
Route::get('/navbar-items', [NavbarController::class, 'index']);
Route::get('/page/{slug}', [PageController::class, 'show']);
Route::get('/guide/{slug}', [GuideController::class, 'show']);
Route::get('/additional-info/{slug}', [AdditionalInfoController::class, 'show']);
Route::get('/home-data', [PageController::class, 'homeData']);
// Route::get('/luxury', [ExperienceController::class, 'index']);
Route::get('/luxury/{slug}', [ExperienceController::class, 'show']);

Route::get('/components/why-choose', [WhyChooseController::class, 'index']);
Route::get('/components/reviews', [ReviewController::class, 'index']);
Route::get('/components/stats', [StatsController::class, 'index']);
Route::get('/components/team', [TeamController::class, 'index']);
Route::get('/components/advantages', [AdvantageController::class, 'index']);
Route::get('/components/legal-documents', [\App\Http\Controllers\Frontend\LegalDocumentController::class, 'index']);
Route::get('/components/credentials', [\App\Http\Controllers\Frontend\CredentialController::class, 'index']);
Route::get('/components/credibilities', [\App\Http\Controllers\Frontend\CredibilityController::class, 'index']);
Route::get('/components/place-explores', [PlaceExploreController::class, 'index']);
Route::get('/places/{slug}', [PlaceExploreController::class, 'show']);
Route::post('/trip-plans', [TripPlanController::class, 'store']);
Route::get('/popular-packages', [PackageController::class, 'popular_packages']);
Route::get('/best-selling-packages', [PackageController::class, 'best_selling_packages']);
Route::get('/all-packages', [PackageController::class, 'packages']);

// Authors
Route::get('/authors', [AuthorController::class, 'index']);
Route::get('/author/{slug}', [AuthorController::class, 'show']);





Route::prefix('popular-treks')->group(function () {
    Route::get('/fetch', [TrekController::class , "fetch"]);
});

// Contact form submission
Route::middleware('throttle:5,1')->post('/contact', [ContactController::class, 'store']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/search', [\App\Http\Controllers\Api\SearchController::class, 'search']);

// Global Settings and Dynamic Nav
Route::get('/global/settings', [\App\Http\Controllers\Api\GlobalDataController::class, 'settings']);
Route::get('/global/navigation', [\App\Http\Controllers\Api\GlobalDataController::class, 'navigation']);

Route::post('/newsletter/subscribe', function (\Illuminate\Http\Request $request) {
    $request->validate(['email' => 'required|email']);
    \App\Models\NewsletterSubscriber::firstOrCreate(['email' => $request->email]);
    return response()->json(['message' => 'Subscribed']);
});

// ─────────────────────────────────────────────────────────
// Fixed Departure Calendar & Booking System
// ─────────────────────────────────────────────────────────
use App\Http\Controllers\Api\DepartureController;

Route::get('/departures',          [DepartureController::class, 'index']);
Route::get('/departures/{id}',     [DepartureController::class, 'show']);
Route::post('/departures',         [DepartureController::class, 'store']);
Route::put('/departures/{id}',     [DepartureController::class, 'update']);
Route::delete('/departures/{id}',  [DepartureController::class, 'destroy']);
Route::post('/departures/bulk',    [DepartureController::class, 'bulk']);
Route::post('/departures/bulk-delete', [DepartureController::class, 'bulkDelete']);

Route::post('/departure-bookings', [DepartureController::class, 'book']);
Route::post('/departure-bookings/inquiry', [DepartureController::class, 'inquiry']);
Route::get('/departure-packages',  [DepartureController::class, 'packages']);

Route::get('/departure-settings',  [DepartureController::class, 'getSettings']);
Route::put('/departure-settings',  [DepartureController::class, 'updateSettings']);

Route::get('/sitemap-data', [\App\Http\Controllers\SeoSitemapController::class, 'apiData']);
