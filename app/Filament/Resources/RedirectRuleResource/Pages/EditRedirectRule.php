<?php

namespace App\Filament\Resources\RedirectRuleResource\Pages;

use App\Filament\Resources\RedirectRuleResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditRedirectRule extends EditRecord
{
    protected static string $resource = RedirectRuleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
