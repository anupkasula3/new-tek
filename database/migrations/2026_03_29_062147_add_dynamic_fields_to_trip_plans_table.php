<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('trip_plans', function (Blueprint $table) {
            $table->dropColumn('destination');
            $table->foreignId('destination_id')->nullable()->constrained()->onDelete('set null')->after('package_id');
            $table->foreignId('experience_id')->nullable()->constrained()->onDelete('set null')->after('destination_id');
            $table->foreignId('trek_id')->nullable()->constrained()->onDelete('set null')->after('experience_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('trip_plans', function (Blueprint $table) {
            $table->string('destination')->after('phone');
            $table->dropForeign(['destination_id']);
            $table->dropColumn('destination_id');
            $table->dropForeign(['experience_id']);
            $table->dropColumn('experience_id');
            $table->dropForeign(['trek_id']);
            $table->dropColumn('trek_id');
        });
    }
};
