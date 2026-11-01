<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Frontend\PostController;
use Illuminate\Support\Facades\Artisan;

// Route::get('/', function () {
//     dd(request()->path());
//     return view('welcome');
// });

// Route::get('/{any}', function () {
//     return view('app');
// })->where('any', '.*');

// other web routes ABOVE 👆

// SPA fallback (exclude API)

Route::get('/run-migrations', function () {
    try {
        Artisan::call('migrate', [
            '--force' => true // <-- allows running migrations without confirmation
        ]);

        return "Migrations ran successfully!";
    } catch (\Exception $e) {
        return "Migration failed: " . $e->getMessage();
    }
});
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{slug}', [PostController::class, 'show']);

// Payment Callbacks
Route::get('/payment/success', [\App\Http\Controllers\Frontend\PaymentCallbackController::class, 'success']);
Route::get('/payment/failed', [\App\Http\Controllers\Frontend\PaymentCallbackController::class, 'failed']);
Route::get('/payment/cancel', [\App\Http\Controllers\Frontend\PaymentCallbackController::class, 'cancel']);
Route::post('/payment/backend', [\App\Http\Controllers\Frontend\PaymentCallbackController::class, 'backend'])->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);

Route::get('/admin/clear-cache', function () {
    if (!\Filament\Facades\Filament::auth()->check()) {
        abort(403);
    }

    \Illuminate\Support\Facades\Cache::forget('site_settings');
    \Illuminate\Support\Facades\Cache::forget('global_navigation');
    \Illuminate\Support\Facades\Cache::forget('redirect_rules');

    \Filament\Notifications\Notification::make()
        ->title('Site settings, navigation & redirects cache cleared successfully!')
        ->success()
        ->send();

    return redirect()->back();
})->name('admin.clear-cache')->middleware(['web']);

use App\Http\Controllers\SeoSitemapController;

// Sitemap Routes
Route::get('/sitemap.xml', [SeoSitemapController::class, 'index']);
Route::get('/sitemap-main.xml', [SeoSitemapController::class, 'main']);
Route::get('/sitemap-images.xml', [SeoSitemapController::class, 'images']);
Route::get('/sitemap-videos.xml', [SeoSitemapController::class, 'videos']);
Route::get('/sitemap-news.xml', [SeoSitemapController::class, 'news']);
// Route::get('/sitemap', [SeoSitemapController::class, 'html']);

Route::redirect('/page/homepage', '/', 301);

Route::view('/{any}', 'app')
    ->where('any', '^(?!api).*')
    ->middleware(\App\Http\Middleware\InjectSeoMeta::class);



// routes/web.php


