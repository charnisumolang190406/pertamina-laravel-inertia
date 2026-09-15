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
        Schema::create('material_balances', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->string('kimap', 50)->nullable()->index();
            $table->text('deskripsi')->nullable();
            $table->string('plant', 20)->default('E003')->nullable();
            $table->string('storage_location', 50)->nullable();
            $table->string('uom', 20)->nullable();
            $table->double('stock_awal')->default(0);
            $table->double('masuk')->default(0);
            $table->double('keluar')->default(0);
            $table->double('stock_akhir')->default(0);
            $table->double('physical_check')->default(0);
            $table->double('selisih_physical')->default(0);
            $table->double('qty_mysap')->default(0);
            $table->double('selisih_mysap')->default(0);
            $table->string('binloc', 50)->nullable();
            $table->string('kategori', 20)->default('SOH')->index(); // SOH or 2YSP
            $table->string('periode', 50)->default('Juli 2026')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('material_balances');
    }
};
