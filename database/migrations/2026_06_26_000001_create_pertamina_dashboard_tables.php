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
        // 1. Users Table
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('username')->unique();
            $table->string('password');
            $table->string('role');
            $table->string('fullName');
            $table->string('initials');
            $table->rememberToken();
            $table->timestamps();
        });

        // 2. SCM (Monitoring Kontrak)
        Schema::create('scm', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary(); // Using custom ID from React/CSV imports
            $table->string('nomor', 100)->nullable();
            $table->text('nama')->nullable();
            $table->string('vendor', 200)->nullable();
            $table->unsignedBigInteger('nilai')->default(0);
            $table->string('mulai', 50)->nullable();
            $table->string('selesai', 50)->nullable();
            $table->integer('progres')->default(0);
            $table->string('status', 50)->nullable();
            $table->string('fungsi', 50)->nullable();
            $table->timestamps();
        });

        // 3. MOM (Minutes of Meeting Issues)
        Schema::create('mom', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->string('fungsi', 50)->nullable();
            $table->text('isu')->nullable();
            $table->text('tindak_lanjut')->nullable();
            $table->string('status', 50)->nullable();
            $table->string('statusColor', 100)->nullable();
            $table->text('feedback')->nullable();
            $table->timestamps();
        });

        // 4. Calendar Events
        Schema::create('calendar_events', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->string('title', 255)->nullable();
            $table->text('description')->nullable();
            $table->string('category', 50)->nullable();
            $table->string('date', 50)->nullable();
            $table->timestamps();
        });

        // 5. HC Personnel Mutations
        Schema::create('hc_mutations', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->string('bulan', 50)->nullable();
            $table->string('nama', 200)->nullable();
            $table->string('jenis', 50)->nullable();
            $table->string('fungsi', 50)->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 6. HC TAD Workers List
        Schema::create('hc_tad', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->string('nama', 200)->nullable();
            $table->string('peran', 100)->nullable();
            $table->string('vendor', 200)->nullable();
            $table->string('status', 50)->nullable();
            $table->timestamps();
        });

        // 7. HC Retired Workers List
        Schema::create('hc_retired', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->string('nama', 200)->nullable();
            $table->string('jabatan', 100)->nullable();
            $table->integer('tahun')->nullable();
            $table->string('tanggal', 50)->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 8. Alat Berat (Heavy Machinery)
        Schema::create('alat_berat', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->string('nopol', 50)->nullable();
            $table->string('tahun', 50)->nullable();
            $table->string('jenis', 100)->nullable();
            $table->string('alokasi', 100)->nullable();
            $table->string('merk', 100)->nullable();
            $table->string('model', 100)->nullable();
            $table->string('stnk', 50)->nullable();
            $table->string('pajak', 50)->nullable();
            $table->string('kir', 50)->nullable();
            $table->string('status', 50)->nullable();
            $table->text('kondisi')->nullable();
            $table->timestamps();
        });

        // 9. Perbaikan (Housing & Office Repair)
        Schema::create('perbaikan', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->string('lokasi', 200)->nullable();
            $table->text('pekerjaan')->nullable();
            $table->unsignedBigInteger('estimasi')->default(0);
            $table->unsignedBigInteger('realisasi')->default(0);
            $table->string('status', 50)->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // 10. Lembur TAD (TAD Overtime Logs)
        Schema::create('lembur_tad', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->string('nopok', 50)->nullable();
            $table->string('nama', 200)->nullable();
            $table->string('jabatan', 100)->nullable();
            $table->string('fungsi', 50)->nullable();
            $table->unsignedBigInteger('upah')->default(0);
            $table->double('jamLembur')->default(0);
            $table->unsignedBigInteger('lemburVal')->default(0);
            $table->string('periode', 50)->nullable();
            $table->timestamps();
        });

        // 11. Budget Details (ABI/ABO Details)
        Schema::create('budget_details', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->string('fundCent', 50)->nullable();
            $table->string('name', 200)->nullable();
            $table->string('commitItem', 50)->nullable();
            $table->text('text')->nullable();
            $table->unsignedBigInteger('budget')->default(0);
            $table->unsignedBigInteger('consumed')->default(0);
            $table->unsignedBigInteger('actual')->default(0);
            $table->bigInteger('available')->default(0);
            $table->string('kategori', 50)->nullable();
            $table->timestamps();
        });

        // 12. Stok (Stock Inventory)
        Schema::create('stok', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->string('nama', 200)->nullable();
            $table->string('fungsi', 50)->nullable();
            $table->integer('masuk')->default(0);
            $table->integer('keluar')->default(0);
            $table->integer('saldo')->default(0);
            $table->string('status', 50)->nullable();
            $table->timestamps();
        });

        // 13. Arsip (Digital Documents)
        Schema::create('arsip', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->string('nomor', 100)->nullable();
            $table->text('nama')->nullable();
            $table->string('kategori', 100)->nullable();
            $table->string('tanggal', 50)->nullable();
            $table->text('file_path')->nullable();
            $table->string('uploaded_by', 100)->nullable();
            $table->timestamps();
        });

        // 14. Assets (IT Assets)
        Schema::create('assets', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->string('nama', 200)->nullable();
            $table->string('kategori', 100)->nullable();
            $table->string('brand', 100)->nullable();
            $table->string('serial', 100)->nullable();
            $table->string('lokasi', 100)->nullable();
            $table->string('status', 50)->nullable();
            $table->timestamps();
        });

        // 15. Upload Archive (Import History Logs)
        Schema::create('upload_archive', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->string('filename', 255)->nullable();
            $table->string('fileSize', 50)->nullable();
            $table->string('type', 100)->nullable();
            $table->string('timestamp', 100)->nullable();
            $table->integer('rowCount')->default(0);
            $table->string('uploadedBy', 100)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('upload_archive');
        Schema::dropIfExists('assets');
        Schema::dropIfExists('arsip');
        Schema::dropIfExists('stok');
        Schema::dropIfExists('budget_details');
        Schema::dropIfExists('lembur_tad');
        Schema::dropIfExists('perbaikan');
        Schema::dropIfExists('alat_berat');
        Schema::dropIfExists('hc_retired');
        Schema::dropIfExists('hc_tad');
        Schema::dropIfExists('hc_mutations');
        Schema::dropIfExists('calendar_events');
        Schema::dropIfExists('mom');
        Schema::dropIfExists('scm');
        Schema::dropIfExists('users');
    }
};
