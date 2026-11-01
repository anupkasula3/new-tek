<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    public function index(Request $request)
    {
        $query = Media::latest();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('original_name', 'like', "%{$search}%")
                  ->orWhere('title', 'like', "%{$search}%")
                  ->orWhere('alt', 'like', "%{$search}%");
            });
        }

        if ($type = $request->input('type')) {
            $query->where('mime_type', 'like', "{$type}%");
        }

        $perPage = (int) $request->input('per_page', 30);
        return response()->json($query->paginate($perPage));
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,gif,webp,avif,svg,pdf,doc,docx,xls,xlsx,zip,txt|max:20480',
        ]);

        $file         = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $mimeType     = $file->getMimeType();
        $size         = $file->getSize();

        $ext      = $file->getClientOriginalExtension();
        $basename = Str::slug(pathinfo($originalName, PATHINFO_FILENAME)) ?: 'file';
        $filename = $ext ? "{$basename}.{$ext}" : $basename;

        $counter = 1;
        while (Storage::disk('direct_public')->exists("uploads/{$filename}")) {
            $filename = $ext ? "{$basename}-{$counter}.{$ext}" : "{$basename}-{$counter}";
            $counter++;
        }

        // Store in uploads/ using the direct_public disk
        $path = $file->storeAs('uploads', $filename, 'direct_public');

        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk('direct_public');
        $url = $disk->url($path);

        $width = $height = null;
        if (str_starts_with($mimeType, 'image/') && !str_contains($mimeType, 'svg')) {
            try {
                [$width, $height] = getimagesize($file->getPathname());
            } catch (\Throwable) {}
        }

        $media = Media::create([
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

        return response()->json($media, 201);
    }

    public function update(Request $request, Media $media)
    {
        $data = $request->validate([
            'alt'   => 'nullable|string|max:500',
            'title' => 'nullable|string|max:255',
        ]);

        $media->update($data);
        return response()->json($media);
    }

    public function destroy(Media $media)
    {
        Storage::disk('direct_public')->delete($media->path);
        $media->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
