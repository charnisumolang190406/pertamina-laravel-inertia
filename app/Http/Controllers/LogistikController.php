<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Stok;
use App\Models\AlatBerat;
use App\Models\Perbaikan;
use App\Models\MaterialBalance;

class LogistikController extends Controller
{
    // === MATERIAL BALANCE (STOK MATERIAL GUDANG SOH & 2YSP) SECTION ===
    public function destroyMaterialBalance($id)
    {
        MaterialBalance::destroy($id);
        return redirect()->back()->with('success', 'Item material berhasil dihapus.');
    }

    public function clearMaterialBalance()
    {
        MaterialBalance::query()->delete();
        return redirect()->back()->with('success', 'Data stok material berhasil dikosongkan.');
    }

    public function resetMaterialBalance()
    {
        MaterialBalance::query()->delete();

        $sampleData = [
            // ── SHEET 1: STOCK ON HAND (SOH / LHD1) ──
            ['id' => 1, 'kimap' => 'C536901703', 'deskripsi' => 'LINER, PN.ST225332A/16', 'plant' => 'E003', 'storage_location' => 'LHD1', 'uom' => 'SET', 'stock_awal' => 4, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 4, 'physical_check' => 4, 'selisih_physical' => 0, 'qty_mysap' => 4, 'selisih_mysap' => 0, 'binloc' => 'CC-1-2', 'kategori' => 'SOH', 'periode' => 'Juli 2026'],
            ['id' => 2, 'kimap' => 'C536901704', 'deskripsi' => 'LINER, PN.ST225332A/18', 'plant' => 'E003', 'storage_location' => 'LHD1', 'uom' => 'SET', 'stock_awal' => 2, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 2, 'physical_check' => 2, 'selisih_physical' => 0, 'qty_mysap' => 2, 'selisih_mysap' => 0, 'binloc' => 'CC-1-2', 'kategori' => 'SOH', 'periode' => 'Juli 2026'],
            ['id' => 3, 'kimap' => 'C536901705', 'deskripsi' => 'LINER, PN.ST225332A/18', 'plant' => 'E003', 'storage_location' => 'LHD1', 'uom' => 'SET', 'stock_awal' => 2, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 2, 'physical_check' => 2, 'selisih_physical' => 0, 'qty_mysap' => 2, 'selisih_mysap' => 0, 'binloc' => 'CC-1-2', 'kategori' => 'SOH', 'periode' => 'Juli 2026'],
            ['id' => 4, 'kimap' => 'C536901706', 'deskripsi' => 'LINER, PN.ST225332A/12', 'plant' => 'E003', 'storage_location' => 'LHD1', 'uom' => 'SET', 'stock_awal' => 2, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 2, 'physical_check' => 2, 'selisih_physical' => 0, 'qty_mysap' => 2, 'selisih_mysap' => 0, 'binloc' => 'CC-1-2', 'kategori' => 'SOH', 'periode' => 'Juli 2026'],
            ['id' => 5, 'kimap' => 'C536901885', 'deskripsi' => 'LINER, DWG.M575-281591C1, IT.37', 'plant' => 'E003', 'storage_location' => 'LHD1', 'uom' => 'SET', 'stock_awal' => 2, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 2, 'physical_check' => 2, 'selisih_physical' => 0, 'qty_mysap' => 2, 'selisih_mysap' => 0, 'binloc' => 'CC-1-2', 'kategori' => 'SOH', 'periode' => 'Juli 2026'],
            ['id' => 6, 'kimap' => 'C632600307', 'deskripsi' => 'INS.TAPPER PIN, PN.M673-281499P33/33', 'plant' => 'E003', 'storage_location' => 'LHD1', 'uom' => 'PCS', 'stock_awal' => 2, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 2, 'physical_check' => 2, 'selisih_physical' => 0, 'qty_mysap' => 2, 'selisih_mysap' => 0, 'binloc' => 'CC-1-2', 'kategori' => 'SOH', 'periode' => 'Juli 2026'],
            ['id' => 7, 'kimap' => 'C761500053', 'deskripsi' => 'SHOE, FLOAT, 13.3/8IN, L80, 68PPF, TSH BLUE', 'plant' => 'E003', 'storage_location' => 'LHD1', 'uom' => 'PCS', 'stock_awal' => 5, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 5, 'physical_check' => 5, 'selisih_physical' => 0, 'qty_mysap' => 5, 'selisih_mysap' => 0, 'binloc' => 'AE', 'kategori' => 'SOH', 'periode' => 'Juli 2026'],
            ['id' => 8, 'kimap' => 'C761500074', 'deskripsi' => 'SHOE, FLOAT, 9.5/8IN, L80, 47PPF, TSH BLUE', 'plant' => 'E003', 'storage_location' => 'LHD1', 'uom' => 'PCS', 'stock_awal' => 1, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 1, 'physical_check' => 1, 'selisih_physical' => 0, 'qty_mysap' => 1, 'selisih_mysap' => 0, 'binloc' => 'E', 'kategori' => 'SOH', 'periode' => 'Juli 2026'],
            ['id' => 9, 'kimap' => 'C791905460', 'deskripsi' => 'SPACER, 12XD119, PN.ST118884A/9', 'plant' => 'E003', 'storage_location' => 'LHD1', 'uom' => 'SET', 'stock_awal' => 8, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 8, 'physical_check' => 8, 'selisih_physical' => 0, 'qty_mysap' => 8, 'selisih_mysap' => 0, 'binloc' => 'CC-1-2', 'kategori' => 'SOH', 'periode' => 'Juli 2026'],
            ['id' => 10, 'kimap' => 'C791905461', 'deskripsi' => 'SPACER, 12XD99, PN.ST118884A/12', 'plant' => 'E003', 'storage_location' => 'LHD1', 'uom' => 'SET', 'stock_awal' => 4, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 4, 'physical_check' => 4, 'selisih_physical' => 0, 'qty_mysap' => 4, 'selisih_mysap' => 0, 'binloc' => 'CC-1-2', 'kategori' => 'SOH', 'periode' => 'Juli 2026'],
            ['id' => 11, 'kimap' => 'C791905462', 'deskripsi' => 'SPACER, 25X150X259, PN.ST118884A/13', 'plant' => 'E003', 'storage_location' => 'LHD1', 'uom' => 'SET', 'stock_awal' => 4, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 4, 'physical_check' => 4, 'selisih_physical' => 0, 'qty_mysap' => 4, 'selisih_mysap' => 0, 'binloc' => 'CC-1-2', 'kategori' => 'SOH', 'periode' => 'Juli 2026'],
            ['id' => 12, 'kimap' => 'C791905463', 'deskripsi' => 'SPACER, PN.ST212783G/4-0', 'plant' => 'E003', 'storage_location' => 'LHD1', 'uom' => 'SET', 'stock_awal' => 4, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 4, 'physical_check' => 4, 'selisih_physical' => 0, 'qty_mysap' => 4, 'selisih_mysap' => 0, 'binloc' => 'CC-1-3', 'kategori' => 'SOH', 'periode' => 'Juli 2026'],
            ['id' => 13, 'kimap' => 'C791905464', 'deskripsi' => 'SPACER, PN.ST212783G/7-0', 'plant' => 'E003', 'storage_location' => 'LHD1', 'uom' => 'SET', 'stock_awal' => 2, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 2, 'physical_check' => 2, 'selisih_physical' => 0, 'qty_mysap' => 2, 'selisih_mysap' => 0, 'binloc' => 'CC-1-3', 'kategori' => 'SOH', 'periode' => 'Juli 2026'],
            ['id' => 14, 'kimap' => 'C791905465', 'deskripsi' => 'SPACER, PN.ST212783G/11-0', 'plant' => 'E003', 'storage_location' => 'LHD1', 'uom' => 'SET', 'stock_awal' => 3, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 3, 'physical_check' => 3, 'selisih_physical' => 0, 'qty_mysap' => 3, 'selisih_mysap' => 0, 'binloc' => 'CC-1-3', 'kategori' => 'SOH', 'periode' => 'Juli 2026'],
            ['id' => 15, 'kimap' => 'C791905466', 'deskripsi' => 'SPACER, OD589, PN.ST226490C2/11-0', 'plant' => 'E003', 'storage_location' => 'LHD1', 'uom' => 'SET', 'stock_awal' => 4, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 4, 'physical_check' => 4, 'selisih_physical' => 0, 'qty_mysap' => 4, 'selisih_mysap' => 0, 'binloc' => 'CC-1-3', 'kategori' => 'SOH', 'periode' => 'Juli 2026'],
            ['id' => 16, 'kimap' => 'C791905467', 'deskripsi' => 'SPACER, PN.ST213520I/4-0', 'plant' => 'E003', 'storage_location' => 'LHD1', 'uom' => 'SET', 'stock_awal' => 4, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 4, 'physical_check' => 4, 'selisih_physical' => 0, 'qty_mysap' => 4, 'selisih_mysap' => 0, 'binloc' => 'CC-1-3', 'kategori' => 'SOH', 'periode' => 'Juli 2026'],
            ['id' => 17, 'kimap' => 'C791905468', 'deskripsi' => 'SPACER, PN.ST213520I/7-0', 'plant' => 'E003', 'storage_location' => 'LHD1', 'uom' => 'SET', 'stock_awal' => 2, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 2, 'physical_check' => 2, 'selisih_physical' => 0, 'qty_mysap' => 2, 'selisih_mysap' => 0, 'binloc' => 'CC-1-3', 'kategori' => 'SOH', 'periode' => 'Juli 2026'],
            ['id' => 18, 'kimap' => 'C791905469', 'deskripsi' => 'SPACER, PN.ST213520I/11-0', 'plant' => 'E003', 'storage_location' => 'LHD1', 'uom' => 'SET', 'stock_awal' => 3, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 3, 'physical_check' => 3, 'selisih_physical' => 0, 'qty_mysap' => 3, 'selisih_mysap' => 0, 'binloc' => 'CC-1-3', 'kategori' => 'SOH', 'periode' => 'Juli 2026'],
            ['id' => 19, 'kimap' => 'C875900016', 'deskripsi' => 'THROTTLE PLATE, CL 600, 10 IN', 'plant' => 'E003', 'storage_location' => 'LHD1', 'uom' => 'SET', 'stock_awal' => 6, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 6, 'physical_check' => 6, 'selisih_physical' => 0, 'qty_mysap' => 6, 'selisih_mysap' => 0, 'binloc' => 'CA-2-1', 'kategori' => 'SOH', 'periode' => 'Juli 2026'],
            ['id' => 20, 'kimap' => 'E060054233', 'deskripsi' => 'BALL BEARING, 90X46, IT.P001', 'plant' => 'E003', 'storage_location' => 'LHD1', 'uom' => 'PCS', 'stock_awal' => 3, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 3, 'physical_check' => 3, 'selisih_physical' => 0, 'qty_mysap' => 3, 'selisih_mysap' => 0, 'binloc' => 'CC-1-3', 'kategori' => 'SOH', 'periode' => 'Juli 2026'],
            ['id' => 21, 'kimap' => 'E060170058', 'deskripsi' => 'LINERS, SN.K1HD0002L1, IT.GC-022', 'plant' => 'E003', 'storage_location' => 'LHD1', 'uom' => 'PCS', 'stock_awal' => 4, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 4, 'physical_check' => 4, 'selisih_physical' => 0, 'qty_mysap' => 4, 'selisih_mysap' => 0, 'binloc' => 'CC-1-3', 'kategori' => 'SOH', 'periode' => 'Juli 2026'],
            ['id' => 22, 'kimap' => 'E060170059', 'deskripsi' => 'LINERS, SN.K1HD0002L1, IT.GC-023', 'plant' => 'E003', 'storage_location' => 'LHD1', 'uom' => 'PCS', 'stock_awal' => 2, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 2, 'physical_check' => 2, 'selisih_physical' => 0, 'qty_mysap' => 2, 'selisih_mysap' => 0, 'binloc' => 'CC-1-3', 'kategori' => 'SOH', 'periode' => 'Juli 2026'],
            ['id' => 23, 'kimap' => 'E060170060', 'deskripsi' => 'LINERS, SN.K1HD0002L1, IT.GC-044', 'plant' => 'E003', 'storage_location' => 'LHD1', 'uom' => 'PCS', 'stock_awal' => 4, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 4, 'physical_check' => 4, 'selisih_physical' => 0, 'qty_mysap' => 4, 'selisih_mysap' => 0, 'binloc' => 'CC-1-3', 'kategori' => 'SOH', 'periode' => 'Juli 2026'],
            ['id' => 24, 'kimap' => 'E060170061', 'deskripsi' => 'LINERS, SN.K1HD0002L1, IT.GC-045', 'plant' => 'E003', 'storage_location' => 'LHD1', 'uom' => 'PCS', 'stock_awal' => 2, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 2, 'physical_check' => 2, 'selisih_physical' => 0, 'qty_mysap' => 2, 'selisih_mysap' => 0, 'binloc' => 'CC-1-3', 'kategori' => 'SOH', 'periode' => 'Juli 2026'],
            ['id' => 25, 'kimap' => 'E060170062', 'deskripsi' => 'INS.LINERS, SN.K1HD0002L1, IT.GC-050', 'plant' => 'E003', 'storage_location' => 'LHD1', 'uom' => 'PCS', 'stock_awal' => 4, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 4, 'physical_check' => 4, 'selisih_physical' => 0, 'qty_mysap' => 4, 'selisih_mysap' => 0, 'binloc' => 'CC-1-3', 'kategori' => 'SOH', 'periode' => 'Juli 2026'],
            ['id' => 26, 'kimap' => 'E060170063', 'deskripsi' => 'INS.LINERS, SN.K1HD0002L1, IT.GC-051', 'plant' => 'E003', 'storage_location' => 'LHD1', 'uom' => 'PCS', 'stock_awal' => 2, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 2, 'physical_check' => 2, 'selisih_physical' => 0, 'qty_mysap' => 2, 'selisih_mysap' => 0, 'binloc' => 'CC-1-3', 'kategori' => 'SOH', 'periode' => 'Juli 2026'],

            // ── SHEET 2: 2 YEARS SPARE PART (2YSP) ──
            ['id' => 27, 'kimap' => '1830901139', 'deskripsi' => 'CAULKING WIRE, 1.6X1.6, IT.K014', 'plant' => 'E003', 'storage_location' => '2YSP', 'uom' => 'M', 'stock_awal' => 50, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 50, 'physical_check' => 50, 'selisih_physical' => 0, 'qty_mysap' => 50, 'selisih_mysap' => 0, 'binloc' => 'JE-1-1', 'kategori' => '2YSP', 'periode' => 'Juli 2026'],
            ['id' => 28, 'kimap' => 'J200940459', 'deskripsi' => 'GASKET, 101, IT.P010', 'plant' => 'E003', 'storage_location' => '2YSP', 'uom' => 'PCS', 'stock_awal' => 1, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 1, 'physical_check' => 1, 'selisih_physical' => 0, 'qty_mysap' => 1, 'selisih_mysap' => 0, 'binloc' => 'JF-1-1', 'kategori' => '2YSP', 'periode' => 'Juli 2026'],
            ['id' => 29, 'kimap' => 'J200940472', 'deskripsi' => 'HV BUSHING GASKET SET, DWG.T.0561.GI05', 'plant' => 'E003', 'storage_location' => '2YSP', 'uom' => 'SET', 'stock_awal' => 1, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 1, 'physical_check' => 1, 'selisih_physical' => 0, 'qty_mysap' => 1, 'selisih_mysap' => 0, 'binloc' => 'WA', 'kategori' => '2YSP', 'periode' => 'Juli 2026'],
            ['id' => 30, 'kimap' => 'J200940473', 'deskripsi' => 'LV BUSHING GASKET SET, DWG.T.0561.GI05', 'plant' => 'E003', 'storage_location' => '2YSP', 'uom' => 'SET', 'stock_awal' => 1, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 1, 'physical_check' => 1, 'selisih_physical' => 0, 'qty_mysap' => 1, 'selisih_mysap' => 0, 'binloc' => 'WA', 'kategori' => '2YSP', 'periode' => 'Juli 2026'],
            ['id' => 31, 'kimap' => 'J355915230', 'deskripsi' => 'O-RING, G230, IT.P012', 'plant' => 'E003', 'storage_location' => '2YSP', 'uom' => 'PCS', 'stock_awal' => 1, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 1, 'physical_check' => 1, 'selisih_physical' => 0, 'qty_mysap' => 1, 'selisih_mysap' => 0, 'binloc' => 'JF-1-1', 'kategori' => '2YSP', 'periode' => 'Juli 2026'],
            ['id' => 32, 'kimap' => 'J370909220', 'deskripsi' => 'PACKING, 24,1.5 THK, IT.K005', 'plant' => 'E003', 'storage_location' => '2YSP', 'uom' => 'PCS', 'stock_awal' => 1, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 1, 'physical_check' => 1, 'selisih_physical' => 0, 'qty_mysap' => 1, 'selisih_mysap' => 0, 'binloc' => 'WA', 'kategori' => '2YSP', 'periode' => 'Juli 2026'],
            ['id' => 33, 'kimap' => 'J370909221', 'deskripsi' => 'PACKING, 16,1 THK, IT.K006', 'plant' => 'E003', 'storage_location' => '2YSP', 'uom' => 'PCS', 'stock_awal' => 2, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 2, 'physical_check' => 2, 'selisih_physical' => 0, 'qty_mysap' => 2, 'selisih_mysap' => 0, 'binloc' => 'WA', 'kategori' => '2YSP', 'periode' => 'Juli 2026'],
            ['id' => 34, 'kimap' => 'J370909222', 'deskripsi' => 'PACKING, IT.R004', 'plant' => 'E003', 'storage_location' => '2YSP', 'uom' => 'PCS', 'stock_awal' => 1, 'masuk' => 0, 'keluar' => 0, 'stock_akhir' => 1, 'physical_check' => 1, 'selisih_physical' => 0, 'qty_mysap' => 1, 'selisih_mysap' => 0, 'binloc' => 'JD-1-4', 'kategori' => '2YSP', 'periode' => 'Juli 2026'],
            ['id' => 35, 'kimap' => 'J370909228', 'deskripsi' => 'PACKING SET, DWG.G 001 FUJI L56', 'plant' => 'E003', 'storage_location' => '2YSP', 'uom' => 'SET', 'stock_awal' => 2, 'masuk' => 0, 'keluar' => 2, 'stock_akhir' => 0, 'physical_check' => 0, 'selisih_physical' => 0, 'qty_mysap' => 0, 'selisih_mysap' => 0, 'binloc' => 'JC 1 2', 'kategori' => '2YSP', 'periode' => 'Juli 2026'],
        ];

        foreach ($sampleData as $d) {
            MaterialBalance::create($d);
        }

        return redirect()->back()->with('success', 'Data Stok Material Gudang berhasil direset ke data riil Juli 2026 (SOH & 2YSP).');
    }

