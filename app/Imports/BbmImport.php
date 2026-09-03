<?php

namespace App\Imports;

use App\Models\BbmStock;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithCalculatedFormulas;

class BbmImport implements ToCollection, WithCalculatedFormulas
{
    /**
    * @param Collection $collection
    */
    public function collection(Collection $rows)
    {
        $months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        
        foreach ($rows as $index => $row) {
            // Excel row is $index + 1
            // We start reading from row 6 (index 5)
            if ($index < 5) {
                continue;
            }

            $col0 = isset($row[0]) ? trim((string)$row[0]) : '';
            $col1 = isset($row[1]) ? trim((string)$row[1]) : '';

            \Illuminate\Support\Facades\Log::info("BBM Import Row $index: col0='$col0', col1='$col1'");

            // The 'JUMLAH' row marks the end of 'Pemakaian Operasional'
            if (stripos($col0, 'JUMLAH') !== false || stripos($col1, 'JUMLAH') !== false) {
                break; // Stop parsing the rest of the file
            }

            $bulan = $col1;

            // If it's a valid month, process it
            if (in_array($bulan, $months)) {
                $stock_awal_solar = (float)($row[2] ?? 0);
                $penerimaan_solar = (float)($row[3] ?? 0);
                $pengeluaran_ag_solar = (float)($row[4] ?? 0);
                $pengeluaran_proyek_solar = (float)($row[5] ?? 0);
                $stock_akhir_solar = (float)($row[6] ?? 0);

                BbmStock::updateOrCreate(
                    ['bulan' => $bulan],
                    [
                        'stock_awal_solar' => $stock_awal_solar,
                        'penerimaan_solar' => $penerimaan_solar,
                        'pengeluaran_ag_solar' => $pengeluaran_ag_solar,
                        'pengeluaran_proyek_solar' => $pengeluaran_proyek_solar,
                        'stock_akhir_solar' => $stock_akhir_solar,
                    ]
                );
            }
        }
    }
}
