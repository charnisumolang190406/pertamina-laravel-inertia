import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { 
  FileSignature, Calculator, CheckCircle, AlertCircle, Plus, Trash2, Database, UploadCloud, Check, X,
  Users, Package, DollarSign, Filter
} from 'lucide-react';
import KpiCard from '../../Components/KpiCard';
import MomTable from '../../Components/MomTable';

// Fungsi pillar definitions
const FUNGSI_OPTIONS = [
    { value: 'Human Capital',        label: 'Human Capital',        short: 'HC',   color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { value: 'Facility Management',  label: 'Facility Management',  short: 'FM',   color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { value: 'Budgeting',            label: 'Budgeting',            short: 'BGT',  color: 'bg-green-100 text-green-700 border-green-200' },
];

const FUNGSI_ALL = { value: 'Semua', label: 'Semua Fungsi', short: 'ALL', color: 'bg-slate-100 text-slate-600 border-slate-200' };

function getFungsiMeta(fungsi) {
    return FUNGSI_OPTIONS.find(f => f.value === fungsi) || { label: fungsi || '-', short: fungsi || '-', color: 'bg-slate-100 text-slate-500 border-slate-200' };
}

export default function Scm(props) {
    const { scmList, momList, auth, onOpenFeedback } = props;
    const currentUser = auth.user;

    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterFungsi, setFilterFungsi] = useState('Semua');

    const { data, setData, post, reset, errors } = useForm({
        nomor: '',
        nama: '',
        vendor: '',
        nilai: '',
        mulai: '',
        selesai: '',
        progres: 0,
        status: 'Aktif',
        fungsi: 'Human Capital',
    });

    const calculateProgress = (start, end) => {
        if (!start || !end) return 0;
        const startDate = new Date(start);
        const endDate = new Date(end);
        const now = new Date();
        
        if (now < startDate) return 0;
        if (now > endDate) return 100;
        
        const totalDuration = endDate.getTime() - startDate.getTime();
        const elapsed = now.getTime() - startDate.getTime();
        
        const rawProgress = (elapsed / totalDuration) * 100;
        return Math.min(Math.max(Math.round(rawProgress), 0), 100);
    };

    const contractsWithProgress = scmList.map(c => ({
        ...c,
        calculatedProgress: calculateProgress(c.mulai, c.selesai)
    }));

    // Filter by search + fungsi
    const filteredScm = contractsWithProgress.filter(c => {
        const matchSearch = (
            c.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.nomor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.vendor.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const matchFungsi = filterFungsi === 'Semua' || c.fungsi === filterFungsi;
        return matchSearch && matchFungsi;
    });

    const totalContracts = contractsWithProgress.length;
    const totalValue = contractsWithProgress.reduce((acc, c) => acc + c.nilai, 0);
    const activeContracts = contractsWithProgress.filter(c => c.calculatedProgress < 100).length;
    const criticalContracts = contractsWithProgress.filter(c => c.calculatedProgress >= 90 && c.calculatedProgress < 100).length;

    // Per-fungsi value summaries for KPI enrichment
    const valueByFungsi = FUNGSI_OPTIONS.reduce((acc, f) => {
        acc[f.value] = contractsWithProgress
            .filter(c => c.fungsi === f.value)
            .reduce((s, c) => s + c.nilai, 0);
        return acc;
    }, {});

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    };

    const formatCurrencyShort = (val) => {
        if (val >= 1_000_000_000) return `Rp ${(val / 1_000_000_000).toFixed(1)} M`;
        if (val >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(1)} Jt`;
        return formatCurrency(val);
    };

    const handleAddContractSubmit = (e) => {
        e.preventDefault();
        post('/scm', {
            onSuccess: () => {
                setShowAddModal(false);
                reset();
            }
        });
    };

    const handleDeleteScm = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data monitoring kontrak ini?')) {
            router.delete(`/scm/${id}`);
        }
    };

    const handleResetScmData = (mode) => {
        if (mode === 'clear') {
            if (confirm('Apakah Anda yakin ingin menghapus SEMUA data kontrak monitoring?')) {
                router.post('/scm/clear');
            }
        } else if (mode === 'default') {
            if (confirm('Apakah Anda yakin ingin mengembalikan data kontrak ke data default awal?')) {
                router.post('/scm/reset');
            }
        }
    };

    const isAdmin = currentUser?.role?.startsWith('Admin');

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-[fadeIn_0.3s_ease-in-out] font-sans text-slate-800">
            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard 
                    title="Total Kontrak" 
                    value={`${totalContracts} Kontrak`} 
                    subtitle="Mencakup semua fungsi" 
                    icon={FileSignature} 
                    colorClass="text-blue-600" 
                    bgClass="bg-blue-50" 
                />
                <KpiCard 
                    title="Nilai Total Kontrak" 
                    value={formatCurrency(totalValue)} 
                    subtitle="PGE Area Lahendong" 
                    icon={Calculator} 
                    colorClass="text-green-600" 
                    bgClass="bg-green-50" 
                />
                <KpiCard 
                    title="Kontrak Aktif" 
                    value={`${activeContracts} Kontrak`} 
                    subtitle="Masih berjalan (Progress < 100%)" 
                    icon={CheckCircle} 
                    colorClass="text-indigo-600" 
                    bgClass="bg-indigo-50" 
                />
                <KpiCard 
                    title="Kontrak Akan Selesai" 
                    value={`${criticalContracts} Unit`} 
                    subtitle="Progress >= 90%" 
                    icon={AlertCircle} 
                    colorClass="text-amber-600" 
                    bgClass="bg-amber-50" 
                />
            </div>

            {/* PER-FUNGSI SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {FUNGSI_OPTIONS.map(f => {
                    const fungsiContracts = contractsWithProgress.filter(c => c.fungsi === f.value);
                    const fungsiValue = fungsiContracts.reduce((s, c) => s + c.nilai, 0);
                    const fungsiCount = fungsiContracts.length;
                    const IconComp = f.value === 'Human Capital' ? Users : f.value === 'Facility Management' ? Package : DollarSign;
                    return (
                        <button
                            key={f.value}
                            onClick={() => setFilterFungsi(filterFungsi === f.value ? 'Semua' : f.value)}
                            className={`text-left p-4 rounded-2xl border transition-all cursor-pointer active:scale-95 ${
                                filterFungsi === f.value
                                    ? 'bg-blue-600 border-blue-700 text-white shadow-md shadow-blue-500/20'
                                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                                    filterFungsi === f.value ? 'bg-white/20 border-white/30 text-white' : f.color
                                }`}>
                                    {f.short}
                                </span>
                                <IconComp className={`w-4 h-4 ${filterFungsi === f.value ? 'text-white/80' : 'text-slate-400'}`} />
                            </div>
                            <p className={`text-[11px] font-extrabold uppercase tracking-wide mb-1 ${filterFungsi === f.value ? 'text-white/70' : 'text-slate-400'}`}>
                                {f.label}
                            </p>
                            <p className={`text-lg font-black leading-tight ${filterFungsi === f.value ? 'text-white' : 'text-slate-800'}`}>
                                {fungsiCount} Kontrak
                            </p>
                            <p className={`text-[10px] font-bold mt-0.5 ${filterFungsi === f.value ? 'text-white/70' : 'text-slate-400'}`}>
                                {formatCurrencyShort(fungsiValue)}
                            </p>
                        </button>
                    );
                })}
            </div>

            {/* ACTION BUTTONS & SEARCH BAR */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex gap-2 text-xs font-bold flex-wrap">
                    {isAdmin && (
                        <>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md shadow-blue-500/10 cursor-pointer transition-all active:scale-95"
                            >
                                <Plus className="w-4 h-4" /> Tambah Kontrak
                            </button>
                            <button
                                onClick={() => handleResetScmData('clear')}
                                className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-xl border border-red-200 cursor-pointer transition-all active:scale-95"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> Kosongkan Kontrak
                            </button>
                            <button
                                onClick={() => handleResetScmData('default')}
                                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl border border-slate-200 cursor-pointer transition-all active:scale-95"
                            >
                                <Database className="w-3.5 h-3.5" /> Reset Default
                            </button>
                        </>
                    )}
                </div>

                <div className="relative w-full md:w-64">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-250 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all font-medium"
                        placeholder="Cari kontrak, nomor, vendor..."
                    />
                </div>
            </div>

            {/* CONTRACTS TABLE */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between flex-wrap gap-2">
                    <div>
                        <h3 className="font-extrabold text-slate-800 text-sm">Monitoring Progress & Nilai Kontrak Vendor</h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">Daftar keseluruhan pengadaan jasa dan barang di PGE Area Lahendong.</p>
                    </div>
                    {filterFungsi !== 'Semua' && (
                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-slate-400 font-semibold">Filter aktif:</span>
                            <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${getFungsiMeta(filterFungsi).color}`}>
                                {filterFungsi}
                            </span>
                            <button
                                onClick={() => setFilterFungsi('Semua')}
                                className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                                title="Hapus filter"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-3.5 text-slate-500 font-bold">Nomor Kontrak</th>
                                <th className="p-3.5 text-slate-500 font-bold max-w-xs text-wrap">Nama Pekerjaan Kontrak</th>
                                <th className="p-3.5 text-slate-500 font-bold">Mitra Kerja / Vendor</th>
                                <th className="p-3.5 text-slate-500 font-bold text-center">Fungsi</th>
                                <th className="p-3.5 text-slate-500 font-bold text-right">Nilai Kontrak</th>
                                <th className="p-3.5 text-slate-500 font-bold text-center">Jangka Waktu</th>
                                <th className="p-3.5 text-slate-500 font-bold text-center w-24">Progress Waktu</th>
                                {isAdmin && <th className="p-3.5 text-slate-500 font-bold text-center w-20">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredScm.map(item => {
                                const meta = getFungsiMeta(item.fungsi);
                                return (
                                    <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="p-3.5 font-mono text-slate-600 font-bold">{item.nomor}</td>
                                        <td className="p-3.5 max-w-xs text-wrap font-bold text-slate-800">{item.nama}</td>
                                        <td className="p-3.5 text-slate-600 font-semibold">{item.vendor}</td>
                                        <td className="p-3.5 text-center">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-extrabold uppercase tracking-wide whitespace-nowrap ${meta.color}`}>
                                                {meta.short}
                                            </span>
                                            <span className="block text-[9px] text-slate-400 font-semibold mt-0.5 truncate max-w-[90px] mx-auto leading-tight">
                                                {meta.label}
                                            </span>
                                        </td>
                                        <td className="p-3.5 text-right font-mono font-bold text-slate-900">{formatCurrency(item.nilai)}</td>
                                        <td className="p-3.5 text-center text-slate-500 font-semibold">
                                            {item.mulai} s/d {item.selesai}
                                        </td>
                                        <td className="p-3.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200 shrink-0">
                                                    <div 
                                                        className={`h-full rounded-full ${
                                                            item.calculatedProgress >= 100 ? 'bg-green-500' :
                                                            item.calculatedProgress >= 90 ? 'bg-amber-500' : 'bg-blue-500'
                                                        }`}
                                                        style={{ width: `${Math.min(item.calculatedProgress, 100)}%` }}
                                                    />
                                                </div>
                                                <span className="font-bold text-slate-700 text-[10px]">{item.calculatedProgress}%</span>
                                            </div>
                                        </td>
                                        {isAdmin && (
                                            <td className="p-3.5 text-center">
                                                <button
                                                    onClick={() => handleDeleteScm(item.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                                                    title="Hapus Kontrak"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                            {filteredScm.length === 0 && (
                                <tr>
                                    <td colSpan={isAdmin ? 8 : 7} className="p-8 text-center text-slate-400 font-medium">
                                        {filterFungsi !== 'Semua'
                                            ? `Tidak ada kontrak untuk fungsi "${filterFungsi}".`
                                            : 'Tidak ada data monitoring kontrak vendor.'
                                        }
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ADD CONTRACT MODAL */}
            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-in-out]">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800 text-sm">Tambah Data Monitoring Kontrak</h3>
                            <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleAddContractSubmit} className="p-6 space-y-4 max-h-[500px] overflow-y-auto pr-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nomor Kontrak</label>
                                    <input
                                        type="text"
                                        value={data.nomor}
                                        onChange={(e) => setData('nomor', e.target.value)}
                                        className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold text-slate-800"
                                        placeholder="Contoh: 012/PGE-LHD/HC/2026"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mitra / Vendor</label>
                                    <input
                                        type="text"
                                        value={data.vendor}
                                        onChange={(e) => setData('vendor', e.target.value)}
                                        className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold text-slate-800"
                                        placeholder="Contoh: PT Kawanua Multi Mandiri"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Pekerjaan</label>
                                <textarea
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    rows={2}
                                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold text-slate-800 resize-none"
                                    placeholder="Tulis judul lengkap lingkup pekerjaan kontrak..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nilai Kontrak (Rp)</label>
                                    <input
                                        type="number"
                                        value={data.nilai}
                                        onChange={(e) => setData('nilai', e.target.value)}
                                        className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold text-slate-800"
                                        placeholder="Contoh: 1500000000"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Fungsi / Pilar Pemilik</label>
                                    <select
                                        value={data.fungsi}
                                        onChange={(e) => setData('fungsi', e.target.value)}
                                        className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-bold text-slate-700"
                                        required
                                    >
                                        {FUNGSI_OPTIONS.map(f => (
                                            <option key={f.value} value={f.value}>{f.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tanggal Mulai</label>
                                    <input
                                        type="date"
                                        value={data.mulai}
                                        onChange={(e) => setData('mulai', e.target.value)}
                                        className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-bold"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tanggal Selesai</label>
                                    <input
                                        type="date"
                                        value={data.selesai}
                                        onChange={(e) => setData('selesai', e.target.value)}
                                        className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-bold"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Fungsi visual preview */}
                            {data.fungsi && (
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex items-center gap-2.5">
                                    <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-extrabold uppercase tracking-wide ${getFungsiMeta(data.fungsi).color}`}>
                                        {getFungsiMeta(data.fungsi).short}
                                    </span>
                                    <div>
                                        <p className="text-[11px] font-bold text-slate-700">{data.fungsi}</p>
                                        <p className="text-[9px] text-slate-400 font-semibold">Kontrak ini akan dikategorikan ke fungsi ini</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-2 text-xs font-bold pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
                                >
                                    <Check className="w-4 h-4" /> Simpan Kontrak
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MOM TABLE AT BOTTOM */}
            <MomTable 
                momList={momList} 
                fungsi="SCM" 
                currentUser={currentUser} 
                onOpenFeedback={onOpenFeedback} 
            />
        </div>
    );
}
