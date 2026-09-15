<?php

namespace App\Imports;

use App\Models\AlatBerat;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithCalculatedFormulas;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class AlatBeratImport implements WithMultipleSheets
{
    /**
     * Pastikan HANYA sheet pertama (indeks 0 - data Alat Berat & KRP) yang diproses.
     * Sheet kedua (PANDUAN_PENGISIAN) tidak akan dibaca agar tidak terjadi tabrakan baris teks panduan.
     */
    public function sheets(): array
    {
        return [
            0 => new AlatBeratDataSheetImport(),
        ];
    }
}

class AlatBeratDataSheetImport implements ToCollection, WithCalculatedFormulas
{
    public function collection(Collection $rows)
    {
        // Bersihkan data lama dengan query delete (aman di dalam DB transaction MySQL)
        AlatBerat::query()->delete();

        $currentKategori = 'Alat Berat';
        $itemCounter = 1;

        foreach ($rows as $index => $row) {
            $rowArray = $row->toArray();
            $fullRowText = strtoupper(trim(implode(' ', array_filter(array_map('strval', $rowArray)))));

            if (empty($fullRowText)) {
                continue;
            }

            // Abaikan baris panduan, instruksi, atau keterangan jika ada
            if (
                str_contains($fullRowText, 'PANDUAN') ||
                str_contains($fullRowText, 'KETERANGAN & FORMAT') ||
                str_contains($fullRowText, 'PILIHAN CONTOH') ||
                str_contains($fullRowText, 'LOKASI / FUNGSI PEMAKAI') ||
                str_contains($fullRowText, 'FORMAT PENGISIAN') ||
                str_contains($fullRowText, 'NOMOR POLISI RESMI')
            ) {
                continue;
            }

            // Deteksi header bagian
            if (str_contains($fullRowText, 'DAFTAR KRP') || str_contains($fullRowText, 'KONTRAK PT BLP') || str_contains($fullRowText, 'KRP KONTRAK')) {
                $currentKategori = 'KRP';
                continue;
            }
            if (str_contains($fullRowText, 'DAFTAR ALAT BERAT') || str_contains($fullRowText, 'ASET-PGE LHD')) {
                $currentKategori = 'Alat Berat';
                continue;
            }

            // Abaikan header tabel
            if (str_contains($fullRowText, 'NOMOR POLISI') || str_contains($fullRowText, 'JENIS KENDARAAN') || str_contains($fullRowText, 'MASA BERLAKU')) {
                continue;
            }

            // Baca kolom
            $col0 = trim((string)($row[0] ?? ''));
            $col1 = trim((string)($row[1] ?? '')); // NOPOL
            $col2 = trim((string)($row[2] ?? '')); // TAHUN
            $col3 = trim((string)($row[3] ?? '')); // JENIS
            $col4 = trim((string)($row[4] ?? '')); // ALOKASI
            $col5 = trim((string)($row[5] ?? '')); // MERK
            $col6 = trim((string)($row[6] ?? '')); // MODEL

            // Jika kosong semua identifier utamanya, lewati
            if (!is_numeric($col0) && empty($col1) && empty($col3) && empty($col5) && empty($col6)) {
                continue;
            }

            // Jika col1 adalah kalimat panjang penjelasan bukan nomor plat/unit
            if (mb_strlen($col1) > 40 && (str_contains($col1, ' ') && (str_contains($col1, 'PGE') || str_contains($col1, 'LHD') || str_contains($col1, 'kendaraan') || str_contains($col1, 'unit')))) {
                continue;
            }

            $nopol = !empty($col1) ? $col1 : '-';
            $tahun = !empty($col2) ? $col2 : null;
            $jenis = !empty($col3) ? $col3 : ($currentKategori === 'KRP' ? 'HARIAN' : 'Alat Berat');
            $alokasi = !empty($col4) ? $col4 : null;
            $merk = !empty($col5) ? $col5 : null;
            $model = !empty($col6) ? $col6 : null;

            // Smart detection kategori jika header bagian tidak terbaca
            $kategori = $currentKategori;
            $upperModel = strtoupper((string)$model);
            $upperJenis = strtoupper((string)$jenis);
            if (
                str_contains($upperModel, 'FORTUNER') || str_contains($upperModel, 'INNOVA') ||
                str_contains($upperModel, 'HILUX') || str_contains($upperModel, 'HIACE') ||
                str_contains($upperModel, 'DYNA') || str_contains($upperModel, 'AVANZA') ||
                $upperJenis === 'HARIAN' || $upperJenis === 'SHIFT'
            ) {
                $kategori = 'KRP';
            } elseif (
                str_contains($upperJenis, 'CRANE') || str_contains($upperJenis, 'FORKLIFT') ||
                str_contains($upperJenis, 'TMC') || str_contains($upperJenis, 'EXCAVATOR')
            ) {
                $kategori = 'Alat Berat';
            }

            // Format tanggal
            $stnk = $this->parseDate($row[7] ?? null);
            $pajak = $this->parseDate($row[8] ?? null);
            $kir = $this->parseDate($row[9] ?? null);
            $rawStatus = isset($row[10]) ? trim((string)$row[10]) : '';
            $kondisi = isset($row[11]) ? trim((string)$row[11]) : null;

            // Cek status otomatis jika kosong atau strip
            $status = $rawStatus;
            if (empty($status) || $status === '-') {
                $today = date('Y-m-d');
                if (($pajak && $pajak < $today) || ($stnk && $stnk < $today) || ($kir && $kir < $today)) {
                    $status = 'PAJAK MATI';
                } else {
                    $status = 'AMAN';
                }
            }

            AlatBerat::create([
                'id' => $itemCounter,
                'nopol' => mb_substr($nopol ?: '-', 0, 100),
                'tahun' => mb_substr($tahun ?: '-', 0, 50),
                'jenis' => mb_substr($jenis ?: 'Alat Berat', 0, 150),
                'kategori' => mb_substr($kategori ?: 'Alat Berat', 0, 50),
                'alokasi' => mb_substr($alokasi ?: '-', 0, 255),
                'merk' => mb_substr($merk ?: '-', 0, 150),
                'model' => mb_substr($model ?: '-', 0, 150),
                'stnk' => $stnk,
                'pajak' => $pajak,
                'kir' => $kir,
                'status' => mb_substr($status ?: 'AMAN', 0, 50),
                'kondisi' => $kondisi ?: '-',
            ]);

            $itemCounter++;
        }
    }

    private function parseDate($value)
    {
        if (empty($value) || $value === '-' || $value === '--') {
            return null;
        }

        try {
            // Jika tanggal adalah numeric serial Excel
            if (is_numeric($value)) {
                return Date::excelToDateTimeObject((float)$value)->format('Y-m-d');
            }

            // Format string seperti '30-Aug-27' atau '2026-08-30'
            $cleanVal = trim((string)$value);
            $timestamp = strtotime($cleanVal);
            if ($timestamp !== false && $timestamp > 0) {
                return date('Y-m-d', $timestamp);
            }

            // Format d/m/Y atau d-m-Y
            if (preg_match('/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/', $cleanVal, $matches)) {
                $year = strlen($matches[3]) == 2 ? '20' . $matches[3] : $matches[3];
                return sprintf('%04d-%02d-%02d', $year, $matches[2], $matches[1]);
            }
        } catch (\Exception $e) {
            // Fallback
        }

        return null;
    }
}
