<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('media')) {
            DB::table('media')
                ->where('url', 'like', '%lightskyblue-hyena-667273.hostingersite.com%')
                ->update([
                    'url' => DB::raw("REPLACE(url, 'lightskyblue-hyena-667273.hostingersite.com', 'himalayantrekking.com')")
                ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('media')) {
            DB::table('media')
                ->where('url', 'like', '%himalayantrekking.com%')
                ->update([
                    'url' => DB::raw("REPLACE(url, 'himalayantrekking.com', 'lightskyblue-hyena-667273.hostingersite.com')")
                ]);
        }
    }
};
