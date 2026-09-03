<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Imports\BbmImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;

class BbmImportController extends Controller
{
    public function import(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|mimes:xlsx,xls,csv|max:10240',
            ]);

            // Gunakan import custom yang membaca baris secara spesifik
            Excel::import(new BbmImport, $request->file('file'));

            return redirect()->back()->with('success', 'Data Laporan Pemakaian BBM berhasil diimport (Hanya Pemakaian Operasional).');
        } catch (\Exception $e) {
            Log::error('BBM Import Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Terjadi kesalahan saat import data: ' . $e->getMessage());
        }
    }
}
