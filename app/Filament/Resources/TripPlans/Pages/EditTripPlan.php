<?php

namespace App\Filament\Resources\TripPlans\Pages;

use App\Filament\Resources\TripPlans\TripPlanResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditTripPlan extends EditRecord
{
    protected static string $resource = TripPlanResource::class;

    protected function getHeaderActions(): array
    {
        return [
            $this->getSaveFormAction()
                ->label('Save changes')
                ->action('save')
                ->extraAttributes(['form' => 'form']),
            $this->getCancelFormAction(),
            DeleteAction::make(),
        ];
    }

    protected function getFormActions(): array
    {
        return [];
    }
}
