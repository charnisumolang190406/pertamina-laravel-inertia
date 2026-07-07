import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  LineChart, Line, Legend, PieChart, Pie, Cell
} from 'recharts';
import { 
  LayoutDashboard, FileSignature, Calculator, Users, Laptop, Shield, FileText 
} from 'lucide-react';
import KpiCard from '../../Components/KpiCard';
import MomTable from '../../Components/MomTable';

export default function MainDashboard(props) {
    const { scmList, budgetDetailsList, assetList, tadWorkers, momList, auth, onOpenFeedback } = props;
    const currentUser = auth.user;

    // SCM contract statistics
    const totalScmContracts = scmList.length;
    const totalScmValue = scmList.reduce((acc, c) => acc + c.nilai, 0);

    // Budget statistics
    const totalBudget = budgetDetailsList.reduce((acc, b) => acc + b.budget, 0);
    const totalConsumed = budgetDetailsList.reduce((acc, b) => acc + b.consumed, 0);
    const totalActual = budgetDetailsList.reduce((acc, b) => acc + b.actual, 0);

    // IT asset statistics
    const totalAssets = assetList.length;
    const optimalAssets = assetList.filter(a => a.status === 'Optimal').length;

    // TAD workers
    const totalTad = tadWorkers.length;

    // Formatting helpers
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    };

    const formatShortCurrency = (val) => {
        if (val >= 1000000000) {
            return `Rp ${(val / 1000000000).toFixed(1)} M`;
        }
        if (val >= 1000000) {
            return `Rp ${(val / 1000000).toFixed(1)} Jt`;
        }
        return `Rp ${val}`;
    };

    // Prepare chart data for budget
    // Group budget details by category (ABI / ABO)
    const budgetCategories = budgetDetailsList.reduce((acc, curr) => {
        const cat = curr.kategori || 'ABO';
        if (!acc[cat]) {
            acc[cat] = { category: cat, budget: 0, consumed: 0, actual: 0 };
        }
        acc[cat].budget += curr.budget;
        acc[cat].consumed += curr.consumed;
        acc[cat].actual += curr.actual;
        return acc;
    }, {});

    const budgetChartData = Object.values(budgetCategories);

    // Prepare chart data for SCM
    const scmChartData = scmList.slice(0, 5).map(c => ({
        name: c.vendor.length > 15 ? `${c.vendor.substring(0, 15)}...` : c.vendor,
        progress: c.progres,
        nilai: c.nilai / 1000000 // In millions
    }));

    // Prepare chart data for IT Assets (Donut Chart)
    const assetStatusData = [
        { name: 'Optimal', value: assetList.filter(a => a.status === 'Optimal').length, color: '#10b981' }, // green-500
        { name: 'Rusak Ringan', value: assetList.filter(a => a.status === 'Rusak Ringan').length, color: '#f59e0b' }, // amber-500
        { name: 'Rusak Berat', value: assetList.filter(a => a.status === 'Rusak Berat').length, color: '#ef4444' }, // red-500
    ].filter(item => item.value > 0); // Hide empty categories

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-[fadeIn_0.3s_ease-in-out] font-sans text-slate-800">
            {/* Premium Welcome Header Banner */}
            <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-800 p-6 rounded-3xl shadow-md text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-15">
                    <Shield className="w-64 h-64 text-white" />
                </div>
                <div className="z-10">
                    <h2 className="text-xl font-black tracking-tight leading-none">Selamat Datang di Executive Dashboard</h2>
                    <p className="text-blue-100 text-xs mt-2 font-semibold">Monitor ringkasan pilar koordinasi Business Support PGE Area Lahendong secara real-time.</p>
                </div>
                <div className="z-10 bg-white/10 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-xs text-xs font-bold whitespace-nowrap">
                    Periode Laporan: Tahun 2026
                </div>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard 
                    title="Total Kontrak SCM" 
                    value={`${totalScmContracts} Kontrak`} 
                    subtitle={formatShortCurrency(totalScmValue)} 
                    icon={FileSignature} 
                    colorClass="text-blue-600" 
                    bgClass="bg-blue-50" 
                />
                <KpiCard 
                    title="Total Plafon Budget" 
                    value={formatShortCurrency(totalBudget)} 
                    subtitle={`Realisasi: ${formatShortCurrency(totalActual)}`} 
                    icon={Calculator} 
                    colorClass="text-green-600" 
                    bgClass="bg-green-50" 
                />
                <KpiCard 
                    title="Aset IT Optimal" 
                    value={`${optimalAssets} / ${totalAssets} Unit`} 
                    subtitle="Server, PC & Network Device" 
                    icon={Laptop} 
                    colorClass="text-indigo-600" 
                    bgClass="bg-indigo-50" 
                />
                <KpiCard 
                    title="Tenaga Alih Daya" 
                    value={`${totalTad} Orang`} 
                    subtitle="Driver, Security & GA Support" 
                    icon={Users} 
                    colorClass="text-purple-600" 
                    bgClass="bg-purple-50" 
                />
            </div>

            {/* CHARTS CONTAINER */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Budget Penyerapan Bar Chart */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col h-80">
                    <div className="mb-4">
                        <h4 className="font-bold text-slate-800 text-sm">Penyerapan Anggaran ABI & ABO (Rupiah)</h4>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">Komparasi Plafon Budget, Consumed (PR/PO) dan Actual Realisasi.</p>
                    </div>
                    <div className="flex-1 w-full min-h-0 text-[10px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={budgetChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="category" tickLine={false} axisLine={false} className="font-semibold text-slate-500" />
                                <YAxis tickLine={false} axisLine={false} className="font-semibold text-slate-500" tickFormatter={(v) => `${(v / 1000000000).toFixed(0)}M`} />
                                <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                                <Legend wrapperStyle={{ paddingTop: 10 }} />
                                <Bar dataKey="budget" name="Plafon (Budget)" fill="#00529C" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="consumed" name="Consumed (PR/PO)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="actual" name="Actual (LPB)" fill="#8DC63F" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* SCM Progress Line/Bar Chart */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col h-80">
                    <div className="mb-4">
                        <h4 className="font-bold text-slate-800 text-sm">Progress & Nilai Kontrak Vendor Utama</h4>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">Progress fisik (%) dan nilai kontrak (Juta Rp) dari 5 kontrak terbaru.</p>
                    </div>
                    <div className="flex-1 w-full min-h-0 text-[10px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={scmChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" tickLine={false} axisLine={false} className="font-semibold text-slate-500" />
                                <YAxis tickLine={false} axisLine={false} className="font-semibold text-slate-500" />
                                <RechartsTooltip formatter={(value, name) => name === 'progress' ? `${value}%` : `Rp ${value.toLocaleString('id-ID')} Jt`} />
                                <Legend wrapperStyle={{ paddingTop: 10 }} />
                                <Bar dataKey="progress" name="Progress Fisik (%)" fill="#00529C" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="nilai" name="Nilai Kontrak (Jt Rp)" fill="#E52B2D" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* IT Assets Status Donut Chart */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col h-80">
                    <div className="mb-4">
                        <h4 className="font-bold text-slate-800 text-sm">Status Aset IT (Donut Chart)</h4>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">Proporsi kondisi seluruh aset ICT yang ada.</p>
                    </div>
                    <div className="flex-1 w-full min-h-0 text-[10px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={assetStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                                >
                                    {assetStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip formatter={(value) => `${value} Unit`} />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

        </div>
    );
}
