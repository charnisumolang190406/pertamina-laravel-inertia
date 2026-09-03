<?php

namespace App\Imports;

use App\Models\Perbaikan;
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
        // Pengecekan baris kosong
        if (!isset($row['deskripsi_pekerjaan']) || empty(trim($row['deskripsi_pekerjaan']))) {
            return null;
        }

        // Parsing tanggal, Excel format bisa berupa angka serial atau string Y-m-d
        $tglRequest = $this->parseDate($row['tanggal_request'] ?? null);
        $tglSelesai = $this->parseDate($row['tanggal_selesai'] ?? null);
        
        $newId = DB::table('perbaikan')->max('id') + 1;

        return new Perbaikan([
            'id' => $newId,
            'pekerjaan' => $row['deskripsi_pekerjaan'],
            'tanggal_request' => $tglRequest,
            'tanggal_selesai' => $tglSelesai,
            'status' => $row['status'] ?? 'In Progress',
            'link_foto' => $row['link_bukti_foto_opsional'] ?? null,
            'lokasi' => 'Rumah Dinas', // default
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
