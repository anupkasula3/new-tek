<?php

namespace App\Filament\Resources\NewsletterSubscribers\Tables;

use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class NewsletterSubscribersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('sn')
                    ->label('S.N.')
                    ->rowIndex(),
                TextColumn::make('email')
                    ->searchable()
                    ->sortable()
                    ->copyable(),
                TextColumn::make('created_at')
                    ->label('Subscribed At')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->actions([
                ViewAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    BulkAction::make('export_csv')
                        ->label('Export CSV')
                        ->icon('heroicon-o-arrow-down-tray')
                        ->action(function ($records) {
                            $filename = 'newsletter_subscribers_' . date('Y-m-d') . '.csv';
                            $headers = [
                                'Content-Type' => 'text/csv',
                                'Content-Disposition' => "attachment; filename=\"$filename\"",
                            ];

                            $callback = function () use ($records) {
                                $file = fopen('php://output', 'w');
                                fputcsv($file, ['ID', 'Email', 'Subscribed At']);

                                foreach ($records as $record) {
                                    fputcsv($file, [$record->id, $record->email, $record->created_at?->format('Y-m-d H:i:s') ?? '']);
                                }

                                fclose($file);
                            };

                            return response()->stream($callback, 200, $headers);
                        }),
                ]),
            ]);
    }
}
