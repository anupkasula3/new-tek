<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('packageables', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('package_id');
            $table->morphs('packageable'); // packageable_id + packageable_type
            $table->timestamps();

            $table->foreign('package_id')
                  ->references('id')
                  ->on('packages')
                  ->onDelete('cascade');

            $table->unique(['package_id', 'packageable_id', 'packageable_type'], 'packageables_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('packageables');
    }
};
