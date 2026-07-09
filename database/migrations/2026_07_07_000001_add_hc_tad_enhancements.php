<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hc_retired', function (Blueprint $table) {
            $table->unsignedTinyInteger('umur_pensiun')->nullable()->after('jabatan');
        });

        Schema::create('tad_mutations', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->string('bulan', 50)->nullable();
            $table->string('nama', 200)->nullable();
            $table->string('jenis', 50)->nullable();
            $table->string('peran', 100)->nullable();
            $table->string('vendor', 200)->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tad_mutations');

        Schema::table('hc_retired', function (Blueprint $table) {
            $table->dropColumn('umur_pensiun');
        });
    }
};
