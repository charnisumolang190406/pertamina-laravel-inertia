import React, { useState, useMemo, useRef } from 'react';
import { router } from '@inertiajs/react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import {
    Truck, Car, AlertTriangle, CheckCircle2, AlertCircle,
    Search, Download, UploadCloud, RotateCcw, Trash2,
    Calendar, ShieldAlert, ShieldCheck, Filter, Clock, X, Info
} from 'lucide-react';
import Swal from 'sweetalert2';
import Pagination from './Pagination';

export default function AlatBeratKrpSection({ alatBeratList = [], isAdmin = false, formatDate }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('ALL'); // ALL, 'Alat Berat', 'KRP'
    const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, 'PAJAK MATI', 'AMAN'
    const [kondisiFilter, setKondisiFilter] = useState('ALL'); // ALL, 'MAINTENANCE', 'READY'
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // ── 1. KLASIFIKASI & ANALISIS DATA ──
    const enrichedList = useMemo(() => {
        return alatBeratList.map((item) => {
            const rawKategori = (item.kategori || '').toLowerCase();
            const rawJenis = (item.jenis || '').toUpperCase();
            const rawModel = (item.model || '').toUpperCase();

            // Tentukan Kategori: Alat Berat vs KRP
            let category = 'Alat Berat';
            if (
                rawKategori.includes('krp') ||
                rawJenis === 'HARIAN' ||
                rawJenis === 'SHIFT' ||
                rawModel.includes('FORTUNER') ||
                rawModel.includes('INNOVA') ||
                rawModel.includes('HILUX') ||
                rawModel.includes('HIACE') ||
                rawModel.includes('DYNA') ||
                rawModel.includes('AVANZA')
            ) {
                category = 'KRP';
            }

            // Tentukan Status Dokumen
            const rawStatus = (item.status || '').toUpperCase();
            const isPajakMati = rawStatus.includes('MATI') || rawStatus.includes('EXPIRED') || rawStatus.includes('PERPANJANG');

            // Tentukan Kondisi Fisik
            const rawKondisi = (item.kondisi || '').toLowerCase();
            const isUnderMaintenance = rawKondisi.includes('maintenance') || rawKondisi.includes('rusak') || rawKondisi.includes('perbaikan');

            return {
                ...item,
                derivedCategory: category,
                isPajakMati,
                isUnderMaintenance
            };
        });
    }, [alatBeratList]);

    // ── 2. METRIK / KPI LENGKAP ──
    const metrics = useMemo(() => {
        const total = enrichedList.length;
        const totalAlatBerat = enrichedList.filter(i => i.derivedCategory === 'Alat Berat').length;
        const totalKrp = enrichedList.filter(i => i.derivedCategory === 'KRP').length;
        const totalPajakMati = enrichedList.filter(i => i.isPajakMati).length;
        const totalAman = total - totalPajakMati;
        const totalMaintenance = enrichedList.filter(i => i.isUnderMaintenance).length;
        const totalSiapOperasi = total - totalMaintenance;

        return {
            total,
            totalAlatBerat,
            totalKrp,
            totalPajakMati,
            totalAman,
            totalMaintenance,
            totalSiapOperasi
        };
    }, [enrichedList]);

    // ── 3. DATA GRAFIK ANALITIK ──
    // Chart 1: Komposisi Aset (Donut Chart)
    const categoryChartData = useMemo(() => [
        { name: 'Alat Berat (PGE LHD)', value: metrics.totalAlatBerat, color: '#2563eb' },
        { name: 'KRP (Kontrak PT BLP)', value: metrics.totalKrp, color: '#0d9488' },
    ], [metrics]);

    // Chart 2: Status Dokumen & Pajak (Donut Chart)
    const statusChartData = useMemo(() => [
        { name: 'Aman / Tertib Pajak', value: metrics.totalAman, color: '#10b981' },
        { name: 'Pajak Mati / Perlu Perpanjangan', value: metrics.totalPajakMati, color: '#ef4444' },
    ], [metrics]);

    // Chart 3: Distribusi Alokasi Terbanyak (Bar Chart)
    const alokasiChartData = useMemo(() => {
        const counts = {};
        enrichedList.forEach(item => {
            const alok = item.alokasi && item.alokasi !== '-' ? item.alokasi : 'Lainnya';
            counts[alok] = (counts[alok] || 0) + 1;
        });

        return Object.entries(counts)
            .map(([name, count]) => ({ name, total: count }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 6); // Ambil top 6
    }, [enrichedList]);

    // ── 4. FILTERING & PENCARIAN ──
    const filteredList = useMemo(() => {
        return enrichedList.filter(item => {
            // Filter Kategori
            if (categoryFilter !== 'ALL' && item.derivedCategory !== categoryFilter) {
                return false;
            }

            // Filter Status Surat
            if (statusFilter === 'PAJAK MATI' && !item.isPajakMati) return false;
            if (statusFilter === 'AMAN' && item.isPajakMati) return false;

            // Filter Kondisi
            if (kondisiFilter === 'MAINTENANCE' && !item.isUnderMaintenance) return false;
            if (kondisiFilter === 'READY' && item.isUnderMaintenance) return false;

            // Search Query
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchNopol = (item.nopol || '').toLowerCase().includes(q);
                const matchJenis = (item.jenis || '').toLowerCase().includes(q);
                const matchMerk = (item.merk || '').toLowerCase().includes(q);
                const matchModel = (item.model || '').toLowerCase().includes(q);
                const matchAlokasi = (item.alokasi || '').toLowerCase().includes(q);
                const matchKondisi = (item.kondisi || '').toLowerCase().includes(q);

                return matchNopol || matchJenis || matchMerk || matchModel || matchAlokasi || matchKondisi;
            }

            return true;
        });
    }, [enrichedList, categoryFilter, statusFilter, kondisiFilter, searchQuery]);

    // Reset pagination ketika filter berubah
    React.useEffect(() => {
        setCurrentPage(1);
    }, [categoryFilter, statusFilter, kondisiFilter, searchQuery]);

    // ── 5. HANDLER RESET DATA ──
    const handleResetData = () => {
        Swal.fire({
            title: 'Reset ke Data Bawaan?',
            html: 'Data akan dikembalikan ke data resmi awal PGE Lahendong (<b>34 Unit: 8 Alat Berat & 26 KRP</b>).',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d97706',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Reset Data',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.post('/logistik/alat-berat/reset', {}, {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Data Direset!',
                            text: 'Data Alat Berat & KRP telah dikembalikan ke data default bawaan.',
                            icon: 'success',
                            confirmButtonColor: '#2563eb'
                        });
                    }
                });
            }
        });
    };

    // ── 7. HANDLER HAPUS BARIS TUNGGAL ──
    const handleDeleteRow = (id, nopolOrJenis) => {
        Swal.fire({
            title: 'Hapus Unit Ini?',
            text: `Yakin ingin menghapus aset "${nopolOrJenis}" dari daftar?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/logistik/alat-berat/${id}`, {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Terhapus!',
                            text: 'Unit berhasil dihapus dari sistem.',
                            icon: 'success',
                            timer: 1500,
                            showConfirmButton: false
                        });
                    }
                });
            }
        });
    };

    // Pagination slice
    const paginatedData = filteredList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="space-y-6">
            {/* ── ACTION BAR & HEADER ── */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-200/60">
                            <Truck className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-2">
                                Monitoring Alat Berat dan KRP
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200">
                                    {metrics.total} Unit Terdaftar
                                </span>
                            </h2>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                                Aset Alat Berat PGE Lahendong & Kendaraan Ringan Penumpang (Kontrak PT BLP)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tombol Aksi: Unduh Template, Upload Laporan, Ekspor, Reset */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    {/* Unduh Template Resmi */}
                    <a
                        href="/logistik/alat-berat/template"
                        className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs hover:border-slate-400 transition-all active:scale-95 cursor-pointer"
                        title="Unduh Format Excel Resmi (.xlsx) dengan baris panduan dan data asli"
                    >
                        <Download className="w-3.5 h-3.5 text-blue-600" />
                        <span>Unduh Template Excel</span>
                    </a>



                    {/* Ekspor Laporan Aktif */}
                    <a
                        href="/logistik/alat-berat/export"
                        className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all active:scale-95 cursor-pointer"
                        title="Unduh rekapitulasi data aktif ke Excel"
                    >
                        <Download className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Ekspor Laporan</span>
                    </a>

                    {/* Reset Data Bawaan (Khusus Admin FM) */}
                    {isAdmin && (
                        <button
                            onClick={handleResetData}
                            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl border border-transparent hover:border-amber-200 transition-all cursor-pointer"
                            title="Reset data ke 34 unit asli PGE Lahendong"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* ── SUMMARY KPI CARDS LENGKAP (MEMUAT KESELURUHAN) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {/* 1. Total Unit Keseluruhan */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="flex justify-between items-start">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Seluruh Aset</span>
                        <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                            <Truck className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-2.5">
                        <span className="text-2xl font-black text-slate-800">{metrics.total}</span>
                        <span className="text-xs text-slate-500 ml-1 font-bold">Unit</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">Alat Berat & Kendaraan Operasional</p>
                </div>

                {/* 2. Total Alat Berat */}
                <div 
                    onClick={() => setCategoryFilter(categoryFilter === 'Alat Berat' ? 'ALL' : 'Alat Berat')}
                    className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer hover:border-blue-400 ${
                        categoryFilter === 'Alat Berat' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200 shadow-2xs'
                    }`}
                >
                    <div className="flex justify-between items-start">
                        <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Alat Berat PGE LHD</span>
                        <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                            <Truck className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-2.5">
                        <span className="text-2xl font-black text-blue-700">{metrics.totalAlatBerat}</span>
                        <span className="text-xs text-blue-500 ml-1 font-bold">Unit</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">Crane, TMC, & Forklift Aktif</p>
                </div>

                {/* 3. Total KRP (Kendaraan Ringan Penumpang) */}
                <div 
                    onClick={() => setCategoryFilter(categoryFilter === 'KRP' ? 'ALL' : 'KRP')}
                    className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer hover:border-teal-400 ${
                        categoryFilter === 'KRP' ? 'border-teal-500 ring-2 ring-teal-100' : 'border-slate-200 shadow-2xs'
                    }`}
                >
                    <div className="flex justify-between items-start">
                        <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">KRP Kontrak PT BLP</span>
                        <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                            <Car className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-2.5">
                        <span className="text-2xl font-black text-teal-700">{metrics.totalKrp}</span>
                        <span className="text-xs text-teal-500 ml-1 font-bold">Unit</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">Fortuner, Innova, Hilux, Hiace, Dyna</p>
                </div>

                {/* 4. Dokumen / Pajak Mati (Perlu Perpanjangan) */}
                <div 
                    onClick={() => setStatusFilter(statusFilter === 'PAJAK MATI' ? 'ALL' : 'PAJAK MATI')}
                    className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer hover:border-red-400 ${
                        statusFilter === 'PAJAK MATI' ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200 shadow-2xs'
                    }`}
                >
                    <div className="flex justify-between items-start">
                        <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">Pajak / KIR Mati</span>
                        <div className="p-2 rounded-xl bg-red-50 text-red-600">
                            <ShieldAlert className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-2.5">
                        <span className="text-2xl font-black text-red-600">{metrics.totalPajakMati}</span>
                        <span className="text-xs text-red-400 ml-1 font-bold">Unit</span>
                    </div>
                    <p className="text-[11px] text-red-500 font-medium mt-1">Perlu perpanjangan STNK/Pajak</p>
                </div>

                {/* 5. Kesiapan Fisik (Maintenance vs Siap Operasi) */}
                <div 
                    onClick={() => setKondisiFilter(kondisiFilter === 'MAINTENANCE' ? 'ALL' : 'MAINTENANCE')}
                    className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer hover:border-amber-400 ${
                        kondisiFilter === 'MAINTENANCE' ? 'border-amber-500 ring-2 ring-amber-100' : 'border-slate-200 shadow-2xs'
                    }`}
                >
                    <div className="flex justify-between items-start">
                        <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Under Maintenance</span>
                        <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                            <AlertCircle className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-2.5">
                        <span className="text-2xl font-black text-amber-600">{metrics.totalMaintenance}</span>
                        <span className="text-xs text-amber-500 ml-1 font-bold">Unit</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">{metrics.totalSiapOperasi} Unit Siap Beroperasi</p>
                </div>
            </div>

            {/* ── GRAFIK ANALITIK VISUAL (RECHARTS) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* 1. Komposisi Jenis Aset */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                    <div>
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Komposisi Unit Aset</h4>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">Proporsi Alat Berat vs Kendaraan Ringan (KRP)</p>
                    </div>
                    <div className="h-44 my-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryChartData}
                                    innerRadius={45}
                                    outerRadius={65}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {categoryChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip 
                                    formatter={(val, name) => [`${val} Unit (${((val / metrics.total) * 100).toFixed(1)}%)`, name]}
                                    contentStyle={{ borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 text-xs font-bold pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-blue-700">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                            <span>Alat Berat ({metrics.totalAlatBerat})</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-teal-700">
                            <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                            <span>KRP ({metrics.totalKrp})</span>
                        </div>
                    </div>
                </div>

                {/* 2. Status Kepatuhan Pajak / Surat */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                    <div>
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Kepatuhan Surat & Pajak</h4>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">Status masa berlaku STNK, Pajak Tahunan, dan KIR</p>
                    </div>
                    <div className="h-44 my-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusChartData}
                                    innerRadius={45}
                                    outerRadius={65}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {statusChartData.map((entry, index) => (
                                        <Cell key={`cell-status-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip 
                                    formatter={(val, name) => [`${val} Unit (${((val / metrics.total) * 100).toFixed(1)}%)`, name]}
                                    contentStyle={{ borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 text-xs font-bold pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-emerald-700">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                            <span>Aman ({metrics.totalAman})</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-red-600">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                            <span>Pajak Mati ({metrics.totalPajakMati})</span>
                        </div>
                    </div>
                </div>

                {/* 3. Distribusi Alokasi Unit Terbanyak */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                    <div>
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Top Alokasi Pemakai</h4>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">Distribusi pemanfaatan unit di fungsi / area PGE</p>
                    </div>
                    <div className="h-44 my-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={alokasiChartData} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }} 
                                    width={90} 
                                />
                                <RechartsTooltip 
                                    formatter={(val) => [`${val} Unit`, 'Alokasi']}
                                    contentStyle={{ borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}
                                />
                                <Bar dataKey="total" fill="#3b82f6" radius={[0, 6, 6, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="text-center text-[10px] text-slate-400 font-medium pt-2 border-t border-slate-100">
                        Pool kendaraan & LHD-3 memiliki konsentrasi unit terbanyak
                    </div>
                </div>
            </div>

            {/* ── FILTER & SEARCH BAR ── */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
                    {/* Filter Kategori Tab Pills */}
                    <div className="flex flex-wrap gap-1.5 bg-slate-100/80 p-1 rounded-xl">
                        <button
                            onClick={() => setCategoryFilter('ALL')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                categoryFilter === 'ALL'
                                    ? 'bg-white text-slate-800 shadow-xs'
                                    : 'text-slate-600 hover:text-slate-800'
                            }`}
                        >
                            Semua Unit ({metrics.total})
                        </button>
                        <button
                            onClick={() => setCategoryFilter('Alat Berat')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                categoryFilter === 'Alat Berat'
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-blue-700'
                            }`}
                        >
                            <Truck className="w-3.5 h-3.5" /> Alat Berat ({metrics.totalAlatBerat})
                        </button>
                        <button
                            onClick={() => setCategoryFilter('KRP')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                categoryFilter === 'KRP'
                                    ? 'bg-teal-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-teal-700'
                            }`}
                        >
                            <Car className="w-3.5 h-3.5" /> KRP Kontrak BLP ({metrics.totalKrp})
                        </button>
                    </div>

                    {/* Filter Dropdowns & Reset */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Status Surat Dropdown */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                        >
                            <option value="ALL">Semua Status Surat</option>
                            <option value="PAJAK MATI">Pajak Mati / Perlu Perpanjangan</option>
                            <option value="AMAN">Aman / Aktif</option>
                        </select>

                        {/* Kondisi Fisik Dropdown */}
                        <select
                            value={kondisiFilter}
                            onChange={(e) => setKondisiFilter(e.target.value)}
                            className="bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                        >
                            <option value="ALL">Semua Kondisi Fisik</option>
                            <option value="READY">Siap Operasi / Baik</option>
                            <option value="MAINTENANCE">Under Maintenance</option>
                        </select>

                        {/* Reset Filter Button jika ada filter aktif */}
                        {(categoryFilter !== 'ALL' || statusFilter !== 'ALL' || kondisiFilter !== 'ALL' || searchQuery) && (
                            <button
                                onClick={() => {
                                    setCategoryFilter('ALL');
                                    setStatusFilter('ALL');
                                    setKondisiFilter('ALL');
                                    setSearchQuery('');
                                }}
                                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                                title="Reset semua filter"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Reset</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Input Pencarian Realtime */}
                <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari nomor polisi, merk, tipe/model, alokasi (misal: DB 1192 VD, Fortuner, Tadano, LHD-3, GM)..."
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* ── TABEL DATA RESMI ── */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-800">
                            Daftar Unit Terdata ({filteredList.length} dari {metrics.total})
                        </span>
                        {filteredList.length < metrics.total && (
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                                Filter Aktif
                            </span>
                        )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                        Halaman {currentPage} dari {Math.max(1, Math.ceil(filteredList.length / ITEMS_PER_PAGE))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-[11px]">
                            <tr>
                                <th className="p-3.5 text-center w-10">No</th>
                                <th className="p-3.5 text-center">Kategori</th>
                                <th className="p-3.5">No. Polisi</th>
                                <th className="p-3.5">Jenis / Skema</th>
                                <th className="p-3.5">Alokasi Pemakai</th>
                                <th className="p-3.5">Merk</th>
                                <th className="p-3.5">Type / Model</th>
                                <th className="p-3.5 text-center">STNK (5 Thn)</th>
                                <th className="p-3.5 text-center">Pajak STNK (1 Thn)</th>
                                <th className="p-3.5 text-center">KIR (6 Bln)</th>
                                <th className="p-3.5 text-center">Status Surat</th>
                                <th className="p-3.5 min-w-[200px]">Kondisi Fisik & Keterangan</th>
                                {isAdmin && <th className="p-3.5 text-center w-14">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginatedData.map((item, idx) => {
                                const actualIdx = (currentPage - 1) * ITEMS_PER_PAGE + idx;
                                const isKrp = item.derivedCategory === 'KRP';

                                return (
                                    <tr key={item.id || idx} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="p-3.5 text-slate-400 text-center font-medium">{actualIdx + 1}</td>
                                        <td className="p-3.5 text-center">
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${
                                                isKrp 
                                                    ? 'bg-teal-50 text-teal-700 border-teal-200' 
                                                    : 'bg-blue-50 text-blue-700 border-blue-200'
                                            }`}>
                                                {item.derivedCategory}
                                            </span>
                                        </td>
                                        <td className="p-3.5 font-mono font-bold text-slate-800">
                                            {item.nopol && item.nopol !== '-' ? (
                                                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 border border-slate-200">
                                                    {item.nopol}
                                                </span>
                                            ) : (
                                                <span className="text-slate-300">-</span>
                                            )}
                                        </td>
                                        <td className="p-3.5 font-bold text-slate-700">{item.jenis || '-'}</td>
                                        <td className="p-3.5 font-semibold text-slate-600">
                                            {item.alokasi && item.alokasi !== '-' ? item.alokasi : '-'}
                                        </td>
                                        <td className="p-3.5 font-bold text-slate-700">{item.merk || '-'}</td>
                                        <td className="p-3.5 font-semibold text-slate-600">{item.model || '-'}</td>
                                        <td className="p-3.5 text-center font-mono text-slate-500">
                                            {item.stnk ? item.stnk : '-'}
                                        </td>
                                        <td className="p-3.5 text-center font-mono text-slate-500">
                                            {item.pajak ? item.pajak : '-'}
                                        </td>
                                        <td className="p-3.5 text-center font-mono text-slate-500">
                                            {item.kir ? item.kir : '-'}
                                        </td>
                                        <td className="p-3.5 text-center">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wide border ${
                                                item.isPajakMati
                                                    ? 'bg-red-50 text-red-700 border-red-200'
                                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            }`}>
                                                {item.status || 'AMAN'}
                                            </span>
                                        </td>
                                        <td className="p-3.5 text-slate-600 font-medium">
                                            {item.isUnderMaintenance ? (
                                                <div className="flex items-start gap-1.5 text-amber-700 bg-amber-50/80 p-1.5 rounded-lg border border-amber-200">
                                                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                                                    <span className="text-[11px] font-bold leading-relaxed">{item.kondisi}</span>
                                                </div>
                                            ) : (
                                                <span>{item.kondisi && item.kondisi !== '-' ? item.kondisi : 'Siap Operasi'}</span>
                                            )}
                                        </td>
                                        {isAdmin && (
                                            <td className="p-3.5 text-center">
                                                <button
                                                    onClick={() => handleDeleteRow(item.id, item.nopol !== '-' ? item.nopol : item.jenis)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                    title="Hapus baris unit ini"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}

                            {paginatedData.length === 0 && (
                                <tr>
                                    <td colSpan={isAdmin ? 13 : 12} className="p-12 text-center text-slate-400">
                                        <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                        {enrichedList.length === 0 ? (
                                            <>
                                                <p className="text-xs font-bold text-slate-700">Belum ada data unit Alat Berat & KRP.</p>
                                                <p className="text-[11px] text-slate-400 mt-1">Silakan unggah berkas Excel melalui tombol <strong>Upload Laporan</strong> di bar atas.</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-xs font-bold text-slate-600">Tidak ada data unit yang sesuai filter.</p>
                                                <p className="text-[11px] text-slate-400 mt-0.5">Coba ubah kata kunci pencarian atau reset filter.</p>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="p-3 border-t border-slate-100">
                    <Pagination
                        currentPage={currentPage}
                        totalItems={filteredList.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
}
