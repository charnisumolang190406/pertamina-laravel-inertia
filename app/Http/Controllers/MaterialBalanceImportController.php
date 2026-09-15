<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\MaterialBalanceImport;
use App\Models\MaterialBalance;
use App\Models\UploadArchive;

class MaterialBalanceImportController extends Controller
{
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:15360',
        ]);

        try {
            $file = $request->file('file');
            $filePath = $file->getRealPath();
            $sheetNames = [];

            try {
                $reader = \PhpOffice\PhpSpreadsheet\IOFactory::createReaderForFile($filePath);
                $sheetNames = $reader->listWorksheetNames($filePath);
            } catch (\Throwable $err) {
                \Illuminate\Support\Facades\Log::warning("Could not pre-read sheet names: " . $err->getMessage());
            }

            Excel::import(new MaterialBalanceImport($sheetNames), $file);

            $totalProcessed = MaterialBalance::count();
            $sohCount = MaterialBalance::where('kategori', 'SOH')->count();
            $twoYspCount = MaterialBalance::where('kategori', '2YSP')->count();

            // Log the upload for history
            UploadArchive::create([
                'id' => (int)(microtime(true) * 1000) + rand(1000, 9999),
                'filename' => $request->file('file')->getClientOriginalName(),
                'fileSize' => round($request->file('file')->getSize() / 1024, 2) . ' KB',
                'type' => 'MATERIAL_BALANCE Import',
                'timestamp' => date('d-m-Y H:i:s'),
                'rowCount' => $totalProcessed,
                'uploaded_by' => 'Admin Facility Management',
            ]);

            return redirect()->back()->with('success', "File Excel Material Balance Inventory berhasil diunggah! Sebanyak {$totalProcessed} item ({$sohCount} SOH, {$twoYspCount} 2YSP) berhasil disimpan ke sistem.");
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Material Balance Import Error: " . $e->getMessage());

            UploadArchive::create([
                'id' => (int)(microtime(true) * 1000) + rand(1000, 9999),
                'filename' => $request->file('file')->getClientOriginalName(),
                'fileSize' => round($request->file('file')->getSize() / 1024, 2) . ' KB',
                'type' => 'MATERIAL_BALANCE Import (GAGAL)',
                'timestamp' => date('d-m-Y H:i:s'),
                'rowCount' => 0,
                'uploaded_by' => 'Admin Facility Management',
            ]);

            return redirect()->back()->with('error', 'Gagal mengimpor file Material Balance: ' . $e->getMessage());
        }
    }
}
