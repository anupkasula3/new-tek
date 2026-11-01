<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('packages', function (Blueprint $table) {
            $table->id();

            // Basic Info
            $table->string('title');
            $table->string('slug')->unique();

            // Location & Category
            $table->string('country')->default('Nepal');
            $table->string('region')->nullable();
            $table->string('category')->nullable();

            // Key Facts
            $table->integer('distance_km')->nullable();// 130
            // Pricing & Difficulty
            $table->decimal('price', 10, 2);
            $table->string('difficulty');              // Challenging

            // Main Content
            $table->longText('experience');

            // Media
            $table->string('featured_image')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->string('status')->default('draft'); // draft, published, scheduled, private
            $table->timestamp('published_at')->nullable();
            $table->boolean('sticky')->default(false);

            // SEO
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('canonical_url')->nullable();
            $table->boolean('noindex')->default(false);


            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};

