<?php

namespace App\Filament\Resources\Posts\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Tables;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use App\Models\Post;

class PostsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->defaultPaginationPageOption(30)
            ->paginationPageOptions([10, 20, 30, 50, 100])
            ->columns([
                

                TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->limit(40),

                TextColumn::make('status')
                    ->badge()
                    ->colors([
                        'gray' => 'draft',
                        'success' => 'published',
                        'warning' => 'scheduled',
                        'danger' => 'private',
                    ])
                    ->sortable(),

                TextColumn::make('categories.name')
                    ->label('Categories')
                    ->badge()
                    ->separator(', ')
                    ->toggleable(),

                TextColumn::make('author_display')
                    ->label('Author')
                    ->state(function (Post $record) {
                        if ($record->author && is_object($record->author)) {
                            return $record->author->name;
                        }
                        return $record->getRawOriginal('author') ?: '—';
                    })
                    ->searchable(query: function ($query, string $search) {
                        return $query->whereHas('author', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                            ->orWhere('author', 'like', "%{$search}%");
                    })
                    ->toggleable(),

                TextColumn::make('tags.name')
                    ->label('Tags')
                    ->badge()
                    ->separator(', ')
                    ->toggleable(isToggledHiddenByDefault: true),

                IconColumn::make('is_featured')
                    ->boolean()
                    ->label('Featured'),

                IconColumn::make('sticky')
                    ->boolean(),

                TextColumn::make('published_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(),

                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                TrashedFilter::make(),
            ])
            ->recordActions([
                // \Filament\Actions\ViewAction::make(),
                \Filament\Actions\EditAction::make(),
                \Filament\Actions\DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                ]),
            ]);
    }
}
