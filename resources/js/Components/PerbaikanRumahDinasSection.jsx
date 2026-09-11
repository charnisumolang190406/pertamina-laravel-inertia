import React, { useState, useMemo, useRef } from 'react';
import { router } from '@inertiajs/react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area, Legend
} from 'recharts';
import {
    Folder, Download, Search, AlertTriangle, CheckCircle2,
    Clock, Wrench, Building2, Droplets, Zap, Wind, Sofa, Trash2,
    UploadCloud, FileSpreadsheet, RotateCcw, X
} from 'lucide-react';
import Swal from 'sweetalert2';
import Pagination from './Pagination';

// ─── 5 KATEGORI KERUSAKAN FASILITAS STANDAR ───
export const CATEGORY_CONFIG = {
    'Sipil dan Struktural': {
        color: '#f59e0b',
        bgBadge: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: Building2,
        desc: 'Atap, plafon, tembok retak, cat, fasad, pagar'
    },
    'Plumbing dan Sanitasi': {
        color: '#0284c7',
        bgBadge: 'bg-sky-50 text-sky-700 border-sky-200',
        icon: Droplets,
        desc: 'Pipa air, kran, toren, wastafel, kloset, saluran pembuangan'
    },
    'Mekanikal dan Elektrikal (MEP)': {
        color: '#8b5cf6',
        bgBadge: 'bg-purple-50 text-purple-700 border-purple-200',
        icon: Zap,
        desc: 'MCB listrik, instalasi kabel, stop kontak, sakelar, lampu'
    },
    'HVAC (Pendingin Udara)': {
        color: '#0d9488',
        bgBadge: 'bg-teal-50 text-teal-700 border-teal-200',
        icon: Wind,
        desc: 'AC split/cassette, kebocoran freon, cuci AC, pendingin'
    },
    'Interior dan Fixture (FF&E)': {
        color: '#f43f5e',
        bgBadge: 'bg-rose-50 text-rose-700 border-rose-200',
        icon: Sofa,
        desc: 'Meja, lemari, kunci/handle pintu, setrika, furniture dinas'
    }
};

// ─── AUTO CATEGORIZER CERDAS (BACKWARD COMPATIBLE) ───
export const detectKategoriKerusakan = (item) => {
    if (item.kategori && CATEGORY_CONFIG[item.kategori]) {
        return item.kategori;
    }
    const text = ((item.pekerjaan || '') + ' ' + (item.keterangan || '')).toLowerCase();

    // 1. Plumbing & Sanitasi
    if (
        text.includes('toilet') || text.includes('kloset') || text.includes('closet') ||
        text.includes('pipa') || text.includes('kran') || text.includes('keran') ||
        text.includes('bocor air') || text.includes('saluran') || text.includes('toren') ||
        text.includes('pompa') || text.includes('jet pump') || text.includes('wastafel') ||
        text.includes('drainase') || text.includes('sanyo') || text.includes('got') ||
        text.includes('sanitasi')
    ) {
        if (!text.includes('atap') && !text.includes('genteng') && !text.includes('plafon')) {
            return 'Plumbing dan Sanitasi';
        }
    }

    // 2. HVAC
    if (
        text.includes('ac') || text.includes('freon') || text.includes('tidak dingin') ||
        text.includes('cuci ac') || text.includes('chiller') || text.includes('kompresor') ||
        text.includes('hvac') || text.includes('pendingin') || text.includes('cassette')
    ) {
        return 'HVAC (Pendingin Udara)';
    }

    // 3. Mekanikal & Elektrikal (MEP)
    if (
        text.includes('listrik') || text.includes('mcb') || text.includes('lampu') ||
        text.includes('kabel') || text.includes('sakelar') || text.includes('saklar') ||
        text.includes('stop kontak') || text.includes('korslet') || text.includes('konslet') ||
        text.includes('panel') || text.includes('genset') || text.includes('trafo')
    ) {
        return 'Mekanikal dan Elektrikal (MEP)';
    }

    // 4. Interior & Fixture (FF&E)
    if (
        text.includes('meja') || text.includes('kursi') || text.includes('lemari') ||
        text.includes('kunci') || text.includes('handle') || text.includes('gagang') ||
        text.includes('engsel') || text.includes('kitchen') || text.includes('setrika') ||
        text.includes('furniture') || text.includes('kasur') || text.includes('sofa') ||
        text.includes('gorden') || text.includes('rak')
    ) {
        return 'Interior dan Fixture (FF&E)';
    }

    // 5. Sipil & Struktural
    return 'Sipil dan Struktural';
};

