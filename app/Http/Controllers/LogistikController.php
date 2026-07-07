<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Stok;
use App\Models\AlatBerat;
use App\Models\Perbaikan;

class LogistikController extends Controller
{
    // === STOK SECTION ===
    public function destroyStok($id)
    {
        Stok::destroy($id);
        return redirect()->back()->with('success', 'Item stok berhasil dihapus.');
    }

    public function clearStok()
    {
        Stok::truncate();
        return redirect()->back()->with('success', 'Data stok berhasil dikosongkan.');
    }

    public function resetStok()
    {
        Stok::truncate();
        $initialData = [
            ['id' => 1, 'nama' => 'Pipa Besi Carbon 6 Inch Sch 80', 'fungsi' => 'Maintenance (MTC)', 'masuk' => 50, 'keluar' => 20, 'saldo' => 130, 'status' => 'Aman'],
            ['id' => 2, 'nama' => 'Kabel Power NYY 4x10mm', 'fungsi' => 'IT / Operations (OP)', 'masuk' => 1000, 'keluar' => 300, 'saldo' => 1200, 'status' => 'Aman'],
            ['id' => 3, 'nama' => 'Valve Gate 4 Inch ANSI 300', 'fungsi' => 'Maintenance (MTC)', 'masuk' => 2, 'keluar' => 6, 'saldo' => 3, 'status' => 'Minimum Stock'],
            ['id' => 4, 'nama' => 'O-Ring Gasket Kit 2 Inch', 'fungsi' => 'Maintenance (MTC)', 'masuk' => 15, 'keluar' => 12, 'saldo' => 18, 'status' => 'Aman'],
        ];
        foreach ($initialData as $data) {
            Stok::create($data);
        }
        return redirect()->back()->with('success', 'Data stok berhasil direset ke default.');
    }

    // === ALAT BERAT SECTION ===
    public function destroyAlatBerat($id)
    {
        AlatBerat::destroy($id);
        return redirect()->back()->with('success', 'Aset alat berat berhasil dihapus.');
    }

    public function clearAlatBerat()
    {
        AlatBerat::truncate();
        return redirect()->back()->with('success', 'Data alat berat berhasil dikosongkan.');
    }

    public function resetAlatBerat()
    {
        AlatBerat::truncate();
        $initialData = [
            ['id' => 1, 'nopol' => '-', 'tahun' => '-', 'jenis' => 'CRANE 30T', 'alokasi' => 'LHD-3', 'merk' => 'TADANO', 'model' => 'GR300E-3', 'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13', 'status' => 'AMAN', 'kondisi' => 'Under Maintenance: Sparepart dari UT (piping brake) estimasi ready akhir agustus 2026'],
            ['id' => 2, 'nopol' => '-', 'tahun' => '-', 'jenis' => 'TMC 10T', 'alokasi' => 'LHD-3', 'merk' => 'TADANO', 'model' => 'TM-ZT1000', 'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13', 'status' => 'AMAN', 'kondisi' => 'Baik'],
            ['id' => 3, 'nopol' => 'DB 8273 GY', 'tahun' => '-', 'jenis' => 'TMC 3.5T', 'alokasi' => 'LHD-3', 'merk' => 'TADANO', 'model' => 'TM-ZT630', 'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13', 'status' => 'AMAN', 'kondisi' => 'Under Maintenance'],
            ['id' => 4, 'nopol' => '-', 'tahun' => '-', 'jenis' => 'FORKLIFT 7T', 'alokasi' => 'LHD-2', 'merk' => 'CATERPILLAR', 'model' => 'DP70', 'stnk' => '-', 'pajak' => '-', 'kir' => '-', 'status' => 'AMAN', 'kondisi' => 'Baik'],
            ['id' => 5, 'nopol' => '-', 'tahun' => '-', 'jenis' => 'FORKLIFT 5T', 'alokasi' => 'LHD-3', 'merk' => 'CATERPILLAR', 'model' => 'DP50', 'stnk' => '-', 'pajak' => '-', 'kir' => '-', 'status' => 'AMAN', 'kondisi' => 'Baik'],
            ['id' => 6, 'nopol' => '-', 'tahun' => '-', 'jenis' => 'FORKLIFT 4T', 'alokasi' => 'LHD-3', 'merk' => 'CATERPILLAR', 'model' => 'DP40', 'stnk' => '-', 'pajak' => '-', 'kir' => '-', 'status' => 'AMAN', 'kondisi' => 'Baik'],
            ['id' => 7, 'nopol' => '-', 'tahun' => '-', 'jenis' => 'FORKLIFT 3.5T', 'alokasi' => 'LHD-4', 'merk' => 'CATERPILLAR', 'model' => 'DP35', 'stnk' => '-', 'pajak' => '-', 'kir' => '-', 'status' => 'AMAN', 'kondisi' => 'Baik'],
            ['id' => 8, 'nopol' => '-', 'tahun' => '-', 'jenis' => 'FORKLIFT 2.5T', 'alokasi' => 'LHD-3', 'merk' => 'CATERPILLAR', 'model' => 'DP25', 'stnk' => '-', 'pajak' => '-', 'kir' => '-', 'status' => 'AMAN', 'kondisi' => 'Baik'],
        ];
        foreach ($initialData as $data) {
            AlatBerat::create($data);
        }
        return redirect()->back()->with('success', 'Data alat berat berhasil direset ke default.');
    }

    // === PERBAIKAN SECTION ===
    public function destroyPerbaikan($id)
    {
        Perbaikan::destroy($id);
        return redirect()->back()->with('success', 'Data perbaikan berhasil dihapus.');
    }

    public function clearPerbaikan()
    {
        Perbaikan::truncate();
        return redirect()->back()->with('success', 'Data perbaikan berhasil dikosongkan.');
    }

    public function resetPerbaikan()
    {
        Perbaikan::truncate();
        $initialData = [
            ['id' => 1, 'lokasi' => 'Rumah Dinas No. 12', 'pekerjaan' => 'Perbaikan Atap dan Plafon Bocor', 'estimasi' => 25000000, 'realisasi' => 24500000, 'status' => 'Selesai', 'keterangan' => 'Pekerjaan selesai 100% menggunakan dana rutin LOG'],
            ['id' => 2, 'lokasi' => 'Gedung Kantor Utama', 'pekerjaan' => 'Pengecatan dan Perbaikan Fasad Depan', 'estimasi' => 45000000, 'realisasi' => 38000000, 'status' => 'On Progress', 'keterangan' => 'Progres fisik 75%, estimasi selesai Juli 2026'],
            ['id' => 3, 'lokasi' => 'Rumah Dinas No. 5', 'pekerjaan' => 'Renovasi Pagar Keliling', 'estimasi' => 15000000, 'realisasi' => 15000000, 'status' => 'Selesai', 'keterangan' => 'Selesai tepat waktu'],
            ['id' => 4, 'lokasi' => 'Gedung Kantor SCM', 'pekerjaan' => 'Instalasi AC Cassette 3 PK', 'estimasi' => 18000000, 'realisasi' => 18000000, 'status' => 'Selesai', 'keterangan' => 'AC Ruang Buyer SCM baru'],
        ];
        foreach ($initialData as $data) {
            Perbaikan::create($data);
        }
        return redirect()->back()->with('success', 'Data perbaikan berhasil direset ke default.');
    }
}
