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
use App\Models\HcTad;
use App\Models\HcRetired;
use App\Models\Employee;
use App\Models\FinancialPerformance;
use App\Models\BbmStock;

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
            $baseId = (int)(microtime(true) * 1000) * 1000; // Shift to avoid overlap with existing ids, leaving room for sequential addition

            // Jika tipe datanya adalah MASTER, kita bersihkan dulu tabel lamanya agar menimpa data baru
            // Menggunakan delete() alih-alih truncate() karena truncate() memutus DB::beginTransaction() di MySQL
            if ($type === 'master_organik') {
                Employee::query()->delete();
            } elseif ($type === 'master_tad') {
                HcTad::query()->delete();
            } elseif ($type === 'master_pensiun') {
                HcRetired::query()->delete();
            } elseif ($type === 'alat_berat') {
                AlatBerat::query()->delete();
            }

            foreach ($rows as $row) {
                $uniqueId = $baseId + $insertedCount;
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
                        $upah = intval($row['upah'] ?? 0);
                        $jamLembur = floatval($row['jamLembur'] ?? $row['jam_lembur'] ?? 0);
                        $customVal = intval($row['lembur_val'] ?? $row['lemburVal'] ?? 0);
                        // Hitung nilai lembur secara otomatis jika tidak disediakan di Excel (Rumus baku: (Upah / 173) * Jam Lembur)
                        $calculatedLemburVal = $customVal > 0 ? $customVal : round(($upah / 173) * $jamLembur);
                        $nopok = trim($row['nopok'] ?? '-');
                        $nama = trim($row['nama'] ?? 'Pekerja TAD');
                        $periode = trim($row['periode'] ?? date('F Y'));

                        $existing = ($nopok !== '-' && !empty($nopok))
                            ? LemburTad::where('nopok', $nopok)->where('periode', $periode)->first()
                            : LemburTad::where('nama', $nama)->where('periode', $periode)->first();

                        if ($existing) {
                            $existing->update([
                                'nama' => $nama,
                                'jabatan' => $row['jabatan'] ?? 'Staff',
                                'fungsi' => $row['fungsi'] ?? 'BUSINESS SUPPORT',
                                'upah' => $upah,
                                'jamLembur' => $jamLembur,
                                'lemburVal' => $calculatedLemburVal,
                            ]);
                        } else {
                            LemburTad::create([
                                'id' => $uniqueId,
                                'nopok' => $nopok,
                                'nama' => $nama,
                                'jabatan' => $row['jabatan'] ?? 'Staff',
                                'fungsi' => $row['fungsi'] ?? 'BUSINESS SUPPORT',
                                'upah' => $upah,
                                'jamLembur' => $jamLembur,
                                'lemburVal' => $calculatedLemburVal,
                                'periode' => $periode,
                            ]);
                        }
                        $insertedCount++;
                        break;

                    case 'budget_detail':
                        BudgetDetail::create([
                            'id' => $uniqueId,
                            'fundCent' => $row['fundCent'] ?? ('LHD-' . rand(1000, 9999)),
                            'fungsi' => $row['fungsi'] ?? null,
                            'name' => $row['name'] ?? 'Pos Anggaran Baru',
                            'commitItem' => $row['commitItem'] ?? '500000',
                            'text' => $row['text'] ?? 'Item Deskripsi',
                            'budget' => intval($row['budget'] ?? 0),
                            'consumed' => intval($row['consumed'] ?? 0),
                            'commitment' => intval($row['commitment'] ?? 0),
                            'actual' => intval($row['actual'] ?? 0),
                            'available' => intval($row['available'] ?? 0),
                            'kategori' => $row['kategori'] ?? 'ABO',
                        ]);
                        $insertedCount++;
                        break;

                    case 'alat_berat':
                        // Helper to parse excel dates
                        $parseDate = function($value) {
                            if (empty($value)) return null;
                            if (is_numeric($value)) {
                                return \Carbon\Carbon::instance(\PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($value))->format('Y-m-d');
                            }
                            try {
                                return \Carbon\Carbon::parse($value)->format('Y-m-d');
                            } catch (\Exception $e) {
                                return null;
                            }
                        };
                        
                        $jenis = trim($row['jenis'] ?? 'Unknown');
                        $nopol = trim($row['nopol'] ?? '-');
                        
                        // Filter out intermediate headers and empty separator rows from the Excel file
                        if (strtoupper($jenis) === 'JENIS KENDARAAN' || strtoupper($nopol) === 'NOMOR POLISI' || strtoupper($jenis) === 'NO') {
                            continue 2; // Skip this row and go to next foreach iteration
                        }
                        if (($jenis === '' || $jenis === 'Unknown') && ($nopol === '' || $nopol === '-')) {
                            continue 2; // Skip completely empty rows
                        }
                        
                        AlatBerat::create([
                            'id' => $uniqueId,
                            'nopol' => $nopol,
                            'tahun' => $row['tahun'] ?? null,
                            'jenis' => $jenis,
                            'alokasi' => $row['alokasi'] ?? null,
                            'merk' => $row['merk'] ?? null,
                            'model' => $row['model'] ?? null,
                            
                            'stnk' => $parseDate($row['stnk'] ?? null),
                            'pajak' => $parseDate($row['pajak'] ?? null),
                            'kir' => $parseDate($row['kir'] ?? null),
                            'status' => $row['status'] ?? 'Optimal',
                            'kondisi' => $row['kondisi'] ?? null,
                        ]);
                        $insertedCount++;
                        break;

                    case 'perbaikan_rumdin':
                        $tglRequest = null;
                        if (!empty($row['tanggal_request'])) {
                            try {
                                if (is_numeric($row['tanggal_request'])) {
                                    $tglRequest = gmdate("Y-m-d", ($row['tanggal_request'] - 25569) * 86400);
                                } else {
                                    $tglRequest = \Carbon\Carbon::parse($row['tanggal_request'])->format('Y-m-d');
                                }
                            } catch (\Exception $e) {}
                        }
                        
                        $tglSelesai = null;
                        if (!empty($row['tanggal_selesai'])) {
                            try {
                                if (is_numeric($row['tanggal_selesai'])) {
                                    $tglSelesai = gmdate("Y-m-d", ($row['tanggal_selesai'] - 25569) * 86400);
                                } else {
                                    $tglSelesai = \Carbon\Carbon::parse($row['tanggal_selesai'])->format('Y-m-d');
                                }
                            } catch (\Exception $e) {}
                        }

                        Perbaikan::create([
                            'id' => $uniqueId,
                            'pekerjaan' => $row['deskripsi_pekerjaan'] ?? 'Perbaikan Umum',
                            'lokasi' => 'Rumah Dinas',
                            'tanggal_request' => $tglRequest,
                            'tanggal_selesai' => $tglSelesai,
                            'status' => $row['status'] ?? 'In Progress',
                            'link_foto' => $row['link_bukti_foto_opsional'] ?? null,
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



                    case 'master_organik':
                        $tanggalLahir = null;
                        if (!empty($row['tanggal_lahir'])) {
                            try {
                                // Assume date might be a string or excel numeric
                                if (is_numeric($row['tanggal_lahir'])) {
                                    $unixDate = ($row['tanggal_lahir'] - 25569) * 86400;
                                    $tanggalLahir = gmdate("Y-m-d", $unixDate);
                                } else {
                                    $tanggalLahir = \Carbon\Carbon::parse($row['tanggal_lahir'])->format('Y-m-d');
                                }
                            } catch (\Exception $e) {
                                $tanggalLahir = null;
                            }
                        }
                        
                        $umur = intval($row['umur'] ?? 0);
                        if ($umur === 0 && $tanggalLahir) {
                            $umur = \Carbon\Carbon::parse($tanggalLahir)->age;
                        }

                        $empId = $row['nopok'] ?? ('EMP-' . rand(1000, 9999));
                        Employee::updateOrCreate(
                            ['employee_id' => $empId],
                            [
                                'name' => $row['nama'] ?? 'Pegawai Baru',
                                'gender' => $row['gender'] ?? 'Laki-laki',
                                'position' => $row['jabatan'] ?? 'Staff',
                                'department' => $row['fungsi'] ?? 'Operasi',
                                'status' => 'Aktif',
                                'age' => $umur > 0 ? $umur : 30,
                                'tanggal_lahir' => $tanggalLahir
                            ]
                        );
                        $insertedCount++;
                        break;

                    case 'master_tad':
                        HcTad::create([
                            'id' => $uniqueId,
                            'nama' => $row['nama'] ?? 'Pekerja TAD',
                            'peran' => $row['peran'] ?? 'Staff',
                            'vendor' => $row['vendor'] ?? 'PT Vendor',
                            'status' => $row['status'] ?? 'Aktif',
                        ]);
                        $insertedCount++;
                        break;

                    case 'master_pensiun':
                        $nama = $row['nama'] ?? 'Pegawai';
                        HcRetired::updateOrCreate(
                            ['nama' => $nama],
                            [
                                'jabatan' => $row['jabatan'] ?? 'Staff',
                                'umur_pensiun' => intval($row['umur'] ?? 56),
                                'tahun' => intval($row['tahun'] ?? date('Y')),
                                'tanggal' => $row['tanggal'] ?? date('Y-m-d'),
                                'keterangan' => $row['keterangan'] ?? '-',
                                'id' => \Illuminate\Support\Facades\DB::raw("IFNULL(id, '$uniqueId')")
                            ]
                        );
                        $insertedCount++;
                        break;
                        
                    case 'financial_performance':
                        FinancialPerformance::updateOrCreate(
                            ['year' => intval($row['year'] ?? 0)],
                            [
                                'revenue' => (float)($row['revenue'] ?? 0),
                                'cost' => (float)($row['cost'] ?? 0),
                                'depreciation' => (float)($row['depreciation'] ?? 0),
                                'net_profit' => (float)($row['net_profit'] ?? 0),
                                'abo' => (float)($row['abo'] ?? 0),
                                'ebitda' => (float)($row['ebitda'] ?? 0),
                                'cost_per_kwh' => (float)($row['cost_per_kwh'] ?? 0),
                            ]
                        );
                        $insertedCount++;
                        break;
                        
                    case 'bbm':
                        BbmStock::updateOrCreate(
                            ['bulan' => $row['bulan']],
                            [
                                'stock_awal_solar' => (float)($row['stock_awal_solar'] ?? 0),
                                'penerimaan_solar' => (float)($row['penerimaan_solar'] ?? 0),
                                'pengeluaran_ag_solar' => (float)($row['pengeluaran_ag_solar'] ?? 0),
                                'pengeluaran_proyek_solar' => (float)($row['pengeluaran_proyek_solar'] ?? 0),
                                'stock_akhir_solar' => (float)($row['stock_akhir_solar'] ?? 0),
                            ]
                        );
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
            } elseif (in_array($type, ['hc', 'lembur_tad'])) {
                $archiveCategory = 'Laporan Bulanan';
            } elseif (in_array($type, ['master_organik', 'master_tad', 'master_pensiun'])) {
                $archiveCategory = 'Master Data';
            } elseif ($type === 'financial_performance') {
                $archiveCategory = 'Laporan Finansial';
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
