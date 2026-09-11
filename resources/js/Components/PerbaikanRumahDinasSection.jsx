import React, { useState, useMemo, useRef } from 'react';
import { router } from '@inertiajs/react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area, Legend
} from 'recharts';
import {
    Download, Search, AlertTriangle, CheckCircle2,
    Clock, Wrench, Building2, Droplets, Zap, Wind, Sofa, Trash2,
    UploadCloud, FileSpreadsheet, RotateCcw, X, Calendar, CheckCircle, XCircle
} from 'lucide-react';
import Swal from 'sweetalert2';
import Pagination from './Pagination';

// ─── 5 KATEGORI KERUSAKAN FASILITAS & SLA RESMI ───
export const CATEGORY_CONFIG = {
    'Sipil dan Struktural (SST)': {
        code: 'SST',
        slaDays: 7,
        slaLabel: '7 HK',
        color: '#f59e0b',
        bgBadge: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: Building2,
        contoh: 'Atap/plafon bocor, tembok retak, pintu lapuk, kusen, pengecatan fasad/dinding, dan pagar.',
        manfaat: 'Mengetahui kondisi fisik bangunan serta kesiapan bangunan dalam menghadapi musim hujan.'
    },
    'Plumbing dan Sanitasi (PS)': {
        code: 'PS',
        slaDays: 2,
        slaLabel: '2 HK',
        color: '#0284c7',
        bgBadge: 'bg-sky-50 text-sky-700 border-sky-200',
        icon: Droplets,
        contoh: 'Pipa bocor, keran rusak, saluran pembuangan mampet, toren air, pompa jet pump, dan kloset rusak.',
        manfaat: 'Mengevaluasi kondisi jaringan air, sanitasi, serta usia jaringan pipa rumah dinas.'
    },
    'Mekanikal dan Elektrikal (MEL)': {
        code: 'MEL',
        slaDays: 2,
        slaLabel: '2 HK',
        color: '#8b5cf6',
        bgBadge: 'bg-purple-50 text-purple-700 border-purple-200',
        icon: Zap,
        contoh: 'Sakelar bermasalah, MCB turun, instalasi kabel, lampu mati, dan gangguan kelistrikan lainnya.',
        manfaat: 'Mendukung aspek keselamatan (safety/HSE) serta mencegah risiko korsleting dan kebakaran.'
    },
    'Pendingin Udara (HVAC)': {
        code: 'HVAC',
        slaDays: 2,
        slaLabel: '2 HK',
        color: '#0d9488',
        bgBadge: 'bg-teal-50 text-teal-700 border-teal-200',
        icon: Wind,
        contoh: 'AC bocor air, AC tidak dingin, freon habis, dan servis/cuci AC rutin.',
        manfaat: 'Mengevaluasi efisiensi penggunaan energi listrik serta kenyamanan penghuni.'
    },
    'Interior dan Fixture (FF&E)': {
        code: 'FF&E',
        slaDays: 2,
        slaLabel: '2 HK',
        color: '#f43f5e',
        bgBadge: 'bg-rose-50 text-rose-700 border-rose-200',
        icon: Sofa,
        contoh: 'Meja setrika, engsel lemari, handle/kunci pintu toilet, kitchen set, isi ulang gas dan perabot rumah dinas.',
        manfaat: 'Mengevaluasi kondisi aset lepas (furniture) serta inventaris rumah dinas.'
    }
};

// ─── DAFTAR PILIHAN BULAN UNTUK FILTER BULANAN ───
export const MONTH_OPTIONS = [
    { value: 'ALL', label: 'Semua Bulan (Tahun 2026)' },
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
];

