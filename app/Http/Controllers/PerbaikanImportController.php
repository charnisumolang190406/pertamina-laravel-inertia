<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Imports\PerbaikanImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\DB;

class PerbaikanImportController extends Controller
{
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,csv,xls|max:10240', // 10MB Max
        ]);

        try {
            DB::beginTransaction();
            
            // Delete old data if necessary, or just append. Let's append for now to be safe,
            // or clear it if it's meant to be a full replace. Since it's a dashboard, we'll append.
            
            Excel::import(new PerbaikanImport, $request->file('file'));
            
            DB::commit();
            return redirect()->back()->with('success', 'File Excel berhasil diunggah dan data perbaikan telah diperbarui!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal mengunggah file: ' . $e->getMessage());
        }
    }
}
