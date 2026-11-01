<?php

namespace App\Console\Commands;

use App\Models\Media;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class SyncMediaLibrary extends Command
{
    protected $signature   = 'media:sync';
    protected $description = 'Sync files in public/uploads into the media table';

    public function handle(): void
    {
        $disk  = Storage::disk('direct_public');
        $files = $disk->files('uploads');
        $count = 0;

        foreach ($files as $path) {
            $filename = basename($path);
            $ext      = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

            $mime = match ($ext) {
                'jpg', 'jpeg' => 'image/jpeg',
                'png'         => 'image/png',
                'gif'         => 'image/gif',
                'webp'        => 'image/webp',
                'avif'        => 'image/avif',
                'svg'         => 'image/svg+xml',
                'pdf'         => 'application/pdf',
                default       => 'application/octet-stream',
            };

            $url  = env('APP_URL') . '/' . $path;
            $size = $disk->size($path);

            $w = $h = null;
            if (str_starts_with($mime, 'image/') && $mime !== 'image/svg+xml') {
                try {
                    [$w, $h] = getimagesize(public_path($path));
                } catch (\Throwable) {}
            }

            Media::firstOrCreate(
                ['path' => $path],
                [
                    'filename'      => $filename,
                    'original_name' => $filename,
                    'url'           => $url,
                    'mime_type'     => $mime,
                    'size'          => $size,
                    'width'         => $w,
                    'height'        => $h,
                    'title'         => pathinfo($filename, PATHINFO_FILENAME),
                    'alt'           => '',
                ]
            );
            $count++;
        }

        $this->info("Synced {$count} files. DB total: " . Media::count());
    }
}
