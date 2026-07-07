<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Arsip;
use App\Models\UploadArchive;

class ArsipController extends Controller
{
    public function destroyArsip($id)
    {
        Arsip::destroy($id);
        return redirect()->back()->with('success', 'Dokumen berhasil dihapus.');
    }

    public function destroyUploadLog($id)
    {
        UploadArchive::destroy($id);
        return redirect()->back()->with('success', 'Log riwayat unggahan berhasil dihapus.');
    }
}
