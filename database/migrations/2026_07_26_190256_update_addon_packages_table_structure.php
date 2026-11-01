<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('addon_packages', function (Blueprint $table) {
            // Add columns directly to addon_packages
            $table->decimal('price', 10, 2)->default(0)->after('description');
            $table->json('images')->nullable()->after('price');
            $table->string('badge')->nullable()->after('images');
            $table->string('short_label')->nullable()->after('badge');
            
            // Add min and max columns for selection/quantity configuration
            $table->integer('min_qty')->default(0)->after('short_label');
            $table->integer('max_qty')->default(1)->after('min_qty');

            // Drop column is_required as we can use min_qty >= 1 to determine if it is required
            if (Schema::hasColumn('addon_packages', 'is_required')) {
                $table->dropColumn('is_required');
            }
        });
    }

    public function down(): void
    {
        Schema::table('addon_packages', function (Blueprint $table) {
            $table->boolean('is_required')->default(false)->after('selection_type');
            $table->dropColumn(['price', 'images', 'badge', 'short_label', 'min_qty', 'max_qty']);
        });
    }
};
