<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('name');
            $table->string('designation')->nullable()->after('email');
            $table->text('bio')->nullable()->after('designation');
            $table->json('social_links')->nullable()->after('bio');
            $table->boolean('is_author')->default(false)->after('social_links');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['slug', 'designation', 'bio', 'social_links', 'is_author']);
        });
    }
};
