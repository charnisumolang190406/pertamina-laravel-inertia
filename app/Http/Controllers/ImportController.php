<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Scm;
use App\Models\Stok;
use App\Models\LemburTad;
use App\Models\BudgetDetail;
use App\Models\AlatBerat;
use App\Models\Perbaikan;
use App\Models\HcMutation;
use App\Models\TadMutation;
use App\Models\Asset;
use App\Models\Arsip;
use App\Models\UploadArchive;
use App\Models\Mom;

class ImportController extends Controller
{
    public function import(Request $request)
    {
        $request->validate([
            'type' => 'required|string',
            'rows' => 'required|array',
            'filename' => 'required|string',
            'fileSize' => 'required|string',
        ]);

        $type = $request->input('type');
        $rows = $request->input('rows');
        $filename = $request->input('filename');
        $fileSize = $request->input('fileSize');
        $user = auth()->user();

        DB::beginTransaction();
        try {
            $insertedCount = 0;

            foreach ($rows as $row) {
                $uniqueId = (int)(microtime(true) * 1000) + $insertedCount + rand(100, 999);
                switch ($type) {
                    case 'scm':
                        Scm::create([
                            'id' => $uniqueId,
                            'nomor' => $row['nomor'] ?? ('KTR-' . time() . '-' . rand(100, 999)),
                            'nama' => $row['nama'] ?? 'Kontrak Tanpa Nama',
                            'vendor' => $row['vendor'] ?? 'PT Vendor',
                            'nilai' => intval($row['nilai'] ?? 0),
                            'mulai' => $row['mulai'] ?? date('Y-m-d'),
                            'selesai' => $row['selesai'] ?? date('Y-m-d'),
                            'progres' => intval($row['progres'] ?? 0),
                            'status' => $row['status'] ?? 'Aktif',
                            'fungsi' => $row['fungsi'] ?? 'BS',
                        ]);
                        $insertedCount++;
                        break;

                    case 'logistik':
                        Stok::create([
                            'id' => $uniqueId,
                            'item_number' => $row['item_number'] ?? ('MAT-' . time() . '-' . rand(10, 99)),
                            'deskripsi' => $row['deskripsi'] ?? 'Deskripsi Material',
                            'uom' => $row['uom'] ?? 'PCS',
                            'stok' => intval($row['stok'] ?? 0),
                            'kategori' => $row['kategori'] ?? 'Fast Moving',
                            'lokasi' => $row['lokasi'] ?? 'Gudang Utama LHD',
                        ]);
                        $insertedCount++;
                        break;

                    case 'lembur_tad':
                        LemburTad::create([
                            'id' => $uniqueId,
                            'nopok' => $row['nopok'] ?? '-',
                            'nama' => $row['nama'] ?? 'Pekerja TAD',
                            'jabatan' => $row['jabatan'] ?? 'Staff',
                            'fungsi' => $row['fungsi'] ?? 'BUSINESS SUPPORT',
                            'upah' => intval($row['upah'] ?? 0),
                            'jamLembur' => floatval($row['jamLembur'] ?? $row['jam_lembur'] ?? 0),
                            'lemburVal' => intval($row['lemburVal'] ?? $row['lembur_val'] ?? 0),
                            'periode' => $row['periode'] ?? date('F Y'),
                        ]);
                        $insertedCount++;
                        break;

                    case 'budget_detail':
                        BudgetDetail::create([
                            'id' => $uniqueId,
                            'fundCent' => $row['fundCent'] ?? ('LHD-' . rand(1000, 9999)),
                            'name' => $row['name'] ?? 'Pos Anggaran Baru',
                            'commitItem' => $row['commitItem'] ?? '500000',
                            'text' => $row['text'] ?? 'Item Deskripsi',
                            'budget' => intval($row['budget'] ?? 0),
                            'consumed' => intval($row['consumed'] ?? 0),
                            'actual' => intval($row['actual'] ?? 0),
                            'available' => intval($row['available'] ?? 0),
                            'kategori' => $row['kategori'] ?? 'ABO',
                        ]);
                        $insertedCount++;
                        break;

                    case 'alat_berat':
                        AlatBerat::create([
                            'id' => $uniqueId,
                            'jenis' => $row['jenis'] ?? 'Forklift',
                            'nopol' => $row['nopol'] ?? '-',
                            'expired_kir' => $row['expired_kir'] ?? date('Y-m-d'),
                            'expired_stnk' => $row['expired_stnk'] ?? date('Y-m-d'),
                            'expired_sio' => $row['expired_sio'] ?? date('Y-m-d'),
                            'expired_sia' => $row['expired_sia'] ?? date('Y-m-d'),
                            'status' => $row['status'] ?? 'Optimal',
                        ]);
                        $insertedCount++;
                        break;

                    case 'perbaikan_rumdin':
                        Perbaikan::create([
                            'id' => $uniqueId,
                            'nomor_rumah' => $row['nomor_rumah'] ?? 'N-00',
                            'estimasi' => intval($row['estimasi'] ?? 0),
                            'realisasi' => intval($row['realisasi'] ?? 0),
                            'progress' => intval($row['progress'] ?? 0),
                            'keterangan' => $row['keterangan'] ?? 'Perbaikan Umum',
                        ]);
                        $insertedCount++;
                        break;

                    case 'hc':
                        HcMutation::create([
                            'id' => $uniqueId,
                            'bulan' => $row['bulan'] ?? date('F Y'),
                            'nama' => $row['nama'] ?? 'Pegawai Baru',
                            'jenis' => $row['jenis'] ?? 'Masuk',
                            'fungsi' => $row['fungsi'] ?? 'BS',
                            'keterangan' => $row['keterangan'] ?? '-',
                        ]);
                        $insertedCount++;
                        break;

                    case 'tad_mutation':
                        TadMutation::create([
                            'id' => $uniqueId,
                            'bulan' => $row['bulan'] ?? date('F Y'),
                            'nama' => $row['nama'] ?? 'Pegawai TAD',
                            'jenis' => $row['jenis'] ?? 'Masuk',
                            'peran' => $row['peran'] ?? 'Staff',
                            'vendor' => $row['vendor'] ?? '-',
                            'keterangan' => $row['keterangan'] ?? '-',
                        ]);
                        $insertedCount++;
                        break;

                    case 'it_asset':
                        Asset::create([
                            'id' => $uniqueId,
                            'nomor_seri' => $row['nomor_seri'] ?? ('SN-' . time() . '-' . rand(10, 99)),
                            'jenis' => $row['jenis'] ?? 'PC Workstation',
                            'merek' => $row['merek'] ?? 'HP',
                            'user' => $row['user'] ?? 'Staff BS',
                            'fungsi' => $row['fungsi'] ?? 'BS',
                            'status' => $row['status'] ?? 'Optimal',
                        ]);
                        $insertedCount++;
                        break;

                    case 'mom':
                        Mom::create([
                            'id' => $uniqueId,
                            'fungsi' => $row['fungsi'] ?? 'BS',
                            'isu' => $row['isu'] ?? 'Isu Baru',
                            'tindak_lanjut' => $row['tindak_lanjut'] ?? 'Rencana Tindak Lanjut',
                            'status' => 'Menunggu Review',
                            'statusColor' => 'bg-yellow-100 text-yellow-800',
                            'feedback' => null,
                        ]);
                        $insertedCount++;
                        break;
                }
            }

            // --- AUTOMATION: AUTO-ARCHIVE FILE ---
            // Determine archive category based on upload type
            $archiveCategory = 'Umum';
            if ($type === 'scm') {
                $archiveCategory = 'Kontrak & SCM';
            } elseif ($type === 'mom') {
                $archiveCategory = 'MOM Rapat';
            } elseif (in_array($type, ['hc', 'lembur_tad', 'tad_mutation'])) {
                $archiveCategory = 'Laporan Bulanan';
            }

            Arsip::create([
                'id' => (int)(microtime(true) * 1000) + rand(1000, 9999),
                'nomor' => 'DOC-' . time() . '-' . rand(10, 99),
                'nama' => $filename,
                'kategori' => $archiveCategory,
                'tanggal' => date('Y-m-d'),
                'file_path' => '#', // Simulated virtual local path
                'uploaded_by' => $user->name,
            ]);

            // Save Upload Log
            UploadArchive::create([
                'id' => (int)(microtime(true) * 1000) + rand(1000, 9999),
                'filename' => $filename,
                'fileSize' => $fileSize,
                'type' => strtoupper($type) . ' Import (' . $insertedCount . ' Baris)',
                'timestamp' => date('d-m-Y H:i:s'),
                'rowCount' => $insertedCount,
                'uploaded_by' => $user->name,
            ]);

            DB::commit();
            return redirect()->back()->with('success', 'Data sebanyak ' . $insertedCount . ' baris berhasil diimpor & otomatis diarsipkan!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal mengimpor data: ' . $e->getMessage());
        }
    }
}