    // === ALAT BERAT SECTION ===
    public function destroyAlatBerat($id)
    {
        AlatBerat::destroy($id);
        return redirect()->back()->with('success', 'Aset alat berat berhasil dihapus.');
    }

    public function clearAlatBerat()
    {
        AlatBerat::truncate();
        return redirect()->back()->with('success', 'Data alat berat berhasil dikosongkan.');
    }

    public function resetAlatBerat()
    {
        AlatBerat::truncate();
        $initialData = [
            // === DAFTAR ALAT BERAT DAN ALOKASI PENGGUNA (ASET-PGE LHD) - 8 UNIT ===
            [
                'id' => 1, 'nopol' => '-', 'tahun' => '-', 'jenis' => 'CRANE 30T', 'kategori' => 'Alat Berat',
                'alokasi' => 'LHD-3', 'merk' => 'TADANO', 'model' => 'GR300E-3',
                'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13',
                'status' => 'PAJAK MATI',
                'kondisi' => 'Under Maintenance: Sparepart dari UT (piping brake) estimasi ready akhir agustus 2026'
            ],
            [
                'id' => 2, 'nopol' => '-', 'tahun' => '-', 'jenis' => 'TMC 10T', 'kategori' => 'Alat Berat',
                'alokasi' => 'LHD-3', 'merk' => 'TADANO', 'model' => 'TM-ZT1000',
                'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13',
                'status' => 'PAJAK MATI',
                'kondisi' => 'Baik'
            ],
            [
                'id' => 3, 'nopol' => 'DB 8273 GY', 'tahun' => '-', 'jenis' => 'TMC 3.5T', 'kategori' => 'Alat Berat',
                'alokasi' => 'LHD-3', 'merk' => 'TADANO', 'model' => 'TM-ZT630',
                'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13',
                'status' => 'PAJAK MATI',
                'kondisi' => 'Under Maintenance'
            ],
            [
                'id' => 4, 'nopol' => '-', 'tahun' => '-', 'jenis' => 'FORKLIFT 7T', 'kategori' => 'Alat Berat',
                'alokasi' => 'LHD-2', 'merk' => 'CATERPILLAR', 'model' => 'DP70',
                'stnk' => null, 'pajak' => null, 'kir' => null,
                'status' => 'AMAN',
                'kondisi' => 'Baik'
            ],
            [
                'id' => 5, 'nopol' => '-', 'tahun' => '-', 'jenis' => 'FORKLIFT 5T', 'kategori' => 'Alat Berat',
                'alokasi' => 'LHD-3', 'merk' => 'CATERPILLAR', 'model' => 'DP50',
                'stnk' => null, 'pajak' => null, 'kir' => null,
                'status' => 'AMAN',
                'kondisi' => 'Baik'
            ],
            [
                'id' => 6, 'nopol' => '-', 'tahun' => '-', 'jenis' => 'FORKLIFT 4T', 'kategori' => 'Alat Berat',
                'alokasi' => 'LHD-3', 'merk' => 'CATERPILLAR', 'model' => 'DP40',
                'stnk' => null, 'pajak' => null, 'kir' => null,
                'status' => 'AMAN',
                'kondisi' => 'Baik'
            ],
            [
                'id' => 7, 'nopol' => '-', 'tahun' => '-', 'jenis' => 'FORKLIFT 3.5T', 'kategori' => 'Alat Berat',
                'alokasi' => 'LHD-4', 'merk' => 'CATERPILLAR', 'model' => 'DP35',
                'stnk' => null, 'pajak' => null, 'kir' => null,
                'status' => 'AMAN',
                'kondisi' => 'Baik'
            ],
            [
                'id' => 8, 'nopol' => '-', 'tahun' => '-', 'jenis' => 'FORKLIFT 2.5T', 'kategori' => 'Alat Berat',
                'alokasi' => 'LHD-3', 'merk' => 'CATERPILLAR', 'model' => 'DP25',
                'stnk' => null, 'pajak' => null, 'kir' => null,
                'status' => 'AMAN',
                'kondisi' => 'Baik'
            ],

            // === DAFTAR KRP KONTRAK PT BLP (NO.4600004311) - 26 UNIT ===
            [
                'id' => 9, 'nopol' => 'DB 1192 VD', 'tahun' => '-', 'jenis' => 'HARIAN', 'kategori' => 'KRP',
                'alokasi' => 'GM', 'merk' => 'TOYOTA', 'model' => 'FORTUNER',
                'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13',
                'status' => 'PAJAK MATI', 'kondisi' => 'Siap Operasi'
            ],
            [
                'id' => 10, 'nopol' => 'DB 1060 VD', 'tahun' => '-', 'jenis' => 'HARIAN', 'kategori' => 'KRP',
                'alokasi' => 'GM', 'merk' => 'TOYOTA', 'model' => 'INNOVA',
                'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13',
                'status' => 'PAJAK MATI', 'kondisi' => 'Siap Operasi'
            ],
            [
                'id' => 11, 'nopol' => 'DB 1062 VD', 'tahun' => '-', 'jenis' => 'HARIAN', 'kategori' => 'KRP',
                'alokasi' => 'KOMPERTA', 'merk' => 'TOYOTA', 'model' => 'INNOVA',
                'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13',
                'status' => 'PAJAK MATI', 'kondisi' => 'Siap Operasi'
            ],
            [
                'id' => 12, 'nopol' => 'DB 1055 VD', 'tahun' => '-', 'jenis' => 'HARIAN', 'kategori' => 'KRP',
                'alokasi' => 'MANAGER OPERATION', 'merk' => 'TOYOTA', 'model' => 'INNOVA',
                'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13',
                'status' => 'PAJAK MATI', 'kondisi' => 'Siap Operasi'
            ],
            [
                'id' => 13, 'nopol' => 'DB 1056 VD', 'tahun' => '-', 'jenis' => 'HARIAN', 'kategori' => 'KRP',
                'alokasi' => 'MANAGER TOMPASO', 'merk' => 'TOYOTA', 'model' => 'INNOVA',
                'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13',
                'status' => 'PAJAK MATI', 'kondisi' => 'Siap Operasi'
            ],
            [
                'id' => 14, 'nopol' => 'DB 1057 VD', 'tahun' => '-', 'jenis' => 'HARIAN', 'kategori' => 'KRP',
                'alokasi' => 'MANAGER HSSE', 'merk' => 'TOYOTA', 'model' => 'INNOVA',
                'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13',
                'status' => 'PAJAK MATI', 'kondisi' => 'Siap Operasi'
            ],
            [
                'id' => 15, 'nopol' => 'DB 1588 VC', 'tahun' => '-', 'jenis' => 'HARIAN', 'kategori' => 'KRP',
                'alokasi' => 'MANAGER BUSINESS SUPPORT', 'merk' => 'TOYOTA', 'model' => 'INNOVA',
                'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13',
                'status' => 'PAJAK MATI', 'kondisi' => 'Siap Operasi'
            ],
            [
                'id' => 16, 'nopol' => 'DB 8159 CL', 'tahun' => '-', 'jenis' => 'SHIFT', 'kategori' => 'KRP',
                'alokasi' => 'OPERATION (MONITORING CCR TOMPASO)', 'merk' => 'TOYOTA', 'model' => 'HILUX DC',
                'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13',
                'status' => 'PAJAK MATI', 'kondisi' => 'Siap Operasi'
            ],
            [
                'id' => 17, 'nopol' => 'DB 7083 CB', 'tahun' => '-', 'jenis' => 'SHIFT', 'kategori' => 'KRP',
                'alokasi' => 'OPERATION (APLOS OPERATOR CCR TOMPASO)', 'merk' => 'TOYOTA', 'model' => 'HIACE',
                'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13',
                'status' => 'PAJAK MATI', 'kondisi' => 'Siap Operasi'
            ],
            [
                'id' => 18, 'nopol' => 'DB 1063 VD', 'tahun' => '-', 'jenis' => 'SHIFT', 'kategori' => 'KRP',
                'alokasi' => 'OPERATION (APLOS OPERATOR CCR 1-4)', 'merk' => 'TOYOTA', 'model' => 'INNOVA',
                'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13',
                'status' => 'PAJAK MATI', 'kondisi' => 'Siap Operasi'
            ],
            [
                'id' => 19, 'nopol' => 'DB 8268 CL', 'tahun' => '-', 'jenis' => 'SHIFT', 'kategori' => 'KRP',
                'alokasi' => 'OPERATION (MONITORING CCR 1-4)', 'merk' => 'TOYOTA', 'model' => 'HILUX DC',
                'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13',
                'status' => 'PAJAK MATI', 'kondisi' => 'Siap Operasi'
            ],
            [
                'id' => 20, 'nopol' => 'DB 8158 CL', 'tahun' => '-', 'jenis' => 'SHIFT', 'kategori' => 'KRP',
                'alokasi' => 'HSSE SECURITY', 'merk' => 'TOYOTA', 'model' => 'HILUX DC',
                'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13',
                'status' => 'PAJAK MATI', 'kondisi' => 'Siap Operasi'
            ],
            [
                'id' => 21, 'nopol' => 'DB 1058 VD', 'tahun' => '-', 'jenis' => 'HARIAN', 'kategori' => 'KRP',
                'alokasi' => 'POOL', 'merk' => 'TOYOTA', 'model' => 'INNOVA',
                'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13',
                'status' => 'PAJAK MATI', 'kondisi' => 'Siap Operasi'
            ],
            [
                'id' => 22, 'nopol' => 'DB 1059 VD', 'tahun' => '-', 'jenis' => 'HARIAN', 'kategori' => 'KRP',
                'alokasi' => 'POOL', 'merk' => 'TOYOTA', 'model' => 'INNOVA',
                'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13',
                'status' => 'PAJAK MATI', 'kondisi' => 'Siap Operasi'
            ],
            [
                'id' => 23, 'nopol' => 'DB 1590 VC', 'tahun' => '-', 'jenis' => 'HARIAN', 'kategori' => 'KRP',
                'alokasi' => 'POOL', 'merk' => 'TOYOTA', 'model' => 'INNOVA',
                'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13',
                'status' => 'PAJAK MATI', 'kondisi' => 'Siap Operasi'
            ],
            [
                'id' => 24, 'nopol' => 'DB 1061 VD', 'tahun' => '-', 'jenis' => 'HARIAN', 'kategori' => 'KRP',
                'alokasi' => 'POOL', 'merk' => 'TOYOTA', 'model' => 'INNOVA',
                'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13',
                'status' => 'PAJAK MATI', 'kondisi' => 'Siap Operasi'
            ],
            [
                'id' => 25, 'nopol' => 'DB 1585 VC', 'tahun' => '-', 'jenis' => 'HARIAN', 'kategori' => 'KRP',
                'alokasi' => 'POOL', 'merk' => 'TOYOTA', 'model' => 'INNOVA',
                'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13',
                'status' => 'PAJAK MATI', 'kondisi' => 'Siap Operasi'
            ],
            [
                'id' => 26, 'nopol' => 'DB 1587 VC', 'tahun' => '-', 'jenis' => 'HARIAN', 'kategori' => 'KRP',
                'alokasi' => 'POOL', 'merk' => 'TOYOTA', 'model' => 'INNOVA',
                'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13',
                'status' => 'PAJAK MATI', 'kondisi' => 'Siap Operasi'
            ],
            [
                'id' => 27, 'nopol' => 'DB 1586 VC', 'tahun' => '-', 'jenis' => 'HARIAN', 'kategori' => 'KRP',
                'alokasi' => 'POOL', 'merk' => 'TOYOTA', 'model' => 'INNOVA',
                'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13',
                'status' => 'PAJAK MATI', 'kondisi' => 'Siap Operasi'
            ],
            [
                'id' => 28, 'nopol' => 'DB 1589 VC', 'tahun' => '-', 'jenis' => 'HARIAN', 'kategori' => 'KRP',
                'alokasi' => 'POOL', 'merk' => 'TOYOTA', 'model' => 'INNOVA',
                'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13',
                'status' => 'PAJAK MATI', 'kondisi' => 'Siap Operasi'
            ],
            [
                'id' => 29, 'nopol' => 'DB 8160 CL', 'tahun' => '-', 'jenis' => 'HARIAN', 'kategori' => 'KRP',
                'alokasi' => 'OPERATION (SAMPLING DAN PENGUKURAN)', 'merk' => 'TOYOTA', 'model' => 'HILUX DC',
                'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13',
                'status' => 'PAJAK MATI', 'kondisi' => 'Siap Operasi'
            ],
            [
                'id' => 30, 'nopol' => 'DB 8161 CL', 'tahun' => '-', 'jenis' => 'HARIAN', 'kategori' => 'KRP',
                'alokasi' => 'MAINTENANCE AREA 1', 'merk' => 'TOYOTA', 'model' => 'HILUX DC',
                'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13',
                'status' => 'PAJAK MATI', 'kondisi' => 'Siap Operasi'
            ],
            [
                'id' => 31, 'nopol' => 'DB 8162 CL', 'tahun' => '-', 'jenis' => 'HARIAN', 'kategori' => 'KRP',
                'alokasi' => 'MAINTENANCE AREA 2', 'merk' => 'TOYOTA', 'model' => 'HILUX DC',
                'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13',
                'status' => 'PAJAK MATI', 'kondisi' => 'Siap Operasi'
            ],
            [
                'id' => 32, 'nopol' => 'DB 8163 CL', 'tahun' => '-', 'jenis' => 'HARIAN', 'kategori' => 'KRP',
                'alokasi' => 'MAINTENANCE', 'merk' => 'TOYOTA', 'model' => 'HILUX DC',
                'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13',
                'status' => 'PAJAK MATI', 'kondisi' => 'Siap Operasi'
            ],
            [
                'id' => 33, 'nopol' => 'DB 8024 CM', 'tahun' => '-', 'jenis' => 'HARIAN', 'kategori' => 'KRP',
                'alokasi' => 'SCM TRUCK', 'merk' => 'TOYOTA', 'model' => 'TRUCK DYNA',
                'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13',
                'status' => 'PAJAK MATI', 'kondisi' => 'Siap Operasi'
            ],
            [
                'id' => 34, 'nopol' => 'DB 8451 CH', 'tahun' => '-', 'jenis' => 'HARIAN', 'kategori' => 'KRP',
                'alokasi' => 'MAINTENANCE TRUCK', 'merk' => 'TOYOTA', 'model' => 'TRUCK DYNA',
                'stnk' => '2027-08-30', 'pajak' => '2026-08-30', 'kir' => '2026-08-13',
                'status' => 'PAJAK MATI', 'kondisi' => 'Siap Operasi'
            ],
        ];

        foreach ($initialData as $data) {
            AlatBerat::create($data);
        }

        return redirect()->back()->with('success', 'Data Alat Berat & KRP berhasil direset ke 34 unit asli PGE Lahendong.');
    }

