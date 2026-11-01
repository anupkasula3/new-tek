<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();

            // Core
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('content')->nullable();
            $table->text('excerpt')->nullable();
            $table->longText('overview')->nullable();
            $table->string('featured_image')->nullable();
             $table->unsignedInteger('reading_time')->nullable();
            $table->string('author')->nullable();

            // Status / Publishing
            $table->enum('status', ['draft', 'published', 'scheduled', 'private'])->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();

            // Editorial / UX
            $table->boolean('is_featured')->default(false);
            $table->boolean('sticky')->default(false);
            $table->unsignedInteger('view_count')->default(0);
            $table->boolean('comment_enabled')->default(true);

            // SEO Meta
            $table->string('meta_title')->nullable();          // ~60 chars
            $table->text('meta_description')->nullable();      // ~160 chars
            $table->string('canonical_url')->nullable();

            // Robots
            $table->boolean('noindex')->default(false);
            $table->boolean('nofollow')->default(false);

            // Open Graph
            $table->string('og_title')->nullable();
            $table->text('og_description')->nullable();
            $table->string('og_image')->nullable();

            // Twitter
            $table->enum('twitter_card', ['summary', 'summary_large_image'])->default('summary_large_image');
            $table->string('twitter_title')->nullable();
            $table->text('twitter_description')->nullable();
            $table->string('twitter_image')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'published_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
