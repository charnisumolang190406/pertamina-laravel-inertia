<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\RiskRegisterImport;
use App\Models\RiskRegister;
use App\Models\UploadArchive;
use Illuminate\Support\Facades\Log;

class RiskRegisterImportController extends Controller
{
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:10240',
        ]);

        try {
            Excel::import(new RiskRegisterImport, $request->file('file'));

            $count = RiskRegister::count();

            // Log upload history
            UploadArchive::create([
                'id' => (int)(microtime(true) * 1000) + rand(1000, 9999),
                'filename' => $request->file('file')->getClientOriginalName(),
                'fileSize' => round($request->file('file')->getSize() / 1024, 2) . ' KB',
                'type' => 'RISK_REGISTER Import',
                'timestamp' => date('d-m-Y H:i:s'),
                'rowCount' => $count,
                'uploaded_by' => auth()->user()->fullName ?? (auth()->user()->role ?? 'Admin BPB'),
            ]);

            return redirect()->back()->with('success', "File Risk Register berhasil diimpor! Sebanyak {$count} data risiko berhasil diproses oleh Backend PHP.");
        } catch (\Exception $e) {
            Log::error("Risk Register Import Error: " . $e->getMessage());

            UploadArchive::create([
                'id' => (int)(microtime(true) * 1000) + rand(1000, 9999),
                'filename' => $request->file('file')->getClientOriginalName(),
                'fileSize' => round($request->file('file')->getSize() / 1024, 2) . ' KB',
                'type' => 'RISK_REGISTER Import (GAGAL)',
                'timestamp' => date('d-m-Y H:i:s'),
                'rowCount' => 0,
                'uploaded_by' => auth()->user()->fullName ?? (auth()->user()->role ?? 'Admin BPB'),
            ]);

            return redirect()->back()->with('error', 'Gagal mengimpor file Risk Register: ' . $e->getMessage());
        }
    }

    public function clear()
    {
        try {
            RiskRegister::truncate();
            return redirect()->back()->with('success', 'Seluruh data Risk Register berhasil dikosongkan.');
        } catch (\Exception $e) {
            Log::error("Risk Register Clear Error: " . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal mengosongkan data Risk Register: ' . $e->getMessage());
        }
    }
}
