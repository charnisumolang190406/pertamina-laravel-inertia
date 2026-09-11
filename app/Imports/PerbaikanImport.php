<?php

namespace App\Imports;

use App\Models\Perbaikan;
use App\Http\Controllers\LogistikController;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PerbaikanImport implements ToModel, WithHeadingRow
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        // Pengecekan variasi nama kolom pekerjaan
        $pekerjaan = $row['deskripsi_pekerjaan'] 
            ?? $row['pekerjaan'] 
            ?? $row['uraian_pekerjaan'] 
            ?? $row['uraian'] 
            ?? null;

        if (empty($pekerjaan) || empty(trim($pekerjaan))) {
            return null;
        }

        // Lokasi: ambil dari kolom lokasi atau deteksi dari deskripsi
        $lokasi = $row['lokasi'] ?? null;
        if (empty($lokasi)) {
            if (preg_match('/(RD\s*\d+|Rumah\s*Dinas\s*(?:No\.?)?\s*\d+|Wisma\s*[A-Za-z0-9]+)/i', $pekerjaan, $matches)) {
                $lokasi = trim($matches[1]);
            } else {
                $lokasi = 'Rumah Dinas';
            }
        }

        // Parsing tanggal
        $tglRequest = $this->parseDate($row['tanggal_request'] ?? $row['tgl_request'] ?? null);
        $tglSelesai = $this->parseDate($row['tanggal_selesai'] ?? $row['tgl_selesai'] ?? null);

        // Kategori & Urgensi (Auto-Categorizer jika tidak ada kolom di Excel)
        $keterangan = $row['keterangan'] ?? '';
        $kategori = !empty($row['kategori']) ? $row['kategori'] : LogistikController::autoCategorize($pekerjaan, $keterangan);
        $urgensi = !empty($row['urgensi']) ? $row['urgensi'] : LogistikController::autoUrgensi($pekerjaan, $keterangan);

        $status = $row['status'] ?? ($tglSelesai ? 'Done' : 'In Progress');
        $linkFoto = $row['link_bukti_foto_opsional'] ?? $row['link_foto'] ?? $row['foto'] ?? null;
        $estimasi = isset($row['estimasi']) && is_numeric($row['estimasi']) ? $row['estimasi'] : 0;
        $realisasi = isset($row['realisasi']) && is_numeric($row['realisasi']) ? $row['realisasi'] : 0;

        $newId = (int) (DB::table('perbaikan')->max('id') ?? 0) + 1;

        return new Perbaikan([
            'id' => $newId,
            'lokasi' => $lokasi,
            'pekerjaan' => trim($pekerjaan),
            'kategori' => $kategori,
            'urgensi' => $urgensi,
            'tanggal_request' => $tglRequest ?? now()->format('Y-m-d'),
            'tanggal_selesai' => $tglSelesai,
            'status' => $status,
            'estimasi' => $estimasi,
            'realisasi' => $realisasi,
            'link_foto' => $linkFoto,
            'keterangan' => $keterangan,
        ]);
    }
    
    private function parseDate($value)
    {
        if (!$value) return null;
        
        try {
            if (is_numeric($value)) {
                return \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($value)->format('Y-m-d');
            }
            return Carbon::parse($value)->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }
}
