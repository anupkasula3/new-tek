<?php

namespace App\Filament\Resources\ContactMessages;

use App\Filament\Resources\ContactMessages\Pages\ListContactMessages;
use App\Filament\Resources\ContactMessages\Pages\ViewContactMessage;
use App\Models\ContactMessage;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Actions\DeleteAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\ViewAction;
use Filament\Actions\Action as FilamentAction;
use Filament\Actions\BulkAction;
use Filament\Tables\Filters\Filter;
use Illuminate\Database\Eloquent\Builder;
use UnitEnum;

class ContactMessageResource extends Resource
{
    protected static ?string $model = ContactMessage::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::Envelope;

    protected static UnitEnum|string|null $navigationGroup = 'Bookings & Messages';

    protected static ?int $navigationSort = 4;

    protected static ?string $navigationLabel = 'Contact Messages';

    protected static ?string $modelLabel = 'Contact Message';

    protected static ?string $pluralModelLabel = 'Contact Messages';

    protected static ?string $recordTitleAttribute = 'full_name';

    public static function getNavigationBadge(): ?string
    {
        return (string) static::getModel()::where('is_read', false)->count() ?: null;
    }

    public static function getNavigationBadgeColor(): string
    {
        return 'danger';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
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
                    ->searchable()
                    ->copyable()
                    ->sortable(),
                TextColumn::make('telephone')
                    ->label('Phone')
                    ->searchable()
                    ->placeholder('—'),
                IconColumn::make('is_read')
                    ->label('Read')
                    ->boolean()
                    ->trueColor('success')
                    ->falseColor('danger')
                    ->sortable(),
                TextColumn::make('nationality')
                    ->label('Nationality')
                    ->placeholder('—'),
                TextColumn::make('message')
                    ->label('Message')
                    ->limit(60)
                    ->tooltip(fn (ContactMessage $record): string => $record->message),
                TextColumn::make('created_at')
                    ->label('Received')
                    ->dateTime('M d, Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Filter::make('unread')
                    ->label('Unread Only')
                    ->query(fn (Builder $query): Builder => $query->where('is_read', false))
                    ->default(),
            ])
            ->actions([
                ViewAction::make(),
                FilamentAction::make('mark_read')
                    ->label('Mark as Read')
                    ->icon(Heroicon::Check)
                    ->color('success')
                    ->visible(fn (ContactMessage $record): bool => ! $record->is_read)
                    ->action(fn (ContactMessage $record) => $record->update(['is_read' => true])),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    BulkAction::make('mark_all_read')
                        ->label('Mark as Read')
                        ->icon(Heroicon::CheckCircle)
                        ->action(fn ($records) => $records->each->update(['is_read' => true])),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListContactMessages::route('/'),
            'view'   => ViewContactMessage::route('/{record}'),
        ];
    }
}
