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

    /**
     * Unduh Template Excel Resmi (.xlsx) dengan Format 5 Kategori & SLA 2026
     */
    /**
     * Unduh Template Excel Resmi (.xlsx) dengan Format Dropdown Unit RD & Urgensi
     */
    public function downloadTemplateExcel()
    {
        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();

        // ── SHEET 1: TEMPLATE_DATA_PERBAIKAN (SESUAI FORMAT SCREENSHOT PENGGUNA) ──
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Template_Data_Perbaikan');

        $headers = [
            'A1' => 'No',
            'B1' => 'No Unit RD',
            'C1' => 'Deskripsi Pekerjaan',
            'D1' => 'Urgensi',
            'E1' => 'Tanggal Request',
            'F1' => 'Tanggal Selesai',
        ];

        foreach ($headers as $cell => $text) {
            $sheet->setCellValue($cell, $text);
        }

        // Header Styling (Abu-abu Profesional Sesuai Screenshot Excel Pengguna)
        $headerStyle = [
            'font' => [
                'bold' => true,
                'color' => ['argb' => 'FF1E293B'],
                'size' => 11,
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'startColor' => ['argb' => 'FFE2E8F0'],
            ],
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    'color' => ['argb' => 'FF94A3B8'],
                ],
            ],
        ];
        $sheet->getStyle('A1:F1')->applyFromArray($headerStyle);
        $sheet->getRowDimension(1)->setRowHeight(26);

        // Data Contoh Persis Seperti Screenshot Pengguna
        $samples = [
            [1, 'RD 01', 'Perbaikan meja setrika RD 30,', 'Low', '03/01/2026', '06/01/2026'],
            [2, 'RD 31', 'Perbaikan Kunci toilet pria management lepas', 'Medium', '06/01/2026', '07/01/2026'],
            [3, 'RD 05', 'Pipa kran dapur bocor dan wastafel mampet', 'High', '04/02/2026', '05/02/2026'],
            [4, 'Kantor', 'MCB Listrik sering trip / turun mendadak', 'High', '15/03/2026', '16/03/2026'],
            [5, 'RD 01', 'Servis AC Split 1.5 PK tidak dingin & bocor freon', 'Low', '02/03/2026', '04/03/2026'],
            [6, 'RD 30', 'Perbaikan meja setrika dan engsel lemari dinas', 'Medium', '12/01/2026', '14/01/2026'],
        ];

        $rowIdx = 2;
        foreach ($samples as $row) {
            $sheet->setCellValue('A' . $rowIdx, $row[0]);
            $sheet->setCellValue('B' . $rowIdx, $row[1]);
            $sheet->setCellValue('C' . $rowIdx, $row[2]);
            $sheet->setCellValue('D' . $rowIdx, $row[3]);
            $sheet->setCellValue('E' . $rowIdx, $row[4]);
            $sheet->setCellValue('F' . $rowIdx, $row[5]);

            // Alignment per kolom
            $sheet->getStyle('A' . $rowIdx)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle('B' . $rowIdx)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle('D' . $rowIdx)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle('E' . $rowIdx)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle('F' . $rowIdx)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);

            $sheet->getRowDimension($rowIdx)->setRowHeight(22);
            $rowIdx++;
        }

        // ── SHEET 2: SHEET1 (REFERENSI UNIT RD & PANDUAN KATEGORI) ──
        $refSheet = $spreadsheet->createSheet();
        $refSheet->setTitle('Sheet1');

        $refSheet->setCellValue('A1', 'Daftar Unit RD');
        $refSheet->setCellValue('C1', 'Pilihan Urgensi');
        $refSheet->setCellValue('E1', 'Panduan Kategori');
        $refSheet->setCellValue('F1', 'Target SLA');

        $units = [
            'RD 01', 'RD 02', 'RD 03', 'RD 04', 'RD 05', 'RD 06', 'RD 07', 'RD 08', 'RD 09', 'RD 10',
            'RD 11', 'RD 12', 'RD 13', 'RD 14', 'RD 15', 'RD 16', 'RD 17', 'RD 18', 'RD 19', 'RD 20',
            'RD 21', 'RD 22', 'RD 23', 'RD 24', 'RD 25', 'RD 26', 'RD 27', 'RD 28', 'RD 29', 'RD 30',
            'RD 31', 'RD 32', 'RD 33', 'RD 34', 'RD 35',
            'Kantor', 'Wisma Manajemen', 'Pos Security', 'Mess Karyawan'
        ];

        foreach ($units as $i => $u) {
            $refSheet->setCellValue('A' . ($i + 2), $u);
        }

        $refSheet->setCellValue('C2', 'Low');
        $refSheet->setCellValue('C3', 'Medium');
        $refSheet->setCellValue('C4', 'High');

        $kategoriGuide = [
            ['Sipil dan Struktural (SST)', '7 HK'],
            ['Plumbing dan Sanitasi (PS)', '2 HK'],
            ['Mekanikal dan Elektrikal (MEL)', '2 HK'],
            ['Pendingin Udara (HVAC)', '2 HK'],
            ['Interior dan Fixture (FF&E)', '2 HK'],
        ];
        foreach ($kategoriGuide as $i => $kg) {
            $refSheet->setCellValue('E' . ($i + 2), $kg[0]);
            $refSheet->setCellValue('F' . ($i + 2), $kg[1]);
        }

        $refHeaderStyle = [
            'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF']],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'startColor' => ['argb' => 'FF1E40AF'],
            ],
            'alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER],
        ];
        $refSheet->getStyle('A1')->applyFromArray($refHeaderStyle);
        $refSheet->getStyle('C1')->applyFromArray($refHeaderStyle);
        $refSheet->getStyle('E1:F1')->applyFromArray($refHeaderStyle);

        // Named Range untuk Dropdown Unit
        $lastUnitRow = count($units) + 1;
        $spreadsheet->addNamedRange(
            new \PhpOffice\PhpSpreadsheet\NamedRange('DaftarUnitRD', $refSheet, '$A$2:$A$' . $lastUnitRow)
        );

        // ── DATA VALIDATION / IN-CELL DROPDOWN ──
        // 1. Dropdown Lokasi / No Unit RD
        $valUnit = new \PhpOffice\PhpSpreadsheet\Cell\DataValidation();
        $valUnit->setType(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::TYPE_LIST);
        $valUnit->setErrorStyle(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::STYLE_INFORMATION);
        $valUnit->setAllowBlank(true);
        $valUnit->setShowDropDown(true);
        $valUnit->setShowInputMessage(true);
        $valUnit->setShowErrorMessage(true);
        $valUnit->setPromptTitle('Pilih No Unit RD');
        $valUnit->setPrompt('Pilih unit rumah dinas atau kantor dari daftar dropdown.');
        $valUnit->setFormula1('=DaftarUnitRD');

        // 2. Dropdown Urgensi (Low, Medium, High)
        $valUrgensi = new \PhpOffice\PhpSpreadsheet\Cell\DataValidation();
        $valUrgensi->setType(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::TYPE_LIST);
        $valUrgensi->setErrorStyle(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::STYLE_INFORMATION);
        $valUrgensi->setAllowBlank(true);
        $valUrgensi->setShowDropDown(true);
        $valUrgensi->setShowInputMessage(true);
        $valUrgensi->setShowErrorMessage(true);
        $valUrgensi->setPromptTitle('Tingkat Urgensi');
        $valUrgensi->setPrompt('Pilih urgensi pekerjaan: Low, Medium, atau High');
        $valUrgensi->setFormula1('"Low,Medium,High"');

        // Pasang data validation untuk 200 baris ke depan di Sheet Template
        for ($r = 2; $r <= 200; $r++) {
            $sheet->getCell("B$r")->setDataValidation(clone $valUnit);
            $sheet->getCell("D$r")->setDataValidation(clone $valUrgensi);
        }

        // Auto size kolom
        foreach (range('A', 'F') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }
        foreach (range('A', 'F') as $col) {
            $refSheet->getColumnDimension($col)->setAutoSize(true);
        }

        // Pastikan Sheet 1 aktif saat file dibuka
        $spreadsheet->setActiveSheetIndex(0);

        $fileName = 'Template_Data_Perbaikan.xlsx';
        $tempPath = tempnam(sys_get_temp_dir(), 'tmpl_') . '.xlsx';
        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        $writer->save($tempPath);

        // Bersihkan output buffer agar tidak ada byte pengotor sebelum file biner dikirim
        while (ob_get_level()) {
            ob_end_clean();
        }

        return response()->download($tempPath, $fileName, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Length' => filesize($tempPath),
            'Cache-Control' => 'no-cache, must-revalidate',
        ])->deleteFileAfterSend(true);
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

        $columns = ['ID', 'Lokasi', 'Kategori Kerusakan', 'Deskripsi Pekerjaan', 'Urgensi', 'Tanggal Request', 'Tanggal Selesai', 'Lama Perbaikan (Hari)', 'Kesesuaian SLA', 'Status', 'Estimasi (Rp)', 'Realisasi (Rp)', 'Keterangan'];

        $callback = function () use ($data, $columns) {
            $file = fopen('php://output', 'w');
            fputs($file, "\xEF\xBB\xBF");
            fputcsv($file, $columns);

            foreach ($data as $item) {
                $cat = $item->kategori ?: self::autoCategorize($item->pekerjaan, $item->keterangan);
                $urg = $item->urgensi ?: self::autoUrgensi($item->pekerjaan, $item->keterangan);
                
                // Hitung lama perbaikan & kesesuaian SLA
                $durasi = null;
                $kesesuaianSla = '-';
                if ($item->tanggal_request) {
                    $start = new \DateTime($item->tanggal_request);
                    $end = $item->tanggal_selesai ? new \DateTime($item->tanggal_selesai) : new \DateTime();
                    $diff = $start->diff($end);
                    $durasi = (int) $diff->days;
                    
                    $slaLimit = str_contains($cat, 'Sipil') || str_contains($cat, 'SST') ? 7 : 2;
                    $kesesuaianSla = ($durasi <= $slaLimit) ? 'Sesuai SLA' : 'Melebihi SLA';
                }

                fputcsv($file, [
                    $item->id,
                    $item->lokasi,
                    $cat,
                    $item->pekerjaan,
                    $urg,
                    $item->tanggal_request,
                    $item->tanggal_selesai,
                    $durasi !== null ? $durasi : '-',
                    $kesesuaianSla,
                    $item->status ?: 'Done',
                    $item->estimasi,
                    $item->realisasi,
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
                'kategori' => 'Sipil dan Struktural (SST)',
                'urgensi' => 'High',
                'estimasi' => 25000000,
                'realisasi' => 24500000,
                'status' => 'Done',
                'keterangan' => 'Pekerjaan perbaikan atap selesai 100% menggunakan genteng metal',
                'tanggal_request' => '2026-01-05',
                'tanggal_selesai' => '2026-01-09',
                'link_foto' => null,
            ],
            [
                'id' => 2,
                'lokasi' => 'Rumah Dinas No. 30',
                'pekerjaan' => 'Perbaikan meja setrika dan engsel lemari dinas',
                'kategori' => 'Interior dan Fixture (FF&E)',
                'urgensi' => 'Low',
                'estimasi' => 850000,
                'realisasi' => 800000,
                'status' => 'Done',
                'keterangan' => 'Penggantian engsel hidrolik baru',
                'tanggal_request' => '2026-01-12',
                'tanggal_selesai' => '2026-01-14',
                'link_foto' => null,
            ],
            [
                'id' => 3,
                'lokasi' => 'Wisma Manajemen',
                'pekerjaan' => 'Perbaikan Kunci toilet pria management lepas',
                'kategori' => 'Interior dan Fixture (FF&E)',
                'urgensi' => 'Medium',
                'estimasi' => 500000,
                'realisasi' => 450000,
                'status' => 'Done',
                'keterangan' => 'Penggantian handle set kunci bulat stainless',
                'tanggal_request' => '2026-01-18',
                'tanggal_selesai' => '2026-01-19',
                'link_foto' => null,
            ],
            [
                'id' => 4,
                'lokasi' => 'Rumah Dinas No. 30',
                'pekerjaan' => 'Pipa kran dapur bocor dan wastafel mampet',
                'kategori' => 'Plumbing dan Sanitasi (PS)',
                'urgensi' => 'Medium',
                'estimasi' => 1200000,
                'realisasi' => 1150000,
                'status' => 'Done',
                'keterangan' => 'Penggantian pipa sifon & kran leher angsa',
                'tanggal_request' => '2026-02-04',
                'tanggal_selesai' => '2026-02-05',
                'link_foto' => null,
            ],
            [
                'id' => 5,
                'lokasi' => 'Rumah Dinas No. 05',
                'pekerjaan' => 'Renovasi Pagar Keliling & Engsel Gerbang',
                'kategori' => 'Sipil dan Struktural (SST)',
                'urgensi' => 'Low',
                'estimasi' => 15000000,
                'realisasi' => 15000000,
                'status' => 'Done',
                'keterangan' => 'Pengelasan ulang dan cat anti-karat',
                'tanggal_request' => '2026-02-14',
                'tanggal_selesai' => '2026-02-23',
                'link_foto' => null,
            ],
            [
                'id' => 6,
                'lokasi' => 'Rumah Dinas No. 18',
                'pekerjaan' => 'Servis AC Split 1.5 PK tidak dingin & bocor freon',
                'kategori' => 'Pendingin Udara (HVAC)',
                'urgensi' => 'Medium',
                'estimasi' => 1500000,
                'realisasi' => 1400000,
                'status' => 'Done',
                'keterangan' => 'Pengelasan pipa evaporator dan isi ulang freon R32',
                'tanggal_request' => '2026-03-02',
                'tanggal_selesai' => '2026-03-04',
                'link_foto' => null,
            ],
            [
                'id' => 7,
                'lokasi' => 'Rumah Dinas No. 12',
                'pekerjaan' => 'MCB Listrik sering trip / turun mendadak',
                'kategori' => 'Mekanikal dan Elektrikal (MEL)',
                'urgensi' => 'High',
                'estimasi' => 950000,
                'realisasi' => 900000,
                'status' => 'Done',
                'keterangan' => 'Penggantian MCB Schneider 25A & penataan ulang beban fasa',
                'tanggal_request' => '2026-03-15',
                'tanggal_selesai' => '2026-03-16',
                'link_foto' => null,
            ],
            [
                'id' => 8,
                'lokasi' => 'Rumah Dinas No. 24',
                'pekerjaan' => 'Instalasi stop kontak baru & perbaikan fitting lampu kamar',
                'kategori' => 'Mekanikal dan Elektrikal (MEL)',
                'urgensi' => 'Low',
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
                'kategori' => 'Sipil dan Struktural (SST)',
                'urgensi' => 'Low',
                'estimasi' => 3200000,
                'realisasi' => 3000000,
                'status' => 'Done',
                'keterangan' => 'Waterproofing Aquaproof dan pengecatan ulang Dulux',
                'tanggal_request' => '2026-04-20',
                'tanggal_selesai' => '2026-04-24',
                'link_foto' => null,
            ],
            [
                'id' => 10,
                'lokasi' => 'Rumah Dinas No. 18',
                'pekerjaan' => 'Pelampung toren air patah dan air meluap',
                'kategori' => 'Plumbing dan Sanitasi (PS)',
                'urgensi' => 'High',
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
                'kategori' => 'Pendingin Udara (HVAC)',
                'urgensi' => 'Low',
                'estimasi' => 2400000,
                'realisasi' => 2200000,
                'status' => 'Done',
                'keterangan' => 'Cleaning 4 unit AC Cassette Daikin',
                'tanggal_request' => '2026-05-22',
                'tanggal_selesai' => '2026-05-26',
                'link_foto' => null,
            ],
            [
                'id' => 12,
                'lokasi' => 'Rumah Dinas No. 12',
                'pekerjaan' => 'Kran shower kamar mandi utama patah di drat pipa',
                'kategori' => 'Plumbing dan Sanitasi (PS)',
                'urgensi' => 'Medium',
                'estimasi' => 850000,
                'realisasi' => 800000,
                'status' => 'Done',
                'keterangan' => 'Ekstraksi patahan drat dan pasang kran mixer baru',
                'tanggal_request' => '2026-06-11',
                'tanggal_selesai' => '2026-06-15',
                'link_foto' => null,
            ],
            [
                'id' => 13,
                'lokasi' => 'Rumah Dinas No. 24',
                'pekerjaan' => 'Genteng geser dan perbaikan talang air bocor',
                'kategori' => 'Sipil dan Struktural (SST)',
                'urgensi' => 'High',
                'estimasi' => 2800000,
                'realisasi' => 2800000,
                'status' => 'Done',
                'keterangan' => 'Plesteran talang jurai dan reposisi genteng',
                'tanggal_request' => '2026-08-28',
                'tanggal_selesai' => '2026-09-02',
                'link_foto' => null,
            ],
            [
                'id' => 14,
                'lokasi' => 'Rumah Dinas No. 32',
                'pekerjaan' => 'Korsleting saklar utama pompa air submersible',
                'kategori' => 'Mekanikal dan Elektrikal (MEL)',
                'urgensi' => 'High',
                'estimasi' => 1250000,
                'realisasi' => 1200000,
                'status' => 'Done',
                'keterangan' => 'Pengecekan dan penggantian saklar magnetik pompa',
                'tanggal_request' => '2026-09-02',
                'tanggal_selesai' => '2026-09-03',
                'link_foto' => null,
            ],
            [
                'id' => 15,
                'lokasi' => 'Rumah Dinas No. 30',
                'pekerjaan' => 'AC Kamar Anak mati total indikator kedip',
                'kategori' => 'Pendingin Udara (HVAC)',
                'urgensi' => 'Medium',
                'estimasi' => 1800000,
                'realisasi' => 1750000,
                'status' => 'Done',
                'keterangan' => 'Penggantian modul PCB dan kapasitor fan outdoor',
                'tanggal_request' => '2026-09-05',
                'tanggal_selesai' => '2026-09-06',
                'link_foto' => null,
            ],
        ];

        foreach ($initialData as $data) {
            Perbaikan::create($data);
        }

        return redirect()->back()->with('success', 'Data perbaikan berhasil direset dengan data 5 kategori standar terbaru.');
    }

    public static function autoCategorize($pekerjaan, $keterangan = '')
    {
        $text = strtolower($pekerjaan . ' ' . $keterangan);
        if (preg_match('/(toilet|kloset|closet|pipa|kran|keran|bocor air|saluran|toren|pompa|jet pump|wastafel|drainase|sanyo|got|sanitasi)/i', $text) && !preg_match('/(atap|genteng|plafon)/i', $text)) {
            return 'Plumbing dan Sanitasi (PS)';
        }
        if (preg_match('/(ac|freon|tidak dingin|cuci ac|chiller|kompresor|hvac|pendingin|cassette)/i', $text)) {
            return 'Pendingin Udara (HVAC)';
        }
        if (preg_match('/(listrik|mcb|lampu|kabel|sakelar|saklar|stop kontak|korslet|konslet|panel|genset|trafo)/i', $text)) {
            return 'Mekanikal dan Elektrikal (MEL)';
        }
        if (preg_match('/(meja|kursi|lemari|kunci|handle|gagang|engsel|kitchen|setrika|furniture|kasur|sofa|gorden|rak)/i', $text)) {
            return 'Interior dan Fixture (FF&E)';
        }
        return 'Sipil dan Struktural (SST)';
    }

    public static function autoUrgensi($pekerjaan, $keterangan = '')
    {
        $text = strtolower($pekerjaan . ' ' . $keterangan);
        if (preg_match('/(darurat|emergency|korslet|banjir|jebol|parah)/i', $text)) {
            return 'High';
        }
        if (preg_match('/(bocor|mati total|lepas|rusak berat|trip|tidak dingin|mampet)/i', $text)) {
            return 'Medium';
        }
        return 'Low';
    }
}
