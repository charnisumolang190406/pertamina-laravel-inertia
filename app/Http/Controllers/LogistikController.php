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
    public function storePerbaikan(Request $request)
    {
        $validated = $request->validate([
            'lokasi' => 'required|string|max:255',
            'pekerjaan' => 'required|string|max:500',
            'kategori' => 'nullable|string|max:100',
            'urgensi' => 'nullable|string|max:50',
            'tanggal_request' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date',
            'status' => 'required|string',
            'estimasi' => 'nullable|numeric',
            'realisasi' => 'nullable|numeric',
            'link_foto' => 'nullable|string',
            'keterangan' => 'nullable|string',
        ]);

        $kategori = !empty($validated['kategori']) ? $validated['kategori'] : self::autoCategorize($validated['pekerjaan'], $validated['keterangan'] ?? '');
        $urgensi = !empty($validated['urgensi']) ? $validated['urgensi'] : self::autoUrgensi($validated['pekerjaan'], $validated['keterangan'] ?? '');

        $newId = (int) (Perbaikan::max('id') ?? 0) + 1;
        if ($newId < 1000 && Perbaikan::count() > 0) {
            $newId = time();
        }

        Perbaikan::create([
            'id' => $newId,
            'lokasi' => $validated['lokasi'],
            'pekerjaan' => $validated['pekerjaan'],
            'kategori' => $kategori,
            'urgensi' => $urgensi,
            'tanggal_request' => $validated['tanggal_request'] ?? now()->format('Y-m-d'),
            'tanggal_selesai' => $validated['tanggal_selesai'] ?? null,
            'status' => $validated['status'] ?? 'In Progress',
            'estimasi' => $validated['estimasi'] ?? 0,
            'realisasi' => $validated['realisasi'] ?? 0,
            'link_foto' => $validated['link_foto'] ?? null,
            'keterangan' => $validated['keterangan'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Data perbaikan berhasil ditambahkan.');
    }

    public function updatePerbaikan(Request $request, $id)
    {
        $perbaikan = Perbaikan::findOrFail($id);
        $validated = $request->validate([
            'lokasi' => 'required|string|max:255',
            'pekerjaan' => 'required|string|max:500',
            'kategori' => 'nullable|string|max:100',
            'urgensi' => 'nullable|string|max:50',
            'tanggal_request' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date',
            'status' => 'required|string',
            'estimasi' => 'nullable|numeric',
            'realisasi' => 'nullable|numeric',
            'link_foto' => 'nullable|string',
            'keterangan' => 'nullable|string',
        ]);

        if (empty($validated['kategori'])) {
            $validated['kategori'] = self::autoCategorize($validated['pekerjaan'], $validated['keterangan'] ?? '');
        }
        if (empty($validated['urgensi'])) {
            $validated['urgensi'] = self::autoUrgensi($validated['pekerjaan'], $validated['keterangan'] ?? '');
        }

        $perbaikan->update($validated);
        return redirect()->back()->with('success', 'Data perbaikan berhasil diperbarui.');
    }

    public function exportPerbaikan()
    {
        $data = Perbaikan::orderBy('tanggal_request', 'desc')->get();
        $filename = "Laporan_Perbaikan_Rumah_Dinas_" . date('Ymd_His') . ".csv";

        $headers = [
            "Content-type" => "text/csv; charset=UTF-8",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $columns = ['ID', 'Lokasi', 'Deskripsi Pekerjaan', 'Kategori Kerusakan', 'Urgensi', 'Tanggal Request', 'Tanggal Selesai', 'Status', 'Estimasi (Rp)', 'Realisasi (Rp)', 'Link Foto', 'Keterangan'];

        $callback = function () use ($data, $columns) {
            $file = fopen('php://output', 'w');
            fputs($file, "\xEF\xBB\xBF");
            fputcsv($file, $columns);

            foreach ($data as $item) {
                fputcsv($file, [
                    $item->id,
                    $item->lokasi,
                    $item->pekerjaan,
                    $item->kategori ?: self::autoCategorize($item->pekerjaan, $item->keterangan),
                    $item->urgensi ?: self::autoUrgensi($item->pekerjaan, $item->keterangan),
                    $item->tanggal_request,
                    $item->tanggal_selesai,
                    $item->status,
                    $item->estimasi,
                    $item->realisasi,
                    $item->link_foto,
                    $item->keterangan,
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

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
            [
                'id' => 1,
                'lokasi' => 'Rumah Dinas No. 12',
                'pekerjaan' => 'Perbaikan Atap dan Plafon Bocor Ruang Tamu',
                'kategori' => 'Sipil dan Struktural',
                'urgensi' => 'High',
                'estimasi' => 25000000,
                'realisasi' => 24500000,
                'status' => 'Done',
                'keterangan' => 'Pekerjaan perbaikan atap selesai 100% menggunakan genteng metal',
                'tanggal_request' => '2026-01-05',
                'tanggal_selesai' => '2026-01-08',
                'link_foto' => 'https://drive.google.com/drive/folders/contoh-foto-rd12',
            ],
            [
                'id' => 2,
                'lokasi' => 'Rumah Dinas No. 30',
                'pekerjaan' => 'Perbaikan meja setrika dan engsel lemari dinas',
                'kategori' => 'Interior dan Fixture (FF&E)',
                'urgensi' => 'Normal',
                'estimasi' => 850000,
                'realisasi' => 800000,
                'status' => 'Done',
                'keterangan' => 'Penggantian engsel hidrolik baru',
                'tanggal_request' => '2026-01-12',
                'tanggal_selesai' => '2026-01-14',
                'link_foto' => 'https://drive.google.com/drive/folders/contoh-foto-rd30-1',
            ],
            [
                'id' => 3,
                'lokasi' => 'Wisma Manajemen',
                'pekerjaan' => 'Perbaikan Kunci toilet pria management lepas',
                'kategori' => 'Interior dan Fixture (FF&E)',
                'urgensi' => 'High',
                'estimasi' => 500000,
                'realisasi' => 450000,
                'status' => 'Done',
                'keterangan' => 'Penggantian handle set kunci bulat stainless',
                'tanggal_request' => '2026-01-18',
                'tanggal_selesai' => '2026-01-19',
                'link_foto' => 'https://drive.google.com/drive/folders/contoh-foto-wisma',
            ],
            [
                'id' => 4,
                'lokasi' => 'Rumah Dinas No. 30',
                'pekerjaan' => 'Pipa kran dapur bocor dan wastafel mampet',
                'kategori' => 'Plumbing dan Sanitasi',
                'urgensi' => 'High',
                'estimasi' => 1200000,
                'realisasi' => 1150000,
                'status' => 'Done',
                'keterangan' => 'Penggantian pipa sifon & kran leher angsa',
                'tanggal_request' => '2026-02-04',
                'tanggal_selesai' => '2026-02-06',
                'link_foto' => 'https://drive.google.com/drive/folders/contoh-foto-rd30-2',
            ],
            [
                'id' => 5,
                'lokasi' => 'Rumah Dinas No. 05',
                'pekerjaan' => 'Renovasi Pagar Keliling & Engsel Gerbang',
                'kategori' => 'Sipil dan Struktural',
                'urgensi' => 'Normal',
                'estimasi' => 15000000,
                'realisasi' => 15000000,
                'status' => 'Done',
                'keterangan' => 'Pengelasan ulang dan cat anti-karat',
                'tanggal_request' => '2026-02-14',
                'tanggal_selesai' => '2026-02-18',
                'link_foto' => 'https://drive.google.com/drive/folders/contoh-foto-rd05',
            ],
            [
                'id' => 6,
                'lokasi' => 'Rumah Dinas No. 18',
                'pekerjaan' => 'Servis AC Split 1.5 PK tidak dingin & bocor freon',
                'kategori' => 'HVAC (Pendingin Udara)',
                'urgensi' => 'High',
                'estimasi' => 1500000,
                'realisasi' => 1400000,
                'status' => 'Done',
                'keterangan' => 'Pengelasan pipa evaporator dan isi ulang freon R32',
                'tanggal_request' => '2026-03-02',
                'tanggal_selesai' => '2026-03-04',
                'link_foto' => 'https://drive.google.com/drive/folders/contoh-foto-rd18-1',
            ],
            [
                'id' => 7,
                'lokasi' => 'Rumah Dinas No. 12',
                'pekerjaan' => 'MCB Listrik sering trip / turun mendadak',
                'kategori' => 'Mekanikal dan Elektrikal (MEP)',
                'urgensi' => 'Emergency',
                'estimasi' => 950000,
                'realisasi' => 900000,
                'status' => 'Done',
                'keterangan' => 'Penggantian MCB Schneider 25A & penataan ulang beban fasa',
                'tanggal_request' => '2026-03-15',
                'tanggal_selesai' => '2026-03-16',
                'link_foto' => 'https://drive.google.com/drive/folders/contoh-foto-rd12-mcb',
            ],
            [
                'id' => 8,
                'lokasi' => 'Rumah Dinas No. 24',
                'pekerjaan' => 'Instalasi stop kontak baru & perbaikan fitting lampu kamar',
                'kategori' => 'Mekanikal dan Elektrikal (MEP)',
                'urgensi' => 'Normal',
                'estimasi' => 650000,
                'realisasi' => 600000,
                'status' => 'Done',
                'keterangan' => 'Pemasangan kabel NYM 3x2.5mm dan saklar ganda Panasonic',
                'tanggal_request' => '2026-04-10',
                'tanggal_selesai' => '2026-04-12',
                'link_foto' => null,
            ],
            [
                'id' => 9,
                'lokasi' => 'Rumah Dinas No. 30',
                'pekerjaan' => 'Tembok rembes dan cat terkelupas kamar tidur',
                'kategori' => 'Sipil dan Struktural',
                'urgensi' => 'Normal',
                'estimasi' => 3200000,
                'realisasi' => 3000000,
                'status' => 'Done',
                'keterangan' => 'Waterproofing Aquaproof dan pengecatan ulang Dulux',
                'tanggal_request' => '2026-04-20',
                'tanggal_selesai' => '2026-04-23',
                'link_foto' => 'https://drive.google.com/drive/folders/contoh-foto-rd30-3',
            ],
            [
                'id' => 10,
                'lokasi' => 'Rumah Dinas No. 18',
                'pekerjaan' => 'Pelampung toren air patah dan air meluap',
                'kategori' => 'Plumbing dan Sanitasi',
                'urgensi' => 'Emergency',
                'estimasi' => 750000,
                'realisasi' => 700000,
                'status' => 'Done',
                'keterangan' => 'Penggantian radar otomatis toren Penguin',
                'tanggal_request' => '2026-05-08',
                'tanggal_selesai' => '2026-05-09',
                'link_foto' => null,
            ],
            [
                'id' => 11,
                'lokasi' => 'Wisma Manajemen',
                'pekerjaan' => 'Perawatan rutin AC Cassette & ganti filter udara',
                'kategori' => 'HVAC (Pendingin Udara)',
                'urgensi' => 'Normal',
                'estimasi' => 2400000,
                'realisasi' => 2200000,
                'status' => 'Done',
                'keterangan' => 'Cleaning 4 unit AC Cassette Daikin',
                'tanggal_request' => '2026-05-22',
                'tanggal_selesai' => '2026-05-24',
                'link_foto' => 'https://drive.google.com/drive/folders/contoh-foto-wisma-ac',
            ],
            [
                'id' => 12,
                'lokasi' => 'Rumah Dinas No. 12',
                'pekerjaan' => 'Kran shower kamar mandi utama patah di drat pipa',
                'kategori' => 'Plumbing dan Sanitasi',
                'urgensi' => 'High',
                'estimasi' => 850000,
                'realisasi' => 800000,
                'status' => 'Done',
                'keterangan' => 'Ekstraksi patahan drat dan pasang kran mixer baru',
                'tanggal_request' => '2026-06-11',
                'tanggal_selesai' => '2026-06-13',
                'link_foto' => null,
            ],
            [
                'id' => 13,
                'lokasi' => 'Rumah Dinas No. 24',
                'pekerjaan' => 'Genteng geser dan perbaikan talang air bocor',
                'kategori' => 'Sipil dan Struktural',
                'urgensi' => 'High',
                'estimasi' => 2800000,
                'realisasi' => 0,
                'status' => 'In Progress',
                'keterangan' => 'Sedang menunggu pengeringan plesteran talang jurai',
                'tanggal_request' => '2026-08-28',
                'tanggal_selesai' => null,
                'link_foto' => 'https://drive.google.com/drive/folders/contoh-foto-rd24',
            ],
            [
                'id' => 14,
                'lokasi' => 'Rumah Dinas No. 32',
                'pekerjaan' => 'Korsleting saklar utama pompa air submersible',
                'kategori' => 'Mekanikal dan Elektrikal (MEP)',
                'urgensi' => 'Emergency',
                'estimasi' => 1250000,
                'realisasi' => 0,
                'status' => 'In Progress',
                'keterangan' => 'Teknisi sedang melakukan pengecekan kabel jalur pompa',
                'tanggal_request' => '2026-09-02',
                'tanggal_selesai' => null,
                'link_foto' => null,
            ],
            [
                'id' => 15,
                'lokasi' => 'Rumah Dinas No. 30',
                'pekerjaan' => 'AC Kamar Anak mati total indikator kedip',
                'kategori' => 'HVAC (Pendingin Udara)',
                'urgensi' => 'High',
                'estimasi' => 1800000,
                'realisasi' => 0,
                'status' => 'In Progress',
                'keterangan' => 'Penggantian kapasitor fan outdoor sedang diproses',
                'tanggal_request' => '2026-09-05',
                'tanggal_selesai' => null,
                'link_foto' => null,
            ],
        ];

        foreach ($initialData as $data) {
            Perbaikan::create($data);
        }

        return redirect()->back()->with('success', 'Data perbaikan berhasil direset dengan data komprehensif 5 kategori.');
    }

    public static function autoCategorize($pekerjaan, $keterangan = '')
    {
        $text = strtolower($pekerjaan . ' ' . $keterangan);
        if (preg_match('/(toilet|kloset|closet|pipa|kran|keran|bocor air|saluran|toren|pompa|jet pump|wastafel|drainase|sanyo|got|sanitasi)/i', $text) && !preg_match('/(atap|genteng|plafon)/i', $text)) {
            return 'Plumbing dan Sanitasi';
        }
        if (preg_match('/(ac|freon|tidak dingin|cuci ac|chiller|kompresor|hvac|pendingin|cassette)/i', $text)) {
            return 'HVAC (Pendingin Udara)';
        }
        if (preg_match('/(listrik|mcb|lampu|kabel|sakelar|saklar|stop kontak|korslet|konslet|panel|genset|trafo)/i', $text)) {
            return 'Mekanikal dan Elektrikal (MEP)';
        }
        if (preg_match('/(meja|kursi|lemari|kunci|handle|gagang|engsel|kitchen|setrika|furniture|kasur|sofa|gorden|rak)/i', $text)) {
            return 'Interior dan Fixture (FF&E)';
        }
        return 'Sipil dan Struktural';
    }

    public static function autoUrgensi($pekerjaan, $keterangan = '')
    {
        $text = strtolower($pekerjaan . ' ' . $keterangan);
        if (preg_match('/(darurat|emergency|korslet|banjir|jebol)/i', $text)) {
            return 'Emergency';
        }
        if (preg_match('/(bocor|mati total|lepas|rusak berat|trip)/i', $text)) {
            return 'High';
        }
        return 'Normal';
    }
}
