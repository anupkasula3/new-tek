<?php

namespace App\Filament\Widgets;

use App\Models\ContactMessage;
use App\Models\TripPlan;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsCRM extends BaseWidget
{
    protected ?string $heading = 'CRM Overview';
    
    protected function getStats(): array
    {
        $unreadMessages = ContactMessage::where('is_read', false)->count();
        $pendingTripPlans = TripPlan::where('status', 'pending')->count();

        if ($unreadMessages === 0 && $pendingTripPlans === 0) {
            return [];
        }

        return [
            Stat::make('Unread Messages', $unreadMessages)
                ->description('Messages needing attention')
                ->descriptionIcon('heroicon-m-envelope')
                ->color('danger'),
            Stat::make('Pending Trip Plans', $pendingTripPlans)
                ->description('Plans needing review')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),
        ];
    }
}
