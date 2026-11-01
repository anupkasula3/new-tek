<?php
namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Post;

class PostController extends Controller
{

    public function show()
    {
        $posts = Post::with([
            'seoMeta',
            'categories:id,name,slug',
            'tags:id,name,slug',
            'author:id,name,slug,avatar_url,designation,bio,social_links',
        ])
            ->where('status', 'published')
            ->latest('published_at')
            ->paginate(30);

        return response()->json($posts);
    }

    public function index($slug)
    {
        $post = Post::with([
            'seoMeta',
            'categories:id,name,slug',
            'tags:id,name,slug',
            'author:id,name,slug,avatar_url,designation,bio,social_links',
        ])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();
        return response()->json($post);
    }
}
