<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages\Dashboard;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Widgets\AccountWidget;

use Filament\Widgets\FilamentInfoWidget;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use Filament\Navigation\NavigationGroup;
use Filament\View\PanelsRenderHook;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->brandLogo(fn() => view('filament.brand'))
            ->favicon(fn() => \App\Models\SiteSetting::first()?->favicon_url ?? asset('assets/images/logo.png'))
            ->sidebarCollapsibleOnDesktop()
            ->id('admin')
            ->path('admin')
            ->login()
            // ->registration()
            ->emailVerification()
            // ->passwordReset()
            ->profile(\App\Filament\Pages\Auth\EditProfile::class, isSimple: false)
            ->colors([
                'primary' => Color::Blue, // Tailwind CSS green-500
            ])
            ->font('Outfit')
            ->renderHook(
                PanelsRenderHook::STYLES_AFTER,
                fn(): string => \Illuminate\Support\Facades\Blade::render('<link rel="stylesheet" href="{{ asset(\'css/filament/filament/app.css\') }}"><link rel="stylesheet" href="{{ asset(\'css/filament/filament/style.css\') }}">@vite([\'resources/css/app.css\'])'),
            )
            ->renderHook(
                PanelsRenderHook::STYLES_AFTER,
                fn(): string => \Illuminate\Support\Facades\Blade::render('
                    <style>
                        /* ── Hide Filament native sidebar nav, replace with React ── */
                        .fi-sidebar-nav > :not(#admin-custom-sidebar) { display: none !important; }
                        .fi-sidebar-nav { padding: 0 !important; }
                        .fi-sidebar {
                            background: transparent !important;
                            border: none !important;
                            box-shadow: none !important;
                            padding: 0 !important;
                            width: auto !important;
                            min-width: 0 !important;
                        }
                        .fi-sidebar-header { display: none !important; }
                        #admin-custom-sidebar {
                            display: flex;
                            flex-direction: column;
                            height: 100%;
                        }
                    </style>
                '),
            )
            ->renderHook(
                PanelsRenderHook::STYLES_AFTER,
                fn(): string => \Illuminate\Support\Facades\Blade::render('
                    <style>
                        /* ── Sticky table action column ── */
                        .fi-ta-table td.fi-ta-cell:last-child {
                            position: sticky !important;
                            right: 0 !important;
                            z-index: 20 !important;
                            background-color: rgb(255, 255, 255) !important;
                            border-left: 1px solid rgba(0, 0, 0, 0.06) !important;
                            box-shadow: -6px 0 12px -4px rgba(0, 0, 0, 0.12) !important;
                        }
                        .fi.dark .fi-ta-table td.fi-ta-cell:last-child {
                            background-color: rgb(24, 24, 27) !important;
                            border-left: 1px solid rgba(255, 255, 255, 0.06) !important;
                            box-shadow: -6px 0 12px -4px rgba(0, 0, 0, 0.4) !important;
                        }
                        .fi-ta-table th:last-child {
                            position: sticky !important;
                            right: 0 !important;
                            z-index: 21 !important;
                            background-color: rgb(249, 250, 251) !important;
                            border-left: 1px solid rgba(0, 0, 0, 0.06) !important;
                            box-shadow: -6px 0 12px -4px rgba(0, 0, 0, 0.12) !important;
                        }
                        .fi.dark .fi-ta-table th:last-child {
                            background-color: rgb(39, 39, 42) !important;
                            border-left: 1px solid rgba(255, 255, 255, 0.06) !important;
                            box-shadow: -6px 0 12px -4px rgba(0, 0, 0, 0.4) !important;
                        }
                        
                        .fi-ta-content-ctn.fi-fixed-positioning-context {
                            height: calc(100vh - 330px) !important;
                        }
                    </style>
                '),
            )
            ->renderHook(
                PanelsRenderHook::GLOBAL_SEARCH_BEFORE,
                fn(): string => \Illuminate\Support\Facades\Blade::render('
                    <a href="{{ route(\'admin.clear-cache\') }}" 
                       title="Clear Settings & Navigation Cache" 
                       class="flex items-center gap-1.5 px-3 h-9 text-gray-500 text-sm font-medium rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                       style="margin-right: 0.75rem;"
                    >
                        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"></path>
                        </svg>
                        <span>Clear Cache</span>
                    </a>
                '),
            )

            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\Filament\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\Filament\Pages')
            ->pages([
                Dashboard::class,

            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\Filament\Widgets')
            ->widgets([
                // AccountWidget::class,

                // FilamentInfoWidget::class,
            ])
            ->renderHook(
                PanelsRenderHook::BODY_END,
                fn(): string => \Illuminate\Support\Facades\Blade::render('
                    @viteReactRefresh
                    @vite([\'resources/js/app.tsx\', \'resources/js/admin-sidebar.tsx\'])
                '),
            )
            ->renderHook(
                PanelsRenderHook::SIDEBAR_NAV_START,
                fn(): string => \Illuminate\Support\Facades\Blade::render('<div id="admin-custom-sidebar"></div>'),
            )
            ->renderHook(
                PanelsRenderHook::BODY_END,
                fn() => view('filament.fullscreen-script'),
            )
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ])
            ->navigationGroups([
                NavigationGroup::make()
                    ->label('Bookings & Messages')
                    ->collapsible()
                    ->collapsed(),

                NavigationGroup::make()
                    ->label('Tours & Destinations')
                    ->collapsible()
                    ->collapsed(),

                NavigationGroup::make()
                    ->label('Content')
                    ->collapsible()
                    ->collapsed(),

                NavigationGroup::make()
                    ->label('Components')
                    ->collapsible()
                    ->collapsed(),

                NavigationGroup::make()
                    ->label('Site Settings')
                    ->collapsible()
                    ->collapsed(),
            ]);
    }
}
