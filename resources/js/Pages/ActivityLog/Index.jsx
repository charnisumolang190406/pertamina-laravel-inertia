import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft, Activity, Search, Filter, PlusCircle, Edit3, Trash2,
    Calendar, User, CheckCircle2, Shield, Layers, Database,
    Calculator, Package, Clock, Users, Wrench, Home, TrendingUp,
    ChevronDown, ChevronUp, Code, RefreshCw
} from 'lucide-react';
import Pagination from '../../Components/Pagination';

export default function Index({ auth, logs, stats = {}, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [activeEvent, setActiveEvent] = useState(filters.event || 'all');
    const [expandedJsonIds, setExpandedJsonIds] = useState({});

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get('/activity-log', {
            search: search || undefined,
            event: activeEvent !== 'all' ? activeEvent : undefined,
        }, { preserveState: true, replace: true });
    };

    const handleFilterEvent = (eventKey) => {
        setActiveEvent(eventKey);
        router.get('/activity-log', {
            search: search || undefined,
            event: eventKey !== 'all' ? eventKey : undefined,
        }, { preserveState: true, replace: true });
    };

    const toggleExpandJson = (id) => {
        setExpandedJsonIds(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(/\./g, ':');
    };

    const getModuleIcon = (cat) => {
        switch (cat) {
            case 'Budgeting': return Calculator;
            case 'SCM': return Package;
            case 'Logistik': return Package;
            case 'Human Capital': return Users;
            case 'Facility': return Home;
            case 'Finansial': return TrendingUp;
            case 'MOM': return Activity;
            default: return Database;
        }
    };

    const getRoleColor = (role = '') => {
        const r = role.toLowerCase();
        if (r.includes('budget') || r.includes('bpb')) return 'bg-blue-100 text-blue-800 border-blue-200';
        if (r.includes('hc') || r.includes('human')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        if (r.includes('scm')) return 'bg-indigo-100 text-indigo-800 border-indigo-200';
        if (r.includes('logistik') || r.includes('facility')) return 'bg-amber-100 text-amber-800 border-amber-200';
        return 'bg-purple-100 text-purple-800 border-purple-200';
    };

    return (
        <div className="min-h-screen bg-slate-50/80 font-sans text-slate-800">
            <Head title="Log Aktivitas & Riwayat Perubahan Data" />

            {/* HEADER */}
            <header className="bg-white border-b border-slate-200 shadow-2xs sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                        <Link
                            href="/"
                            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                            title="Kembali ke Dashboard"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-600">
                                    <Activity className="w-4 h-4" />
                                </div>
                                <h1 className="text-base font-black text-slate-900 tracking-tight">
                                    Log Aktivitas Sistem (Audit Trail)
                                </h1>
                            </div>
                            <p className="text-[10.5px] font-medium text-slate-500">
                                Rekam jejak seluruh perubahan data, impor berkas, dan aktivitas operasional
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <div className="text-xs font-bold text-slate-800">{auth?.user?.name || auth?.user?.fullName}</div>
                            <div className="text-[10px] font-semibold text-slate-400">{auth?.user?.role}</div>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                            {auth?.user?.initials || 'AD'}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
                {/* ─── 1. STATS OVERVIEW CARDS ─── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex items-center gap-3.5">
                        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                            <Layers className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xl font-black text-slate-900">{stats.total || logs.total || 0}</div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Aktivitas</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex items-center gap-3.5">
                        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <PlusCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xl font-black text-emerald-700">+{stats.created || 0}</div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Data Ditambah</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex items-center gap-3.5">
                        <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                            <Edit3 className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xl font-black text-indigo-700">✎ {stats.updated || 0}</div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Data Diperbarui</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex items-center gap-3.5">
                        <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                            <Trash2 className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xl font-black text-rose-700">✕ {stats.deleted || 0}</div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Data Dihapus</div>
                        </div>
                    </div>
                </div>

                {/* ─── 2. SEARCH & FILTER BAR ─── */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                    {/* Event Filter Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                        {[
                            { id: 'all', label: 'Semua Aksi' },
                            { id: 'created', label: '+ Tambah Data' },
                            { id: 'updated', label: '✎ Edit Data' },
                            { id: 'deleted', label: '✕ Hapus Data' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleFilterEvent(tab.id)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                                    activeEvent === tab.id
                                        ? 'bg-blue-600 text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-800'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari aktor, modul, atau kata kunci..."
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </form>
                </div>

                {/* ─── 3. ACTIVITY LOG TABLE ─── */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <h3 className="text-sm font-black text-slate-800 tracking-tight">
                                Riwayat Transaksi & Perubahan Data
                            </h3>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                Menampilkan {logs.data.length} dari total {logs.total} aktivitas
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-100/70">
                                <tr>
                                    <th className="px-5 py-3.5 text-left text-[10.5px] font-black text-slate-600 uppercase tracking-wider w-36">
                                        Waktu
                                    </th>
                                    <th className="px-5 py-3.5 text-left text-[10.5px] font-black text-slate-600 uppercase tracking-wider w-56">
                                        Aktor (Pelaksana)
                                    </th>
                                    <th className="px-4 py-3.5 text-center text-[10.5px] font-black text-slate-600 uppercase tracking-wider w-28">
                                        Aksi
                                    </th>
                                    <th className="px-5 py-3.5 text-left text-[10.5px] font-black text-slate-600 uppercase tracking-wider w-64">
                                        Data Terdampak
                                    </th>
                                    <th className="px-5 py-3.5 text-left text-[10.5px] font-black text-slate-600 uppercase tracking-wider">
                                        Detail Perubahan
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {logs.data.map((log) => {
                                    const ModIcon = getModuleIcon(log.module_category);
                                    const isJsonOpen = !!expandedJsonIds[log.id];

                                    return (
                                        <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                                            {/* WAKTU */}
                                            <td className="px-5 py-4 whitespace-nowrap align-top">
                                                <div className="text-xs font-bold text-slate-800">
                                                    {formatDate(log.created_at)}
                                                </div>
                                                <div className="text-[10px] font-semibold text-slate-400 mt-0.5 flex items-center gap-1">
                                                    <Clock className="w-3 h-3 text-slate-400" />
                                                    {new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>

                                            {/* AKTOR */}
                                            <td className="px-5 py-4 align-top">
                                                <div className="flex items-start gap-2.5">
                                                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-extrabold text-[10px] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                                                        {log.actor_initials || 'AD'}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="text-xs font-extrabold text-slate-800 leading-snug">
                                                            {log.actor_name}
                                                        </div>
                                                        <span className={`inline-block mt-1 text-[9.5px] font-bold px-2 py-0.5 rounded-md border ${getRoleColor(log.actor_role)}`}>
                                                            {log.actor_role}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* AKSI */}
                                            <td className="px-4 py-4 text-center align-top whitespace-nowrap">
                                                {log.event === 'created' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
                                                        <PlusCircle className="w-3 h-3" /> Tambah
                                                    </span>
                                                )}
                                                {log.event === 'updated' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black rounded-lg bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide">
                                                        <Edit3 className="w-3 h-3" /> Edit
                                                    </span>
                                                )}
                                                {log.event === 'deleted' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black rounded-lg bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wide">
                                                        <Trash2 className="w-3 h-3" /> Hapus
                                                    </span>
                                                )}
                                            </td>

                                            {/* DATA TERDAMPAK */}
                                            <td className="px-5 py-4 align-top">
                                                <div className="flex items-start gap-2">
                                                    <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 shrink-0 mt-0.5">
                                                        <ModIcon className="w-3.5 h-3.5 text-blue-600" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="text-xs font-black text-slate-800 leading-tight">
                                                            {log.module_name}
                                                        </div>
                                                        <div className="text-[10.5px] font-semibold text-slate-500 mt-0.5 truncate">
                                                            Entri: {log.item_identifier}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* DETAIL PERUBAHAN */}
                                            <td className="px-5 py-4 align-top">
                                                <div className="space-y-2">
                                                    {/* Summary Pill and Text */}
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-800 font-extrabold text-[10px] rounded-md border border-slate-200">
                                                            {log.summary_badge}
                                                        </span>
                                                        <span className="text-xs font-medium text-slate-700">
                                                            {log.summary_text}
                                                        </span>
                                                    </div>

                                                    {/* Key Highlights / Fields Changed */}
                                                    {log.key_highlights && log.key_highlights.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                                                            {log.key_highlights.map((hl, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="px-2 py-0.5 bg-blue-50/80 border border-blue-200/70 text-blue-800 text-[10px] font-bold rounded-md"
                                                                >
                                                                    {hl}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Raw JSON inspection toggle */}
                                                    {log.properties && Object.keys(log.properties).length > 0 && (
                                                        <div className="pt-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleExpandJson(log.id)}
                                                                className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                                                            >
                                                                <Code className="w-3 h-3" />
                                                                <span>{isJsonOpen ? 'Sembunyikan Raw JSON' : 'Lihat Raw JSON'}</span>
                                                                {isJsonOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                                            </button>

                                                            {isJsonOpen && (
                                                                <div className="mt-2 p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[10.5px] overflow-x-auto max-w-xl shadow-inner leading-relaxed">
                                                                    <pre>{JSON.stringify(log.properties, null, 2)}</pre>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {logs.data.length === 0 && (
                            <div className="text-center py-14">
                                <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <h4 className="text-sm font-bold text-slate-700">Tidak ada log aktivitas</h4>
                                <p className="text-xs text-slate-400 mt-1">Belum ada catatan perubahan data yang sesuai kriteria pencarian.</p>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-slate-100 bg-slate-50/60">
                        <Pagination
                            currentPage={logs.current_page}
                            totalItems={logs.total}
                            itemsPerPage={logs.per_page || 15}
                            onPageChange={(p) => router.get('/activity-log', {
                                page: p,
                                search: search || undefined,
                                event: activeEvent !== 'all' ? activeEvent : undefined,
                            }, { preserveState: true })}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
