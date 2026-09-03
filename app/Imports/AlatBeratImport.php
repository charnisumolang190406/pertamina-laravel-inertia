<?php

namespace App\Imports;

use App\Models\AlatBerat;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithCalculatedFormulas;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class AlatBeratImport implements ToCollection, WithCalculatedFormulas
{
    public function collection(Collection $rows)
    {
        // Clear existing data to replace with new data (standard for this system)
        AlatBerat::truncate();

        foreach ($rows as $index => $row) {
            // Data starts at row 7 (index 6)
            if ($index < 6) {
                continue;
            }

            // If column 'NO' (index 0) and 'JENIS KENDARAAN' (index 3) are empty, skip or break
            if (empty($row[0]) && empty($row[3])) {
                continue; // It might be an empty row in the middle, or end of file
            }

            $nopol = isset($row[1]) ? trim((string)$row[1]) : '-';
            $tahun = isset($row[2]) ? trim((string)$row[2]) : null;
            $jenis = isset($row[3]) ? trim((string)$row[3]) : 'Unknown';
            $alokasi = isset($row[4]) ? trim((string)$row[4]) : null;
            $merk = isset($row[5]) ? trim((string)$row[5]) : null;
            $model = isset($row[6]) ? trim((string)$row[6]) : null;
            
            // Format dates. They might be numeric Excel dates or strings like '30-Aug-27'
            $stnk = $this->parseDate($row[7] ?? null);
            $pajak = $this->parseDate($row[8] ?? null);
            $kir = $this->parseDate($row[9] ?? null);
            $status = isset($row[10]) ? trim((string)$row[10]) : 'Optimal';
            $kondisi = isset($row[11]) ? trim((string)$row[11]) : null;

            AlatBerat::create([
                'id' => 'AB-' . uniqid(),
                'nopol' => $nopol ?: '-',
                'tahun' => $tahun,
                'jenis' => $jenis,
                'alokasi' => $alokasi,
                'merk' => $merk,
                'model' => $model,
                'stnk' => $stnk,
                'pajak' => $pajak,
                'kir' => $kir,
                'status' => $status,
                'kondisi' => $kondisi,
            ]);
        }
    }

    private function parseDate($value)
    {
        if (empty($value) || $value === '-') {
            return null;
        }

        try {
            // Check if it's a numeric Excel date serial
            if (is_numeric($value)) {
                return Date::excelToDateTimeObject($value)->format('Y-m-d');
            }

            // Otherwise try parsing the string (e.g. '30-Aug-27')
            $timestamp = strtotime($value);
            if ($timestamp !== false) {
                return date('Y-m-d', $timestamp);
            }
        } catch (\Exception $e) {
            // Fallback if parsing fails
        }

        return null;
    }
}