// ─── AUTO CATEGORIZER CERDAS & NORMALISASI ───
export const detectKategoriKerusakan = (item) => {
    const raw = (item.kategori || '').toLowerCase();
    if (raw.includes('sst') || raw.includes('sipil') || raw.includes('struktural')) {
        return 'Sipil dan Struktural (SST)';
    }
    if (raw.includes('ps') || raw.includes('plumbing') || raw.includes('sanitasi')) {
        return 'Plumbing dan Sanitasi (PS)';
    }
    if (raw.includes('mel') || raw.includes('mep') || raw.includes('mekanikal') || raw.includes('elektrikal') || raw.includes('listrik')) {
        return 'Mekanikal dan Elektrikal (MEL)';
    }
    if (raw.includes('hvac') || raw.includes('pendingin') || raw.includes('ac')) {
        return 'Pendingin Udara (HVAC)';
    }
    if (raw.includes('ff&e') || raw.includes('ffe') || raw.includes('interior') || raw.includes('fixture')) {
        return 'Interior dan Fixture (FF&E)';
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
            return 'Plumbing dan Sanitasi (PS)';
        }
    }

    // 2. HVAC
    if (
        text.includes('ac') || text.includes('freon') || text.includes('tidak dingin') ||
        text.includes('cuci ac') || text.includes('chiller') || text.includes('kompresor') ||
        text.includes('hvac') || text.includes('pendingin') || text.includes('cassette')
    ) {
        return 'Pendingin Udara (HVAC)';
    }

    // 3. Mekanikal & Elektrikal (MEL)
    if (
        text.includes('listrik') || text.includes('mcb') || text.includes('lampu') ||
        text.includes('kabel') || text.includes('sakelar') || text.includes('saklar') ||
        text.includes('stop kontak') || text.includes('korslet') || text.includes('konslet') ||
        text.includes('panel') || text.includes('genset') || text.includes('trafo')
    ) {
        return 'Mekanikal dan Elektrikal (MEL)';
    }

    // 4. Interior & Fixture (FF&E)
    if (
        text.includes('meja') || text.includes('kursi') || text.includes('lemari') ||
        text.includes('kunci') || text.includes('handle') || text.includes('gagang') ||
        text.includes('engsel') || text.includes('kitchen') || text.includes('setrika') ||
        text.includes('furniture') || text.includes('kasur') || text.includes('sofa') ||
        text.includes('gorden') || text.includes('rak') || text.includes('gas')
    ) {
        return 'Interior dan Fixture (FF&E)';
    }

    // 5. Sipil & Struktural
    return 'Sipil dan Struktural (SST)';
};

// ─── AUTO DETECT URGENSI (LOW, MEDIUM, HIGH) ───
export const detectUrgensi = (item) => {
    const raw = (item.urgensi || '').toLowerCase();
    if (raw === 'high' || raw === 'emergency' || raw === 'darurat') return 'High';
    if (raw === 'medium' || raw === 'normal' || raw === 'sedang') return 'Medium';
    if (raw === 'low' || raw === 'rendah') return 'Low';

    const text = ((item.pekerjaan || '') + ' ' + (item.keterangan || '')).toLowerCase();
    if (text.includes('darurat') || text.includes('emergency') || text.includes('korslet') || text.includes('banjir') || text.includes('jebol') || text.includes('parah')) {
        return 'High';
    }
    if (text.includes('bocor') || text.includes('mati total') || text.includes('lepas') || text.includes('rusak berat') || text.includes('trip') || text.includes('tidak dingin')) {
        return 'Medium';
    }
    return 'Low';
};

// ─── FORMAT TANGGAL RINGKAS (DD-MM-YYYY) SESUAI ARAHAN PAK JOHAN AGAR HEMAT RUANG ───
const formatCompactDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
        const clean = String(dateStr).split('T')[0];
        const parts = clean.split('-');
        if (parts.length === 3 && parts[0].length === 4) {
            const [y, m, d] = parts;
            return `${d.padStart(2, '0')}-${m.padStart(2, '0')}-${y}`;
        }
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    } catch {
        return dateStr;
    }
};

