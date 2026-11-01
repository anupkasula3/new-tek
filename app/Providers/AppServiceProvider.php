<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Filament\Tables\Table;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->usePublicPath(base_path('public_html'));
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Set default pagination to 30 for all Filament tables globally
        Table::configureUsing(function (Table $table): void {
            $table
                ->defaultPaginationPageOption(30)
                ->paginationPageOptions([10, 30, 50, 100]);
        });
    }
}
