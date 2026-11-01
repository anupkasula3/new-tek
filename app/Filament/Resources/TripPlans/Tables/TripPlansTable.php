<?php

namespace App\Filament\Resources\TripPlans\Tables;

use App\Models\TripPlan;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Actions\ViewAction;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Tables\Filters\SelectFilter;
use App\Models\Booking;
use Filament\Notifications\Notification;

class TripPlansTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->defaultPaginationPageOption(30)
            ->columns([
                TextColumn::make('sn')
                    ->label('S.N.')
                    ->rowIndex(),
                TextColumn::make('full_name')
                    ->label('Name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('email')
                    ->label('Email')
                    ->searchable(),
                TextColumn::make('phone')
                    ->label('Phone')
                    ->searchable(),
                TextColumn::make('package.title')
                    ->label('Package')
                    ->searchable()
                    ->sortable()
                    ->placeholder('Custom')
                    ->url(fn (TripPlan $record) => $record->package_id ? \App\Filament\Resources\Packages\PackageResource::getUrl('view', ['record' => $record->package_id]) : null)
                    ->openUrlInNewTab(),
                TextColumn::make('destination.name')
                    ->label('Destination')
                    ->searchable()
                    ->sortable()
                    ->placeholder('Any')
                    ->url(fn (TripPlan $record) => $record->destination_id ? \App\Filament\Resources\Destinations\DestinationResource::getUrl('view', ['record' => $record->destination_id]) : null)
                    ->openUrlInNewTab(),
                TextColumn::make('preferred_date')
                    ->date()
                    ->sortable(),
                TextColumn::make('status')
                    ->badge()
                    ->colors([
                        'warning' => 'pending',
                        'info' => 'reviewed',
                        'primary' => 'contacted',
                        'success' => 'completed',
                        'danger' => 'cancelled',
                    ]),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'reviewed' => 'Reviewed',
                        'contacted' => 'Contacted',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                    ]),
            ])
            ->recordActions([
                Action::make('convert_to_booking')
                    ->label('Confirm Booking')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->visible(fn (TripPlan $record): bool => $record->package_id !== null && $record->status !== 'completed')
                    ->requiresConfirmation()
                    ->action(function (TripPlan $record) {
                        $persons = (int) filter_var($record->group_size, FILTER_SANITIZE_NUMBER_INT) ?: 1;
                        $amount = $record->package->calculatePrice($persons) * $persons;
                        $orderNo = \Carbon\Carbon::now()->getPreciseTimestamp(3);

                        Booking::create([
                            'package_id' => $record->package_id,
                            'name' => $record->full_name,
                            'email' => $record->email,
                            'phone' => $record->phone,
                            'persons' => $persons,
                            'amount' => $amount,
                            'order_no' => $orderNo,
                            'currency' => env('HBL_CURRENCY', 'USD'),
                            'status' => 'pending',
                        ]);

                        $record->update(['status' => 'completed']);

                        Notification::make()
                            ->title('Converted to Booking')
                            ->success()
                            ->send();
                    }),
                ViewAction::make(),
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
