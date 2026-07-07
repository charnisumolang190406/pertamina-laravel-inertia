<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LemburTad;

class HcController extends Controller
{
    public function destroyLemburTad($id)
    {
        LemburTad::destroy($id);
        return redirect()->back()->with('success', 'Data lembur TAD berhasil dihapus.');
    }

    public function destroyLemburTadByPeriode(Request $request)
    {
        $request->validate([
            'periode' => ['required', 'string']
        ]);
        
        LemburTad::where('periode', $request->input('periode'))->delete();
        return redirect()->back()->with('success', 'Seluruh data lembur periode ' . $request->input('periode') . ' berhasil dihapus.');
    }
}
