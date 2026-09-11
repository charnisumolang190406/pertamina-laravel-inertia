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
        if (!Schema::hasTable('ict_maintenances')) {
            Schema::create('ict_maintenances', function (Blueprint $table) {
                $table->id();
                $table->string('kegiatan');
                $table->integer('tahun')->default(2026);
                $table->integer('bulan'); // 1 - 12
                $table->integer('minggu'); // 1 - 4
                $table->string('tipe'); // 'rencana' | 'realisasi'
                $table->string('status')->default('Terjadwal'); // 'Terjadwal' | 'Selesai' | 'Tertunda'
                $table->text('keterangan')->nullable();
                $table->timestamps();

                $table->index(['kegiatan', 'tahun', 'bulan', 'minggu', 'tipe']);
            });
        }

        if (!Schema::hasTable('ict_services')) {
            Schema::create('ict_services', function (Blueprint $table) {
                $table->id();
                $table->string('bulan', 10)->default('06');
                $table->integer('tahun')->default(2026);
                $table->string('kategori'); // Jaringan, multimedia, printer, sound, Komputer, server
                $table->integer('jumlah')->default(0);
                $table->text('keterangan')->nullable();
                $table->string('sumber_url')->nullable();
                $table->timestamps();

                $table->index(['bulan', 'tahun', 'kategori']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ict_maintenances');
        Schema::dropIfExists('ict_services');
    }
};
