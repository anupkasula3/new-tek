<?php

namespace App\Filament\Components;

use Filament\Forms\Components\Field;

class MediaPicker extends Field
{
    protected string $view = 'filament.components.media-picker';

    // Mock methods for compatibility with FileUpload API calls in existing forms
    
    public function image(): static
    {
        return $this;
    }

    public function acceptedFileTypes(array $types): static
    {
        return $this;
    }

    public function disk(string $disk): static
    {
        return $this;
    }

    public function directory(string $directory): static
    {
        return $this;
    }

    public function visibility(string $visibility): static
    {
        return $this;
    }

    public function imagePreviewHeight(string|int|callable $height): static
    {
        return $this;
    }

    public function imageEditor(): static
    {
        return $this;
    }

    protected function setUp(): void
    {
        parent::setUp();
    }
}
