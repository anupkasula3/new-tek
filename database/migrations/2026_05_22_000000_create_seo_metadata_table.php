<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seo_metadata', function (Blueprint $table) {
            $table->id();

            // Polymorphic morphs: seoable_id & seoable_type
            $table->morphs('seoable');

            // SEO Fields
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->text('seo_keywords')->nullable();
            $table->string('focus_keyword')->nullable();
            $table->string('slug')->nullable();
            $table->string('canonical_url')->nullable();
            $table->string('meta_robots')->default('index, follow');

            // Open Graph / Facebook
            $table->string('og_title')->nullable();
            $table->text('og_description')->nullable();
            $table->string('og_image')->nullable();

            // Twitter / X
            $table->string('twitter_title')->nullable();
            $table->text('twitter_description')->nullable();
            $table->string('twitter_image')->nullable();

            // Schema & Indexing
            $table->string('schema_type')->nullable()->default('WebPage');
            $table->boolean('is_indexable')->default(true);
            $table->boolean('is_followable')->default(true);

            // Sitemap Fields
            $table->decimal('sitemap_priority', 3, 2)->default(0.80);
            $table->string('sitemap_frequency')->default('daily');
            $table->timestamp('lastmod')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seo_metadata');
    }
};
