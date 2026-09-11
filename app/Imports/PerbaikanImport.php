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

        // Lokasi: ambil dari kolom no_unit_rd, unit_rd, lokasi, atau deteksi dari deskripsi
        $lokasi = $row['no_unit_rd'] 
            ?? $row['unit_rd'] 
            ?? $row['unit'] 
            ?? $row['lokasi'] 
            ?? null;

        if (empty($lokasi)) {
            if (preg_match('/(RD\s*\d+|Rumah\s*Dinas\s*(?:No\.?)?\s*\d+|Wisma\s*[A-Za-z0-9]+|Kantor|Mess|Pos\s*Security)/i', $pekerjaan, $matches)) {
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
        $rawKategori = $row['kategori'] ?? null;
        if (!empty($rawKategori)) {
            $rk = strtolower($rawKategori);
            if (str_contains($rk, 'sst') || str_contains($rk, 'sipil')) $kategori = 'Sipil dan Struktural (SST)';
            elseif (str_contains($rk, 'ps') || str_contains($rk, 'plumb') || str_contains($rk, 'sanit')) $kategori = 'Plumbing dan Sanitasi (PS)';
            elseif (str_contains($rk, 'mel') || str_contains($rk, 'mep') || str_contains($rk, 'listrik') || str_contains($rk, 'mekanikal')) $kategori = 'Mekanikal dan Elektrikal (MEL)';
            elseif (str_contains($rk, 'hvac') || str_contains($rk, 'ac') || str_contains($rk, 'pendingin')) $kategori = 'Pendingin Udara (HVAC)';
            elseif (str_contains($rk, 'ff&e') || str_contains($rk, 'ffe') || str_contains($rk, 'interior') || str_contains($rk, 'fixture')) $kategori = 'Interior dan Fixture (FF&E)';
            else $kategori = $rawKategori;
        } else {
            $kategori = LogistikController::autoCategorize($pekerjaan, $keterangan);
        }
        $rawUrgensi = strtolower(trim($row['urgensi'] ?? ''));
        if ($rawUrgensi === 'high' || $rawUrgensi === 'emergency' || $rawUrgensi === 'darurat') {
            $urgensi = 'High';
        } elseif ($rawUrgensi === 'medium' || $rawUrgensi === 'normal' || $rawUrgensi === 'sedang') {
            $urgensi = 'Medium';
        } elseif ($rawUrgensi === 'low' || $rawUrgensi === 'rendah') {
            $urgensi = 'Low';
        } elseif (!empty($row['urgensi'])) {
            $urgensi = ucfirst($row['urgensi']);
        } else {
            $urgensi = LogistikController::autoUrgensi($pekerjaan, $keterangan);
        }

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
            $valStr = trim((string)$value);
            // Format DD/MM/YYYY atau DD-MM-YYYY (standar Indonesia pada Excel)
            if (preg_match('/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/', $valStr, $m)) {
                $day = (int)$m[1];
                $month = (int)$m[2];
                $year = (int)$m[3];
                return sprintf('%04d-%02d-%02d', $year, $month, $day);
            }
            return Carbon::parse($valStr)->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }
}
