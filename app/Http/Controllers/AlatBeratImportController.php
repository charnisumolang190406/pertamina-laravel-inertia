<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\AlatBeratImport;
use App\Models\UploadArchive;

class AlatBeratImportController extends Controller
{
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:10240',
        ]);

        try {
            // Import the file using the dedicated AlatBeratImport class
            Excel::import(new AlatBeratImport, $request->file('file'));

            // Log the upload for history
            \App\Models\UploadArchive::create([
                'id' => (int)(microtime(true) * 1000) + rand(1000, 9999),
                'filename' => $request->file('file')->getClientOriginalName(),
                'fileSize' => round($request->file('file')->getSize() / 1024, 2) . ' KB',
                'type' => 'ALAT_BERAT Import',
                'timestamp' => date('d-m-Y H:i:s'),
                'rowCount' => 0, // Since we don't return count from Excel::import natively easily here
                'uploaded_by' => 'Admin Facility Management',
            ]);

            return response()->json(['message' => 'File Excel Alat Berat berhasil diunggah dan diproses oleh PHP Backend!']);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Alat Berat Import Error: " . $e->getMessage());
            
            // Log the failed upload
            \App\Models\UploadArchive::create([
                'id' => (int)(microtime(true) * 1000) + rand(1000, 9999),
                'filename' => $request->file('file')->getClientOriginalName(),
                'fileSize' => round($request->file('file')->getSize() / 1024, 2) . ' KB',
                'type' => 'ALAT_BERAT Import (GAGAL)',
                'timestamp' => date('d-m-Y H:i:s'),
                'rowCount' => 0,
                'uploaded_by' => 'Admin Facility Management',
            ]);

            return response()->json(['error' => 'Gagal mengimpor file Alat Berat: ' . $e->getMessage()], 500);
        }
    }
}
