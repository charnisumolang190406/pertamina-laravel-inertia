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
        Schema::create('bbm_stocks', function (Blueprint $table) {
            $table->id();
            $table->string('bulan');
            
            // Solar
            $table->decimal('stock_awal_solar', 10, 3)->nullable();
            $table->decimal('penerimaan_solar', 10, 3)->nullable();
            $table->decimal('pengeluaran_ag_solar', 10, 3)->nullable();
            $table->decimal('pengeluaran_proyek_solar', 10, 3)->nullable();
            $table->decimal('stock_akhir_solar', 10, 3)->nullable();
            
            // Premium (just placeholders in case they use it)
            $table->decimal('stock_awal_premium', 10, 3)->nullable();
            $table->decimal('penerimaan_premium', 10, 3)->nullable();
            $table->decimal('pengeluaran_premium', 10, 3)->nullable();
            $table->decimal('stock_akhir_premium', 10, 3)->nullable();
            
            $table->string('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bbm_stocks');
    }
};