export default function PerbaikanRumahDinasSection({ perbaikanList = [], isAdmin = false, formatDate }) {
    // ─── STATE FILTER & SEARCH ───
    const [searchQuery, setSearchQuery] = useState('');
    const [filterMonth, setFilterMonth] = useState('ALL');
    const [filterCategory, setFilterCategory] = useState('ALL');
    const [filterUrgensi, setFilterUrgensi] = useState('ALL');
    const [filterSla, setFilterSla] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;
    const fileInputRef = useRef(null);

    // ─── ENRICH DATA WITH COMPUTED FIELDS & SLA RULES ───
    const enrichedList = useMemo(() => {
        return perbaikanList.map(item => {
            const kategori = detectKategoriKerusakan(item);
            const catConfig = CATEGORY_CONFIG[kategori] || CATEGORY_CONFIG['Sipil dan Struktural (SST)'];
            const urgensi = detectUrgensi(item);

            // Ekstrak bulan dari tanggal_request atau tanggal_selesai
            let itemMonth = null;
            if (item.tanggal_request) {
                itemMonth = item.tanggal_request.substring(5, 7);
            } else if (item.tanggal_selesai) {
                itemMonth = item.tanggal_selesai.substring(5, 7);
            }

            // Hitung durasi lama perbaikan (hari)
            let durasiHari = null;
            if (item.tanggal_request) {
                const start = new Date(item.tanggal_request);
                const end = item.tanggal_selesai ? new Date(item.tanggal_selesai) : new Date();
                const diffTime = Math.max(0, end - start);
                durasiHari = Math.round(diffTime / (1000 * 60 * 60 * 24));
            }

            // Aturan SLA: SST = 7 HK, Kategori lainnya = 2 HK
            const slaDaysLimit = catConfig.slaDays;
            const isSlaCompliant = durasiHari !== null ? durasiHari <= slaDaysLimit : true;

            const isDone = (item.status || '').toLowerCase().includes('selesai') || (item.status || '').toLowerCase() === 'done';

            return {
                ...item,
                computedCategory: kategori,
                catConfig,
                computedUrgensi: urgensi,
                itemMonth,
                durasiHari,
                slaDaysLimit,
                isSlaCompliant,
                isDone
            };
        });
    }, [perbaikanList]);

    // ─── DATA TERFILTER BERDASARKAN BULAN (MENGUBAH SEMUA GRAFIK & KPI) ───
    const monthFilteredList = useMemo(() => {
        if (filterMonth === 'ALL') return enrichedList;
        return enrichedList.filter(item => item.itemMonth === filterMonth);
    }, [enrichedList, filterMonth]);

    // ─── DATA TERFILTER UNTUK TABEL DETAIL (MENERAPKAN SEARCH & FILTER LAIN) ───
    const filteredList = useMemo(() => {
        return monthFilteredList.filter(item => {
            if (filterCategory !== 'ALL' && item.computedCategory !== filterCategory) return false;
            if (filterUrgensi !== 'ALL' && item.computedUrgensi !== filterUrgensi) return false;
            if (filterSla === 'COMPLIANT' && !item.isSlaCompliant) return false;
            if (filterSla === 'OVERDUE' && item.isSlaCompliant) return false;

            if (searchQuery.trim() !== '') {
                const q = searchQuery.toLowerCase();
                const matchLokasi = (item.lokasi || '').toLowerCase().includes(q);
                const matchPekerjaan = (item.pekerjaan || '').toLowerCase().includes(q);
                const matchKet = (item.keterangan || '').toLowerCase().includes(q);
                if (!matchLokasi && !matchPekerjaan && !matchKet) return false;
            }

            return true;
        });
    }, [monthFilteredList, filterCategory, filterUrgensi, filterSla, searchQuery]);

    // ─── ANALYTICS KPI METRICS (BERDASARKAN BULAN TERPILIH) ───
    const kpiMetrics = useMemo(() => {
        const list = monthFilteredList;
        const total = list.length;
        const doneCount = list.filter(i => i.isDone).length;
        const inProgressCount = total - doneCount;

        // Kesesuaian SLA: Berapa yang Sesuai SLA dan berapa yang Melebihi SLA
        const compliantCount = list.filter(i => i.isSlaCompliant).length;
        const overdueCount = list.filter(i => !i.isSlaCompliant && i.durasiHari !== null).length;
        const evaluatedTotal = compliantCount + overdueCount;
        const slaRate = evaluatedTotal > 0 ? Math.round((compliantCount / evaluatedTotal) * 100) : (total > 0 ? 100 : 0);

        // Rata-rata durasi perbaikan untuk pekerjaan yang memiliki durasi
        const itemsWithDuration = list.filter(i => i.durasiHari !== null);
        const avgDuration = itemsWithDuration.length > 0
            ? (itemsWithDuration.reduce((acc, c) => acc + c.durasiHari, 0) / itemsWithDuration.length).toFixed(1)
            : '0.0';

        // Kategori perbaikan dominan
        const categoryCounts = {};
        list.forEach(i => {
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
            compliantCount,
            overdueCount,
            slaRate,
            avgDuration,
            itemsWithDurationCount: itemsWithDuration.length,
            dominantCategory,
            maxCategoryCount
        };
    }, [monthFilteredList]);

    // ─── CHART 1: DONUT DISTRIBUSI KATEGORI KERUSAKAN ───
    const donutChartData = useMemo(() => {
        const counts = {};
        Object.keys(CATEGORY_CONFIG).forEach(cat => { counts[cat] = 0; });
        monthFilteredList.forEach(item => {
            counts[item.computedCategory] = (counts[item.computedCategory] || 0) + 1;
        });

        return Object.entries(counts).map(([name, value]) => ({
            name,
            code: CATEGORY_CONFIG[name]?.code || name,
            slaLabel: CATEGORY_CONFIG[name]?.slaLabel || '2 HK',
            value,
            percentage: monthFilteredList.length > 0 ? Math.round((value / monthFilteredList.length) * 100) : 0,
            color: CATEGORY_CONFIG[name]?.color || '#94a3b8'
        })).filter(item => item.value > 0);
    }, [monthFilteredList]);

    // ─── CHART 2: BAR TOP 5 UNIT TERBANYAK PERBAIKAN ───
    const topHousesChartData = useMemo(() => {
        const houseCounts = {};
        monthFilteredList.forEach(item => {
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
    }, [monthFilteredList]);

    // ─── CHART 3: TREN PERBAIKAN MASUK VS SELESAI (SLA) ───
    const monthlyTrendData = useMemo(() => {
        const monthsMap = {
            '01': { month: 'Jan', request: 0, selesaiSla: 0 },
            '02': { month: 'Feb', request: 0, selesaiSla: 0 },
            '03': { month: 'Mar', request: 0, selesaiSla: 0 },
            '04': { month: 'Apr', request: 0, selesaiSla: 0 },
            '05': { month: 'Mei', request: 0, selesaiSla: 0 },
            '06': { month: 'Jun', request: 0, selesaiSla: 0 },
            '07': { month: 'Jul', request: 0, selesaiSla: 0 },
            '08': { month: 'Agu', request: 0, selesaiSla: 0 },
            '09': { month: 'Sep', request: 0, selesaiSla: 0 },
            '10': { month: 'Okt', request: 0, selesaiSla: 0 },
            '11': { month: 'Nov', request: 0, selesaiSla: 0 },
            '12': { month: 'Des', request: 0, selesaiSla: 0 },
        };

        enrichedList.forEach(item => {
            if (item.tanggal_request) {
                const m = item.tanggal_request.substring(5, 7);
                if (monthsMap[m]) monthsMap[m].request += 1;
            }
            if (item.tanggal_selesai && item.isSlaCompliant) {
                const m = item.tanggal_selesai.substring(5, 7);
                if (monthsMap[m]) monthsMap[m].selesaiSla += 1;
            }
        });

        return Object.values(monthsMap);
    }, [enrichedList]);

    // ─── HANDLER UNDUH TEMPLATE EXCEL RESMI (.XLSX) ───
    const handleDownloadTemplate = () => {
        const link = document.createElement('a');
        link.href = '/logistik/perbaikan/template';
        link.setAttribute('download', 'Template_Data_Perbaikan.xlsx');
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
            title: 'Reset ke Data Standar 2026?',
            text: 'Mengembalikan data perbaikan ke 15 contoh standar 5 kategori (SST, PS, MEL, HVAC, FF&E).',
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
                            text: 'Data perbaikan berhasil direset ke standar 5 kategori terbaru.',
                            timer: 1500,
                            showConfirmButton: false
                        });
                    }
                });
            }
        });
    };

    const selectedMonthLabel = MONTH_OPTIONS.find(m => m.value === filterMonth)?.label || 'Semua Bulan';

    return (
        <div className="space-y-6 animate-[fadeIn_0.3s_ease-in-out]">

            {/* ─── HEADER & BULAN FILTER (TOP BAR) ─── */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100 shrink-0 shadow-2xs">
                        <Building2 className="w-5 h-5" />
                    </span>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
                                Monitoring Perbaikan Rumah Dinas & Kantor
                            </h2>
                            <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                                Logistic & FM Area 2026
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Analitik 5 kelompok kerusakan & pemantauan tingkat kesesuaian durasi penyelesaian (SLA).
                        </p>
                    </div>
                </div>

                {/* FILTER PERIODE BULAN & ACTION BUTTONS */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {/* FILTER PER BULAN UTAMA */}
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-2xs">
                        <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="text-[11px] font-bold text-slate-600 hidden sm:inline">Periode:</span>
                        <select
                            value={filterMonth}
                            onChange={(e) => { setFilterMonth(e.target.value); setCurrentPage(1); }}
                            className="text-xs font-black bg-transparent text-slate-800 focus:outline-hidden cursor-pointer pr-1"
                        >
                            {MONTH_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleDownloadTemplate}
                        title="Unduh Template Excel (.xlsx) Rekap Perbaikan 2026"
                        className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl border border-emerald-200 shadow-2xs transition-all active:scale-95 cursor-pointer"
                    >
                        <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                        <span className="hidden sm:inline">Template Excel (.xlsx)</span>
                    </button>

                    <button
                        onClick={handleExportData}
                        className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs transition-all active:scale-95 cursor-pointer"
                    >
                        <Download className="w-4 h-4 text-slate-600" />
                        <span>Unduh Laporan</span>
                    </button>

                    {isAdmin && (
                        <button
                            onClick={handleResetToDefault}
                            title="Reset data ke contoh 5 kategori 2026"
                            className="p-2 text-slate-400 hover:text-blue-600 rounded-xl hover:bg-blue-50 border border-slate-200 transition-colors cursor-pointer"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* ─── 4 SUMMARY KPI CARDS (UPDATE SESUAI KESEPAKATAN) ─── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* CARD 1: TOTAL PERBAIKAN */}
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">Total Perbaikan</span>
                        <span className="p-2 rounded-xl bg-blue-50 text-blue-600"><Wrench className="w-4 h-4" /></span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
                        {kpiMetrics.total} <span className="text-xs font-semibold text-slate-500">Item</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-1">
                        <span className="text-emerald-600 font-bold">{kpiMetrics.doneCount} Selesai</span> • Rekapitulasi Selesai 100%
                    </div>
                </div>

                {/* CARD 2: TINGKAT KESESUAIAN SLA */}
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">Tingkat Kesesuaian SLA</span>
                        <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle2 className="w-4 h-4" /></span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">
                        {kpiMetrics.slaRate}%
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${kpiMetrics.slaRate}%` }} />
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium mt-1.5 flex items-center justify-between">
                        <span className="text-emerald-700 font-bold">{kpiMetrics.compliantCount} Sesuai SLA</span>
                        <span className="text-rose-600 font-bold">{kpiMetrics.overdueCount} Melebihi SLA</span>
                    </div>
                </div>

                {/* CARD 3: RATA-RATA DURASI PERBAIKAN (HAPUS TARGET RESPON) */}
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">Rata-rata Durasi Perbaikan</span>
                        <span className="p-2 rounded-xl bg-amber-50 text-amber-600"><Clock className="w-4 h-4" /></span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
                        {kpiMetrics.avgDuration} <span className="text-xs font-semibold text-slate-500">Hari</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-1">
                        Lama pengerjaan rata-rata per unit rumah dinas
                    </div>
                </div>

                {/* CARD 4: KATEGORI TERBANYAK */}
                <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">Kategori Terbanyak</span>
                        <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600"><Building2 className="w-4 h-4" /></span>
                    </div>
                    <div className="text-sm sm:text-base font-black text-slate-800 mt-2 truncate" title={kpiMetrics.dominantCategory}>
                        {kpiMetrics.dominantCategory}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-1">
                        {kpiMetrics.maxCategoryCount} perbaikan ({kpiMetrics.total > 0 ? Math.round((kpiMetrics.maxCategoryCount / kpiMetrics.total) * 100) : 0}% dari total)
                    </div>
                </div>
            </div>

            {/* ─── 3 CHARTS SECTION (DONUT KATEGORI, BAR TOP 5 UNIT, TREN BULANAN) ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* GRAFIK 1: DONUT DISTRIBUSI KATEGORI KERUSAKAN & STANDAR SLA */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-black text-slate-800 text-sm flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                                Distribusi Kategori Kerusakan
                            </h3>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                5 Kelompok
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">
                            Proporsi perbaikan fasilitas periode <strong className="text-slate-700">{selectedMonthLabel}</strong>.
                        </p>
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
                                    formatter={(value, name) => [`${value} Kasus (${monthFilteredList.length > 0 ? Math.round((value / monthFilteredList.length) * 100) : 0}%)`, name]}
                                    contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #e2e8f0' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-black text-slate-800">{monthFilteredList.length}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Perbaikan</span>
                        </div>
                    </div>

                    <div className="space-y-1.5 border-t border-slate-100 pt-3 text-[11px]">
                        {donutChartData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2 truncate">
                                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                    <span className="text-slate-700 font-semibold truncate">{item.name}</span>
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-mono font-bold">
                                        SLA {item.slaLabel}
                                    </span>
                                </div>
                                <span className="font-bold text-slate-800 shrink-0">{item.value} ({item.percentage}%)</span>
                            </div>
                        ))}
                        {donutChartData.length === 0 && (
                            <div className="text-center py-4 text-slate-400 text-xs font-medium">
                                Tidak ada data pada periode ini.
                            </div>
                        )}
                    </div>
                </div>

                {/* GRAFIK 2: BAR TOP 5 UNIT TERBANYAK PERBAIKAN (KOMPLAIN DIGANTI PERBAIKAN) */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-black text-slate-800 text-sm flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                                Top 5 Unit Terbanyak Perbaikan
                            </h3>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                Evaluasi Overhaul
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">
                            Unit rumah dinas dengan frekuensi perbaikan terbanyak.
                        </p>
                    </div>

                    <div className="h-56 my-2">
                        {topHousesChartData.length > 0 ? (
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
                                        formatter={(val) => [`${val} Pekerjaan`, 'Total Perbaikan']}
                                        contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #e2e8f0' }}
                                    />
                                    <Bar dataKey="total" fill="#6366f1" radius={[0, 8, 8, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 text-xs font-medium">
                                Belum ada catatan unit perbaikan pada periode ini.
                            </div>
                        )}
                    </div>

                    <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3 text-[11px] text-indigo-900 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                            <span className="font-bold">Insight Pemeliharaan:</span> Unit dengan frekuensi perbaikan berulang disarankan dilakukan audit fisik menyeluruh (major overhaul) untuk pencegahan kerusakan berkelanjutan.
                        </div>
                    </div>
                </div>

                {/* GRAFIK 3: TREN PERBAIKAN MASUK VS SELESAI (SLA) */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-black text-slate-800 text-sm flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                                Tren Perbaikan Masuk vs Selesai (SLA)
                            </h3>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Kinerja Tahunan
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">
                            Perbandingan volume laporan perbaikan masuk vs pekerjaan terselesaikan bulanan.
                        </p>
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
                                <Area type="monotone" dataKey="request" name="Perbaikan Masuk" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReq)" />
                                <Area type="monotone" dataKey="selesaiSla" name="Selesai Sesuai SLA" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDone)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ─── PANDUAN RINGKAS 5 KATEGORI KERUSAKAN & SLA RESMI ─── */}
            <div className="bg-slate-50/70 border border-slate-200 rounded-3xl p-4.5">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        Standar 5 Kategori Kerusakan Fasilitas & Batas SLA (Tahun 2026)
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-1">
                    {Object.entries(CATEGORY_CONFIG).map(([catName, config]) => {
                        const Icon = config.icon;
                        return (
                            <div key={catName} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${config.bgBadge}`}>
                                        {config.code}
                                    </span>
                                    <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 font-mono">
                                        SLA: {config.slaLabel}
                                    </span>
                                </div>
                                <h4 className="font-bold text-slate-800 text-xs pt-1">{catName}</h4>
                                <p className="text-[10.5px] text-slate-500 leading-snug line-clamp-2" title={config.contoh}>
                                    {config.contoh}
                                </p>
                            </div>
                        );
                    })}
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
                            placeholder="Cari unit rumah dinas (misal: RD 12, RD 30) atau kata kunci perbaikan..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-9.5 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
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
                    <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
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

                        {/* FILTER KESESUAIAN SLA */}
                        <select
                            value={filterSla}
                            onChange={(e) => { setFilterSla(e.target.value); setCurrentPage(1); }}
                            className="text-xs font-bold rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-700 focus:outline-hidden focus:border-blue-500"
                        >
                            <option value="ALL">Semua Kesesuaian SLA</option>
                            <option value="COMPLIANT">Sesuai SLA (Tepat Waktu)</option>
                            <option value="OVERDUE">Melebihi SLA (Terlambat)</option>
                        </select>

                        {/* FILTER URGENSI */}
                        <select
                            value={filterUrgensi}
                            onChange={(e) => { setFilterUrgensi(e.target.value); setCurrentPage(1); }}
                            className="text-xs font-bold rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-700 focus:outline-hidden focus:border-blue-500"
                        >
                            <option value="ALL">Semua Urgensi</option>
                            <option value="High">High (Tinggi)</option>
                            <option value="Medium">Medium (Sedang)</option>
                            <option value="Low">Low (Rendah)</option>
                        </select>
                    </div>
                </div>

                {/* ACTIVE FILTER BADGES */}
                {(filterMonth !== 'ALL' || filterCategory !== 'ALL' || filterUrgensi !== 'ALL' || filterSla !== 'ALL' || searchQuery) && (
                    <div className="flex items-center gap-2 text-[11px] pt-1 flex-wrap">
                        <span className="text-slate-500 font-bold">Filter Aktif:</span>
                        {filterMonth !== 'ALL' && (
                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg border border-blue-200 font-bold flex items-center gap-1">
                                Bulan: {selectedMonthLabel}
                                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterMonth('ALL')} />
                            </span>
                        )}
                        {filterCategory !== 'ALL' && (
                            <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg border border-amber-200 font-bold flex items-center gap-1">
                                Kategori: {filterCategory}
                                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterCategory('ALL')} />
                            </span>
                        )}
                        {filterSla !== 'ALL' && (
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg border border-emerald-200 font-bold flex items-center gap-1">
                                SLA: {filterSla === 'COMPLIANT' ? 'Sesuai SLA' : 'Melebihi SLA'}
                                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterSla('ALL')} />
                            </span>
                        )}
                        {filterUrgensi !== 'ALL' && (
                            <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-lg border border-purple-200 font-bold flex items-center gap-1">
                                Urgensi: {filterUrgensi}
                                <X className="w-3 h-3 cursor-pointer" onClick={() => setFilterUrgensi('ALL')} />
                            </span>
                        )}
                        <button
                            onClick={() => {
                                setFilterMonth('ALL');
                                setFilterCategory('ALL');
                                setFilterUrgensi('ALL');
                                setFilterSla('ALL');
                                setSearchQuery('');
                            }}
                            className="text-red-500 hover:text-red-700 font-bold cursor-pointer underline ml-2"
                        >
                            Reset Semua Filter
                        </button>
                    </div>
                )}
            </div>

            {/* ─── TABEL DETAIL PERBAIKAN (EXCEL INTEGRATED, NO BUKTI FOTO) ─── */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h3 className="font-black text-slate-800 text-sm">
                            Rekapitulasi Data Perbaikan Rumah Dinas & Fasilitas
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            Menampilkan {filteredList.length} dari total {monthFilteredList.length} baris data perbaikan hasil rekapitulasi Admin Aset dan Fasility Management.
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
                                <th className="p-3.5 text-slate-500 font-bold text-center">Lama Perbaikan</th>
                                <th className="p-3.5 text-slate-500 font-bold text-center">Kesesuaian SLA</th>
                                {isAdmin && <th className="p-3.5 text-slate-500 font-bold text-center w-16">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((item, idx) => {
                                const actualIdx = (currentPage - 1) * ITEMS_PER_PAGE + idx;
                                const catConfig = item.catConfig || CATEGORY_CONFIG['Sipil dan Struktural (SST)'];
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
                                            <div className="flex items-center gap-1.5">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-bold ${catConfig.bgBadge}`}>
                                                    <CatIcon className="w-3 h-3 shrink-0" />
                                                    {catConfig.code}
                                                </span>
                                                <span className="text-[11px] font-semibold text-slate-700 truncate max-w-[170px]" title={item.computedCategory}>
                                                    {item.computedCategory}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-3.5 max-w-sm text-wrap font-medium text-slate-700">
                                            <div className="font-semibold text-slate-800">{item.pekerjaan}</div>
                                            {item.keterangan && (
                                                <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-xs">{item.keterangan}</div>
                                            )}
                                        </td>
                                        <td className="p-3.5 text-center">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                                item.computedUrgensi === 'High'
                                                    ? 'bg-red-50 text-red-700 border-red-200'
                                                    : item.computedUrgensi === 'Medium'
                                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            }`}>
                                                {item.computedUrgensi}
                                            </span>
                                        </td>
                                        <td className="p-3.5 text-slate-600 font-mono text-[11px] font-semibold">{formatCompactDate(item.tanggal_request)}</td>
                                        <td className="p-3.5 text-slate-600 font-mono text-[11px] font-semibold">{formatCompactDate(item.tanggal_selesai)}</td>
                                        
                                        {/* LAMA PERBAIKAN (MENGGANTIKAN DURASI SLA) */}
                                        <td className="p-3.5 text-center font-mono font-bold text-slate-700">
                                            {item.durasiHari !== null ? (
                                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                                                    item.isSlaCompliant ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                                                }`}>
                                                    {item.durasiHari} Hari
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-[11px]">-</span>
                                            )}
                                        </td>

                                        {/* TINGKAT KESESUAIAN SLA */}
                                        <td className="p-3.5 text-center">
                                            {item.isSlaCompliant ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                                                    Sesuai SLA ({item.catConfig.slaLabel})
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                                                    <XCircle className="w-3 h-3 text-rose-600" />
                                                    Melebihi SLA (&gt; {item.catConfig.slaLabel})
                                                </span>
                                            )}
                                        </td>

                                        {/* AKSI */}
                                        {isAdmin && (
                                            <td className="p-3.5 text-center">
                                                <button
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    title="Hapus Baris Data"
                                                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 cursor-pointer transition-colors"
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
                                    <td colSpan={isAdmin ? 10 : 9} className="p-8 text-center text-slate-400">
                                        Tidak ditemukan data perbaikan yang sesuai dengan filter atau pencarian. Silakan unggah file Excel rekap perbaikan rumah dinas.
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
