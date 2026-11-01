<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Post;

class AuthorController extends Controller
{
    /**
     * List all active blog authors.
     */
    public function index()
    {
        $authors = User::where('is_author', true)
            ->select('id', 'name', 'slug', 'designation', 'bio', 'avatar_url', 'social_links')
            ->withCount(['posts as posts_count' => function ($q) {
                $q->where('status', 'published');
            }])
            ->orderByDesc('posts_count')
            ->get();

        return response()->json($authors);
    }

    /**
     * Show a single author's profile and their published posts.
     */
    public function show(string $slug)
    {
        $author = User::where('slug', $slug)
            ->where('is_author', true)
            ->select('id', 'name', 'slug', 'designation', 'bio', 'avatar_url', 'social_links')
            ->firstOrFail();

        $posts = Post::with([
                'categories:id,name,slug',
                'tags:id,name,slug',
            ])
            ->where('author_id', $author->id)
            ->where('status', 'published')
            ->latest('published_at')
            ->paginate(12);

        return response()->json([
            'author' => $author,
            'posts'  => $posts,
        ]);
    }
}