    /**
     * Unduh Template Resmi Excel Alat Berat & KRP (.xlsx) Sesuai Format Asli PGE LHD
     */
    public function downloadTemplateAlatBeratExcel()
    {
        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();

        // ── SHEET 1: ALAT_BERAT_DAN_KRP ──
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Alat_Berat_dan_KRP');

        // Styles
        $titleStyle = [
            'font' => ['bold' => true, 'size' => 11, 'color' => ['argb' => 'FF000000']],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'startColor' => ['argb' => 'FFD1D5DB'], // Light gray
            ],
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
            ],
            'borders' => [
                'allBorders' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN, 'color' => ['argb' => 'FF64748B']],
            ],
        ];

        $headerStyle = [
            'font' => ['bold' => true, 'size' => 10, 'color' => ['argb' => 'FF000000']],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'startColor' => ['argb' => 'FFE2E8F0'], // Slate 200
            ],
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                'wrapText' => true,
            ],
            'borders' => [
                'allBorders' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN, 'color' => ['argb' => 'FF94A3B8']],
            ],
        ];

        $dataBorder = [
            'borders' => [
                'allBorders' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN, 'color' => ['argb' => 'FFE2E8F0']],
            ],
        ];

        // 1. SECTION ALAT BERAT
        $sheet->mergeCells('A1:L1');
        $sheet->setCellValue('A1', 'DAFTAR ALAT BERAT DAN ALOKASI PENGGUNA (ASET-PGE LHD)');
        $sheet->getStyle('A1:L1')->applyFromArray($titleStyle);
        $sheet->getRowDimension(1)->setRowHeight(26);

        // Header Table 1
        $sheet->mergeCells('A2:A3'); $sheet->setCellValue('A2', 'NO');
        $sheet->mergeCells('B2:B3'); $sheet->setCellValue('B2', 'NOMOR POLISI');
        $sheet->mergeCells('C2:C3'); $sheet->setCellValue('C2', 'TAHUN KENDARAAN');
        $sheet->mergeCells('D2:D3'); $sheet->setCellValue('D2', 'JENIS KENDARAAN');
        $sheet->mergeCells('E2:E3'); $sheet->setCellValue('E2', 'ALOKASI PEMAKAI');
        $sheet->mergeCells('F2:F3'); $sheet->setCellValue('F2', 'MERK');
        $sheet->mergeCells('G2:G3'); $sheet->setCellValue('G2', 'TYPE / MODEL');
        $sheet->mergeCells('H2:J2'); $sheet->setCellValue('H2', 'MASA BERLAKU SURAT KENDARAAN');
        $sheet->setCellValue('H3', "STNK (5 thn)");
        $sheet->setCellValue('I3', "PAJAK STNK (1 thn)");
        $sheet->setCellValue('J3', "KIR (2X per 1 thn)");
        $sheet->mergeCells('K2:K3'); $sheet->setCellValue('K2', 'STATUS');
        $sheet->mergeCells('L2:L3'); $sheet->setCellValue('L2', 'KONDISI ASET');

        $sheet->getStyle('A2:L3')->applyFromArray($headerStyle);
        $sheet->getRowDimension(2)->setRowHeight(22);
        $sheet->getRowDimension(3)->setRowHeight(22);

        // Sample Data Alat Berat (8 baris)
        $sampleAlatBerat = [
            [1, '', '', 'CRANE 30T', 'LHD-3', 'TADANO', 'GR300E-3', '30-Aug-27', '30-Aug-26', '13-Aug-26', 'PAJAK MATI', 'Under Maintenance: Sparepart dari UT (piping brake) estimasi ready akhir agustus 2026'],
            [2, '', '', 'TMC 10T', 'LHD-3', 'TADANO', 'TM-ZT1000', '30-Aug-27', '30-Aug-26', '13-Aug-26', 'PAJAK MATI', ''],
            [3, 'DB 8273 GY', '', 'TMC 3.5T', 'LHD-3', 'TADANO', 'TM-ZT630', '30-Aug-27', '30-Aug-26', '13-Aug-26', 'PAJAK MATI', 'Under Maintenance'],
            [4, '', '', 'FORKLIFT 7T', 'LHD-2', 'CATERPILLAR', 'DP70', '-', '-', '-', 'AMAN', ''],
            [5, '', '', 'FORKLIFT 5T', 'LHD-3', 'CATERPILLAR', 'DP50', '-', '-', '-', 'AMAN', ''],
            [6, '', '', 'FORKLIFT 4T', '', 'CATERPILLAR', 'DP40', '-', '-', '-', 'AMAN', ''],
            [7, '', '', 'FORKLIFT 3.5T', 'LHD-4', 'CATERPILLAR', 'DP35', '-', '-', '-', 'AMAN', ''],
            [8, '', '', 'FORKLIFT 2.5T', '', 'CATERPILLAR', 'DP25', '-', '-', '-', 'AMAN', ''],
        ];

        $r = 4;
        foreach ($sampleAlatBerat as $row) {
            for ($c = 0; $c < count($row); $c++) {
                $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($c + 1);
                $sheet->setCellValue($colLetter . $r, $row[$c]);
            }
            $sheet->getStyle("A{$r}:L{$r}")->applyFromArray($dataBorder);
            $sheet->getStyle("A{$r}")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("B{$r}")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("C{$r}")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("E{$r}")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("H{$r}:K{$r}")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getRowDimension($r)->setRowHeight(20);
            $r++;
        }

        // Space row
        $r++;

        // 2. SECTION KRP KONTRAK PT BLP
        $sheet->mergeCells("A{$r}:L{$r}");
        $sheet->setCellValue("A{$r}", 'DAFTAR KRP KONTRAK PT BLP (NO.4600004311)');
        $sheet->getStyle("A{$r}:L{$r}")->applyFromArray($titleStyle);
        $sheet->getRowDimension($r)->setRowHeight(26);
        $r++;

        // Header Table 2
        $h2Start = $r;
        $h2End = $r + 1;
        $sheet->mergeCells("A{$h2Start}:A{$h2End}"); $sheet->setCellValue("A{$h2Start}", 'NO');
        $sheet->mergeCells("B{$h2Start}:B{$h2End}"); $sheet->setCellValue("B{$h2Start}", 'NOMOR POLISI');
        $sheet->mergeCells("C{$h2Start}:C{$h2End}"); $sheet->setCellValue("C{$h2Start}", 'TAHUN KENDARAAN');
        $sheet->mergeCells("D{$h2Start}:D{$h2End}"); $sheet->setCellValue("D{$h2Start}", 'JENIS KENDARAAN');
        $sheet->mergeCells("E{$h2Start}:E{$h2End}"); $sheet->setCellValue("E{$h2Start}", 'ALOKASI PEMAKAI');
        $sheet->mergeCells("F{$h2Start}:F{$h2End}"); $sheet->setCellValue("F{$h2Start}", 'MERK');
        $sheet->mergeCells("G{$h2Start}:G{$h2End}"); $sheet->setCellValue("G{$h2Start}", 'TYPE / MODEL');
        $sheet->mergeCells("H{$h2Start}:J{$h2Start}"); $sheet->setCellValue("H{$h2Start}", 'MASA BERLAKU SURAT KENDARAAN');
        $sheet->setCellValue("H{$h2End}", "STNK (5 thn)");
        $sheet->setCellValue("I{$h2End}", "PAJAK STNK (1 thn)");
        $sheet->setCellValue("J{$h2End}", "KIR (2X per 1 thn)");
        $sheet->mergeCells("K{$h2Start}:K{$h2End}"); $sheet->setCellValue("K{$h2Start}", 'STATUS');
        $sheet->mergeCells("L{$h2Start}:L{$h2End}"); $sheet->setCellValue("L{$h2Start}", 'KONDISI ASET');

        $sheet->getStyle("A{$h2Start}:L{$h2End}")->applyFromArray($headerStyle);
        $sheet->getRowDimension($h2Start)->setRowHeight(22);
        $sheet->getRowDimension($h2End)->setRowHeight(22);

        $sampleKrp = [
            [1, 'DB 1192 VD', '', 'HARIAN', 'GM', 'TOYOTA', 'FORTUNER', '30-Aug-27', '30-Aug-26', '13-Aug-26', 'PAJAK MATI', ''],
            [2, 'DB 1060 VD', '', 'HARIAN', 'GM', 'TOYOTA', 'INNOVA', '30-Aug-27', '30-Aug-26', '13-Aug-26', 'PAJAK MATI', ''],
            [3, 'DB 1062 VD', '', 'HARIAN', 'KOMPERTA', 'TOYOTA', 'INNOVA', '30-Aug-27', '30-Aug-26', '13-Aug-26', 'PAJAK MATI', ''],
            [4, 'DB 1055 VD', '', 'HARIAN', 'MANAGER OPERATION', 'TOYOTA', 'INNOVA', '30-Aug-27', '30-Aug-26', '13-Aug-26', 'PAJAK MATI', ''],
            [5, 'DB 1056 VD', '', 'HARIAN', 'MANAGER TOMPASO', 'TOYOTA', 'INNOVA', '30-Aug-27', '30-Aug-26', '13-Aug-26', 'PAJAK MATI', ''],
            [6, 'DB 1057 VD', '', 'HARIAN', 'MANAGER HSSE', 'TOYOTA', 'INNOVA', '30-Aug-27', '30-Aug-26', '13-Aug-26', 'PAJAK MATI', ''],
            [7, 'DB 1588 VC', '', 'HARIAN', 'MANAGER BUSINESS SUPPORT', 'TOYOTA', 'INNOVA', '30-Aug-27', '30-Aug-26', '13-Aug-26', 'PAJAK MATI', ''],
            [8, 'DB 8159 CL', '', 'SHIFT', 'OPERATION (MONITORING CCR TOMPASO)', 'TOYOTA', 'HILUX DC', '30-Aug-27', '30-Aug-26', '13-Aug-26', 'PAJAK MATI', ''],
            [9, 'DB 7083 CB', '', 'SHIFT', 'OPERATION (APLOS OPERATOR CCR TOMPASO)', 'TOYOTA', 'HIACE', '30-Aug-27', '30-Aug-26', '13-Aug-26', 'PAJAK MATI', ''],
            [10, 'DB 1063 VD', '', 'SHIFT', 'OPERATION (APLOS OPERATOR CCR 1-4)', 'TOYOTA', 'INNOVA', '30-Aug-27', '30-Aug-26', '13-Aug-26', 'PAJAK MATI', ''],
            [11, 'DB 8268 CL', '', 'SHIFT', 'OPERATION (MONITORING CCR 1-4)', 'TOYOTA', 'HILUX DC', '30-Aug-27', '30-Aug-26', '13-Aug-26', 'PAJAK MATI', ''],
            [12, 'DB 8158 CL', '', 'SHIFT', 'HSSE SECURITY', 'TOYOTA', 'HILUX DC', '30-Aug-27', '30-Aug-26', '13-Aug-26', 'PAJAK MATI', ''],
            [13, 'DB 1058 VD', '', 'HARIAN', 'POOL', 'TOYOTA', 'INNOVA', '30-Aug-27', '30-Aug-26', '13-Aug-26', 'PAJAK MATI', ''],
            [14, 'DB 1059 VD', '', 'HARIAN', 'POOL', 'TOYOTA', 'INNOVA', '30-Aug-27', '30-Aug-26', '13-Aug-26', 'PAJAK MATI', ''],
            [15, 'DB 1590 VC', '', 'HARIAN', 'POOL', 'TOYOTA', 'INNOVA', '30-Aug-27', '30-Aug-26', '13-Aug-26', 'PAJAK MATI', ''],
            [16, 'DB 1061 VD', '', 'HARIAN', 'POOL', 'TOYOTA', 'INNOVA', '30-Aug-27', '30-Aug-26', '13-Aug-26', 'PAJAK MATI', ''],
            [17, 'DB 1585 VC', '', 'HARIAN', 'POOL', 'TOYOTA', 'INNOVA', '30-Aug-27', '30-Aug-26', '13-Aug-26', 'PAJAK MATI', ''],
            [18, 'DB 1587 VC', '', 'HARIAN', 'POOL', 'TOYOTA', 'INNOVA', '30-Aug-27', '30-Aug-26', '13-Aug-26', 'PAJAK MATI', ''],
            [19, 'DB 1586 VC', '', 'HARIAN', 'POOL', 'TOYOTA', 'INNOVA', '30-Aug-27', '30-Aug-26', '13-Aug-26', 'PAJAK MATI', ''],
            [20, 'DB 1589 VC', '', 'HARIAN', 'POOL', 'TOYOTA', 'INNOVA', '30-Aug-27', '30-Aug-26', '13-Aug-26', 'PAJAK MATI', ''],
            [21, 'DB 8160 CL', '', 'HARIAN', 'OPERATION (SAMPLING DAN PENGUKURAN)', 'TOYOTA', 'HILUX DC', '30-Aug-27', '30-Aug-26', '13-Aug-26', 'PAJAK MATI', ''],
            [22, 'DB 8161 CL', '', 'HARIAN', 'MAINTENANCE AREA 1', 'TOYOTA', 'HILUX DC', '30-Aug-27', '30-Aug-26', '13-Aug-26', 'PAJAK MATI', ''],
            [23, 'DB 8162 CL', '', 'HARIAN', 'MAINTENANCE AREA 2', 'TOYOTA', 'HILUX DC', '30-Aug-27', '30-Aug-26', '13-Aug-26', 'PAJAK MATI', ''],
            [24, 'DB 8163 CL', '', 'HARIAN', 'MAINTENANCE', 'TOYOTA', 'HILUX DC', '30-Aug-27', '30-Aug-26', '13-Aug-26', 'PAJAK MATI', ''],
            [25, 'DB 8024 CM', '', 'HARIAN', 'SCM TRUCK', 'TOYOTA', 'TRUCK DYNA', '30-Aug-27', '30-Aug-26', '13-Aug-26', 'PAJAK MATI', ''],
            [26, 'DB 8451 CH', '', 'HARIAN', 'MAINTENANCE TRUCK', 'TOYOTA', 'TRUCK DYNA', '30-Aug-27', '30-Aug-26', '13-Aug-26', 'PAJAK MATI', ''],
        ];

        $r = $h2End + 1;
        foreach ($sampleKrp as $row) {
            for ($c = 0; $c < count($row); $c++) {
                $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($c + 1);
                $sheet->setCellValue($colLetter . $r, $row[$c]);
            }
            $sheet->getStyle("A{$r}:L{$r}")->applyFromArray($dataBorder);
            $sheet->getStyle("A{$r}")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("B{$r}")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("C{$r}")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("D{$r}")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("E{$r}")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT);
            $sheet->getStyle("H{$r}:K{$r}")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getRowDimension($r)->setRowHeight(20);
            $r++;
        }

        foreach (range('A', 'L') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        // ── SHEET 2: PANDUAN PENGISIAN ──
        $guideSheet = $spreadsheet->createSheet();
        $guideSheet->setTitle('PANDUAN_PENGISIAN');

        $guideSheet->setCellValue('A1', 'PANDUAN PENGISIAN TEMPLATE ALAT BERAT & KRP PGE LAHENDONG');
        $guideSheet->getStyle('A1')->getFont()->setBold(true)->setSize(13);
        $guideSheet->getRowDimension(1)->setRowHeight(25);

        $guideRows = [
            ['Kolom', 'Keterangan & Format Nilai', 'Contoh'],
            ['NO', 'Nomor urut baris angka (1, 2, 3...)', '1'],
            ['NOMOR POLISI', 'Nomor polisi resmi kendaraan / unit. Kosongkan atau beri tanda strip (-) jika alat berat tidak berplat', 'DB 1192 VD atau -'],
            ['TAHUN KENDARAAN', 'Tahun pembuatan / perakitan kendaraan (opsional)', '2022'],
            ['JENIS KENDARAAN', 'Untuk Alat Berat: CRANE 30T, FORKLIFT 7T, TMC 10T, dll. Untuk KRP: Skema pemakaian seperti HARIAN atau SHIFT', 'CRANE 30T / HARIAN'],
            ['ALOKASI PEMAKAI', 'Lokasi / Fungsi pemakai di PGE LHD: LHD-1, LHD-2, LHD-3, LHD-4, GM, KOMPERTA, POOL, HSSE, MAINTENANCE, SCM, dll', 'LHD-3 / POOL'],
            ['MERK', 'Pabrikan / Brand unit (TADANO, CATERPILLAR, TOYOTA, MITSUBISHI, dll)', 'TOYOTA'],
            ['TYPE / MODEL', 'Tipe unit: GR300E-3, DP70, FORTUNER, INNOVA, HILUX DC, HIACE, TRUCK DYNA, dll', 'FORTUNER'],
            ['STNK (5 thn)', 'Masa berlaku STNK 5 tahunan. Format tanggal disarankan: YYYY-MM-DD atau DD-MMM-YY atau tanda strip (-)', '2027-08-30 atau 30-Aug-27'],
            ['PAJAK STNK (1 thn)', 'Masa berlaku pajak tahunan. Format tanggal disarankan: YYYY-MM-DD atau DD-MMM-YY atau tanda strip (-)', '2026-08-30 atau 30-Aug-26'],
            ['KIR (2X per 1 thn)', 'Masa berlaku uji KIR berkala (tiap 6 bulan). Format tanggal: YYYY-MM-DD atau DD-MMM-YY atau tanda strip (-)', '2026-08-13 atau 13-Aug-26'],
            ['STATUS', 'Status kepatuhan dokumen: AMAN, PAJAK MATI, atau PERLU PERPANJANGAN', 'AMAN / PAJAK MATI'],
            ['KONDISI ASET', 'Kondisi fisik unit: Baik, Siap Operasi, Under Maintenance: [catatan part/masalah], Rusak, dll', 'Siap Operasi'],
        ];

        $gr = 3;
        foreach ($guideRows as $grow) {
            $guideSheet->setCellValue('A' . $gr, $grow[0]);
            $guideSheet->setCellValue('B' . $gr, $grow[1]);
            $guideSheet->setCellValue('C' . $gr, $grow[2]);
            if ($gr === 3) {
                $guideSheet->getStyle("A{$gr}:C{$gr}")->applyFromArray($headerStyle);
            } else {
                $guideSheet->getStyle("A{$gr}:C{$gr}")->applyFromArray($dataBorder);
            }
            $guideSheet->getRowDimension($gr)->setRowHeight(22);
            $gr++;
        }

        foreach (range('A', 'C') as $col) {
            $guideSheet->getColumnDimension($col)->setAutoSize(true);
        }

        $spreadsheet->setActiveSheetIndex(0);

        $fileName = 'Template_Alat_Berat_dan_KRP_PGE_LHD.xlsx';
        $tempPath = tempnam(sys_get_temp_dir(), 'tmpl_ab_') . '.xlsx';
        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        $writer->save($tempPath);

        while (ob_get_level()) {
            ob_end_clean();
        }

        return response()->download($tempPath, $fileName, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Length' => filesize($tempPath),
            'Cache-Control' => 'no-cache, must-revalidate',
        ])->deleteFileAfterSend(true);
    }

    /**
     * Ekspor Rekapitulasi Data Alat Berat & KRP Aktif ke Excel (.xlsx)
     */
    public function exportAlatBerat()
    {
        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Rekap_Alat_Berat_dan_KRP');

        $items = AlatBerat::all();
        $alatBeratItems = $items->filter(fn($i) => ($i->kategori ?? '') === 'Alat Berat' || str_contains(strtoupper($i->jenis ?? ''), 'CRANE') || str_contains(strtoupper($i->jenis ?? ''), 'FORKLIFT') || str_contains(strtoupper($i->jenis ?? ''), 'TMC'));
        $krpItems = $items->reject(fn($i) => $alatBeratItems->contains('id', $i->id));

        $titleStyle = [
            'font' => ['bold' => true, 'size' => 11],
            'fill' => ['fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID, 'startColor' => ['argb' => 'FFD1D5DB']],
            'alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER],
            'borders' => ['allBorders' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN, 'color' => ['argb' => 'FF64748B']]],
        ];

        $headerStyle = [
            'font' => ['bold' => true, 'size' => 10],
            'fill' => ['fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID, 'startColor' => ['argb' => 'FFE2E8F0']],
            'alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER, 'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER, 'wrapText' => true],
            'borders' => ['allBorders' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN, 'color' => ['argb' => 'FF94A3B8']]],
        ];

        $dataBorder = [
            'borders' => ['allBorders' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN, 'color' => ['argb' => 'FFE2E8F0']]],
        ];

        // 1. SECTION ALAT BERAT
        $sheet->mergeCells('A1:L1');
        $sheet->setCellValue('A1', 'DAFTAR ALAT BERAT DAN ALOKASI PENGGUNA (ASET-PGE LHD)');
        $sheet->getStyle('A1:L1')->applyFromArray($titleStyle);
        $sheet->getRowDimension(1)->setRowHeight(26);

        $sheet->mergeCells('A2:A3'); $sheet->setCellValue('A2', 'NO');
        $sheet->mergeCells('B2:B3'); $sheet->setCellValue('B2', 'NOMOR POLISI');
        $sheet->mergeCells('C2:C3'); $sheet->setCellValue('C2', 'TAHUN KENDARAAN');
        $sheet->mergeCells('D2:D3'); $sheet->setCellValue('D2', 'JENIS KENDARAAN');
        $sheet->mergeCells('E2:E3'); $sheet->setCellValue('E2', 'ALOKASI PEMAKAI');
        $sheet->mergeCells('F2:F3'); $sheet->setCellValue('F2', 'MERK');
        $sheet->mergeCells('G2:G3'); $sheet->setCellValue('G2', 'TYPE / MODEL');
        $sheet->mergeCells('H2:J2'); $sheet->setCellValue('H2', 'MASA BERLAKU SURAT KENDARAAN');
        $sheet->setCellValue('H3', "STNK (5 thn)");
        $sheet->setCellValue('I3', "PAJAK STNK (1 thn)");
        $sheet->setCellValue('J3', "KIR (2X per 1 thn)");
        $sheet->mergeCells('K2:K3'); $sheet->setCellValue('K2', 'STATUS');
        $sheet->mergeCells('L2:L3'); $sheet->setCellValue('L2', 'KONDISI ASET');

        $sheet->getStyle('A2:L3')->applyFromArray($headerStyle);
        $sheet->getRowDimension(2)->setRowHeight(22);
        $sheet->getRowDimension(3)->setRowHeight(22);

        $r = 4;
        $no = 1;
        foreach ($alatBeratItems as $item) {
            $sheet->setCellValue("A{$r}", $no++);
            $sheet->setCellValue("B{$r}", $item->nopol ?: '-');
            $sheet->setCellValue("C{$r}", $item->tahun ?: '-');
            $sheet->setCellValue("D{$r}", $item->jenis ?: '-');
            $sheet->setCellValue("E{$r}", $item->alokasi ?: '-');
            $sheet->setCellValue("F{$r}", $item->merk ?: '-');
            $sheet->setCellValue("G{$r}", $item->model ?: '-');
            $sheet->setCellValue("H{$r}", $item->stnk ?: '-');
            $sheet->setCellValue("I{$r}", $item->pajak ?: '-');
            $sheet->setCellValue("J{$r}", $item->kir ?: '-');
            $sheet->setCellValue("K{$r}", $item->status ?: 'AMAN');
            $sheet->setCellValue("L{$r}", $item->kondisi ?: '-');

            $sheet->getStyle("A{$r}:L{$r}")->applyFromArray($dataBorder);
            $sheet->getStyle("A{$r}:C{$r}")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("H{$r}:K{$r}")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getRowDimension($r)->setRowHeight(20);
            $r++;
        }

        $r++; // separator

        // 2. SECTION KRP
        $sheet->mergeCells("A{$r}:L{$r}");
        $sheet->setCellValue("A{$r}", 'DAFTAR KRP KONTRAK PT BLP (NO.4600004311)');
        $sheet->getStyle("A{$r}:L{$r}")->applyFromArray($titleStyle);
        $sheet->getRowDimension($r)->setRowHeight(26);
        $r++;

        $h2Start = $r;
        $h2End = $r + 1;
        $sheet->mergeCells("A{$h2Start}:A{$h2End}"); $sheet->setCellValue("A{$h2Start}", 'NO');
        $sheet->mergeCells("B{$h2Start}:B{$h2End}"); $sheet->setCellValue("B{$h2Start}", 'NOMOR POLISI');
        $sheet->mergeCells("C{$h2Start}:C{$h2End}"); $sheet->setCellValue("C{$h2Start}", 'TAHUN KENDARAAN');
        $sheet->mergeCells("D{$h2Start}:D{$h2End}"); $sheet->setCellValue("D{$h2Start}", 'JENIS KENDARAAN');
        $sheet->mergeCells("E{$h2Start}:E{$h2End}"); $sheet->setCellValue("E{$h2Start}", 'ALOKASI PEMAKAI');
        $sheet->mergeCells("F{$h2Start}:F{$h2End}"); $sheet->setCellValue("F{$h2Start}", 'MERK');
        $sheet->mergeCells("G{$h2Start}:G{$h2End}"); $sheet->setCellValue("G{$h2Start}", 'TYPE / MODEL');
        $sheet->mergeCells("H{$h2Start}:J{$h2Start}"); $sheet->setCellValue("H{$h2Start}", 'MASA BERLAKU SURAT KENDARAAN');
        $sheet->setCellValue("H{$h2End}", "STNK (5 thn)");
        $sheet->setCellValue("I{$h2End}", "PAJAK STNK (1 thn)");
        $sheet->setCellValue("J{$h2End}", "KIR (2X per 1 thn)");
        $sheet->mergeCells("K{$h2Start}:K{$h2End}"); $sheet->setCellValue("K{$h2Start}", 'STATUS');
        $sheet->mergeCells("L{$h2Start}:L{$h2End}"); $sheet->setCellValue("L{$h2Start}", 'KONDISI ASET');

        $sheet->getStyle("A{$h2Start}:L{$h2End}")->applyFromArray($headerStyle);
        $sheet->getRowDimension($h2Start)->setRowHeight(22);
        $sheet->getRowDimension($h2End)->setRowHeight(22);

        $r = $h2End + 1;
        $no = 1;
        foreach ($krpItems as $item) {
            $sheet->setCellValue("A{$r}", $no++);
            $sheet->setCellValue("B{$r}", $item->nopol ?: '-');
            $sheet->setCellValue("C{$r}", $item->tahun ?: '-');
            $sheet->setCellValue("D{$r}", $item->jenis ?: 'HARIAN');
            $sheet->setCellValue("E{$r}", $item->alokasi ?: '-');
            $sheet->setCellValue("F{$r}", $item->merk ?: '-');
            $sheet->setCellValue("G{$r}", $item->model ?: '-');
            $sheet->setCellValue("H{$r}", $item->stnk ?: '-');
            $sheet->setCellValue("I{$r}", $item->pajak ?: '-');
            $sheet->setCellValue("J{$r}", $item->kir ?: '-');
            $sheet->setCellValue("K{$r}", $item->status ?: 'AMAN');
            $sheet->setCellValue("L{$r}", $item->kondisi ?: '-');

            $sheet->getStyle("A{$r}:L{$r}")->applyFromArray($dataBorder);
            $sheet->getStyle("A{$r}:D{$r}")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("H{$r}:K{$r}")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getRowDimension($r)->setRowHeight(20);
            $r++;
        }

        foreach (range('A', 'L') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $fileName = 'Rekap_Alat_Berat_dan_KRP_PGE_Lahendong.xlsx';
        $tempPath = tempnam(sys_get_temp_dir(), 'export_ab_') . '.xlsx';
        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        $writer->save($tempPath);

        while (ob_get_level()) {
            ob_end_clean();
        }

        return response()->download($tempPath, $fileName, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Length' => filesize($tempPath),
            'Cache-Control' => 'no-cache, must-revalidate',
        ])->deleteFileAfterSend(true);
    }

    /**
     * Unduh Template Resmi Excel Material Balance Inventory (.xlsx) Sesuai Format PGE Lahendong
     */
    public function downloadTemplateMaterialBalanceExcel()
    {
        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();

        $headerStyle = [
            'font' => ['bold' => true, 'size' => 10, 'color' => ['argb' => 'FF1E293B']],
            'fill' => ['fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID, 'startColor' => ['argb' => 'FFE2E8F0']],
            'alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER, 'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER, 'wrapText' => true],
            'borders' => ['allBorders' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN, 'color' => ['argb' => 'FF94A3B8']]],
        ];

        $yellowStyle = [
            'font' => ['bold' => true, 'size' => 10, 'color' => ['argb' => 'FF000000']],
            'fill' => ['fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID, 'startColor' => ['argb' => 'FFFEF08A']], // Light yellow like in Excel
            'alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER, 'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER, 'wrapText' => true],
            'borders' => ['allBorders' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN, 'color' => ['argb' => 'FF94A3B8']]],
        ];

        $subHeaderStyle = [
            'font' => ['italic' => true, 'size' => 9, 'color' => ['argb' => 'FF475569']],
            'fill' => ['fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID, 'startColor' => ['argb' => 'FFF1F5F9']],
            'alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER, 'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER],
            'borders' => ['allBorders' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN, 'color' => ['argb' => 'FFCBD5E1']]],
        ];

        $dataBorder = [
            'borders' => ['allBorders' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN, 'color' => ['argb' => 'FFE2E8F0']]],
        ];

        $sheetsConfig = [
            [
                'title' => 'SOH',
                'headerTitle' => 'MATERIAL BALANCE INVENTORY STOCK ON HAND (SOH)',
                'kategori' => 'SOH',
                'sampleStartNo' => 101,
            ],
            [
                'title' => '2YSP',
                'headerTitle' => 'MATERIAL BALANCE INVENTORY 2 YEARS SPARE PART',
                'kategori' => '2YSP',
                'sampleStartNo' => 126,
            ],
        ];

        $allData = MaterialBalance::all();
        if ($allData->isEmpty()) {
            $this->resetMaterialBalance();
            $allData = MaterialBalance::all();
        }

        foreach ($sheetsConfig as $sheetIndex => $cfg) {
            $sheet = $sheetIndex === 0 ? $spreadsheet->getActiveSheet() : $spreadsheet->createSheet();
            $sheet->setTitle($cfg['title']);

            // 1. Title Block
            $sheet->mergeCells('A2:O2');
            $sheet->setCellValue('A2', $cfg['headerTitle']);
            $sheet->getStyle('A2')->getFont()->setBold(true)->setSize(12);
            $sheet->getStyle('A2')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);

            $sheet->mergeCells('A3:O3');
            $sheet->setCellValue('A3', 'PT PERTAMINA GEOTHERMAL ENERGY AREA LAHENDONG');
            $sheet->getStyle('A3')->getFont()->setBold(true)->setSize(11);
            $sheet->getStyle('A3')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);

            $sheet->mergeCells('A4:O4');
            $sheet->setCellValue('A4', 'Per 31 Juli 2026');
            $sheet->getStyle('A4')->getFont()->setSize(10);
            $sheet->getStyle('A4')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);

            // 2. Table Headers (Row 5 & 6)
            $sheet->setCellValue('A5', 'No.');
            $sheet->setCellValue('B5', 'KIMAP');
            $sheet->setCellValue('C5', 'KIMAP DESCRIPTION');
            $sheet->setCellValue('D5', 'PLANT');
            $sheet->setCellValue('E5', 'STORAGE LOCATION');
            $sheet->setCellValue('F5', 'UOM');

            $sheet->setCellValue('G5', 'STOCK AWAL');
            $sheet->mergeCells('H5:I5');
            $sheet->setCellValue('H5', 'MUTASI');
            $sheet->setCellValue('J5', 'STOCK AKHIR');
            $sheet->setCellValue('K5', 'PHYSICAL CHECK');
            $sheet->setCellValue('L5', 'SELISIH PHYSICAL');
            $sheet->setCellValue('M5', 'QTY MYSAP');
            $sheet->setCellValue('N5', 'SELISIH MYSAP');
            $sheet->setCellValue('O5', 'BINLOC');

            $sheet->getStyle('A5:F5')->applyFromArray($headerStyle);
            $sheet->getStyle('G5:J5')->applyFromArray($yellowStyle);
            $sheet->getStyle('K5:O5')->applyFromArray($headerStyle);
            $sheet->getStyle('L5')->applyFromArray($yellowStyle);

            // Subheader Formulas (Row 6)
            $subHeaders = [
                'A6' => 'a', 'B6' => 'b', 'C6' => 'c', 'D6' => 'd', 'E6' => 'e', 'F6' => 'f',
                'G6' => 'g', 'H6' => 'MASUK (h)', 'I6' => 'KELUAR (i)', 'J6' => 'j = g + h - i',
                'K6' => 'k', 'L6' => 'l = k - j', 'M6' => 'm', 'N6' => 'n = k - m', 'O6' => 'o'
            ];
            foreach ($subHeaders as $cell => $text) {
                $sheet->setCellValue($cell, $text);
            }
            $sheet->getStyle('A6:O6')->applyFromArray($subHeaderStyle);
            $sheet->getRowDimension(5)->setRowHeight(24);
            $sheet->getRowDimension(6)->setRowHeight(20);

            // 3. Data Rows
            $items = $allData->where('kategori', $cfg['kategori'])->values();
            $r = 7;
            $no = $cfg['sampleStartNo'];
            $startDataRow = $r;

            foreach ($items as $item) {
                $sheet->setCellValue("A{$r}", $no++);
                $sheet->setCellValue("B{$r}", $item->kimap ?: '-');
                $sheet->setCellValue("C{$r}", $item->deskripsi ?: '-');
                $sheet->setCellValue("D{$r}", $item->plant ?: 'E003');
                $sheet->setCellValue("E{$r}", $item->storage_location ?: ($cfg['kategori'] === '2YSP' ? '2YSP' : 'LHD1'));
                $sheet->setCellValue("F{$r}", $item->uom ?: 'PCS');
                $sheet->setCellValue("G{$r}", $item->stock_awal);
                $sheet->setCellValue("H{$r}", $item->masuk);
                $sheet->setCellValue("I{$r}", $item->keluar);
                $sheet->setCellValue("J{$r}", "=G{$r}+H{$r}-I{$r}");
                $sheet->setCellValue("K{$r}", $item->physical_check);
                $sheet->setCellValue("L{$r}", "=K{$r}-J{$r}");
                $sheet->setCellValue("M{$r}", $item->qty_mysap);
                $sheet->setCellValue("N{$r}", "=K{$r}-M{$r}");
                $sheet->setCellValue("O{$r}", $item->binloc ?: '-');

                $sheet->getStyle("A{$r}:O{$r}")->applyFromArray($dataBorder);
                $sheet->getStyle("A{$r}")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle("B{$r}")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT);
                $sheet->getStyle("D{$r}:F{$r}")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle("G{$r}:N{$r}")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_RIGHT);
                $sheet->getStyle("O{$r}")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
                $sheet->getRowDimension($r)->setRowHeight(20);
                $r++;
            }

            $endDataRow = $r - 1;

            // 4. Total Row
            if ($endDataRow >= $startDataRow) {
                $sheet->mergeCells("A{$r}:F{$r}");
                $sheet->setCellValue("A{$r}", 'TOTAL');
                $sheet->setCellValue("G{$r}", "=SUM(G{$startDataRow}:G{$endDataRow})");
                $sheet->setCellValue("H{$r}", "=SUM(H{$startDataRow}:H{$endDataRow})");
                $sheet->setCellValue("I{$r}", "=SUM(I{$startDataRow}:I{$endDataRow})");
                $sheet->setCellValue("J{$r}", "=SUM(J{$startDataRow}:J{$endDataRow})");
                $sheet->setCellValue("K{$r}", "=SUM(K{$startDataRow}:K{$endDataRow})");
                $sheet->setCellValue("L{$r}", "=SUM(L{$startDataRow}:L{$endDataRow})");
                $sheet->setCellValue("M{$r}", "=SUM(M{$startDataRow}:M{$endDataRow})");
                $sheet->setCellValue("N{$r}", "=SUM(N{$startDataRow}:N{$endDataRow})");
                $sheet->getStyle("A{$r}:O{$r}")->applyFromArray($headerStyle);
                $sheet->getStyle("A{$r}")->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_RIGHT);
                $sheet->getRowDimension($r)->setRowHeight(22);
                $r++;
            }

            $r += 2; // Spacer

            // 5. Tim Pemeriksa Fisik Signatures (Persis Screenshot PGE LHD)
            $sheet->setCellValue("A{$r}", "Lahendong, 31 Juli 2026");
            $r += 2;
            $sheet->setCellValue("A{$r}", "Tim Pemeriksaan Fisik Area Lahendong");
            $sheet->setCellValue("N{$r}", "Mengetahui");
            $r++;
            $sheet->setCellValue("A{$r}", "Officer II Logistik & FM Area");
            $sheet->setCellValue("G{$r}", "Analyst II Inventory & Stock");
            $sheet->setCellValue("N{$r}", "Ast. Man. Logistik");
            $r += 4;
            $sheet->setCellValue("A{$r}", "M Yandrie Azis");
            $sheet->getStyle("A{$r}")->getFont()->setBold(true);
            $sheet->setCellValue("G{$r}", "Astri Puspitasari");
            $sheet->getStyle("G{$r}")->getFont()->setBold(true);
            $sheet->setCellValue("N{$r}", "Harni Rinaryani");
            $sheet->getStyle("N{$r}")->getFont()->setBold(true);

            foreach (range('A', 'O') as $col) {
                $sheet->getColumnDimension($col)->setAutoSize(true);
            }
        }

        $spreadsheet->setActiveSheetIndex(0);

        $fileName = 'Template_Material_Balance_Inventory_PGE_Lahendong.xlsx';
        $tempPath = tempnam(sys_get_temp_dir(), 'tmpl_matbal_') . '.xlsx';
        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        $writer->save($tempPath);

        while (ob_get_level()) {
            ob_end_clean();
        }

        return response()->download($tempPath, $fileName, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Length' => filesize($tempPath),
            'Cache-Control' => 'no-cache, must-revalidate',
        ])->deleteFileAfterSend(true);
    }

    /**
     * Ekspor Rekapitulasi Data Material Balance Inventory Aktif ke Excel (.xlsx)
     */
    public function exportMaterialBalance()
    {
        return $this->downloadTemplateMaterialBalanceExcel();
    }
    public function storePerbaikan(Request $request)
    {
        $validated = $request->validate([
            'lokasi' => 'required|string|max:255',
            'pekerjaan' => 'required|string|max:500',
            'kategori' => 'nullable|string|max:100',
            'urgensi' => 'nullable|string|max:50',
            'tanggal_request' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date',
            'status' => 'required|string',
            'estimasi' => 'nullable|numeric',
            'realisasi' => 'nullable|numeric',
            'link_foto' => 'nullable|string',
            'keterangan' => 'nullable|string',
        ]);

        $kategori = !empty($validated['kategori']) ? $validated['kategori'] : self::autoCategorize($validated['pekerjaan'], $validated['keterangan'] ?? '');
        $urgensi = !empty($validated['urgensi']) ? $validated['urgensi'] : self::autoUrgensi($validated['pekerjaan'], $validated['keterangan'] ?? '');

        $newId = (int) (Perbaikan::max('id') ?? 0) + 1;
        if ($newId < 1000 && Perbaikan::count() > 0) {
            $newId = time();
        }

        Perbaikan::create([
            'id' => $newId,
            'lokasi' => $validated['lokasi'],
            'pekerjaan' => $validated['pekerjaan'],
            'kategori' => $kategori,
            'urgensi' => $urgensi,
            'tanggal_request' => $validated['tanggal_request'] ?? now()->format('Y-m-d'),
            'tanggal_selesai' => $validated['tanggal_selesai'] ?? null,
            'status' => $validated['status'] ?? 'In Progress',
            'estimasi' => $validated['estimasi'] ?? 0,
            'realisasi' => $validated['realisasi'] ?? 0,
            'link_foto' => $validated['link_foto'] ?? null,
            'keterangan' => $validated['keterangan'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Data perbaikan berhasil ditambahkan.');
    }

    public function updatePerbaikan(Request $request, $id)
    {
        $perbaikan = Perbaikan::findOrFail($id);
        $validated = $request->validate([
            'lokasi' => 'required|string|max:255',
            'pekerjaan' => 'required|string|max:500',
            'kategori' => 'nullable|string|max:100',
            'urgensi' => 'nullable|string|max:50',
            'tanggal_request' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date',
            'status' => 'required|string',
            'estimasi' => 'nullable|numeric',
            'realisasi' => 'nullable|numeric',
            'link_foto' => 'nullable|string',
            'keterangan' => 'nullable|string',
        ]);

        if (empty($validated['kategori'])) {
            $validated['kategori'] = self::autoCategorize($validated['pekerjaan'], $validated['keterangan'] ?? '');
        }
        if (empty($validated['urgensi'])) {
            $validated['urgensi'] = self::autoUrgensi($validated['pekerjaan'], $validated['keterangan'] ?? '');
        }

        $perbaikan->update($validated);
        return redirect()->back()->with('success', 'Data perbaikan berhasil diperbarui.');
    }

    /**
     * Unduh Template Excel Resmi (.xlsx) dengan Format 5 Kategori & SLA 2026
     */
    /**
     * Unduh Template Excel Resmi (.xlsx) dengan Format Dropdown Unit RD & Urgensi
     */
    public function downloadTemplateExcel()
    {
        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();

        // ── SHEET 1: TEMPLATE_DATA_PERBAIKAN (SESUAI FORMAT SCREENSHOT PENGGUNA) ──
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Template_Data_Perbaikan');

        $headers = [
            'A1' => 'No',
            'B1' => 'No Unit RD',
            'C1' => 'Deskripsi Pekerjaan',
            'D1' => 'Urgensi',
            'E1' => 'Tanggal Request',
            'F1' => 'Tanggal Selesai',
        ];

        foreach ($headers as $cell => $text) {
            $sheet->setCellValue($cell, $text);
        }

        // Header Styling (Abu-abu Profesional Sesuai Screenshot Excel Pengguna)
        $headerStyle = [
            'font' => [
                'bold' => true,
                'color' => ['argb' => 'FF1E293B'],
                'size' => 11,
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'startColor' => ['argb' => 'FFE2E8F0'],
            ],
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    'color' => ['argb' => 'FF94A3B8'],
                ],
            ],
        ];
        $sheet->getStyle('A1:F1')->applyFromArray($headerStyle);
        $sheet->getRowDimension(1)->setRowHeight(26);

        // Data Contoh Persis Seperti Screenshot Pengguna
        $samples = [
            [1, 'RD 01', 'Perbaikan meja setrika RD 30,', 'Low', '03/01/2026', '06/01/2026'],
            [2, 'RD 31', 'Perbaikan Kunci toilet pria management lepas', 'Medium', '06/01/2026', '07/01/2026'],
            [3, 'RD 05', 'Pipa kran dapur bocor dan wastafel mampet', 'High', '04/02/2026', '05/02/2026'],
            [4, 'Kantor', 'MCB Listrik sering trip / turun mendadak', 'High', '15/03/2026', '16/03/2026'],
            [5, 'RD 01', 'Servis AC Split 1.5 PK tidak dingin & bocor freon', 'Low', '02/03/2026', '04/03/2026'],
            [6, 'RD 30', 'Perbaikan meja setrika dan engsel lemari dinas', 'Medium', '12/01/2026', '14/01/2026'],
        ];

        $rowIdx = 2;
        foreach ($samples as $row) {
            $sheet->setCellValue('A' . $rowIdx, $row[0]);
            $sheet->setCellValue('B' . $rowIdx, $row[1]);
            $sheet->setCellValue('C' . $rowIdx, $row[2]);
            $sheet->setCellValue('D' . $rowIdx, $row[3]);
            $sheet->setCellValue('E' . $rowIdx, $row[4]);
            $sheet->setCellValue('F' . $rowIdx, $row[5]);

            // Alignment per kolom
            $sheet->getStyle('A' . $rowIdx)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle('B' . $rowIdx)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle('D' . $rowIdx)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle('E' . $rowIdx)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle('F' . $rowIdx)->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);

            $sheet->getRowDimension($rowIdx)->setRowHeight(22);
            $rowIdx++;
        }

        // ── SHEET 2: SHEET1 (REFERENSI UNIT RD & PANDUAN KATEGORI) ──
        $refSheet = $spreadsheet->createSheet();
        $refSheet->setTitle('Sheet1');

        $refSheet->setCellValue('A1', 'Daftar Unit RD');
        $refSheet->setCellValue('C1', 'Pilihan Urgensi');
        $refSheet->setCellValue('E1', 'Panduan Kategori');
        $refSheet->setCellValue('F1', 'Target SLA');

        $units = [
            'RD 01', 'RD 02', 'RD 03', 'RD 04', 'RD 05', 'RD 06', 'RD 07', 'RD 08', 'RD 09', 'RD 10',
            'RD 11', 'RD 12', 'RD 13', 'RD 14', 'RD 15', 'RD 16', 'RD 17', 'RD 18', 'RD 19', 'RD 20',
            'RD 21', 'RD 22', 'RD 23', 'RD 24', 'RD 25', 'RD 26', 'RD 27', 'RD 28', 'RD 29', 'RD 30',
            'RD 31', 'RD 32', 'RD 33', 'RD 34', 'RD 35',
            'Kantor', 'Wisma Manajemen', 'Pos Security', 'Mess Karyawan'
        ];

        foreach ($units as $i => $u) {
            $refSheet->setCellValue('A' . ($i + 2), $u);
        }

        $refSheet->setCellValue('C2', 'Low');
        $refSheet->setCellValue('C3', 'Medium');
        $refSheet->setCellValue('C4', 'High');

        $kategoriGuide = [
            ['Sipil dan Struktural (SST)', '7 HK'],
            ['Plumbing dan Sanitasi (PS)', '2 HK'],
            ['Mekanikal dan Elektrikal (MEL)', '2 HK'],
            ['Pendingin Udara (HVAC)', '2 HK'],
            ['Interior dan Fixture (FF&E)', '2 HK'],
        ];
        foreach ($kategoriGuide as $i => $kg) {
            $refSheet->setCellValue('E' . ($i + 2), $kg[0]);
            $refSheet->setCellValue('F' . ($i + 2), $kg[1]);
        }

        $refHeaderStyle = [
            'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF']],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'startColor' => ['argb' => 'FF1E40AF'],
            ],
            'alignment' => ['horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER],
        ];
        $refSheet->getStyle('A1')->applyFromArray($refHeaderStyle);
        $refSheet->getStyle('C1')->applyFromArray($refHeaderStyle);
        $refSheet->getStyle('E1:F1')->applyFromArray($refHeaderStyle);

        // Named Range untuk Dropdown Unit
        $lastUnitRow = count($units) + 1;
        $spreadsheet->addNamedRange(
            new \PhpOffice\PhpSpreadsheet\NamedRange('DaftarUnitRD', $refSheet, '$A$2:$A$' . $lastUnitRow)
        );

        // ── DATA VALIDATION / IN-CELL DROPDOWN ──
        // 1. Dropdown Lokasi / No Unit RD
        $valUnit = new \PhpOffice\PhpSpreadsheet\Cell\DataValidation();
        $valUnit->setType(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::TYPE_LIST);
        $valUnit->setErrorStyle(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::STYLE_INFORMATION);
        $valUnit->setAllowBlank(true);
        $valUnit->setShowDropDown(true);
        $valUnit->setShowInputMessage(true);
        $valUnit->setShowErrorMessage(true);
        $valUnit->setPromptTitle('Pilih No Unit RD');
        $valUnit->setPrompt('Pilih unit rumah dinas atau kantor dari daftar dropdown.');
        $valUnit->setFormula1('=DaftarUnitRD');

        // 2. Dropdown Urgensi (Low, Medium, High)
        $valUrgensi = new \PhpOffice\PhpSpreadsheet\Cell\DataValidation();
        $valUrgensi->setType(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::TYPE_LIST);
        $valUrgensi->setErrorStyle(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::STYLE_INFORMATION);
        $valUrgensi->setAllowBlank(true);
        $valUrgensi->setShowDropDown(true);
        $valUrgensi->setShowInputMessage(true);
        $valUrgensi->setShowErrorMessage(true);
        $valUrgensi->setPromptTitle('Tingkat Urgensi');
        $valUrgensi->setPrompt('Pilih urgensi pekerjaan: Low, Medium, atau High');
        $valUrgensi->setFormula1('"Low,Medium,High"');

        // Pasang data validation untuk 200 baris ke depan di Sheet Template
        for ($r = 2; $r <= 200; $r++) {
            $sheet->getCell("B$r")->setDataValidation(clone $valUnit);
            $sheet->getCell("D$r")->setDataValidation(clone $valUrgensi);
        }

        // Auto size kolom
        foreach (range('A', 'F') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }
        foreach (range('A', 'F') as $col) {
            $refSheet->getColumnDimension($col)->setAutoSize(true);
        }

        // Pastikan Sheet 1 aktif saat file dibuka
        $spreadsheet->setActiveSheetIndex(0);

        $fileName = 'Template_Data_Perbaikan.xlsx';
        $tempPath = tempnam(sys_get_temp_dir(), 'tmpl_') . '.xlsx';
        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        $writer->save($tempPath);

        // Bersihkan output buffer agar tidak ada byte pengotor sebelum file biner dikirim
        while (ob_get_level()) {
            ob_end_clean();
        }

        return response()->download($tempPath, $fileName, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Length' => filesize($tempPath),
            'Cache-Control' => 'no-cache, must-revalidate',
        ])->deleteFileAfterSend(true);
    }

    public function exportPerbaikan()
    {
        $data = Perbaikan::orderBy('tanggal_request', 'desc')->get();
        $filename = "Laporan_Perbaikan_Rumah_Dinas_" . date('Ymd_His') . ".csv";

        $headers = [
            "Content-type" => "text/csv; charset=UTF-8",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $columns = ['ID', 'Lokasi', 'Kategori Kerusakan', 'Deskripsi Pekerjaan', 'Urgensi', 'Tanggal Request', 'Tanggal Selesai', 'Lama Perbaikan (Hari)', 'Kesesuaian SLA', 'Status', 'Estimasi (Rp)', 'Realisasi (Rp)', 'Keterangan'];

        $callback = function () use ($data, $columns) {
            $file = fopen('php://output', 'w');
            fputs($file, "\xEF\xBB\xBF");
            fputcsv($file, $columns);

            foreach ($data as $item) {
                $cat = $item->kategori ?: self::autoCategorize($item->pekerjaan, $item->keterangan);
                $urg = $item->urgensi ?: self::autoUrgensi($item->pekerjaan, $item->keterangan);
                
                // Hitung lama perbaikan & kesesuaian SLA
                $durasi = null;
                $kesesuaianSla = '-';
                if ($item->tanggal_request) {
                    $start = new \DateTime($item->tanggal_request);
                    $end = $item->tanggal_selesai ? new \DateTime($item->tanggal_selesai) : new \DateTime();
                    $diff = $start->diff($end);
                    $durasi = (int) $diff->days;
                    
                    $slaLimit = str_contains($cat, 'Sipil') || str_contains($cat, 'SST') ? 7 : 2;
                    $kesesuaianSla = ($durasi <= $slaLimit) ? 'Sesuai SLA' : 'Melebihi SLA';
                }

                fputcsv($file, [
                    $item->id,
                    $item->lokasi,
                    $cat,
                    $item->pekerjaan,
                    $urg,
                    $item->tanggal_request,
                    $item->tanggal_selesai,
                    $durasi !== null ? $durasi : '-',
                    $kesesuaianSla,
                    $item->status ?: 'Done',
                    $item->estimasi,
                    $item->realisasi,
                    $item->keterangan,
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function destroyPerbaikan($id)
    {
        Perbaikan::destroy($id);
        return redirect()->back()->with('success', 'Data perbaikan berhasil dihapus.');
    }

    public function clearPerbaikan()
    {
        Perbaikan::truncate();
        return redirect()->back()->with('success', 'Data perbaikan berhasil dikosongkan.');
    }

    public function resetPerbaikan()
    {
        Perbaikan::truncate();
        $initialData = [
            [
                'id' => 1,
                'lokasi' => 'Rumah Dinas No. 12',
                'pekerjaan' => 'Perbaikan Atap dan Plafon Bocor Ruang Tamu',
                'kategori' => 'Sipil dan Struktural (SST)',
                'urgensi' => 'High',
                'estimasi' => 25000000,
                'realisasi' => 24500000,
                'status' => 'Done',
                'keterangan' => 'Pekerjaan perbaikan atap selesai 100% menggunakan genteng metal',
                'tanggal_request' => '2026-01-05',
                'tanggal_selesai' => '2026-01-09',
                'link_foto' => null,
            ],
            [
                'id' => 2,
                'lokasi' => 'Rumah Dinas No. 30',
                'pekerjaan' => 'Perbaikan meja setrika dan engsel lemari dinas',
                'kategori' => 'Interior dan Fixture (FF&E)',
                'urgensi' => 'Low',
                'estimasi' => 850000,
                'realisasi' => 800000,
                'status' => 'Done',
                'keterangan' => 'Penggantian engsel hidrolik baru',
                'tanggal_request' => '2026-01-12',
                'tanggal_selesai' => '2026-01-14',
                'link_foto' => null,
            ],
            [
                'id' => 3,
                'lokasi' => 'Wisma Manajemen',
                'pekerjaan' => 'Perbaikan Kunci toilet pria management lepas',
                'kategori' => 'Interior dan Fixture (FF&E)',
                'urgensi' => 'Medium',
                'estimasi' => 500000,
                'realisasi' => 450000,
                'status' => 'Done',
                'keterangan' => 'Penggantian handle set kunci bulat stainless',
                'tanggal_request' => '2026-01-18',
                'tanggal_selesai' => '2026-01-19',
                'link_foto' => null,
            ],
            [
                'id' => 4,
                'lokasi' => 'Rumah Dinas No. 30',
                'pekerjaan' => 'Pipa kran dapur bocor dan wastafel mampet',
                'kategori' => 'Plumbing dan Sanitasi (PS)',
                'urgensi' => 'Medium',
                'estimasi' => 1200000,
                'realisasi' => 1150000,
                'status' => 'Done',
                'keterangan' => 'Penggantian pipa sifon & kran leher angsa',
                'tanggal_request' => '2026-02-04',
                'tanggal_selesai' => '2026-02-05',
                'link_foto' => null,
            ],
            [
                'id' => 5,
                'lokasi' => 'Rumah Dinas No. 05',
                'pekerjaan' => 'Renovasi Pagar Keliling & Engsel Gerbang',
                'kategori' => 'Sipil dan Struktural (SST)',
                'urgensi' => 'Low',
                'estimasi' => 15000000,
                'realisasi' => 15000000,
                'status' => 'Done',
                'keterangan' => 'Pengelasan ulang dan cat anti-karat',
                'tanggal_request' => '2026-02-14',
                'tanggal_selesai' => '2026-02-23',
                'link_foto' => null,
            ],
            [
                'id' => 6,
                'lokasi' => 'Rumah Dinas No. 18',
                'pekerjaan' => 'Servis AC Split 1.5 PK tidak dingin & bocor freon',
                'kategori' => 'Pendingin Udara (HVAC)',
                'urgensi' => 'Medium',
                'estimasi' => 1500000,
                'realisasi' => 1400000,
                'status' => 'Done',
                'keterangan' => 'Pengelasan pipa evaporator dan isi ulang freon R32',
                'tanggal_request' => '2026-03-02',
                'tanggal_selesai' => '2026-03-04',
                'link_foto' => null,
            ],
            [
                'id' => 7,
                'lokasi' => 'Rumah Dinas No. 12',
                'pekerjaan' => 'MCB Listrik sering trip / turun mendadak',
                'kategori' => 'Mekanikal dan Elektrikal (MEL)',
                'urgensi' => 'High',
                'estimasi' => 950000,
                'realisasi' => 900000,
                'status' => 'Done',
                'keterangan' => 'Penggantian MCB Schneider 25A & penataan ulang beban fasa',
                'tanggal_request' => '2026-03-15',
                'tanggal_selesai' => '2026-03-16',
                'link_foto' => null,
            ],
            [
                'id' => 8,
                'lokasi' => 'Rumah Dinas No. 24',
                'pekerjaan' => 'Instalasi stop kontak baru & perbaikan fitting lampu kamar',
                'kategori' => 'Mekanikal dan Elektrikal (MEL)',
                'urgensi' => 'Low',
                'estimasi' => 650000,
                'realisasi' => 600000,
                'status' => 'Done',
                'keterangan' => 'Pemasangan kabel NYM 3x2.5mm dan saklar ganda Panasonic',
                'tanggal_request' => '2026-04-10',
                'tanggal_selesai' => '2026-04-12',
                'link_foto' => null,
            ],
            [
                'id' => 9,
                'lokasi' => 'Rumah Dinas No. 30',
                'pekerjaan' => 'Tembok rembes dan cat terkelupas kamar tidur',
                'kategori' => 'Sipil dan Struktural (SST)',
                'urgensi' => 'Low',
                'estimasi' => 3200000,
                'realisasi' => 3000000,
                'status' => 'Done',
                'keterangan' => 'Waterproofing Aquaproof dan pengecatan ulang Dulux',
                'tanggal_request' => '2026-04-20',
                'tanggal_selesai' => '2026-04-24',
                'link_foto' => null,
            ],
            [
                'id' => 10,
                'lokasi' => 'Rumah Dinas No. 18',
                'pekerjaan' => 'Pelampung toren air patah dan air meluap',
                'kategori' => 'Plumbing dan Sanitasi (PS)',
                'urgensi' => 'High',
                'estimasi' => 750000,
                'realisasi' => 700000,
                'status' => 'Done',
                'keterangan' => 'Penggantian radar otomatis toren Penguin',
                'tanggal_request' => '2026-05-08',
                'tanggal_selesai' => '2026-05-09',
                'link_foto' => null,
            ],
            [
                'id' => 11,
                'lokasi' => 'Wisma Manajemen',
                'pekerjaan' => 'Perawatan rutin AC Cassette & ganti filter udara',
                'kategori' => 'Pendingin Udara (HVAC)',
                'urgensi' => 'Low',
                'estimasi' => 2400000,
                'realisasi' => 2200000,
                'status' => 'Done',
                'keterangan' => 'Cleaning 4 unit AC Cassette Daikin',
                'tanggal_request' => '2026-05-22',
                'tanggal_selesai' => '2026-05-26',
                'link_foto' => null,
            ],
            [
                'id' => 12,
                'lokasi' => 'Rumah Dinas No. 12',
                'pekerjaan' => 'Kran shower kamar mandi utama patah di drat pipa',
                'kategori' => 'Plumbing dan Sanitasi (PS)',
                'urgensi' => 'Medium',
                'estimasi' => 850000,
                'realisasi' => 800000,
                'status' => 'Done',
                'keterangan' => 'Ekstraksi patahan drat dan pasang kran mixer baru',
                'tanggal_request' => '2026-06-11',
                'tanggal_selesai' => '2026-06-15',
                'link_foto' => null,
            ],
            [
                'id' => 13,
                'lokasi' => 'Rumah Dinas No. 24',
                'pekerjaan' => 'Genteng geser dan perbaikan talang air bocor',
                'kategori' => 'Sipil dan Struktural (SST)',
                'urgensi' => 'High',
                'estimasi' => 2800000,
                'realisasi' => 2800000,
                'status' => 'Done',
                'keterangan' => 'Plesteran talang jurai dan reposisi genteng',
                'tanggal_request' => '2026-08-28',
                'tanggal_selesai' => '2026-09-02',
                'link_foto' => null,
            ],
            [
                'id' => 14,
                'lokasi' => 'Rumah Dinas No. 32',
                'pekerjaan' => 'Korsleting saklar utama pompa air submersible',
                'kategori' => 'Mekanikal dan Elektrikal (MEL)',
                'urgensi' => 'High',
                'estimasi' => 1250000,
                'realisasi' => 1200000,
                'status' => 'Done',
                'keterangan' => 'Pengecekan dan penggantian saklar magnetik pompa',
                'tanggal_request' => '2026-09-02',
                'tanggal_selesai' => '2026-09-03',
                'link_foto' => null,
            ],
            [
                'id' => 15,
                'lokasi' => 'Rumah Dinas No. 30',
                'pekerjaan' => 'AC Kamar Anak mati total indikator kedip',
                'kategori' => 'Pendingin Udara (HVAC)',
                'urgensi' => 'Medium',
                'estimasi' => 1800000,
                'realisasi' => 1750000,
                'status' => 'Done',
                'keterangan' => 'Penggantian modul PCB dan kapasitor fan outdoor',
                'tanggal_request' => '2026-09-05',
                'tanggal_selesai' => '2026-09-06',
                'link_foto' => null,
            ],
        ];

        foreach ($initialData as $data) {
            Perbaikan::create($data);
        }

        return redirect()->back()->with('success', 'Data perbaikan berhasil direset dengan data 5 kategori standar terbaru.');
    }

    public static function autoCategorize($pekerjaan, $keterangan = '')
    {
        $text = strtolower($pekerjaan . ' ' . $keterangan);
        if (preg_match('/(toilet|kloset|closet|pipa|kran|keran|bocor air|saluran|toren|pompa|jet pump|wastafel|drainase|sanyo|got|sanitasi)/i', $text) && !preg_match('/(atap|genteng|plafon)/i', $text)) {
            return 'Plumbing dan Sanitasi (PS)';
        }
        if (preg_match('/(ac|freon|tidak dingin|cuci ac|chiller|kompresor|hvac|pendingin|cassette)/i', $text)) {
            return 'Pendingin Udara (HVAC)';
        }
        if (preg_match('/(listrik|mcb|lampu|kabel|sakelar|saklar|stop kontak|korslet|konslet|panel|genset|trafo)/i', $text)) {
            return 'Mekanikal dan Elektrikal (MEL)';
        }
        if (preg_match('/(meja|kursi|lemari|kunci|handle|gagang|engsel|kitchen|setrika|furniture|kasur|sofa|gorden|rak)/i', $text)) {
            return 'Interior dan Fixture (FF&E)';
        }
        return 'Sipil dan Struktural (SST)';
    }

    public static function autoUrgensi($pekerjaan, $keterangan = '')
    {
        $text = strtolower($pekerjaan . ' ' . $keterangan);
        if (preg_match('/(darurat|emergency|korslet|banjir|jebol|parah)/i', $text)) {
            return 'High';
        }
        if (preg_match('/(bocor|mati total|lepas|rusak berat|trip|tidak dingin|mampet)/i', $text)) {
            return 'Medium';
        }
        return 'Low';
    }
}
