<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Post;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ImportWordPressBlogs extends Command
{
    protected $signature = 'import:blogs';
    protected $description = 'Import blog posts from posts.sql';

    public function handle()
    {
        $filePath = base_path('parsed_blogs.json');
        if (!file_exists($filePath)) {
            $this->error('parsed_blogs.json not found. Please run the python parser first.');
            return;
        }

        $jsonContent = file_get_contents($filePath);
        $blogs = json_decode($jsonContent, true);

        if (!$blogs) {
            $this->error('Failed to parse the JSON file.');
            return;
        }

        $count = 0;

        foreach ($blogs as $blog) {
            $this->info("Importing: " . $blog['title']);
            
            $publishedAt = null;
            try {
                $publishedAt = Carbon::parse($blog['date']);
            } catch (\Exception $e) {
                $publishedAt = now();
            }

            $baseSlug = $blog['slug'] ?: Str::slug($blog['title']);
            $slug = $baseSlug;
            $counter = 1;

            while (Post::withTrashed()->where('slug', $slug)->exists()) {
                // If it already exists, we want to update it, unless we are trying to insert a distinct post with the same slug.
                // Wait, if it exists, let's just find it and update it.
                $existingPost = Post::withTrashed()->where('slug', $slug)->first();
                // However if the title is different, maybe it's a completely different post?
                // Let's just update the existing one if it matches exactly, otherwise generate new slug.
                if ($existingPost && $existingPost->title == $blog['title']) {
                    break;
                }
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }

            // Restore if soft deleted
            $postToUpdate = Post::withTrashed()->where('slug', $slug)->first();
            if ($postToUpdate && $postToUpdate->trashed()) {
                $postToUpdate->restore();
            }

            Post::updateOrCreate(
                ['slug' => $slug],
                [
                    'title' => $blog['title'],
                    'overview' => $blog['overview'],
                    'excerpt' => $blog['excerpt'],
                    'status' => 'published',
                    'published_at' => $publishedAt,
                    'author' => 'Admin',
                    'reading_time' => 5,
                    'featured_image' => 'uploads/default-blog.png',
                ]
            );
            $count++;
        }

        $this->info("Successfully imported $count blog posts.");
    }
}
