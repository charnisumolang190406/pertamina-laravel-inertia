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
        Schema::table('scm', function (Blueprint $table) {
            $table->string('tindak_lanjut')->nullable()->after('selesai');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('scm', function (Blueprint $table) {
            $table->dropColumn('tindak_lanjut');
        });
    }
};
