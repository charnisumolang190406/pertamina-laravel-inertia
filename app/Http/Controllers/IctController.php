<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\IctMaintenance;
use App\Models\IctService;
use App\Models\UploadArchive;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class IctController extends Controller
{
    /**
     * Helper to calculate ICT aggregations in PHP backend
     */
    public static function getCalculatedStats()
    {
        // ─── 1. ICT SERVICE AGGREGATION ───
        $services = IctService::where('tahun', 2026)->where('bulan', '06')->get();
        if ($services->isEmpty()) {
            $services = IctService::where('tahun', 2026)->get();
        }

        $totalTickets = (int) $services->sum('jumlah');
        $highestCategory = $services->sortByDesc('jumlah')->first();
        
        // Breakdown categories
        $categoryBreakdown = [];
        foreach ($services as $srv) {
            $categoryBreakdown[$srv->kategori] = (int) $srv->jumlah;
        }

        // ─── 2. ICT MAINTENANCE AGGREGATION ───
        $maintenances = IctMaintenance::where('tahun', 2026)->get();

        // Semester 1 (Bulan 1 - 6)
        $s1Rencana = $maintenances->where('tipe', 'rencana')->whereBetween('bulan', [1, 6])->count();
        $s1Realisasi = $maintenances->where('tipe', 'realisasi')->whereBetween('bulan', [1, 6])->count();
        $s1AchievementRate = $s1Rencana > 0 ? round(($s1Realisasi / $s1Rencana) * 100, 1) : 100.0;

        // Full Year (Bulan 1 - 12)
        $fullRencana = $maintenances->where('tipe', 'rencana')->count();
        $fullRealisasi = $maintenances->where('tipe', 'realisasi')->count();
        $fullAchievementRate = $fullRencana > 0 ? round(($fullRealisasi / $fullRencana) * 100, 1) : 0.0;

        // Activity breakdown
        $activities = [
            'Minor Maintenance Server',
            'Major Maintenance Server',
            'PABX dan Jaringan Telp',
            'Jaringan LAN & Internet'
        ];

        $activityStats = [];
        foreach ($activities as $act) {
            $planS1 = $maintenances->where('kegiatan', $act)->where('tipe', 'rencana')->whereBetween('bulan', [1, 6])->count();
            $realS1 = $maintenances->where('kegiatan', $act)->where('tipe', 'realisasi')->whereBetween('bulan', [1, 6])->count();
            $activityStats[$act] = [
                'planS1' => $planS1,
                'realS1' => $realS1,
                'rateS1' => $planS1 > 0 ? round(($realS1 / $planS1) * 100, 1) : 100,
            ];
        }

        return [
            'totalTickets' => $totalTickets,
            'highestCategory' => $highestCategory ? $highestCategory->kategori : '-',
            'highestCategoryCount' => $highestCategory ? (int) $highestCategory->jumlah : 0,
            'categoryBreakdown' => $categoryBreakdown,
            's1Rencana' => $s1Rencana,
            's1Realisasi' => $s1Realisasi,
            's1AchievementRate' => $s1AchievementRate,
            'fullRencana' => $fullRencana,
            'fullRealisasi' => $fullRealisasi,
            'fullAchievementRate' => $fullAchievementRate,
            'activityStats' => $activityStats,
        ];
    }

    /**
     * Update an ICT service ticket count
     */
    public function updateService(Request $request)
    {
        $request->validate([
            'kategori' => 'required|string',
            'jumlah' => 'required|integer|min:0',
            'bulan' => 'nullable|string',
            'tahun' => 'nullable|integer',
        ]);

        $bulan = $request->input('bulan', '06');
        $tahun = (int) $request->input('tahun', 2026);
        $kategori = $request->input('kategori');
        $jumlah = (int) $request->input('jumlah');

        IctService::updateOrCreate(
            [
                'kategori' => $kategori,
                'bulan' => $bulan,
                'tahun' => $tahun,
            ],
            [
                'jumlah' => $jumlah,
                'keterangan' => 'Diperbarui oleh ' . (auth()->user()->fullName ?? 'Admin ICT'),
            ]
        );

        return redirect()->back()->with('success', "Data Layanan '{$kategori}' berhasil diperbarui menjadi {$jumlah} tiket.");
    }

    /**
     * Batch update or import ICT Service from form/wizard
     */
    public function importService(Request $request)
    {
        $request->validate([
            'items' => 'nullable|array',
            'file' => 'nullable|mimes:xlsx,xls,csv|max:10240',
        ]);

        $bulan = $request->input('bulan', '06');
        $tahun = (int) $request->input('tahun', 2026);
        $updatedCount = 0;

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $data = \Maatwebsite\Excel\Facades\Excel::toArray([], $file);

            if (!empty($data) && !empty($data[0])) {
                $rows = $data[0];
                // Check if first row is header
                $startIndex = 0;
                if (isset($rows[0][0]) && in_array(strtolower(trim($rows[0][0])), ['kategori', 'category', 'no', 'bulan'])) {
                    $startIndex = 1;
                }

                for ($i = $startIndex; $i < count($rows); $i++) {
                    $row = $rows[$i];
                    if (empty($row[0])) continue;

                    // Support format: Kategori, Jumlah OR Bulan, Tahun, Kategori, Jumlah
                    if (is_numeric($row[0])) {
                        // Might be: No, Kategori, Jumlah
                        $kat = trim($row[1] ?? '');
                        $jml = intval($row[2] ?? 0);
                    } elseif (count($row) >= 4 && is_numeric($row[1])) {
                        // Bulan, Tahun, Kategori, Jumlah
                        $kat = trim($row[2] ?? '');
                        $jml = intval($row[3] ?? 0);
                    } else {
                        // Kategori, Jumlah
                        $kat = trim($row[0] ?? '');
                        $jml = intval($row[1] ?? 0);
                    }

                    if (!empty($kat)) {
                        IctService::updateOrCreate(
                            ['kategori' => $kat, 'bulan' => $bulan, 'tahun' => $tahun],
                            ['jumlah' => $jml, 'keterangan' => 'Import file Excel']
                        );
                        $updatedCount++;
                    }
                }
            }

            UploadArchive::create([
                'id' => (int)(microtime(true) * 1000) + rand(100, 999),
                'filename' => $file->getClientOriginalName(),
                'fileSize' => round($file->getSize() / 1024, 2) . ' KB',
                'type' => 'ICT_SERVICE Import',
                'timestamp' => date('d-m-Y H:i:s'),
                'rowCount' => $updatedCount,
                'uploaded_by' => auth()->user()->fullName ?? 'Admin ICT',
            ]);

            return redirect()->back()->with('success', "Berhasil mengimpor {$updatedCount} data kategori ICT Service.");
        }

        // Direct items array submitted
        if ($request->has('items') && is_array($request->input('items'))) {
            foreach ($request->input('items') as $item) {
                if (isset($item['kategori'])) {
                    IctService::updateOrCreate(
                        ['kategori' => $item['kategori'], 'bulan' => $bulan, 'tahun' => $tahun],
                        ['jumlah' => intval($item['jumlah'] ?? 0)]
                    );
                    $updatedCount++;
                }
            }
            return redirect()->back()->with('success', "Berhasil memperbarui {$updatedCount} data layanan ICT.");
        }

        return redirect()->back()->with('error', 'Tidak ada data layanan ICT yang dapat diproses.');
    }

    /**
     * Toggle or set ICT Maintenance week cell
     */
    public function toggleMaintenance(Request $request)
    {
        $request->validate([
            'kegiatan' => 'required|string',
            'bulan' => 'required|integer|between:1,12',
            'minggu' => 'required|integer|between:1,4',
            'tipe' => 'required|in:rencana,realisasi',
            'active' => 'required|boolean',
        ]);

        $kegiatan = $request->input('kegiatan');
        $bulan = (int) $request->input('bulan');
        $minggu = (int) $request->input('minggu');
        $tipe = $request->input('tipe');
        $active = (bool) $request->input('active');
        $tahun = 2026;

        if ($active) {
            IctMaintenance::updateOrCreate(
                [
                    'kegiatan' => $kegiatan,
                    'tahun' => $tahun,
                    'bulan' => $bulan,
                    'minggu' => $minggu,
                    'tipe' => $tipe,
                ],
                [
                    'status' => $tipe === 'realisasi' ? 'Selesai' : 'Terjadwal',
                    'keterangan' => 'Diperbarui via Dashboard oleh ' . (auth()->user()->fullName ?? 'Admin ICT'),
                ]
            );
            $msg = "Jadwal {$tipe} '{$kegiatan}' (Bulan {$bulan}, Minggu {$minggu}) berhasil diaktifkan.";
        } else {
            IctMaintenance::where('kegiatan', $kegiatan)
                ->where('tahun', $tahun)
                ->where('bulan', $bulan)
                ->where('minggu', $minggu)
                ->where('tipe', $tipe)
                ->delete();
            $msg = "Jadwal {$tipe} '{$kegiatan}' (Bulan {$bulan}, Minggu {$minggu}) berhasil dihapus.";
        }

        return redirect()->back()->with('success', $msg);
    }

    /**
     * Download template CSV for ICT Service or Maintenance
     */
    public function downloadTemplate($type)
    {
        if ($type === 'service') {
            $headers = [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="template_ict_service.csv"',
            ];

            $callback = function () {
                $file = fopen('php://output', 'w');
                fputcsv($file, ['Bulan', 'Tahun', 'Kategori', 'Jumlah', 'Keterangan']);
                fputcsv($file, ['06', '2026', 'Jaringan', '3', 'Penanganan switch & konektivitas']);
                fputcsv($file, ['06', '2026', 'multimedia', '8', 'Pengaturan proyektor & vicon']);
                fputcsv($file, ['06', '2026', 'printer', '3', 'Refill toner & paper jam']);
                fputcsv($file, ['06', '2026', 'sound', '8', 'Setup sound meeting & aula']);
                fputcsv($file, ['06', '2026', 'Komputer', '5', 'Instalasi & perbaikan PC user']);
                fputcsv($file, ['06', '2026', 'server', '6', 'Cek storage, backup & suhu rack']);
                fclose($file);
            };

            return response()->stream($callback, 200, $headers);
        }

        if ($type === 'maintenance') {
            $headers = [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="template_ict_maintenance.csv"',
            ];

            $callback = function () {
                $file = fopen('php://output', 'w');
                fputcsv($file, ['Nama Kegiatan', 'Tahun', 'Bulan (1-12)', 'Minggu (1-4)', 'Tipe (rencana/realisasi)', 'Status', 'Keterangan']);
                fputcsv($file, ['Minor Maintenance Server', '2026', '1', '1', 'rencana', 'Terjadwal', 'Pembersihan rutin']);
                fputcsv($file, ['Minor Maintenance Server', '2026', '1', '1', 'realisasi', 'Selesai', 'Selesai normal']);
                fputcsv($file, ['Major Maintenance Server', '2026', '2', '3', 'rencana', 'Terjadwal', 'Backup full']);
                fputcsv($file, ['PABX dan Jaringan Telp', '2026', '1', '1', 'rencana', 'Terjadwal', 'Cek line internal']);
                fputcsv($file, ['Jaringan LAN & Internet', '2026', '1', '4', 'realisasi', 'Selesai', 'FO & bandwidth optimal']);
                fclose($file);
            };

            return response()->stream($callback, 200, $headers);
        }

        return redirect()->back()->with('error', 'Tipe template tidak ditemukan.');
    }
}
