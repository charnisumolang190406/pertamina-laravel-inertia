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
        DB::statement('ALTER TABLE alat_berat MODIFY nopol VARCHAR(100) NULL, MODIFY alokasi VARCHAR(255) NULL, MODIFY jenis VARCHAR(150) NULL, MODIFY merk VARCHAR(150) NULL, MODIFY model VARCHAR(150) NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE alat_berat MODIFY nopol VARCHAR(50) NULL, MODIFY alokasi VARCHAR(100) NULL, MODIFY jenis VARCHAR(100) NULL, MODIFY merk VARCHAR(100) NULL, MODIFY model VARCHAR(100) NULL');
    }
};
