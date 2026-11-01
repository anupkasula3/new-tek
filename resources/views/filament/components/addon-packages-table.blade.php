@if($record)
    @livewire(\App\Filament\Resources\Packages\RelationManagers\AddonPackagesRelationManager::class, ['ownerRecord' => $record])
@endif
