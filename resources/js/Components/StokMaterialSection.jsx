import React, { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { 
  Package, 
  Layers, 
  Search, 
  Download, 
  FileSpreadsheet, 
  RotateCcw, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowDownRight, 
  ArrowUpRight, 
  Warehouse, 
  Boxes, 
  MapPin, 
  Check, 
  Filter, 
  Info,
  ShieldCheck,
  Building2,
  FileCheck2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import Swal from 'sweetalert2';
import Pagination from './Pagination';

export default function StokMaterialSection({ 
    materialBalanceList = [], 
    isAdmin = true 
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL'); // ALL, SOH, 2YSP
    const [selisihFilter, setSelisihFilter] = useState('ALL'); // ALL, DISCREPANCY_ONLY, MATCH_ONLY
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // ── METRIK & STATISTIK ──
    const metrics = useMemo(() => {
        const totalItems = materialBalanceList.length;
        const totalSoh = materialBalanceList.filter(i => i.kategori === 'SOH').length;
        const total2Ysp = materialBalanceList.filter(i => i.kategori === '2YSP').length;

        const totalStockAwal = materialBalanceList.reduce((acc, curr) => acc + (Number(curr.stock_awal) || 0), 0);
        const totalMasuk = materialBalanceList.reduce((acc, curr) => acc + (Number(curr.masuk) || 0), 0);
        const totalKeluar = materialBalanceList.reduce((acc, curr) => acc + (Number(curr.keluar) || 0), 0);
        const totalStockAkhir = materialBalanceList.reduce((acc, curr) => acc + (Number(curr.stock_akhir) || 0), 0);
        const totalFisik = materialBalanceList.reduce((acc, curr) => acc + (Number(curr.physical_check) || 0), 0);
        const totalMySap = materialBalanceList.reduce((acc, curr) => acc + (Number(curr.qty_mysap) || 0), 0);

        const itemsWithDiscrepancy = materialBalanceList.filter(
            i => (Number(i.selisih_physical) || 0) !== 0 || (Number(i.selisih_mysap) || 0) !== 0
        ).length;

        const matchRate = totalItems > 0 
            ? (((totalItems - itemsWithDiscrepancy) / totalItems) * 100).toFixed(1)
            : 100;

        return {
            totalItems,
            totalSoh,
            total2Ysp,
            totalStockAwal,
            totalMasuk,
            totalKeluar,
            totalStockAkhir,
            totalFisik,
            totalMySap,
            itemsWithDiscrepancy,
            matchRate
        };
    }, [materialBalanceList]);

    // ── DATA GRAFIK RECHARTS ──
    const chartUomData = useMemo(() => {
        const uomCounts = {};
        materialBalanceList.forEach(item => {
            const uom = (item.uom || 'LAINNYA').toUpperCase();
            uomCounts[uom] = (uomCounts[uom] || 0) + 1;
        });

        const COLORS = ['#2563eb', '#0d9488', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];
        return Object.keys(uomCounts).map((key, idx) => ({
            name: key,
            value: uomCounts[key],
            color: COLORS[idx % COLORS.length]
        }));
    }, [materialBalanceList]);

    const chartTopStockData = useMemo(() => {
        return [...materialBalanceList]
            .sort((a, b) => (Number(b.stock_akhir) || 0) - (Number(a.stock_akhir) || 0))
            .slice(0, 6)
            .map(item => ({
                name: item.deskripsi?.length > 18 ? item.deskripsi.substring(0, 18) + '...' : (item.deskripsi || item.kimap),
                fullDesc: item.deskripsi,
                kimap: item.kimap,
                stock: Number(item.stock_akhir) || 0,
                uom: item.uom
            }));
    }, [materialBalanceList]);

    const chartReconciliationData = useMemo(() => {
        return [
            { name: 'Stok Akhir Sistem', qty: metrics.totalStockAkhir, fill: '#3b82f6' },
            { name: 'Hasil Cek Fisik', qty: metrics.totalFisik, fill: '#10b981' },
            { name: 'Kuantitas MySAP', qty: metrics.totalMySap, fill: '#6366f1' },
        ];
    }, [metrics]);

    // ── FILTERING DATA ──
    const filteredList = useMemo(() => {
        return materialBalanceList.filter(item => {
            const matchesCategory = categoryFilter === 'ALL' || item.kategori === categoryFilter;

            const hasDiscrepancy = (Number(item.selisih_physical) || 0) !== 0 || (Number(item.selisih_mysap) || 0) !== 0;
            const matchesSelisih = 
                selisihFilter === 'ALL' ? true :
                selisihFilter === 'DISCREPANCY_ONLY' ? hasDiscrepancy :
                !hasDiscrepancy;

            const q = searchQuery.toLowerCase();
            const matchesSearch = !searchQuery || 
                (item.kimap && item.kimap.toLowerCase().includes(q)) ||
                (item.deskripsi && item.deskripsi.toLowerCase().includes(q)) ||
                (item.binloc && item.binloc.toLowerCase().includes(q)) ||
                (item.storage_location && item.storage_location.toLowerCase().includes(q)) ||
                (item.plant && item.plant.toLowerCase().includes(q));

            return matchesCategory && matchesSelisih && matchesSearch;
        });
    }, [materialBalanceList, categoryFilter, selisihFilter, searchQuery]);

    const paginatedList = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredList.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredList, currentPage]);

    // ── ACTION HANDLERS ──
    const handleClear = () => {
        Swal.fire({
            title: 'Kosongkan Data Material Balance?',
            text: 'Semua item inventori SOH dan 2YSP akan dihapus sementara untuk pengunggahan baru.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Kosongkan',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.post('/logistik/material-balance/clear');
            }
        });
    };

    const handleReset = () => {
        Swal.fire({
            title: 'Reset ke Data Asli PGE LHD?',
            text: 'Data inventori akan dikembalikan ke data resmi bulan Juli 2026 (35 item KIMAP SOH & 2YSP).',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Reset Data',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.post('/logistik/material-balance/reset');
            }
        });
    };

    const handleDeleteItem = (id, kimap) => {
        Swal.fire({
            title: 'Hapus Item Material?',
            text: `Hapus item KIMAP "${kimap}" dari daftar?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Hapus'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/logistik/material-balance/${id}`);
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* 1. TOP HEADER & OFFICIAL BADGE */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wide">
                                PGE AREA LAHENDONG
                            </span>
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                                Periode: Juli 2026
                            </span>
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                                Plant: E003
                            </span>
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-800 mt-2 flex items-center gap-2.5">
                            <Warehouse className="w-6 h-6 text-blue-600" />
                            Material Balance Inventory (Stok Material Gudang)
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                            Pencatatan Rekonsiliasi Fisik vs MySAP untuk Stock On Hand (SOH - LHD1) dan 2 Years Spare Part (2YSP)
                        </p>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        <a
                            href="/logistik/material-balance/template"
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all active:scale-95"
                        >
                            <FileSpreadsheet className="w-4 h-4" />
                            Unduh Template Resmi (Matbal)
                        </a>
                        <a
                            href="/logistik/material-balance/export"
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs transition-all active:scale-95"
                        >
                            <Download className="w-4 h-4" />
                            Ekspor Data Excel
                        </a>
                        {isAdmin && (
                            <>
                                <button
                                    onClick={handleReset}
                                    title="Reset ke data bawaan resmi PGE LHD"
                                    className="p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-colors"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={handleClear}
                                    title="Kosongkan data untuk import"
                                    className="p-2 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. SUMMARY KPI CARDS (5 CARDS) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {/* Total Item KIMAP */}
                <div 
                    onClick={() => { setCategoryFilter('ALL'); setSelisihFilter('ALL'); }}
                    className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer hover:border-blue-400 ${
                        categoryFilter === 'ALL' && selisihFilter === 'ALL' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200 shadow-2xs'
                    }`}
                >
                    <div className="flex justify-between items-start">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Item KIMAP</span>
                        <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                            <Boxes className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-2.5">
                        <span className="text-2xl font-black text-slate-800">{metrics.totalItems}</span>
                        <span className="text-xs text-slate-400 ml-1 font-bold">KIMAP</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">
                        {metrics.totalSoh} SOH + {metrics.total2Ysp} 2YSP
                    </p>
                </div>

                {/* Stock On Hand (SOH) */}
                <div 
                    onClick={() => setCategoryFilter(categoryFilter === 'SOH' ? 'ALL' : 'SOH')}
                    className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer hover:border-teal-400 ${
                        categoryFilter === 'SOH' ? 'border-teal-500 ring-2 ring-teal-100' : 'border-slate-200 shadow-2xs'
                    }`}
                >
                    <div className="flex justify-between items-start">
                        <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">Stock On Hand (SOH)</span>
                        <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                            <Warehouse className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-2.5">
                        <span className="text-2xl font-black text-teal-700">{metrics.totalSoh}</span>
                        <span className="text-xs text-teal-500 ml-1 font-bold">Item</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">Gudang Utama LHD1</p>
                </div>

                {/* 2 Years Spare Part (2YSP) */}
                <div 
                    onClick={() => setCategoryFilter(categoryFilter === '2YSP' ? 'ALL' : '2YSP')}
                    className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer hover:border-indigo-400 ${
                        categoryFilter === '2YSP' ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-200 shadow-2xs'
                    }`}
                >
                    <div className="flex justify-between items-start">
                        <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">2 Years Spare Part</span>
                        <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                            <Layers className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-2.5">
                        <span className="text-2xl font-black text-indigo-700">{metrics.total2Ysp}</span>
                        <span className="text-xs text-indigo-500 ml-1 font-bold">Item</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">Suku Cadang Kritis 2YSP</p>
                </div>

                {/* Total Fisik Terdata */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="flex justify-between items-start">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Fisik Unit</span>
                        <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                            <Package className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-2.5">
                        <span className="text-2xl font-black text-amber-600">{metrics.totalFisik.toLocaleString()}</span>
                        <span className="text-xs text-slate-400 ml-1 font-bold">Unit</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">
                        Mutasi: +{metrics.totalMasuk} / -{metrics.totalKeluar}
                    </p>
                </div>

                {/* Akurasi Rekonsiliasi (Match Rate) */}
                <div 
                    onClick={() => setSelisihFilter(selisihFilter === 'DISCREPANCY_ONLY' ? 'ALL' : 'DISCREPANCY_ONLY')}
                    className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer hover:border-emerald-400 ${
                        selisihFilter === 'DISCREPANCY_ONLY' ? 'border-amber-500 ring-2 ring-amber-100' : 'border-slate-200 shadow-2xs'
                    }`}
                >
                    <div className="flex justify-between items-start">
                        <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Akurasi Opname</span>
                        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-2.5 flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-emerald-700">{metrics.matchRate}%</span>
                        <span className="text-[11px] font-bold text-emerald-600">Cocok</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">
                        {metrics.itemsWithDiscrepancy === 0 ? 'Semua Cocok (Selisih 0)' : `${metrics.itemsWithDiscrepancy} Item Berselisih`}
                    </p>
                </div>
            </div>

            {/* 3. VISUAL ANALYTICS (3 RECHARTS) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* CHART 1: Top Material Berdasarkan Stok */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <Boxes className="w-4 h-4 text-blue-600" />
                        Top Material Kuantitas Tertinggi
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Berdasarkan kuantitas stok akhir unit</p>
                    <div className="h-56 mt-3">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartTopStockData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} />
                                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#475569' }} width={95} />
                                <Tooltip 
                                    formatter={(val, name, item) => [`${val} ${item.payload.uom}`, 'Stok Akhir']}
                                    labelFormatter={(lbl, item) => item?.[0]?.payload?.fullDesc || lbl}
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                                />
                                <Bar dataKey="stock" fill="#2563eb" radius={[0, 6, 6, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* CHART 2: Proporsi Satuan (UOM) */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <Layers className="w-4 h-4 text-teal-600" />
                        Distribusi Satuan Barang (UOM)
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Komposisi PCS, SET, METER, dll</p>
                    <div className="h-56 mt-3 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartUomData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={45}
                                    outerRadius={70}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {chartUomData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(val) => [`${val} Item`, 'Jumlah KIMAP']}
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                                />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36} 
                                    formatter={(value) => <span className="text-[11px] font-bold text-slate-600">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* CHART 3: Rekonsiliasi Sistem vs Fisik vs MySAP */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Rekonsiliasi Sistem vs Fisik
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Perbandingan Stock Akhir, Fisik, & MySAP</p>
                    <div className="h-56 mt-3">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartReconciliationData} margin={{ top: 15, right: 10, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                                <Tooltip 
                                    formatter={(val) => [`${val.toLocaleString()} Unit`, 'Kuantitas']}
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                                />
                                <Bar dataKey="qty" radius={[6, 6, 0, 0]}>
                                    {chartReconciliationData.map((entry, index) => (
                                        <Cell key={`cell-rec-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 4. FILTER PILLS & SEARCH BAR */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Category Pills */}
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => { setCategoryFilter('ALL'); setCurrentPage(1); }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            categoryFilter === 'ALL'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        Semua ({materialBalanceList.length})
                    </button>
                    <button
                        onClick={() => { setCategoryFilter('SOH'); setCurrentPage(1); }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            categoryFilter === 'SOH'
                                ? 'bg-teal-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        Stock On Hand - SOH ({metrics.totalSoh})
                    </button>
                    <button
                        onClick={() => { setCategoryFilter('2YSP'); setCurrentPage(1); }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            categoryFilter === '2YSP'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        2 Years Spare Part - 2YSP ({metrics.total2Ysp})
                    </button>

                    {metrics.itemsWithDiscrepancy > 0 && (
                        <button
                            onClick={() => { setSelisihFilter(selisihFilter === 'DISCREPANCY_ONLY' ? 'ALL' : 'DISCREPANCY_ONLY'); setCurrentPage(1); }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                selisihFilter === 'DISCREPANCY_ONLY'
                                    ? 'bg-amber-600 text-white shadow-xs'
                                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                            }`}
                        >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Ada Selisih ({metrics.itemsWithDiscrepancy})
                        </button>
                    )}
                </div>

                {/* Search Input */}
                <div className="relative min-w-[260px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        placeholder="Cari KIMAP, deskripsi, atau BINLOC..."
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 transition-all outline-none"
                    />
                </div>
            </div>

            {/* 5. DATA TABLE SESUAI DOKUMEN PGE LAHENDONG */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div>
                        <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                            <FileCheck2 className="w-4 h-4 text-blue-600" />
                            Lembar Verifikasi Fisik & MySAP PGE Lahendong
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            Menampilkan {filteredList.length} item material sesuai format resmi
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
                        <thead>
                            {/* Baris 1 Header */}
                            <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-extrabold text-[10px] uppercase">
                                <th className="p-2.5 text-center border-r border-slate-200" rowSpan={2}>No</th>
                                <th className="p-2.5 border-r border-slate-200" rowSpan={2}>KIMAP</th>
                                <th className="p-2.5 border-r border-slate-200 min-w-[200px]" rowSpan={2}>KIMAP DESCRIPTION</th>
                                <th className="p-2.5 text-center border-r border-slate-200" rowSpan={2}>Plant</th>
                                <th className="p-2.5 text-center border-r border-slate-200" rowSpan={2}>Storage Loc</th>
                                <th className="p-2.5 text-center border-r border-slate-200" rowSpan={2}>UOM</th>
                                <th className="p-2 text-center border-r border-slate-200 bg-amber-100/70 text-amber-900" colSpan={4}>MUTASI PERIODE (LHD)</th>
                                <th className="p-2 text-center border-r border-slate-200 bg-emerald-100/70 text-emerald-900" colSpan={2}>HASIL CEK FISIK</th>
                                <th className="p-2 text-center border-r border-slate-200 bg-indigo-100/70 text-indigo-900" colSpan={2}>SISTEM MYSAP</th>
                                <th className="p-2.5 text-center border-r border-slate-200" rowSpan={2}>BINLOC</th>
                                <th className="p-2.5 text-center" rowSpan={2}>Kategori</th>
                            </tr>
                            {/* Baris 2 Header (Sub-kolom Mutasi & Selisih) */}
                            <tr className="border-b border-slate-200 text-[10px] uppercase font-bold">
                                <th className="p-2 text-right border-r border-slate-200 bg-amber-50/70 text-amber-800">Awal (g)</th>
                                <th className="p-2 text-right border-r border-slate-200 bg-amber-50/70 text-emerald-700">Masuk (h)</th>
                                <th className="p-2 text-right border-r border-slate-200 bg-amber-50/70 text-red-700">Keluar (i)</th>
                                <th className="p-2 text-right border-r border-slate-200 bg-amber-100/80 text-amber-900 font-extrabold">Akhir (j)</th>
                                <th className="p-2 text-right border-r border-slate-200 bg-emerald-50/70 text-emerald-800 font-extrabold">Fisik (k)</th>
                                <th className="p-2 text-right border-r border-slate-200 bg-emerald-50/70 text-emerald-800">Selisih (l)</th>
                                <th className="p-2 text-right border-r border-slate-200 bg-indigo-50/70 text-indigo-800 font-extrabold">MySAP (m)</th>
                                <th className="p-2 text-right border-r border-slate-200 bg-indigo-50/70 text-indigo-800">Selisih (n)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginatedList.map((item, idx) => {
                                const actualNo = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                                const isDiscrepant = Number(item.selisih_physical) !== 0 || Number(item.selisih_mysap) !== 0;

                                return (
                                    <tr 
                                        key={item.id} 
                                        className={`hover:bg-slate-50/60 transition-colors ${
                                            isDiscrepant ? 'bg-amber-50/30' : ''
                                        }`}
                                    >
                                        <td className="p-2.5 text-center font-medium text-slate-400 border-r border-slate-100">{actualNo}</td>
                                        <td className="p-2.5 font-mono font-bold text-blue-700 border-r border-slate-100">{item.kimap}</td>
                                        <td className="p-2.5 font-bold text-slate-800 border-r border-slate-100 max-w-[320px] truncate" title={item.deskripsi}>
                                            {item.deskripsi}
                                        </td>
                                        <td className="p-2.5 text-center font-mono text-slate-600 border-r border-slate-100">{item.plant || 'E003'}</td>
                                        <td className="p-2.5 text-center font-bold text-slate-700 border-r border-slate-100">
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] ${
                                                item.kategori === '2YSP' ? 'bg-indigo-50 text-indigo-700' : 'bg-teal-50 text-teal-700'
                                            }`}>
                                                {item.storage_location}
                                            </span>
                                        </td>
                                        <td className="p-2.5 text-center font-bold text-slate-600 border-r border-slate-100">{item.uom}</td>

                                        {/* MUTASI */}
                                        <td className="p-2 text-right font-mono text-slate-700 border-r border-slate-100">{Number(item.stock_awal).toLocaleString()}</td>
                                        <td className="p-2 text-right font-mono text-emerald-700 font-bold border-r border-slate-100">
                                            {Number(item.masuk) > 0 ? `+${item.masuk}` : '0'}
                                        </td>
                                        <td className="p-2 text-right font-mono text-red-600 font-bold border-r border-slate-100">
                                            {Number(item.keluar) > 0 ? `-${item.keluar}` : '0'}
                                        </td>
                                        <td className="p-2 text-right font-mono font-black text-amber-900 bg-amber-50/40 border-r border-slate-100">
                                            {Number(item.stock_akhir).toLocaleString()}
                                        </td>

                                        {/* PHYSICAL */}
                                        <td className="p-2 text-right font-mono font-black text-emerald-800 bg-emerald-50/30 border-r border-slate-100">
                                            {Number(item.physical_check).toLocaleString()}
                                        </td>
                                        <td className="p-2 text-right font-mono font-bold border-r border-slate-100">
                                            {Number(item.selisih_physical) === 0 ? (
                                                <span className="text-emerald-600 text-[10px]">0</span>
                                            ) : (
                                                <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[10px]">
                                                    {item.selisih_physical}
                                                </span>
                                            )}
                                        </td>

                                        {/* MYSAP */}
                                        <td className="p-2 text-right font-mono font-bold text-indigo-800 bg-indigo-50/30 border-r border-slate-100">
                                            {Number(item.qty_mysap).toLocaleString()}
                                        </td>
                                        <td className="p-2 text-right font-mono font-bold border-r border-slate-100">
                                            {Number(item.selisih_mysap) === 0 ? (
                                                <span className="text-emerald-600 text-[10px]">0</span>
                                            ) : (
                                                <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[10px]">
                                                    {item.selisih_mysap}
                                                </span>
                                            )}
                                        </td>

                                        {/* BINLOC */}
                                        <td className="p-2.5 text-center font-mono font-bold text-slate-700 border-r border-slate-100">
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px]">
                                                {item.binloc || '-'}
                                            </span>
                                        </td>

                                        {/* KATEGORI */}
                                        <td className="p-2.5 text-center">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                                item.kategori === '2YSP' 
                                                    ? 'bg-indigo-100 text-indigo-800' 
                                                    : 'bg-teal-100 text-teal-800'
                                            }`}>
                                                {item.kategori}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {paginatedList.length === 0 && (
                                <tr>
                                    <td colSpan={16} className="p-10 text-center text-slate-400">
                                        <Boxes className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                        <p className="font-bold text-slate-600">Tidak ada data material yang sesuai filter.</p>
                                        <p className="text-xs text-slate-400 mt-0.5">Coba ubah kata kunci pencarian atau reset filter.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                    <Pagination 
                        currentPage={currentPage}
                        totalItems={filteredList.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

            {/* 6. TIM PEMERIKSAAN FISIK AREA LAHENDONG (SIGNATURES CARD) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                            Tim Pemeriksaan Fisik & Otorisasi Inventori
                        </h4>
                        <p className="text-[11px] text-slate-400">
                            PT Pertamina Geothermal Energy Area Lahendong (Periode Per 31 Juli 2026)
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pemeriksa I</span>
                        <h5 className="font-extrabold text-slate-800 text-sm mt-1">M Yandrie Azis</h5>
                        <p className="text-xs text-blue-600 font-semibold mt-0.5">Officer II Logistik & FM Area</p>
                        <span className="inline-flex items-center gap-1 mt-2 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3" /> Terverifikasi Fisik
                        </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pemeriksa II</span>
                        <h5 className="font-extrabold text-slate-800 text-sm mt-1">Astri Puspitasari</h5>
                        <p className="text-xs text-blue-600 font-semibold mt-0.5">Analyst II Inventory & Stock</p>
                        <span className="inline-flex items-center gap-1 mt-2 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3" /> Terverifikasi Rekonsiliasi
                        </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 text-center">
                        <span className="text-[10px] uppercase font-bold text-blue-500 tracking-wider">Mengetahui</span>
                        <h5 className="font-extrabold text-slate-800 text-sm mt-1">Harni Rinaryani</h5>
                        <p className="text-xs text-blue-700 font-semibold mt-0.5">Ast. Man. Logistik</p>
                        <span className="inline-flex items-center gap-1 mt-2 text-[10px] text-blue-600 font-bold bg-blue-100/70 px-2 py-0.5 rounded-full">
                            <ShieldCheck className="w-3 h-3" /> Disetujui
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
