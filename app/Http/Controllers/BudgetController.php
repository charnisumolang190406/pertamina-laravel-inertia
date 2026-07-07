<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BudgetDetail;

class BudgetController extends Controller
{
    public function destroy($id)
    {
        BudgetDetail::destroy($id);
        return redirect()->back()->with('success', 'Baris anggaran berhasil dihapus.');
    }

    public function clear()
    {
        BudgetDetail::truncate();
        return redirect()->back()->with('success', 'Semua data rincian anggaran berhasil dikosongkan.');
    }

    public function reset()
    {
        BudgetDetail::truncate();

        $initialData = [
            [
                'id' => 1,
                'fundCent' => 'C0211001',
                'name' => 'Ops. LHD Overhead',
                'commitItem' => '6001006120',
                'text' => 'EMPLOYEE TRAVEL EXPE',
                'budget' => 780000000,
                'consumed' => 214818997,
                'actual' => 214818997,
                'available' => 565181003,
                'kategori' => 'ABO',
            ],
            [
                'id' => 2,
                'fundCent' => 'C0211002',
                'name' => 'Ops. LHD Joint Cost',
                'commitItem' => '6000003100',
                'text' => 'G&G REGIONAL SURVEY',
                'budget' => 39277323,
                'consumed' => 29260000,
                'actual' => 29260000,
                'available' => 10017323,
                'kategori' => 'ABO',
            ],
            [
                'id' => 3,
                'fundCent' => 'C0211002',
                'name' => 'Ops. LHD Joint Cost',
                'commitItem' => '6001008100',
                'text' => 'EMPLOYEE TRAVEL EXPE',
                'budget' => 350000000,
                'consumed' => 211338746,
                'actual' => 188350941,
                'available' => 138661254,
                'kategori' => 'ABO',
            ],
            [
                'id' => 4,
                'fundCent' => 'C0211002',
                'name' => 'Ops. LHD Joint Cost',
                'commitItem' => '6001013210',
                'text' => 'PAINTS, OILS, & LABS',
                'budget' => 440000000,
                'consumed' => 32397000,
                'actual' => 32397000,
                'available' => 407603000,
                'kategori' => 'ABO',
            ],
            [
                'id' => 5,
                'fundCent' => 'C0211003',
                'name' => 'Ops. LHD Steam',
                'commitItem' => '6001008100',
                'text' => 'EMPLOYEE TRAVEL EXPE',
                'budget' => 360000000,
                'consumed' => 107004470,
                'actual' => 95910727,
                'available' => 252995530,
                'kategori' => 'ABO',
            ],
            [
                'id' => 6,
                'fundCent' => 'C0211004',
                'name' => 'Ops. LHD Steam Maint',
                'commitItem' => '6001009000',
                'text' => 'TURBINE OVERHAUL OUTSOURCING',
                'budget' => 50000000000,
                'consumed' => 44639262335,
                'actual' => 44639262335,
                'available' => 5360737665,
                'kategori' => 'ABO',
            ],
            [
                'id' => 7,
                'fundCent' => 'C0211005',
                'name' => 'Ops. LHD Overhead Res',
                'commitItem' => '6001009999',
                'text' => 'OPERATIONAL RESERVE FUNDS',
                'budget' => 68030722677,
                'consumed' => 0,
                'actual' => 0,
                'available' => 68030722677,
                'kategori' => 'ABO',
            ],
            [
                'id' => 8,
                'fundCent' => 'I0211001',
                'name' => 'Investasi Drill LHD-5',
                'commitItem' => '7001002000',
                'text' => 'DRILLING WELL PROJECT Q2',
                'budget' => 12500000000,
                'consumed' => 12500000000,
                'actual' => 12500000000,
                'available' => 0,
                'kategori' => 'ABI',
            ],
            [
                'id' => 9,
                'fundCent' => 'I0211002',
                'name' => 'Investasi Pipe Clust 4',
                'commitItem' => '7001003000',
                'text' => 'CAPITAL PIPING SYSTEM',
                'budget' => 37500000000,
                'consumed' => 0,
                'actual' => 0,
                'available' => 37500000000,
                'kategori' => 'ABI',
            ],
        ];

        foreach ($initialData as $data) {
            BudgetDetail::create($data);
        }

        return redirect()->back()->with('success', 'Data rincian anggaran berhasil direset ke default.');
    }
}
