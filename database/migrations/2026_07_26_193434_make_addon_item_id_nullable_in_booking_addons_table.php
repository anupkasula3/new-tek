<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('booking_addons', function (Blueprint $table) {
            $table->dropForeign(['addon_item_id']);
            $table->foreignId('addon_item_id')->nullable()->change();
            $table->foreign('addon_item_id')->references('id')->on('addon_items')->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('booking_addons', function (Blueprint $table) {
            $table->dropForeign(['addon_item_id']);
            $table->foreignId('addon_item_id')->nullable(false)->change();
            $table->foreign('addon_item_id')->references('id')->on('addon_items')->restrictOnDelete();
        });
    }
};
