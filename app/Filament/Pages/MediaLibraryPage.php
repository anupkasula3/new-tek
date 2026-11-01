<?php

namespace App\Filament\Pages;

use App\Models\Media;
use Filament\Pages\Page;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Livewire\WithFileUploads;
use Livewire\WithPagination;
use Livewire\Attributes\On;
use Filament\Notifications\Notification;
use BackedEnum;

class MediaLibraryPage extends Page
{
    use WithFileUploads, WithPagination;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-photo';

    protected string $view = 'filament.pages.media-library';

    protected static ?string $navigationLabel = 'Media Library';

    protected static ?string $title = 'Media Library';

    protected static ?int $navigationSort = 2;

    public $uploads = [];
    public string $search = '';
    public ?int $selectedMediaId = null;
    public string $editTitle = '';
    public string $editAlt = '';
    
    public function updatingSearch()
    {
        $this->resetPage();
    }

    public function getMediaProperty()
    {
        $query = Media::latest();

        if ($this->search) {
            $query->where(function ($q) {
                $q->where('original_name', 'like', "%{$this->search}%")
                  ->orWhere('title', 'like', "%{$this->search}%")
                  ->orWhere('alt', 'like', "%{$this->search}%");
            });
        }

        return $query->paginate(30);
    }

    public function updatedUploads()
    {
        $this->validate([
            'uploads.*' => 'file|mimes:jpg,jpeg,png,gif,webp,avif,svg,pdf,doc,docx,xls,xlsx,zip,txt|max:20480',
        ]);

        foreach ($this->uploads as $file) {
            $originalName = $file->getClientOriginalName();
            $mimeType     = $file->getMimeType();
            $size         = $file->getSize();
            $ext          = $file->getClientOriginalExtension();
            $basename     = Str::slug(pathinfo($originalName, PATHINFO_FILENAME)) ?: 'file';
            $filename     = $ext ? "{$basename}.{$ext}" : $basename;

            $counter = 1;
            while (Storage::disk('direct_public')->exists("uploads/{$filename}")) {
                $filename = $ext ? "{$basename}-{$counter}.{$ext}" : "{$basename}-{$counter}";
                $counter++;
            }

            $path = $file->storeAs('uploads', $filename, 'direct_public');

            $disk = Storage::disk('direct_public');
            $url  = $disk->url($path);

            $width = $height = null;
            if (str_starts_with($mimeType, 'image/') && !str_contains($mimeType, 'svg')) {
                try {
                    [$width, $height] = getimagesize($file->getRealPath());
                } catch (\Throwable) {}
            }

            Media::create([
                'filename'      => $filename,
                'original_name' => $originalName,
                'path'          => $path,
                'url'           => $url,
                'mime_type'     => $mimeType,
                'size'          => $size,
                'width'         => $width,
                'height'        => $height,
                'title'         => pathinfo($originalName, PATHINFO_FILENAME),
                'alt'           => '',
            ]);
        }

        $this->uploads = [];

        Notification::make()
            ->title('Files uploaded successfully!')
            ->success()
            ->send();
    }

    public function selectMedia(int $id)
    {
        $media = Media::find($id);
        if ($media) {
            $this->selectedMediaId = $id;
            $this->editTitle = $media->title ?? '';
            $this->editAlt = $media->alt ?? '';
        }
    }

    public function getSelectedMediaProperty()
    {
        if ($this->selectedMediaId) {
            return Media::find($this->selectedMediaId);
        }
        return null;
    }

    public function saveMediaDetails()
    {
        $media = Media::find($this->selectedMediaId);
        if ($media) {
            $media->update([
                'title' => $this->editTitle,
                'alt'   => $this->editAlt,
            ]);

            Notification::make()
                ->title('Media details saved.')
                ->success()
                ->send();
        }
    }

    public function deleteMedia(int $id)
    {
        $media = Media::find($id);
        if ($media) {
            Storage::disk('direct_public')->delete($media->path);
            $media->delete();

            if ($this->selectedMediaId === $id) {
                $this->selectedMediaId = null;
                $this->editTitle = '';
                $this->editAlt = '';
            }

            Notification::make()
                ->title('Media deleted.')
                ->success()
                ->send();
        }
    }

    public function closeDetails()
    {
        $this->selectedMediaId = null;
        $this->editTitle = '';
        $this->editAlt = '';
    }

    public function formatFileSize($bytes)
    {
        if (!$bytes) return '—';
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;
        while ($bytes >= 1024 && $i < count($units) - 1) {
            $bytes /= 1024;
            $i++;
        }
        return round($bytes, 1) . ' ' . $units[$i];
    }
}
