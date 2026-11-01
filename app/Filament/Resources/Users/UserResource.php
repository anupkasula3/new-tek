<?php

namespace App\Filament\Resources\Users;

use App\Filament\Resources\Users\Pages\CreateUser;
use App\Filament\Resources\Users\Pages\EditUser;
use App\Filament\Resources\Users\Pages\ListUsers;
use App\Models\User;
use App\Filament\Components\MediaPicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Fieldset;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use BackedEnum;
use UnitEnum;
use Filament\Schemas\Components\Utilities\Set;


class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::Users;

    protected static UnitEnum|string|null $navigationGroup = 'Site Settings';

    protected static ?int $navigationSort = 99;

    protected static ?string $navigationLabel = 'Admin Users';

    protected static ?string $modelLabel = 'User';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('name')
                ->required()
                ->maxLength(255)
                ->live(onBlur: true)
                ->afterStateUpdated(fn (Set $set, ?string $state) => $set('slug', Str::slug($state))),


            TextInput::make('email')
                ->email()
                ->required()
                ->unique(User::class, 'email', ignoreRecord: true)
                ->maxLength(255),

            TextInput::make('password')
                ->password()
                ->revealable()
                ->dehydrateStateUsing(fn ($state) => Hash::make($state))
                ->dehydrated(fn ($state) => filled($state))
                ->required(fn (string $operation) => $operation === 'create')
                ->helperText(fn (string $operation) => $operation === 'edit' ? 'Leave blank to keep current password.' : null)
                ->maxLength(255),

            Toggle::make('is_author')
                ->label('Is Blog Author')
                ->default(false)
                ->helperText('Enable to allow assigning blog posts to this user and display their public author page.'),

            TextInput::make('slug')
                ->label('Author URL Slug')
                ->maxLength(255)
                ->live(debounce: 500)
                ->unique(User::class, 'slug', ignoreRecord: true)
                ->helperText(fn ($state) => $state ? url('/author/' . $state) : null),


            TextInput::make('designation')
                ->label('Designation / Title')
                ->placeholder('e.g., Senior Trekking Specialist & Travel Writer')
                ->maxLength(255),

            MediaPicker::make('avatar_url')
                ->label('Avatar / Profile Photo')
                ->image()
                ->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
                ->disk('direct_public')
                ->directory('uploads')
                ->visibility('public')
                ->imageEditor(),

            Textarea::make('bio')
                ->label('Author Bio')
                ->rows(4)
                ->placeholder('Write a short bio about the author...')
                ->columnSpanFull(),

            Fieldset::make('Social Links')
                ->schema([
                    TextInput::make('social_links.facebook')
                        ->label('Facebook URL')
                        ->url()
                        ->placeholder('https://facebook.com/username'),
                    TextInput::make('social_links.twitter')
                        ->label('Twitter / X URL')
                        ->url()
                        ->placeholder('https://x.com/username'),
                    TextInput::make('social_links.linkedin')
                        ->label('LinkedIn URL')
                        ->url()
                        ->placeholder('https://linkedin.com/in/username'),
                    TextInput::make('social_links.instagram')
                        ->label('Instagram URL')
                        ->url()
                        ->placeholder('https://instagram.com/username'),
                    TextInput::make('social_links.website')
                        ->label('Personal Website')
                        ->url()
                        ->placeholder('https://example.com'),
                ])
                ->columns(2)
                ->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('avatar_url')
                    ->label('Avatar')
                    ->circular(),

                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('email')
                    ->searchable()
                    ->sortable(),

                IconColumn::make('is_author')
                    ->label('Is Author')
                    ->boolean()
                    ->sortable(),

                TextColumn::make('designation')
                    ->label('Designation')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime('M j, Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListUsers::route('/'),
            'create' => CreateUser::route('/create'),
            'edit'   => EditUser::route('/{record}/edit'),
        ];
    }
}