// ─── AUTO DETECT URGENSI ───
export const detectUrgensi = (item) => {
    if (item.urgensi && ['Emergency', 'High', 'Normal'].includes(item.urgensi)) {
        return item.urgensi;
    }
    const text = ((item.pekerjaan || '') + ' ' + (item.keterangan || '')).toLowerCase();
    if (text.includes('darurat') || text.includes('emergency') || text.includes('korslet') || text.includes('banjir') || text.includes('jebol')) {
        return 'Emergency';
    }
    if (text.includes('bocor') || text.includes('mati total') || text.includes('lepas') || text.includes('rusak berat') || text.includes('trip')) {
        return 'High';
    }
    return 'Normal';
};

export default function PerbaikanRumahDinasSection({ perbaikanList = [], isAdmin = false, formatDate }) {
    // ─── STATE FILTER & SEARCH ───
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('ALL');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterUrgensi, setFilterUrgensi] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;
    const fileInputRef = useRef(null);

    // ─── ENRICH DATA WITH COMPUTED FIELDS ───
    const enrichedList = useMemo(() => {
        return perbaikanList.map(item => {
            const kategori = detectKategoriKerusakan(item);
            const urgensi = detectUrgensi(item);

            // Compute durasi (hari)
            let durasiHari = null;
            if (item.tanggal_request) {
                const start = new Date(item.tanggal_request);
                const end = item.tanggal_selesai ? new Date(item.tanggal_selesai) : new Date();
                const diffTime = Math.max(0, end - start);
                durasiHari = Math.round(diffTime / (1000 * 60 * 60 * 24));
            }

            return {
                ...item,
                computedCategory: kategori,
                computedUrgensi: urgensi,
                durasiHari,
                isDone: (item.status || '').toLowerCase().includes('selesai') || (item.status || '').toLowerCase() === 'done'
            };
        });
    }, [perbaikanList]);

    // ─── FILTERED LIST ───
    const filteredList = useMemo(() => {
        return enrichedList.filter(item => {
            if (filterCategory !== 'ALL' && item.computedCategory !== filterCategory) return false;
            if (filterStatus === 'DONE' && !item.isDone) return false;
            if (filterStatus === 'PROGRESS' && item.isDone) return false;
            if (filterUrgensi !== 'ALL' && item.computedUrgensi !== filterUrgensi) return false;

            if (searchQuery.trim() !== '') {
                const q = searchQuery.toLowerCase();
                const matchLokasi = (item.lokasi || '').toLowerCase().includes(q);
                const matchPekerjaan = (item.pekerjaan || '').toLowerCase().includes(q);
                const matchKet = (item.keterangan || '').toLowerCase().includes(q);
                if (!matchLokasi && !matchPekerjaan && !matchKet) return false;
            }

            return true;
        });
    }, [enrichedList, filterCategory, filterStatus, filterUrgensi, searchQuery]);

    // ─── ANALYTICS KPI METRICS ───
    const kpiMetrics = useMemo(() => {
        const total = enrichedList.length;
        const doneCount = enrichedList.filter(i => i.isDone).length;
        const inProgressCount = total - doneCount;
        const resolutionRate = total > 0 ? Math.round((doneCount / total) * 100) : 0;

        // Rata-rata durasi pengerjaan untuk yang sudah selesai
        const completedWithDuration = enrichedList.filter(i => i.isDone && i.durasiHari !== null);
        const avgDuration = completedWithDuration.length > 0
            ? (completedWithDuration.reduce((acc, c) => acc + c.durasiHari, 0) / completedWithDuration.length).toFixed(1)
            : 0;

        // Emergency items
        const emergencyCount = enrichedList.filter(i => i.computedUrgensi === 'Emergency' && !i.isDone).length;

        // Kategori dominan
        const categoryCounts = {};
        enrichedList.forEach(i => {
            categoryCounts[i.computedCategory] = (categoryCounts[i.computedCategory] || 0) + 1;
        });
        let dominantCategory = '-';
        let maxCategoryCount = 0;
        Object.entries(categoryCounts).forEach(([cat, count]) => {
            if (count > maxCategoryCount) {
                maxCategoryCount = count;
                dominantCategory = cat;
            }
        });

        return {
            total,
            doneCount,
            inProgressCount,
            resolutionRate,
            avgDuration,
            emergencyCount,
            dominantCategory,
            maxCategoryCount
        };
    }, [enrichedList]);

    // ─── CHART 1: DONUT DISTRIBUSI KATEGORI KERUSAKAN ───
    const donutChartData = useMemo(() => {
        const counts = {};
        Object.keys(CATEGORY_CONFIG).forEach(cat => { counts[cat] = 0; });
        enrichedList.forEach(item => {
            counts[item.computedCategory] = (counts[item.computedCategory] || 0) + 1;
        });

        return Object.entries(counts).map(([name, value]) => ({
            name,
            value,
            percentage: enrichedList.length > 0 ? Math.round((value / enrichedList.length) * 100) : 0,
            color: CATEGORY_CONFIG[name]?.color || '#94a3b8'
        })).filter(item => item.value > 0);
    }, [enrichedList]);

    // ─── CHART 2: HORIZONTAL BAR TOP 5 RUMAH DINAS PALING SERING KOMPLAIN ───
    const topHousesChartData = useMemo(() => {
        const houseCounts = {};
        enrichedList.forEach(item => {
            let loc = (item.lokasi || 'Rumah Dinas').trim();
            loc = loc.replace(/^Rumah Dinas No\.\s*/i, 'RD ')
                     .replace(/^Rumah Dinas\s*/i, 'RD ')
                     .replace(/^RD\s+/i, 'RD ');
            houseCounts[loc] = (houseCounts[loc] || 0) + 1;
        });

        return Object.entries(houseCounts)
            .map(([lokasi, total]) => ({ lokasi, total }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);
    }, [enrichedList]);

    // ─── CHART 3: TREN BULANAN REQUEST MASUK VS SELESAI (SLA) ───
    const monthlyTrendData = useMemo(() => {
        const monthsMap = {
            '01': { month: 'Jan', request: 0, selesai: 0 },
            '02': { month: 'Feb', request: 0, selesai: 0 },
            '03': { month: 'Mar', request: 0, selesai: 0 },
            '04': { month: 'Apr', request: 0, selesai: 0 },
            '05': { month: 'Mei', request: 0, selesai: 0 },
            '06': { month: 'Jun', request: 0, selesai: 0 },
            '07': { month: 'Jul', request: 0, selesai: 0 },
            '08': { month: 'Agu', request: 0, selesai: 0 },
            '09': { month: 'Sep', request: 0, selesai: 0 },
        };

        enrichedList.forEach(item => {
            if (item.tanggal_request) {
                const m = item.tanggal_request.substring(5, 7);
                if (monthsMap[m]) monthsMap[m].request += 1;
            }
            if (item.tanggal_selesai && item.isDone) {
                const m = item.tanggal_selesai.substring(5, 7);
                if (monthsMap[m]) monthsMap[m].selesai += 1;
            }
        });

        return Object.values(monthsMap);
    }, [enrichedList]);

    // ─── HANDLER UNGGAH FILE EXCEL ───
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        Swal.fire({
            title: 'Mengunggah & Memproses File Excel...',
            text: `Memproses data perbaikan rumah dinas dari ${file.name}...`,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const formData = new FormData();
        formData.append('file', file);

        router.post('/import-perbaikan', formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Impor Excel Berhasil!',
                    text: 'Data perbaikan rumah dinas telah berhasil diimpor dan diklasifikasikan secara otomatis ke dalam 5 kategori kerusakan.',
                    confirmButtonColor: '#2563eb'
                });
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
            onError: (err) => {
                console.error(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal Mengunggah',
                    text: 'Pastikan format file Excel/CSV sesuai dengan template perbaikan.',
                    confirmButtonColor: '#2563eb'
                });
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        });
    };

    // ─── HANDLER UNDUH TEMPLATE EXCEL ───
    const handleDownloadTemplate = () => {
        const headers = ['lokasi', 'deskripsi_pekerjaan', 'tanggal_request', 'tanggal_selesai', 'status', 'link_bukti_foto_opsional', 'estimasi', 'realisasi', 'keterangan'];
        const sampleRows = [
            ['Rumah Dinas No. 30', 'Pipa kran wastafel bocor dan saluran air mampet', '2026-09-01', '2026-09-03', 'Done', 'https://drive.google.com/contoh-foto', '1200000', '1150000', 'Penggantian sifon & kran leher angsa'],
            ['Rumah Dinas No. 12', 'Atap dan plafon ruang tamu bocor rembes', '2026-09-04', '', 'In Progress', '', '2500000', '0', 'Pengecekan genteng geser'],
            ['Rumah Dinas No. 18', 'Servis AC Split 1.5 PK tidak dingin & freon habis', '2026-09-05', '2026-09-07', 'Done', '', '1500000', '1400000', 'Las pipa evaporator dan isi freon R32'],
            ['Wisma Manajemen', 'Kunci handle pintu toilet lepas', '2026-09-06', '2026-09-07', 'Done', '', '450000', '450000', 'Ganti handle set stainless'],
            ['Rumah Dinas No. 24', 'MCB listrik sering turun saat beban puncak', '2026-09-08', '', 'In Progress', '', '850000', '0', 'Pemeriksaan jalur kabel pompa'],
        ];

        let csvContent = "\uFEFF" + headers.join(',') + "\n";
        sampleRows.forEach(row => {
            csvContent += row.map(v => `"${(v || '').replace(/"/g, '""')}"`).join(',') + "\n";
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Template_Perbaikan_Rumah_Dinas.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDeleteItem = (id) => {
        Swal.fire({
            title: 'Hapus Data Perbaikan?',
            text: 'Data baris perbaikan ini akan dihapus dari sistem.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal'
        }).then((res) => {
            if (res.isConfirmed) {
                router.delete(`/logistik/perbaikan/${id}`, {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Dihapus',
                            text: 'Data perbaikan telah berhasil dihapus.',
                            timer: 1500,
                            showConfirmButton: false
                        });
                    }
                });
            }
        });
    };

    const handleExportData = () => {
        window.open('/logistik/perbaikan/export', '_blank');
    };

    const handleResetToDefault = () => {
        Swal.fire({
            title: 'Reset ke Data Bawaan (5 Kategori)?',
            text: 'Tindakan ini akan mengembalikan data perbaikan ke 15 contoh komprehensif 5 kategori kerusakan.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Reset Data',
            cancelButtonText: 'Batal'
        }).then((res) => {
            if (res.isConfirmed) {
                router.post('/logistik/perbaikan/reset', {}, {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Data Direset',
                            text: 'Data perbaikan berhasil direset ke standar 5 kategori.',
                            timer: 1500,
                            showConfirmButton: false
                        });
                    }
                });
            }
        });
    };

    return (
        <div className="space-y-6 animate-[fadeIn_0.3s_ease-in-out]">

            {/* ─── CLEAN INLINE HEADER & ACTIONS (NO POPUP BANNER) ─── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
                <div>
                    <div className="flex items-center gap-2.5">
                        <span className="p-2 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
                            <Building2 className="w-5 h-5" />
                        </span>
                        <div>
                            <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
                                Monitoring Perbaikan Rumah Dinas & Fasilitas
                            </h2>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                                Analitik 5 kelompok kerusakan & pemantauan durasi penyelesaian (SLA) fasilitas.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <button
                        onClick={handleExportData}
                        className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                        <Download className="w-4 h-4 text-slate-500" />
                        <span>Unduh Laporan</span>
                    </button>
                </div>
            </div>

            {/* ─── 4 SUMMARY KPI CARDS ─── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">Total Permintaan</span>
                        <span className="p-2 rounded-xl bg-blue-50 text-blue-600"><Wrench className="w-4 h-4" /></span>
                    </div>
                    <div className="text-2xl font-black text-slate-800 mt-2">{kpiMetrics.total} <span className="text-xs font-semibold text-slate-500">Item</span></div>
                    <div className="text-[11px] text-slate-500 font-medium mt-1">
                        <span className="text-emerald-600 font-bold">{kpiMetrics.doneCount} Selesai</span> • {kpiMetrics.inProgressCount} Dalam Proses
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">Tingkat Penyelesaian (SLA)</span>
                        <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle2 className="w-4 h-4" /></span>
                    </div>
                    <div className="text-2xl font-black text-emerald-600 mt-2">{kpiMetrics.resolutionRate}%</div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${kpiMetrics.resolutionRate}%` }} />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">Rata-rata Durasi Selesai</span>
                        <span className="p-2 rounded-xl bg-amber-50 text-amber-600"><Clock className="w-4 h-4" /></span>
                    </div>
                    <div className="text-2xl font-black text-slate-800 mt-2">{kpiMetrics.avgDuration} <span className="text-xs font-semibold text-slate-500">Hari</span></div>
                    <div className="text-[11px] text-slate-500 font-medium mt-1">
                        Target response SLA: &lt; 3.0 Hari
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">Kategori Terbanyak</span>
                        <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600"><Building2 className="w-4 h-4" /></span>
                    </div>
                    <div className="text-sm font-black text-slate-800 mt-2 truncate" title={kpiMetrics.dominantCategory}>
                        {kpiMetrics.dominantCategory}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-1">
                        {kpiMetrics.maxCategoryCount} kasus ({kpiMetrics.total > 0 ? Math.round((kpiMetrics.maxCategoryCount / kpiMetrics.total) * 100) : 0}% dari total)
                    </div>
                </div>
            </div>

            {/* ─── 3 CHARTS SECTION (DONUT, BAR, TREND) ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* GRAFIK 1: DONUT DISTRIBUSI KATEGORI KERUSAKAN */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-black text-slate-800 text-sm flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                                Distribusi Jenis Kerusakan
                            </h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">5 Kategori</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">Proporsi keluhan fasilitas hasil auto-categorizer Excel.</p>
                    </div>

                    <div className="h-56 my-2 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={donutChartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={80}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {donutChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    formatter={(value, name) => [`${value} Kasus (${enrichedList.length > 0 ? Math.round((value / enrichedList.length) * 100) : 0}%)`, name]}
                                    contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #e2e8f0' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-xl font-black text-slate-800">{enrichedList.length}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Kasus</span>
                        </div>
                    </div>

                    <div className="space-y-1.5 border-t border-slate-100 pt-3 text-[11px]">
                        {donutChartData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2 truncate">
                                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-slate-700 font-medium truncate">{item.name}</span>
                                </div>
                                <span className="font-bold text-slate-800 shrink-0">{item.value} ({item.percentage}%)</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* GRAFIK 2: BAR TOP 5 RUMAH DINAS (REPEAT COMPLAINTS) */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-black text-slate-800 text-sm flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                                Top 5 Unit Terbanyak Komplain
                            </h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                Evaluasi Overhaul
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">Unit rumah dinas dengan frekuensi kerusakan berulang.</p>
                    </div>

                    <div className="h-56 my-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={topHousesChartData}
                                margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                                <YAxis dataKey="lokasi" type="category" width={95} tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }} />
                                <RechartsTooltip
                                    formatter={(val) => [`${val} Permintaan`, 'Jumlah Kerusakan']}
                                    contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #e2e8f0' }}
                                />
                                <Bar dataKey="total" fill="#6366f1" radius={[0, 8, 8, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3 text-[11px] text-indigo-900 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                            <span className="font-bold">Insight Pemeliharaan:</span> Unit dengan frekuensi &ge; 3 kali disarankan evaluasi menyeluruh (major renovation) untuk efisiensi biaya.
                        </div>
                    </div>
                </div>

                {/* GRAFIK 3: TREN REQUEST MASUK VS SELESAI BULANAN (SLA) */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-black text-slate-800 text-sm flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                                Tren Request Masuk vs Selesai
                            </h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                SLA Performance
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">Perbandingan volume laporan masuk vs pekerjaan terselesaikan bulanan.</p>
                    </div>

                    <div className="h-56 my-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorDone" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #e2e8f0' }}
                                />
                                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                                <Area type="monotone" dataKey="request" name="Request Masuk" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReq)" />
                                <Area type="monotone" dataKey="selesai" name="Selesai Sesuai SLA" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDone)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-medium text-slate-600">
                        <span>Status Backlog Aktif:</span>
                        <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            {kpiMetrics.inProgressCount} Pekerjaan Berjalan
                        </span>
                    </div>
                </div>
            </div>

            {/* ─── FILTER CONTROLS & SEARCH BAR ─── */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-col md:flex-row items-center gap-3">
                    {/* SEARCH INPUT */}
                    <div className="relative flex-1 w-full">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Cari unit rumah dinas (misal: RD 30, RD 12) atau kata kunci kerusakan..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-9.5 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* FILTER KATEGORI */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <select
                            value={filterCategory}
                            onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
                            className="text-xs font-bold rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-700 focus:outline-hidden focus:border-blue-500"
                        >
                            <option value="ALL">Semua Kategori Kerusakan</option>
                            {Object.keys(CATEGORY_CONFIG).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        {/* FILTER STATUS */}
                        <select
                            value={filterStatus}
                            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                            className="text-xs font-bold rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-700 focus:outline-hidden focus:border-blue-500"
                        >
                            <option value="ALL">Semua Status</option>
                            <option value="DONE">Selesai (Done)</option>
                            <option value="PROGRESS">Dalam Pengerjaan (In Progress)</option>
                        </select>

                        {/* FILTER URGENSI */}
                        <select
                            value={filterUrgensi}
                            onChange={(e) => { setFilterUrgensi(e.target.value); setCurrentPage(1); }}
                            className="text-xs font-bold rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-700 focus:outline-hidden focus:border-blue-500"
                        >
                            <option value="ALL">Semua Urgensi</option>
                            <option value="Emergency">Emergency (24 Jam)</option>
                            <option value="High">High (3 Hari)</option>
                            <option value="Normal">Normal (7 Hari)</option>
                        </select>
                    </div>
                </div>

                {/* ACTIVE FILTER BADGES */}
                {(filterCategory !== 'ALL' || filterStatus !== 'ALL' || filterUrgensi !== 'ALL' || searchQuery) && (
                    <div className="flex items-center gap-2 text-[11px] pt-1 flex-wrap">
                        <span className="text-slate-500 font-bold">Filter Aktif:</span>
                        {filterCategory !== 'ALL' && (
                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg border border-blue-200 font-bold flex items-center gap-1">
                                Kategori: {filterCategory}
                                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterCategory('ALL')} />
                            </span>
                        )}
                        {filterStatus !== 'ALL' && (
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg border border-emerald-200 font-bold flex items-center gap-1">
                                Status: {filterStatus === 'DONE' ? 'Selesai' : 'In Progress'}
                                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterStatus('ALL')} />
                            </span>
                        )}
                        {filterUrgensi !== 'ALL' && (
                            <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-lg border border-purple-200 font-bold flex items-center gap-1">
                                Urgensi: {filterUrgensi}
                                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterUrgensi('ALL')} />
                            </span>
                        )}
                        <button
                            onClick={() => { setFilterCategory('ALL'); setFilterStatus('ALL'); setFilterUrgensi('ALL'); setSearchQuery(''); }}
                            className="text-red-500 hover:text-red-700 font-bold cursor-pointer underline ml-2"
                        >
                            Reset Semua
                        </button>
                    </div>
                )}
            </div>

            {/* ─── TABEL DETAIL PERBAIKAN DARI UNGGAHAN EXCEL ─── */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div>
                        <h3 className="font-black text-slate-800 text-sm">Daftar Pekerjaan & Permintaan Perbaikan Rumah Dinas (Excel Integrated)</h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            Menampilkan {filteredList.length} dari total {enrichedList.length} baris data perbaikan hasil unggahan Admin Facility Management.
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-3.5 text-slate-500 font-bold w-10 text-center">No</th>
                                <th className="p-3.5 text-slate-500 font-bold">Lokasi / Unit RD</th>
                                <th className="p-3.5 text-slate-500 font-bold">Kategori Kerusakan</th>
                                <th className="p-3.5 text-slate-500 font-bold">Deskripsi Pekerjaan</th>
                                <th className="p-3.5 text-slate-500 font-bold text-center">Urgensi</th>
                                <th className="p-3.5 text-slate-500 font-bold">Tanggal Request</th>
                                <th className="p-3.5 text-slate-500 font-bold">Tanggal Selesai</th>
                                <th className="p-3.5 text-slate-500 font-bold text-center">Durasi SLA</th>
                                <th className="p-3.5 text-slate-500 font-bold text-center">Status</th>
                                <th className="p-3.5 text-slate-500 font-bold text-center">Bukti Foto</th>
                                {isAdmin && <th className="p-3.5 text-slate-500 font-bold text-center w-16">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((item, idx) => {
                                const actualIdx = (currentPage - 1) * ITEMS_PER_PAGE + idx;
                                const catConfig = CATEGORY_CONFIG[item.computedCategory] || CATEGORY_CONFIG['Sipil dan Struktural'];
                                const CatIcon = catConfig.icon;

                                return (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-3.5 text-slate-500 text-center font-medium">{actualIdx + 1}</td>
                                        <td className="p-3.5 font-bold text-slate-800">
                                            <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700">
                                                {item.lokasi || 'Rumah Dinas'}
                                            </span>
                                        </td>
                                        <td className="p-3.5">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-bold ${catConfig.bgBadge}`}>
                                                <CatIcon className="w-3 h-3 shrink-0" />
                                                {item.computedCategory}
                                            </span>
                                        </td>
                                        <td className="p-3.5 max-w-sm text-wrap font-medium text-slate-700">
                                            <div className="font-semibold text-slate-800">{item.pekerjaan}</div>
                                            {item.keterangan && (
                                                <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-xs">{item.keterangan}</div>
                                            )}
                                        </td>
                                        <td className="p-3.5 text-center">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                                item.computedUrgensi === 'Emergency'
                                                    ? 'bg-red-50 text-red-700 border-red-200'
                                                    : item.computedUrgensi === 'High'
                                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                                            }`}>
                                                {item.computedUrgensi}
                                            </span>
                                        </td>
                                        <td className="p-3.5 text-slate-600 font-mono text-[11px]">{formatDate(item.tanggal_request)}</td>
                                        <td className="p-3.5 text-slate-600 font-mono text-[11px]">{formatDate(item.tanggal_selesai)}</td>
                                        <td className="p-3.5 text-center font-mono font-bold text-slate-700">
                                            {item.durasiHari !== null ? (
                                                <span className={`px-2 py-0.5 rounded-md text-[10px] ${
                                                    item.durasiHari <= 3 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                                }`}>
                                                    {item.durasiHari} Hari
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="p-3.5 text-center">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold shadow-2xs ${
                                                item.isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                            }`}>
                                                {item.status || 'In Progress'}
                                            </span>
                                        </td>
                                        <td className="p-3.5 text-center">
                                            {item.link_foto ? (
                                                <a
                                                    href={item.link_foto}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 text-[10px] font-bold transition-colors cursor-pointer"
                                                >
                                                    <Folder className="w-3 h-3" /> Foto
                                                </a>
                                            ) : (
                                                <span className="text-slate-300 text-[10px]">-</span>
                                            )}
                                        </td>
                                        {isAdmin && (
                                            <td className="p-3.5 text-center">
                                                <button
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    title="Hapus Baris Data"
                                                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 cursor-pointer"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                            {filteredList.length === 0 && (
                                <tr>
                                    <td colSpan={isAdmin ? 11 : 10} className="p-8 text-center text-slate-400">
                                        Tidak ditemukan data perbaikan yang sesuai dengan filter atau pencarian. Silakan unggah file Excel data perbaikan rumah dinas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
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
