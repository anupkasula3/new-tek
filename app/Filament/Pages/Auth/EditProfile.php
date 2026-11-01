<?php

namespace App\Filament\Pages\Auth;

use Filament\Auth\Pages\EditProfile as BaseEditProfile;
use App\Filament\Components\MediaPicker;
use Filament\Forms\Components\Component;
use Filament\Schemas\Schema;
use Filament\Actions\Action;

class EditProfile extends BaseEditProfile
{
    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
            MediaPicker::make('avatar_url')
            ->label('Avatar')
            ->image()->acceptedFileTypes(['image/*', 'image/webp', 'image/avif'])
            ->disk('direct_public')
            ->directory('uploads')
            ->visibility('public')
            ->helperText('Recommended size: 200x200px (square).') ,
            $this->getNameFormComponent(),
            $this->getEmailFormComponent(),
            $this->getPasswordFormComponent(),
            $this->getPasswordConfirmationFormComponent(),
            $this->getCurrentPasswordFormComponent(),
        ])
            ->extraAttributes([
            'class' => 'profile-wrapper',
        ]);
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('clear_cache')
                ->label('Clear Cache')
                ->icon('heroicon-o-arrow-path')
                ->color('gray')
                ->url(route('admin.clear-cache')),
        ];
    }
}
