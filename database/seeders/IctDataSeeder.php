<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\IctMaintenance;
use App\Models\IctService;

class IctDataSeeder extends Seeder
{
    public function run(): void
    {
        // ─── 1. SEED ICT SERVICE (LAPORAN JUNI 2026) ───
        $services = [
            ['kategori' => 'Jaringan', 'jumlah' => 3],
            ['kategori' => 'multimedia', 'jumlah' => 8],
            ['kategori' => 'printer', 'jumlah' => 3],
            ['kategori' => 'sound', 'jumlah' => 8],
            ['kategori' => 'Komputer', 'jumlah' => 5],
            ['kategori' => 'server', 'jumlah' => 6],
        ];

        foreach ($services as $srv) {
            IctService::updateOrCreate(
                [
                    'kategori' => $srv['kategori'],
                    'bulan' => '06',
                    'tahun' => 2026,
                ],
                [
                    'jumlah' => $srv['jumlah'],
                    'keterangan' => 'Laporan Bulanan Rekap Layanan ICT',
                    'sumber_url' => 'http://ptmpgewebapp2.pertamina.com/portal/it/rekap.php?bulan=06&th=2026&button=Submit',
                ]
            );
        }

        // ─── 2. SEED JADWAL MAINTENANCE ICT 2026 ───
        $maintenances = [];

        // 1. Minor Maintenance Server
        for ($m = 1; $m <= 12; $m++) {
            $maintenances[] = ['kegiatan' => 'Minor Maintenance Server', 'bulan' => $m, 'minggu' => 1, 'tipe' => 'rencana', 'status' => 'Terjadwal'];
        }
        $minorReal = [
            [1, 1], [1, 4],
            [2, 2], [2, 4],
            [3, 1], [3, 3],
            [4, 1], [4, 3],
            [5, 2], [5, 4],
            [6, 2], [6, 4],
        ];
        foreach ($minorReal as $r) {
            $maintenances[] = ['kegiatan' => 'Minor Maintenance Server', 'bulan' => $r[0], 'minggu' => $r[1], 'tipe' => 'realisasi', 'status' => 'Selesai'];
        }

        // 2. Major Maintenance Server
        $majorPlan = [
            [2, 3], [3, 3], [4, 3], [6, 3], [8, 2], [10, 2], [12, 2]
        ];
        foreach ($majorPlan as $p) {
            $maintenances[] = ['kegiatan' => 'Major Maintenance Server', 'bulan' => $p[0], 'minggu' => $p[1], 'tipe' => 'rencana', 'status' => 'Terjadwal'];
        }
        $majorReal = [
            [2, 3], [3, 3], [4, 3], [6, 3]
        ];
        foreach ($majorReal as $r) {
            $maintenances[] = ['kegiatan' => 'Major Maintenance Server', 'bulan' => $r[0], 'minggu' => $r[1], 'tipe' => 'realisasi', 'status' => 'Selesai'];
        }

        // 3. PABX dan Jaringan Telp
        for ($m = 1; $m <= 12; $m++) {
            $maintenances[] = ['kegiatan' => 'PABX dan Jaringan Telp', 'bulan' => $m, 'minggu' => 1, 'tipe' => 'rencana', 'status' => 'Terjadwal'];
            $maintenances[] = ['kegiatan' => 'PABX dan Jaringan Telp', 'bulan' => $m, 'minggu' => 3, 'tipe' => 'rencana', 'status' => 'Terjadwal'];
        }
        $pabxReal = [
            [1, 1], [1, 4],
            [3, 2], [3, 4],
            [4, 2], [4, 4],
            [5, 2], [5, 4],
            [6, 2], [6, 4],
        ];
        foreach ($pabxReal as $r) {
            $maintenances[] = ['kegiatan' => 'PABX dan Jaringan Telp', 'bulan' => $r[0], 'minggu' => $r[1], 'tipe' => 'realisasi', 'status' => 'Selesai'];
        }

        // 4. Jaringan LAN & Internet
        for ($m = 1; $m <= 12; $m++) {
            $maintenances[] = ['kegiatan' => 'Jaringan LAN & Internet', 'bulan' => $m, 'minggu' => 4, 'tipe' => 'rencana', 'status' => 'Terjadwal'];
        }
        $lanReal = [
            [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4]
        ];
        foreach ($lanReal as $r) {
            $maintenances[] = ['kegiatan' => 'Jaringan LAN & Internet', 'bulan' => $r[0], 'minggu' => $r[1], 'tipe' => 'realisasi', 'status' => 'Selesai'];
        }

        foreach ($maintenances as $item) {
            IctMaintenance::updateOrCreate(
                [
                    'kegiatan' => $item['kegiatan'],
                    'tahun' => 2026,
                    'bulan' => $item['bulan'],
                    'minggu' => $item['minggu'],
                    'tipe' => $item['tipe'],
                ],
                [
                    'status' => $item['status'],
                    'keterangan' => 'Laporan Bulanan Pemeliharaan ICT 2026',
                ]
            );
        }
    }
}
