<?php

namespace Database\Seeders;

use App\Models\BbmStock;
use Illuminate\Database\Seeder;

class BbmStockSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'bulan' => 'Januari',
                'stock_awal_solar' => 5987,
                'penerimaan_solar' => 16000,
                'pengeluaran_ag_solar' => 5974,
                'pengeluaran_proyek_solar' => 0,
                'stock_akhir_solar' => 15993,
            ],
            [
                'bulan' => 'Februari',
                'stock_awal_solar' => 15993,
                'penerimaan_solar' => 0,
                'pengeluaran_ag_solar' => 13346,
                'pengeluaran_proyek_solar' => 0,
                'stock_akhir_solar' => 2647,
            ],
            [
                'bulan' => 'Maret',
                'stock_awal_solar' => 2647,
                'penerimaan_solar' => 0,
                'pengeluaran_ag_solar' => 0,
                'pengeluaran_proyek_solar' => 0,
                'stock_akhir_solar' => 2647,
            ],
            [
                'bulan' => 'April',
                'stock_awal_solar' => 2647,
                'penerimaan_solar' => 16000,
                'pengeluaran_ag_solar' => 11226,
                'pengeluaran_proyek_solar' => 0,
                'stock_akhir_solar' => 7421,
            ],
            [
                'bulan' => 'Mei',
                'stock_awal_solar' => 7421,
                'penerimaan_solar' => 8000,
                'pengeluaran_ag_solar' => 1646,
                'pengeluaran_proyek_solar' => 0,
                'stock_akhir_solar' => 13775,
            ]
        ];

        foreach ($data as $item) {
            BbmStock::create($item);
        }
    }
}
