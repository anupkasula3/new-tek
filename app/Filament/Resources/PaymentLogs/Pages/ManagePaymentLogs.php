<?php

namespace App\Filament\Resources\PaymentLogs\Pages;

use App\Filament\Resources\PaymentLogs\PaymentLogResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManagePaymentLogs extends ManageRecords
{
    protected static string $resource = PaymentLogResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
