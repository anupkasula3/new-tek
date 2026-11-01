<?php

namespace App\Filament\Resources\ContactMessages\Pages;

use App\Filament\Resources\ContactMessages\ContactMessageResource;
use App\Models\ContactMessage;
use Filament\Resources\Pages\ViewRecord;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Illuminate\Support\HtmlString;

class ViewContactMessage extends ViewRecord
{
    protected static string $resource = ContactMessageResource::class;

    protected function afterMount(): void
    {
        /** @var ContactMessage $record */
        $record = $this->getRecord();
        if (! $record->is_read) {
            $record->update(['is_read' => true]);
        }
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Sender Information')
                    ->columns(2)
                    ->schema([
                        Placeholder::make('full_name')
                            ->label('Full Name')
                            ->content(fn (ContactMessage $record): string => $record->full_name),
                        Placeholder::make('email')
                            ->label('Email')
                            ->content(fn (ContactMessage $record): HtmlString => new HtmlString(
                                '<a href="mailto:' . e($record->email) . '" class="text-primary-600 underline">' . e($record->email) . '</a>'
                            )),
                        Placeholder::make('telephone')
                            ->label('Telephone')
                            ->content(fn (ContactMessage $record): string => $record->telephone ?? '—'),
                        Placeholder::make('nationality')
                            ->label('Nationality')
                            ->content(fn (ContactMessage $record): string => $record->nationality ?? '—'),
                        Placeholder::make('created_at')
                            ->label('Received At')
                            ->content(fn (ContactMessage $record): string => $record->created_at->format('F j, Y \a\t H:i')),
                        Placeholder::make('is_read')
                            ->label('Status')
                            ->content(fn (ContactMessage $record): string => $record->is_read ? '✅ Read' : '🔴 Unread'),
                    ]),

                Section::make('Message')
                    ->schema([
                        Placeholder::make('message')
                            ->label(false)
                            ->content(fn (ContactMessage $record): string => $record->message)
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
