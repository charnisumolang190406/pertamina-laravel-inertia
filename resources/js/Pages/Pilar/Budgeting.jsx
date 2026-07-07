import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  Calculator, TrendingUp, CheckCircle, AlertCircle, Plus, Trash2, Check, X, ShieldAlert, Activity, Wrench, Users2,
  FileSpreadsheet, Database, Search, PieChart as PieIcon
} from 'lucide-react';
import KpiCard from '../../Components/KpiCard';
import MomTable from '../../Components/MomTable';

export default function Budgeting(props) {
    const { budgetDetailsList, momList, auth, onOpenFeedback } = props;
    const currentUser = auth.user;

    const [filterKategori, setFilterKategori] = useState('Semua');
    const [activeBudgetSubTab, setActiveBudgetSubTab] = useState('ringkasan');
    const [budgetSearch, setBudgetSearch] = useState('');

    // Aggregate budgets
    const totalBudget = budgetDetailsList.reduce((acc, b) => acc + b.budget, 0);
    const totalConsumed = budgetDetailsList.reduce((acc, b) => acc + b.consumed, 0);
    const totalActual = budgetDetailsList.reduce((acc, b) => acc + b.actual, 0);
    const totalAvailable = budgetDetailsList.reduce((acc, b) => acc + b.available, 0);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    };

    const formatShortCurrency = (val) => {
        if (val >= 1000000000) {
            return `Rp ${(val / 1000000000).toFixed(1)} Miliar`;
        }
        if (val >= 1000000) {
            return `Rp ${(val / 1000000).toFixed(1)} Juta`;
        }
        return `Rp ${val}`;
    };

    const formatPercentage = (val, max) => {
        if (!max) return '0%';
        return `${Math.round((val / max) * 100)}%`;
    };

    // Classify each Cost Center / WBS item into one of the 4 functions
    const getClassifiedFunction = (name = '') => {
        const nameLower = name.toLowerCase();
        if (nameLower.includes('maint') || nameLower.includes('perbaikan') || nameLower.includes('investasi pipe') || nameLower.includes('maintenance')) {
            return 'Maintenance';
        }
        if (nameLower.includes('steam') || nameLower.includes('drill') || nameLower.includes('operation') || nameLower.includes('ops') || nameLower.includes('produksi')) {
            return 'Operation';
        }
        if (nameLower.includes('hsse') || nameLower.includes('safety') || nameLower.includes('lingkungan') || nameLower.includes('hydrant')) {
            return 'HSSE';
        }
        return 'Business Support';
    };

    // Filter list if needed (ABI / ABO)
    const filteredBudgetDetails = filterKategori === 'Semua' 
        ? budgetDetailsList 
        : budgetDetailsList.filter(b => b.kategori === filterKategori);

    // Group items into HSSE, Operation, Maintenance, Business Support
    const groupedDataMap = filteredBudgetDetails.reduce((acc, curr) => {
        const funcName = getClassifiedFunction(curr.name);
        if (!acc[funcName]) {
            acc[funcName] = { name: funcName, budget: 0, consumed: 0, actual: 0 };
        }
        acc[funcName].budget += curr.budget;
        acc[funcName].consumed += curr.consumed;
        acc[funcName].actual += curr.actual;
        return acc;
    }, {});

    const orderedFunctions = ['HSSE', 'Operation', 'Maintenance', 'Business Support'];
    const chartData = orderedFunctions.map(func => groupedDataMap[func] || { name: func, budget: 0, consumed: 0, actual: 0 });

    const getFunctionIcon = (name) => {
        switch (name) {
            case 'HSSE': return <ShieldAlert className="w-5 h-5 text-red-600" />;
            case 'Operation': return <Activity className="w-5 h-5 text-blue-600" />;
            case 'Maintenance': return <Wrench className="w-5 h-5 text-green-600" />;
            default: return <Users2 className="w-5 h-5 text-indigo-600" />;
        }
    };

    const handleClear = () => {
        if (confirm('Apakah Anda yakin ingin MENGOSONGKAN seluruh data rincian anggaran cost center / WBS?')) {
            router.post('/budget/clear');
        }
    };

    const handleReset = () => {
        if (confirm('Apakah Anda yakin ingin me-RESET data rincian anggaran cost center / WBS ke default?')) {
            router.post('/budget/reset');
        }
    };

    const handleDeleteRow = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus baris anggaran ini?')) {
            router.delete(`/budget/${id}`);
        }
    };

    const isAdmin = currentUser?.role?.startsWith('Admin');

    // Filter budget details by search query
    const searchFilteredBudgetDetails = filteredBudgetDetails.filter(item => {
        const query = budgetSearch.toLowerCase().trim();
        return (
            (item.fundCent && item.fundCent.toLowerCase().includes(query)) ||
            (item.name && item.name.toLowerCase().includes(query)) ||
            (item.commitItem && item.commitItem.toLowerCase().includes(query)) ||
            (item.text && item.text.toLowerCase().includes(query))
        );
    });

    const sumBudget = searchFilteredBudgetDetails.reduce((acc, curr) => acc + (Number(curr.budget) || 0), 0);
    const sumConsumed = searchFilteredBudgetDetails.reduce((acc, curr) => acc + (Number(curr.consumed) || 0), 0);
    const sumActual = searchFilteredBudgetDetails.reduce((acc, curr) => acc + (Number(curr.actual) || 0), 0);
    const sumAvailable = searchFilteredBudgetDetails.reduce((acc, curr) => acc + (Number(curr.available) || 0), 0);

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-[fadeIn_0.3s_ease-in-out] font-sans text-slate-800">
            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard 
                    title="Total Budget (Plafon)" 
                    value={formatCurrency(totalBudget)} 
                    subtitle="Tahun Anggaran berjalan" 
                    icon={Calculator} 
                    colorClass="text-blue-600" 
                    bgClass="bg-blue-50" 
                />
                <KpiCard 
                    title="Consumed (PR/PO)" 
                    value={formatCurrency(totalConsumed)} 
                    subtitle={`Terserap ${formatPercentage(totalConsumed, totalBudget)}`} 
                    icon={TrendingUp} 
                    colorClass="text-yellow-600" 
                    bgClass="bg-yellow-50" 
                />
                <KpiCard 
                    title="Actual (Realisasi)" 
                    value={formatCurrency(totalActual)} 
                    subtitle={`Realisasi ${formatPercentage(totalActual, totalBudget)}`} 
                    icon={CheckCircle} 
                    colorClass="text-green-600" 
                    bgClass="bg-green-50" 
                />
                <KpiCard 
                    title="Available (Sisa Plafon)" 
                    value={formatCurrency(totalAvailable)} 
                    subtitle="Sisa anggaran bebas" 
                    icon={AlertCircle} 
                    colorClass="text-indigo-600" 
                    bgClass="bg-indigo-50" 
                />
            </div>

            {/* Subtab Navigation */}
            <div className="flex border-b border-slate-200 bg-white p-2 rounded-2xl border shadow-2xs">
                <button
                    onClick={() => setActiveBudgetSubTab('ringkasan')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        activeBudgetSubTab === 'ringkasan' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <PieIcon className="w-4 h-4" /> Ringkasan Anggaran (ABO/ABI)
                </button>
                <button
                    onClick={() => setActiveBudgetSubTab('abo')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        activeBudgetSubTab === 'abo' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <FileSpreadsheet className="w-4 h-4" /> Cost Center (ABO) ({budgetDetailsList.filter(i => i.kategori === 'ABO').length})
                </button>
                <button
                    onClick={() => setActiveBudgetSubTab('abi')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        activeBudgetSubTab === 'abi' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <FileSpreadsheet className="w-4 h-4" /> WBS Element (ABI) ({budgetDetailsList.filter(i => i.kategori === 'ABI').length})
                </button>
            </div>

            {/* Admin Database Control for Budget Details */}
            {isAdmin && (activeBudgetSubTab === 'abo' || activeBudgetSubTab === 'abi') && (
                <div className="flex justify-end gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs animate-[fadeIn_0.3s_ease-in-out]">
                    <button
                        onClick={handleClear}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-all active:scale-95 cursor-pointer"
                    >
                        <Trash2 className="w-4 h-4" /> Kosongkan Rincian
                    </button>
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all active:scale-95 cursor-pointer"
                    >
                        <Database className="w-4 h-4" /> Reset Default
                    </button>
                </div>
            )}

            {/* Subtab 1: Ringkasan Anggaran (ABO/ABI) */}
            {activeBudgetSubTab === 'ringkasan' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-[fadeIn_0.3s_ease-in-out]">
                    {/* Recharts Bar Chart (Left/Center) */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col h-96">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="font-extrabold text-slate-800 text-sm">Visualisasi Anggaran Per Fungsi</h3>
                                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Komparasi RKAP Plafon (Target) vs Realisasi Pemakaian Aktual.</p>
                            </div>
                            <div className="flex gap-2 text-[10px] font-bold">
                                {['Semua', 'ABI', 'ABO'].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setFilterKategori(cat)}
                                        className={`px-3 py-1.5 rounded-xl cursor-pointer border transition-all ${
                                            filterKategori === cat 
                                                ? 'bg-blue-600 text-white border-transparent' 
                                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-350'
                                        }`}
                                    >
                                        {cat === 'Semua' ? 'Semua Tipe' : cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 w-full min-h-0 text-[10px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} className="font-semibold text-slate-500" />
                                    <YAxis tickLine={false} axisLine={false} className="font-semibold text-slate-500" tickFormatter={(v) => `${(v / 1000000000).toFixed(0)}M`} />
                                    <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                                    <Bar dataKey="budget" name="RKAP Plafon Budget" fill="#00529C" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="actual" name="Realisasi Actual" fill="#8DC63F" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Table Summary Per Fungsi (Right) */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                        <div>
                            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-4">Rincian Anggaran Per Fungsi</h4>
                            <div className="space-y-4">
                                {chartData.map(item => {
                                    const serapPercent = item.budget > 0 ? (item.actual / item.budget) * 100 : 0;
                                    return (
                                        <div key={item.name} className="flex items-start justify-between gap-3 pb-3.5 border-b border-slate-100 last:border-b-0">
                                            <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 shrink-0">
                                                {getFunctionIcon(item.name)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="text-xs font-bold text-slate-855 truncate">{item.name}</h5>
                                                <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">
                                                    Realisasi: {formatShortCurrency(item.actual)}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                                    serapPercent >= 90 ? 'bg-red-50 text-red-700' :
                                                    serapPercent >= 50 ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'
                                                }`}>
                                                    {serapPercent.toFixed(0)}%
                                                </span>
                                                <span className="text-[9px] text-slate-400 block font-bold mt-1">
                                                    Target: {formatShortCurrency(item.budget)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 text-[10px] font-bold text-slate-400 text-center leading-relaxed">
                            Data diringkas secara real-time dari Cost Center terkait.
                        </div>
                    </div>
                </div>
            )}

            {/* Subtab 2: Cost Center (ABO) */}
            {activeBudgetSubTab === 'abo' && (() => {
                const aboGroupMap = {};
                searchFilteredBudgetDetails.filter(i => i.kategori === 'ABO').forEach(item => {
                    const key = item.fundCent || item.name || 'Unassigned';
                    if (!aboGroupMap[key]) {
                        aboGroupMap[key] = {
                            fundCent: item.fundCent,
                            name: item.name,
                            kategori: 'ABO',
                            budget: 0,
                            consumed: 0,
                            actual: 0,
                            available: 0
                        };
                    }
                    aboGroupMap[key].budget += (Number(item.budget) || 0);
                    aboGroupMap[key].consumed += (Number(item.consumed) || 0);
                    aboGroupMap[key].actual += (Number(item.actual) || 0);
                    aboGroupMap[key].available += (Number(item.available) || 0);
                });
                const aboGroupedList = Object.values(aboGroupMap);

                return (
                    <div className="space-y-4 animate-[fadeIn_0.3s_ease-in-out]">
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                            {/* Table Controls */}
                            <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari Cost Center atau Nama..."
                                        value={budgetSearch}
                                        onChange={(e) => setBudgetSearch(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-slate-700 font-semibold"
                                    />
                                </div>
                                <div className="text-xs text-slate-500 font-bold self-center">
                                    Menampilkan {aboGroupedList.length} ringkasan Cost Center (ABO)
                                </div>
                            </div>

                            {/* Detail Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs whitespace-nowrap">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="p-4 text-slate-500 font-bold w-10 text-center">No</th>
                                            <th className="p-4 text-slate-500 font-bold">Fund Center</th>
                                            <th className="p-4 text-slate-500 font-bold">Nama Cost Center</th>
                                            <th className="p-4 text-slate-500 font-bold text-center">Fungsi</th>
                                            <th className="p-4 text-slate-500 font-bold text-right">Consumable Budget</th>
                                            <th className="p-4 text-slate-500 font-bold text-right">Consumed (PR/PO)</th>
                                            <th className="p-4 text-slate-500 font-bold text-right">Actual (Realisasi)</th>
                                            <th className="p-4 text-slate-500 font-bold text-right">Available (Sisa)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {aboGroupedList.map((item, idx) => {
                                            const fungsiName = getClassifiedFunction(item.name);
                                            return (
                                                <tr key={item.fundCent || idx} className="hover:bg-slate-50/70 transition-colors">
                                                    <td className="p-4 text-slate-500 text-center font-semibold">{idx + 1}</td>
                                                    <td className="p-4 font-mono text-xs font-extrabold text-slate-700">{item.fundCent || '-'}</td>
                                                    <td className="p-4 font-bold text-slate-800">{item.name}</td>
                                                    <td className="p-4 text-center">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                            fungsiName === 'HSSE' ? 'bg-red-50 text-red-700 border border-red-200' :
                                                            fungsiName === 'Operation' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                                            fungsiName === 'Maintenance' ? 'bg-green-50 text-green-700 border border-green-200' :
                                                            'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                                        }`}>
                                                            {fungsiName}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right font-mono text-slate-700 font-bold">{formatCurrency(item.budget)}</td>
                                                    <td className="p-4 text-right font-mono text-amber-600 font-bold">{formatCurrency(item.consumed)}</td>
                                                    <td className="p-4 text-right font-mono text-blue-600 font-bold">{formatCurrency(item.actual)}</td>
                                                    <td className={`p-4 text-right font-mono font-extrabold ${item.available >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {formatCurrency(item.available)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {/* Total Accumulation Row */}
                                        {aboGroupedList.length > 0 && (
                                            <tr className="bg-slate-50/80 font-bold border-t-2 border-slate-200">
                                                <td colSpan={4} className="p-4 text-slate-700 text-right uppercase tracking-wider text-[10px]">Total Akumulasi Terfilter</td>
                                                <td className="p-4 text-right font-mono text-slate-900 font-extrabold">{formatCurrency(aboGroupedList.reduce((acc, curr) => acc + curr.budget, 0))}</td>
                                                <td className="p-4 text-right font-mono text-amber-700 font-extrabold">{formatCurrency(aboGroupedList.reduce((acc, curr) => acc + curr.consumed, 0))}</td>
                                                <td className="p-4 text-right font-mono text-blue-700 font-extrabold">{formatCurrency(aboGroupedList.reduce((acc, curr) => acc + curr.actual, 0))}</td>
                                                <td className={`p-4 text-right font-mono font-extrabold ${aboGroupedList.reduce((acc, curr) => acc + curr.available, 0) >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                                    {formatCurrency(aboGroupedList.reduce((acc, curr) => acc + curr.available, 0))}
                                                </td>
                                            </tr>
                                        )}
                                        {aboGroupedList.length === 0 && (
                                            <tr>
                                                <td colSpan={8} className="p-12 text-center text-slate-400 font-medium">
                                                    Tidak ada detail Cost Center (ABO) yang ditemukan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Subtab 3: WBS Element (ABI) */}
            {activeBudgetSubTab === 'abi' && (
                <div className="space-y-4 animate-[fadeIn_0.3s_ease-in-out]">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                        {/* Table Controls */}
                        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Cari WBS Element, Commit Item, Deskripsi..."
                                    value={budgetSearch}
                                    onChange={(e) => setBudgetSearch(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-slate-700 font-semibold"
                                />
                            </div>
                            <div className="text-xs text-slate-500 font-bold self-center">
                                Menampilkan {searchFilteredBudgetDetails.filter(i => i.kategori === 'ABI').length} detail WBS Element (ABI)
                            </div>
                        </div>

                        {/* Detail Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs whitespace-nowrap">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="p-4 text-slate-500 font-bold w-10 text-center">No</th>
                                        <th className="p-4 text-slate-500 font-bold">WBS Element</th>
                                        <th className="p-4 text-slate-500 font-bold">Deskripsi WBS / Proyek</th>
                                        <th className="p-4 text-slate-500 font-bold">Commit. Item</th>
                                        <th className="p-4 text-slate-500 font-bold text-center">Fungsi</th>
                                        <th className="p-4 text-slate-500 font-bold max-w-xs text-wrap">Deskripsi Item (Text)</th>
                                        <th className="p-4 text-slate-500 font-bold text-right">Consumable Budget</th>
                                        <th className="p-4 text-slate-500 font-bold text-right">Consumed (PR/PO)</th>
                                        <th className="p-4 text-slate-500 font-bold text-right">Actual (Realisasi)</th>
                                        <th className="p-4 text-slate-500 font-bold text-right">Available (Sisa)</th>
                                        {isAdmin && <th className="p-4 text-slate-500 font-bold text-center w-16">Aksi</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {searchFilteredBudgetDetails.filter(i => i.kategori === 'ABI').map((item, idx) => {
                                        const fungsiName = getClassifiedFunction(item.name);
                                        return (
                                            <tr key={item.id || idx} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="p-4 text-slate-500 text-center font-semibold">{idx + 1}</td>
                                                <td className="p-4 font-mono text-xs font-extrabold text-slate-700">{item.fundCent || '-'}</td>
                                                <td className="p-4 font-bold text-slate-800">{item.name}</td>
                                                <td className="p-4 font-mono text-[11px] text-slate-500 font-bold">{item.commitItem}</td>
                                                <td className="p-4 text-center">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                        fungsiName === 'HSSE' ? 'bg-red-50 text-red-700 border border-red-200' :
                                                        fungsiName === 'Operation' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                                        fungsiName === 'Maintenance' ? 'bg-green-50 text-green-700 border border-green-200' :
                                                        'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                                    }`}>
                                                        {fungsiName}
                                                    </span>
                                                </td>
                                                <td className="p-4 max-w-xs text-wrap font-medium text-slate-700 leading-relaxed">{item.text}</td>
                                                <td className="p-4 text-right font-mono text-slate-700 font-bold">{formatCurrency(item.budget)}</td>
                                                <td className="p-4 text-right font-mono text-amber-600 font-bold">{formatCurrency(item.consumed)}</td>
                                                <td className="p-4 text-right font-mono text-blue-600 font-bold">{formatCurrency(item.actual)}</td>
                                                <td className={`p-4 text-right font-mono font-extrabold ${item.available >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {formatCurrency(item.available)}
                                                </td>
                                                {isAdmin && (
                                                    <td className="p-4 text-center">
                                                        <button
                                                            onClick={() => handleDeleteRow(item.id)}
                                                            className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 cursor-pointer transition-all active:scale-90"
                                                            title="Hapus Baris"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })}
                                    {/* Total Accumulation Row */}
                                    {searchFilteredBudgetDetails.filter(i => i.kategori === 'ABI').length > 0 && (
                                        <tr className="bg-slate-50/80 font-bold border-t-2 border-slate-200">
                                            <td colSpan={6} className="p-4 text-slate-700 text-right uppercase tracking-wider text-[10px]">Total Akumulasi Terfilter</td>
                                            <td className="p-4 text-right font-mono text-slate-900 font-extrabold">{formatCurrency(searchFilteredBudgetDetails.filter(i => i.kategori === 'ABI').reduce((acc, curr) => acc + (Number(curr.budget) || 0), 0))}</td>
                                            <td className="p-4 text-right font-mono text-amber-700 font-extrabold">{formatCurrency(searchFilteredBudgetDetails.filter(i => i.kategori === 'ABI').reduce((acc, curr) => acc + (Number(curr.consumed) || 0), 0))}</td>
                                            <td className="p-4 text-right font-mono text-blue-700 font-extrabold">{formatCurrency(searchFilteredBudgetDetails.filter(i => i.kategori === 'ABI').reduce((acc, curr) => acc + (Number(curr.actual) || 0), 0))}</td>
                                            <td className={`p-4 text-right font-mono font-extrabold ${searchFilteredBudgetDetails.filter(i => i.kategori === 'ABI').reduce((acc, curr) => acc + (Number(curr.available) || 0), 0) >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                                {formatCurrency(searchFilteredBudgetDetails.filter(i => i.kategori === 'ABI').reduce((acc, curr) => acc + (Number(curr.available) || 0), 0))}
                                            </td>
                                            {isAdmin && <td className="p-4"></td>}
                                        </tr>
                                    )}
                                    {searchFilteredBudgetDetails.filter(i => i.kategori === 'ABI').length === 0 && (
                                        <tr>
                                            <td colSpan={isAdmin ? 11 : 10} className="p-12 text-center text-slate-400 font-medium">
                                                Tidak ada detail WBS Element (ABI) yang ditemukan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* MOM TABLE AT BOTTOM (SHOWS MTC AND BS) */}
            <MomTable 
                momList={momList} 
                fungsi="BUDGET" 
                currentUser={currentUser} 
                onOpenFeedback={onOpenFeedback} 
            />
        </div>
    );
}
