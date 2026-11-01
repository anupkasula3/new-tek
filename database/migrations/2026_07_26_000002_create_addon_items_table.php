<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('addon_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('addon_package_id')->constrained('addon_packages')->cascadeOnDelete();
            $table->string('heading');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2)->default(0);
            $table->json('images')->nullable();
            $table->string('badge')->nullable();
            $table->string('short_label')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('addon_items');
    }
};
