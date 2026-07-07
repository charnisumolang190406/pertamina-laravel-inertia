<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Scm;
use App\Models\UploadArchive;
use Illuminate\Support\Facades\Auth;

class ScmController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nomor' => ['required', 'string'],
            'nama' => ['required', 'string'],
            'vendor' => ['required', 'string'],
            'nilai' => ['required', 'numeric'],
            'mulai' => ['required', 'string'],
            'selesai' => ['required', 'string'],
            'progres' => ['required', 'integer'],
            'status' => ['required', 'string'],
            'fungsi' => ['required', 'string'],
        ]);

        $id = (int)(microtime(true) * 1000); // Unique timestamp ID
        $scm = Scm::create(array_merge(['id' => $id], $validated));

        // Create log in upload history
        $timestamp = date('d/m/Y, H.i.s');
        UploadArchive::create([
            'id' => $id,
            'filename' => "Manual Entry: {$scm->nomor}",
            'fileSize' => '-',
            'type' => 'Monitoring Kontrak (SCM)',
            'timestamp' => $timestamp,
            'rowCount' => 1,
            'uploadedBy' => Auth::user()->fullName ?? 'Admin IT',
        ]);

        return redirect()->back()->with('success', 'Kontrak berhasil ditambahkan.');
    }

    public function destroy($id)
    {
        Scm::destroy($id);
        return redirect()->back()->with('success', 'Kontrak berhasil dihapus.');
    }

    public function clear()
    {
        Scm::truncate();
        return redirect()->back()->with('success', 'Semua data kontrak berhasil dikosongkan.');
    }

    public function reset()
    {
        Scm::truncate();

        // Initial default data
        $initialData = [
            [
                'id' => 1,
                'nomor' => '012/PGE-LHD/BS/2025',
                'nama' => 'Penyediaan Jasa Pengemudi Operasional Area Lahendong',
                'vendor' => 'PT Kawanua Multi Mandiri',
                'nilai' => 1200000000,
                'mulai' => '2025-01-01',
                'selesai' => '2026-12-31',
                'progres' => 75,
                'status' => 'Aktif',
                'fungsi' => 'BS',
            ],
            [
                'id' => 2,
                'nomor' => '034/PGE-LHD/SCM/2026',
                'nama' => 'Pengadaan Carbon Steel Pipe 6 Inch Sch 80',
                'vendor' => 'PT Pertamina Drilling Services Indonesia',
                'nilai' => 850000000,
                'mulai' => '2026-02-15',
                'selesai' => '2026-08-15',
                'progres' => 40,
                'status' => 'Aktif',
                'fungsi' => 'SCM',
            ],
            [
                'id' => 3,
                'nomor' => '056/PGE-LHD/MTC/2025',
                'nama' => 'Jasa Pemeliharaan Rutin Turbine & Generator Unit 5 & 6',
                'vendor' => 'PT Fuji Electric Indonesia',
                'nilai' => 4500000000,
                'mulai' => '2025-03-01',
                'selesai' => '2026-03-01',
                'progres' => 100,
                'status' => 'Selesai',
                'fungsi' => 'MTC',
            ],
            [
                'id' => 4,
                'nomor' => '078/PGE-LHD/HSSE/2026',
                'nama' => 'Pekerjaan Pemasangan Fire Hydrant System Gedung Kantor',
                'vendor' => 'PT Mitra Proteksi Manado',
                'nilai' => 600000000,
                'mulai' => '2026-04-01',
                'selesai' => '2026-10-01',
                'progres' => 20,
                'status' => 'Kritis',
                'fungsi' => 'HSSE',
            ],
            [
                'id' => 5,
                'nomor' => '089/PGE-LHD/BS/2026',
                'nama' => 'Sewa Kendaraan Penunjang Operasional PGE Lahendong',
                'vendor' => 'PT Trans Kawanua Rentcar',
                'nilai' => 1450000000,
                'mulai' => '2026-01-01',
                'selesai' => '2026-12-31',
                'progres' => 50,
                'status' => 'Amandemen',
                'fungsi' => 'BS',
            ],
        ];

        foreach ($initialData as $data) {
            Scm::create($data);
        }

        return redirect()->back()->with('success', 'Data kontrak berhasil direset ke default awal.');
    }
}
