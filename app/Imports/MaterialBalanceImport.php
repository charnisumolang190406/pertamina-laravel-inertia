<?php

namespace App\Imports;

use App\Models\MaterialBalance;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithCalculatedFormulas;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class MaterialBalanceImport implements WithMultipleSheets
{
    protected array $sheetNames;

    public function __construct(array $sheetNames = [])
    {
        $this->sheetNames = $sheetNames;
    }

    public function sheets(): array
    {
        if (empty($this->sheetNames)) {
            return [
                0 => new SingleMaterialSheetImport('SOH', true),
                1 => new SingleMaterialSheetImport('2YSP', false),
            ];
        }

        $sheets = [];
        $isFirst = true;

        foreach ($this->sheetNames as $index => $name) {
            $upper = strtoupper(trim($name));
            $kategori = (str_contains($upper, '2YSP') || str_contains($upper, 'SPARE')) ? '2YSP' : 'SOH';

            // Match by sheet title
            $sheets[$name] = new SingleMaterialSheetImport($kategori, $isFirst);
            $isFirst = false;
        }

        return $sheets;
    }
}

class SingleMaterialSheetImport implements ToCollection, WithCalculatedFormulas
{
    protected $defaultKategori;
    protected $shouldClear;

    public function __construct($defaultKategori = 'SOH', $shouldClear = false)
    {
        $this->defaultKategori = $defaultKategori;
        $this->shouldClear = $shouldClear;
    }

    public function collection(Collection $rows)
    {
        if ($this->shouldClear) {
            // Bersihkan data lama saat memproses sheet pertama
            MaterialBalance::query()->delete();
        }

        $detectedPeriode = 'Juli 2026';
        $currentKategori = $this->defaultKategori;

        // Ambil ID tertinggi yang sudah ada di DB agar ID tetap unik
        $startId = (int)(MaterialBalance::max('id') ?? 0) + 1;

        foreach ($rows as $index => $row) {
            $rowArray = $row->toArray();
            $fullRowText = strtoupper(trim(implode(' ', array_filter(array_map('strval', $rowArray)))));

            if (empty($fullRowText)) {
                continue;
            }

            // Deteksi periode di header
            if (preg_match('/PER\s+(\d{1,2}\s+[A-Za-z]+\s+\d{4})/i', $fullRowText, $matches)) {
                $detectedPeriode = trim($matches[1]);
            }

            // Deteksi kategori dari judul sheet/header
            if (str_contains($fullRowText, '2 YEARS SPARE PART') || str_contains($fullRowText, '2YSP')) {
                $currentKategori = '2YSP';
            } elseif (str_contains($fullRowText, 'STOCK ON HAND') || str_contains($fullRowText, 'SOH')) {
                $currentKategori = 'SOH';
            }

            // Lewati baris judul, header kolom, subheader abjad formula, baris total, dan baris tanda tangan
            if (
                str_contains($fullRowText, 'MATERIAL BALANCE') ||
                str_contains($fullRowText, 'GEOTHERMAL ENERGY') ||
                str_contains($fullRowText, 'KIMAP DESCRIPTION') ||
                str_contains($fullRowText, 'STORAGE LOCATION') ||
                str_contains($fullRowText, 'PHYSICAL CHECK') ||
                str_contains($fullRowText, 'TOTAL') ||
                str_contains($fullRowText, 'TIM PEMERIKSAAN') ||
                str_contains($fullRowText, 'OFFICER II') ||
                str_contains($fullRowText, 'ANALYST II') ||
                str_contains($fullRowText, 'MENGETAHUI') ||
                str_contains($fullRowText, 'AST. MAN. LOGISTIK') ||
                str_contains($fullRowText, 'LAHENDONG,')
            ) {
                continue;
            }

            // Baca kolom-kolom tabel
            $col0 = trim((string)($row[0] ?? '')); // No
            $kimap = trim((string)($row[1] ?? '')); // KIMAP
            $deskripsi = trim((string)($row[2] ?? '')); // KIMAP DESCRIPTION
            $plant = trim((string)($row[3] ?? 'E003')); // PLANT
            $storageLoc = trim((string)($row[4] ?? '')); // STORAGE LOCATION
            $uom = trim((string)($row[5] ?? '')); // UOM

            // Cek jika baris bukan data material (KIMAP harus ada atau No numerik)
            if (empty($kimap) && empty($deskripsi)) {
                continue;
            }

            // Abaikan baris sub-header formula seperti a, b, c, d, e, f, g...
            if (strtoupper($kimap) === 'B' || strtoupper($deskripsi) === 'C' || strtoupper($uom) === 'F') {
                continue;
            }

            // Angka-angka stok
            $stockAwal = is_numeric($row[6] ?? null) ? (float)$row[6] : 0;
            $masuk = is_numeric($row[7] ?? null) ? (float)$row[7] : 0;
            $keluar = is_numeric($row[8] ?? null) ? (float)$row[8] : 0;
            
            // Stock akhir dihitung jika kosong
            $stockAkhir = is_numeric($row[9] ?? null) ? (float)$row[9] : ($stockAwal + $masuk - $keluar);
            $physicalCheck = is_numeric($row[10] ?? null) ? (float)$row[10] : $stockAkhir;
            $selisihPhysical = is_numeric($row[11] ?? null) ? (float)$row[11] : ($physicalCheck - $stockAkhir);
            $qtyMysap = is_numeric($row[12] ?? null) ? (float)$row[12] : $physicalCheck;
            $selisihMysap = is_numeric($row[13] ?? null) ? (float)$row[13] : ($physicalCheck - $qtyMysap);
            $binloc = trim((string)($row[14] ?? '-'));

            // Deteksi kategori spesifik dari storage location
            $kategori = $this->defaultKategori;
            if (strtoupper($storageLoc) === '2YSP' || str_contains(strtoupper($storageLoc), 'SPARE')) {
                $kategori = '2YSP';
            } elseif (strtoupper($storageLoc) === 'LHD1' || str_contains(strtoupper($storageLoc), 'SOH')) {
                $kategori = 'SOH';
            }

            MaterialBalance::create([
                'id' => $startId++,
                'kimap' => mb_substr($kimap ?: '-', 0, 50),
                'deskripsi' => $deskripsi ?: '-',
                'plant' => mb_substr($plant ?: 'E003', 0, 20),
                'storage_location' => mb_substr($storageLoc ?: ($kategori === '2YSP' ? '2YSP' : 'LHD1'), 0, 50),
                'uom' => mb_substr($uom ?: 'PCS', 0, 20),
                'stock_awal' => $stockAwal,
                'masuk' => $masuk,
                'keluar' => $keluar,
                'stock_akhir' => $stockAkhir,
                'physical_check' => $physicalCheck,
                'selisih_physical' => $selisihPhysical,
                'qty_mysap' => $qtyMysap,
                'selisih_mysap' => $selisihMysap,
                'binloc' => mb_substr($binloc ?: '-', 0, 50),
                'kategori' => $kategori,
                'periode' => mb_substr($detectedPeriode, 0, 50),
            ]);
        }
    }
}
