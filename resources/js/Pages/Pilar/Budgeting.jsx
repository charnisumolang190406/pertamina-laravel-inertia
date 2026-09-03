import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, Customized
} from 'recharts';
import { BarDiffOverlay, useBarHover } from '../../Components/BarDiffOverlay';
import ChartDetailModal from '../../Components/ChartDetailModal';
import Pagination from '../../Components/Pagination';
import { 
  Calculator, TrendingUp, CheckCircle, AlertCircle, Plus, Trash2, Check, X, ShieldAlert, Activity, Wrench, Users2,
  FileSpreadsheet, Database, Search, PieChart as PieIcon, Maximize2
} from 'lucide-react';
import KpiCard from '../../Components/KpiCard';
const PERTAMINA_BLUE = '#00529C';
const PERTAMINA_GREEN = '#8DC63F';
const PERTAMINA_YELLOW = '#F59E0B';
const PERTAMINA_RED = '#E52B2D';

// Data passed via props

function ChartCard({ title, subtitle, children, className = '', onClick }) {
    const isClickable = !!onClick;
    return (
        <div
            onClick={onClick}
            className={`bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col transition-all duration-300 relative group ${
                isClickable ? 'hover:shadow-md hover:border-slate-350 cursor-pointer' : ''
            } ${className}`}
        >
            <div className="mb-3 flex justify-between items-start">
                <div className="min-w-0">
                    <h4 className="font-bold text-slate-800 text-sm truncate">{title}</h4>
                    {subtitle && <p className="text-[10px] text-slate-400 font-bold mt-0.5 truncate">{subtitle}</p>}
                </div>
                {isClickable && (
                    <span className="p-1 text-slate-350 group-hover:text-blue-600 rounded-lg group-hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100 shrink-0" title="Detail Chart">
                        <Maximize2 className="w-3.5 h-3.5" />
                    </span>
                )}
            </div>
            <div className="flex-1 w-full min-h-0 text-[10px]">{children}</div>
            {isClickable && (
                <div className="absolute bottom-2 right-4 text-[8px] font-extrabold text-blue-600 tracking-wider opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    KLIK UNTUK DETAIL & FILTER
                </div>
            )}
        </div>
    );
}

function TabRealisasiAbo({ budgetDetailsList, onChartClick, aboYearly = [], aboKumulatif2026 = [], aboMonthly2026 = [] }) {
    const aboYearlyHover = useBarHover();
    const aboFungsiHover = useBarHover();

    const dynamicAboPerFungsi = React.useMemo(() => {
        const aboList = budgetDetailsList.filter(b => b.kategori === 'ABO');
        
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

        const groupedMap = aboList.reduce((acc, curr) => {
            const funcName = getClassifiedFunction(curr.name);
            if (!acc[funcName]) {
                acc[funcName] = { fungsi: funcName, budget: 0, actual: 0 };
            }
            acc[funcName].budget += curr.budget;
            acc[funcName].actual += curr.actual;
            return acc;
        }, {});

        const result = Object.values(groupedMap).map(item => ({
            fungsi: item.fungsi,
            budget: Number((item.budget / 1000000000).toFixed(2)),
            actual: Number((item.actual / 1000000000).toFixed(2)),
            variance: Number(((item.actual - item.budget) / 1000000000).toFixed(2))
        }));

        if (result.length === 0) {
            return [
                { fungsi: 'Operation', budget: 0, actual: 0, variance: 0 },
                { fungsi: 'Maintenance', budget: 0, actual: 0, variance: 0 },
                { fungsi: 'HSSE', budget: 0, actual: 0, variance: 0 },
                { fungsi: 'Bus. Support', budget: 0, actual: 0, variance: 0 }
            ];
        }
        return result;
    }, [budgetDetailsList]);

    return (
        <div className="space-y-4 animate-[fadeIn_0.3s_ease-in-out]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ChartCard
                    title="ABO 2019 – 2026 (USD Juta)"
                    subtitle="Perbandingan RKAP vs Actual — Kenaikan anggaran ABO Area Lahendong"
                    className="h-72"
                    onClick={() => onChartClick && onChartClick('abo-yearly')}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={aboYearly} margin={{ top: 10, right: 60, left: -10, bottom: 5 }} {...aboYearlyHover.barChartProps}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="tahun" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                            <RechartsTooltip formatter={(v, name) => [`${v} Juta USD`, name]} />
                            <Legend wrapperStyle={{ fontSize: 9 }} />
                            <Bar dataKey="rkap" name="RKAP (USD)" fill="#93c5fd" radius={[3, 3, 0, 0]} />
                            <Bar dataKey="actual" name="Actual (USD)" fill={PERTAMINA_GREEN} radius={[3, 3, 0, 0]} />
                            <Customized component={BarDiffOverlay} barKey1="rkap" barKey2="actual" activeIndex={aboYearlyHover.activeIndex} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                    title="Actual ABO Area Lahendong 2026 — Kumulatif"
                    subtitle="Serapan anggaran kumulatif RKAP vs Realisasi (IDR Miliar)"
                    className="h-72"
                    onClick={() => onChartClick && onChartClick('abo-kumulatif')}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={aboKumulatif2026} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="bulan" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} label={{ value: 'Bulan', position: 'insideBottom', offset: -2, style: { fontSize: 9 } }} />
                            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                            <RechartsTooltip formatter={(v, name) => [`${v} Miliar`, name]} />
                            <Legend wrapperStyle={{ fontSize: 9 }} />
                            <Line type="monotone" dataKey="rkap" name="RKAP Kumulatif" stroke={PERTAMINA_BLUE} strokeWidth={2.5} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="realisasi" name="Realisasi Kumulatif" stroke={PERTAMINA_GREEN} strokeWidth={2.5} dot={{ r: 3 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ChartCard
                    title="Actual ABO Area Lahendong 2026 — Monthly"
                    subtitle="Realisasi bulanan RKAP vs Actual (IDR Miliar)"
                    className="h-64"
                    onClick={() => onChartClick && onChartClick('abo-monthly')}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={aboMonthly2026} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="bulan" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} domain={[2.5, 3.8]} />
                            <RechartsTooltip formatter={(v, name) => [`${v} Miliar`, name]} />
                            <Legend wrapperStyle={{ fontSize: 9 }} />
                            <Line type="monotone" dataKey="rkap" name="RKAP 2026" stroke={PERTAMINA_BLUE} strokeWidth={2} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="realisasi" name="Real 2026" stroke={PERTAMINA_GREEN} strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                    title="Rincian Realisasi ABO per Fungsi"
                    subtitle="Budget vs Actual per fungsi — Area Lahendong 2026 (IDR Miliar)"
                    className="h-64"
                    onClick={() => onChartClick && onChartClick('abo-fungsi')}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dynamicAboPerFungsi} margin={{ top: 10, right: 60, left: -10, bottom: 5 }} {...aboFungsiHover.barChartProps}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="fungsi" tickLine={false} axisLine={false} tick={{ fontSize: 9 }} />
                            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                            <RechartsTooltip formatter={(v, name) => [`${v} Miliar`, name]} />
                            <Legend wrapperStyle={{ fontSize: 9 }} />
                            <Bar dataKey="budget" name="Budget" fill="#93c5fd" radius={[3, 3, 0, 0]} />
                            <Bar dataKey="actual" name="Actual" fill={PERTAMINA_GREEN} radius={[3, 3, 0, 0]} />
                            <Customized component={BarDiffOverlay} barKey1="budget" barKey2="actual" activeIndex={aboFungsiHover.activeIndex} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
}

function RingkasanBarChart({ chartData, formatCurrency }) {
    const ringkasanHover = useBarHover();
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 60, left: -20, bottom: 5 }} {...ringkasanHover.barChartProps}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} className="font-semibold text-slate-500" />
                <YAxis tickLine={false} axisLine={false} className="font-semibold text-slate-500" tickFormatter={(v) => `${(v / 1000000000).toFixed(0)}M`} />
                <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                <Legend wrapperStyle={{ paddingTop: 10 }} />
                <Bar dataKey="budget" name="RKAP Plafon Budget" fill="#00529C" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="Realisasi Actual" fill="#8DC63F" radius={[4, 4, 0, 0]} />
                <Customized component={BarDiffOverlay} barKey1="budget" barKey2="actual" activeIndex={ringkasanHover.activeIndex} />
            </BarChart>
        </ResponsiveContainer>
    );
}

function RingkasanVisualization({ chartData, formatCurrency, formatShortCurrency, getFunctionIcon, titleSuffix, onChartClick, chartId }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-[fadeIn_0.3s_ease-in-out] mb-6">
            <div
                onClick={() => onChartClick && onChartClick(chartId)}
                className={`lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col h-96 relative group ${
                    onChartClick ? 'hover:shadow-md hover:border-slate-350 cursor-pointer' : ''
                }`}
            >
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="font-extrabold text-slate-800 text-sm">Visualisasi Anggaran Per Fungsi {titleSuffix}</h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">Komparasi RKAP Plafon (Target) vs Realisasi Pemakaian Aktual.</p>
                    </div>
                    {onChartClick && (
                        <span className="p-1.5 text-slate-350 group-hover:text-blue-600 rounded-xl group-hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100" title="Detail Chart">
                            <Maximize2 className="w-4 h-4" />
                        </span>
                    )}
                </div>
                <div className="flex-1 w-full min-h-0 text-[10px]">
                    <RingkasanBarChart chartData={chartData} formatCurrency={formatCurrency} />
                </div>
                {onChartClick && (
                    <div className="absolute bottom-2 right-6 text-[8px] font-extrabold text-blue-600 tracking-wider opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        KLIK UNTUK DETAIL & FILTER
                    </div>
                )}
            </div>
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
                    Data diringkas secara real-time dari {titleSuffix === '(ABO)' ? 'Cost Center' : 'WBS Element'} terkait.
                </div>
            </div>
        </div>
    );
}

export default function Budgeting(props) {
    const { budgetDetailsList, momList, auth, onOpenFeedback, activeSubMenu, aboYearly = [], aboKumulatif2026 = [], aboMonthly2026 = [] } = props;
    const currentUser = auth.user;

    const [activeBudgetSubTab, setActiveBudgetSubTab] = useState('abo');
    const [aboViewMode, setAboViewMode] = useState('detail'); // 'detail' | 'grouped'
    const [aboDetailPage, setAboDetailPage] = useState(1);
    const [aboGroupedPage, setAboGroupedPage] = useState(1);
    const [abiPage, setAbiPage] = useState(1);
    const [selectedChart, setSelectedChart] = useState(null);
    const [isChartModalOpen, setIsChartModalOpen] = useState(false);

    React.useEffect(() => {
        if (activeSubMenu) {
            setActiveBudgetSubTab(activeSubMenu);
        }
    }, [activeSubMenu]);
    const [budgetSearch, setBudgetSearch] = useState('');

    React.useEffect(() => {
        setAboDetailPage(1);
        setAboGroupedPage(1);
        setAbiPage(1);
    }, [budgetSearch, aboViewMode]);

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
    const getClassifiedFunction = (name = '', fungsi = '') => {
        if (fungsi && String(fungsi).trim() !== '') {
            const fLower = String(fungsi).trim().toLowerCase();
            if (fLower.includes('maint')) return 'Maintenance';
            if (fLower.includes('op') || fLower.includes('prod') || fLower.includes('steam')) return 'Operation';
            if (fLower.includes('hsse') || fLower.includes('safe') || fLower.includes('lingk')) return 'HSSE';
            if (fLower.includes('bus') || fLower.includes('support') || fLower.includes('bs')) return 'Business Support';
            if (fLower.includes('gpr')) return 'GPR';
            return fungsi;
        }
        const nameLower = (name || '').toLowerCase();
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

    // Helper to calculate chart data for a specific category
    const getChartDataForCategory = (kategori) => {
        const filteredList = budgetDetailsList.filter(b => b.kategori === kategori);
        const groupedDataMap = filteredList.reduce((acc, curr) => {
            const funcName = getClassifiedFunction(curr.name, curr.fungsi);
            if (!acc[funcName]) {
                acc[funcName] = { name: funcName, budget: 0, consumed: 0, actual: 0 };
            }
            acc[funcName].budget += curr.budget;
            acc[funcName].consumed += curr.consumed;
            acc[funcName].actual += curr.actual;
            return acc;
        }, {});
        const orderedFunctions = ['HSSE', 'Operation', 'Maintenance', 'Business Support'];
        return orderedFunctions.map(func => groupedDataMap[func] || { name: func, budget: 0, consumed: 0, actual: 0 });
    };

    const chartDataAbo = getChartDataForCategory('ABO');
    const chartDataAbi = getChartDataForCategory('ABI');
    
    const searchFilteredBudgetDetails = budgetDetailsList.filter(item => {
        const query = budgetSearch.toLowerCase().trim();
        return (
            (item.fundCent && item.fundCent.toLowerCase().includes(query)) ||
            (item.fungsi && item.fungsi.toLowerCase().includes(query)) ||
            (item.name && item.name.toLowerCase().includes(query)) ||
            (item.commitItem && item.commitItem.toLowerCase().includes(query)) ||
            (item.text && item.text.toLowerCase().includes(query))
        );
    });

    const getFunctionIcon = (name) => {
        switch (name) {
            case 'HSSE': return <ShieldAlert className="w-5 h-5 text-red-600" />;
            case 'Operation': return <Activity className="w-5 h-5 text-blue-600" />;
            case 'Maintenance': return <Wrench className="w-5 h-5 text-green-600" />;
            default: return <Users2 className="w-5 h-5 text-indigo-600" />;
        }
    };

    // Dynamic ABO per fungsi calculation for modal
    const dynamicAboPerFungsi = React.useMemo(() => {
        const aboList = budgetDetailsList.filter(b => b.kategori === 'ABO');
        const groupedMap = aboList.reduce((acc, curr) => {
            const funcName = getClassifiedFunction(curr.name, curr.fungsi);
            if (!acc[funcName]) {
                acc[funcName] = { fungsi: funcName, budget: 0, actual: 0 };
            }
            acc[funcName].budget += curr.budget;
            acc[funcName].actual += curr.actual;
            return acc;
        }, {});

        const result = Object.values(groupedMap).map(item => ({
            fungsi: item.fungsi,
            budget: Number((item.budget / 1000000000).toFixed(2)),
            actual: Number((item.actual / 1000000000).toFixed(2)),
            variance: Number(((item.actual - item.budget) / 1000000000).toFixed(2))
        }));

        if (result.length === 0) {
            return [
                { fungsi: 'Operation', budget: 0, actual: 0, variance: 0 },
                { fungsi: 'Maintenance', budget: 0, actual: 0, variance: 0 },
                { fungsi: 'HSSE', budget: 0, actual: 0, variance: 0 },
                { fungsi: 'Bus. Support', budget: 0, actual: 0, variance: 0 }
            ];
        }
        return result;
    }, [budgetDetailsList]);

    const chartConfigs = {
        'abo-yearly': {
            id: 'abo-yearly',
            title: 'ABO 2019 – 2026 (USD Juta)',
            subtitle: 'Perbandingan RKAP vs Actual ABO Area Lahendong',
            type: 'bar',
            xAxisKey: 'tahun',
            timeType: 'year',
            series: [
                { key: 'rkap', label: 'RKAP (USD)', color: '#93c5fd', type: 'bar', unit: 'Juta USD' },
                { key: 'actual', label: 'Actual (USD)', color: PERTAMINA_GREEN, type: 'bar', unit: 'Juta USD' }
            ],
            rawData: aboYearly
        },
        'abo-kumulatif': {
            id: 'abo-kumulatif',
            title: 'Actual ABO Area Lahendong 2026 — Kumulatif',
            subtitle: 'Serapan anggaran kumulatif RKAP vs Realisasi (IDR Miliar)',
            type: 'line',
            xAxisKey: 'bulan',
            timeType: 'month',
            series: [
                { key: 'rkap', label: 'RKAP Kumulatif', color: PERTAMINA_BLUE, unit: 'Miliar' },
                { key: 'realisasi', label: 'Realisasi Kumulatif', color: PERTAMINA_GREEN, unit: 'Miliar' }
            ],
            rawData: aboKumulatif2026
        },
        'abo-monthly': {
            id: 'abo-monthly',
            title: 'Actual ABO Area Lahendong 2026 — Monthly',
            subtitle: 'Realisasi bulanan RKAP vs Actual (IDR Miliar)',
            type: 'line',
            xAxisKey: 'bulan',
            timeType: 'month',
            series: [
                { key: 'rkap', label: 'RKAP 2026', color: PERTAMINA_BLUE, unit: 'Miliar' },
                { key: 'realisasi', label: 'Real 2026', color: PERTAMINA_GREEN, unit: 'Miliar' }
            ],
            rawData: aboMonthly2026
        },
        'abo-fungsi': {
            id: 'abo-fungsi',
            title: 'Rincian Realisasi ABO per Fungsi',
            subtitle: 'Budget vs Actual per fungsi — Area Lahendong 2026 (IDR Miliar)',
            type: 'bar',
            xAxisKey: 'fungsi',
            timeType: 'other',
            series: [
                { key: 'budget', label: 'Budget', color: '#93c5fd', type: 'bar', unit: 'Miliar' },
                { key: 'actual', label: 'Actual', color: PERTAMINA_GREEN, type: 'bar', unit: 'Miliar' }
            ],
            rawData: dynamicAboPerFungsi
        },
        'budget-ringkasan-abo': {
            id: 'budget-ringkasan-abo',
            title: 'Visualisasi Anggaran Per Fungsi (ABO)',
            subtitle: 'Komparasi RKAP Plafon vs Realisasi Pemakaian Aktual (ABO)',
            type: 'bar',
            xAxisKey: 'name',
            timeType: 'other',
            series: [
                { key: 'budget', label: 'RKAP Plafon', color: PERTAMINA_BLUE, type: 'bar', unit: 'Rp' },
                { key: 'actual', label: 'Realisasi Actual', color: PERTAMINA_GREEN, type: 'bar', unit: 'Rp' }
            ],
            rawData: chartDataAbo
        },
        'budget-ringkasan-abi': {
            id: 'budget-ringkasan-abi',
            title: 'Visualisasi Anggaran Per Fungsi (ABI)',
            subtitle: 'Komparasi RKAP Plafon vs Realisasi Pemakaian Aktual (ABI)',
            type: 'bar',
            xAxisKey: 'name',
            timeType: 'other',
            series: [
                { key: 'budget', label: 'RKAP Plafon', color: PERTAMINA_BLUE, type: 'bar', unit: 'Rp' },
                { key: 'actual', label: 'Realisasi Actual', color: PERTAMINA_GREEN, type: 'bar', unit: 'Rp' }
            ],
            rawData: chartDataAbi
        }
    };

    const handleChartClick = (chartId) => {
        if (chartConfigs[chartId]) {
            setSelectedChart(chartConfigs[chartId]);
            setIsChartModalOpen(true);
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
                    value={formatShortCurrency(totalBudget)} 
                    subtitle="Tahun Anggaran berjalan" 
                    icon={Calculator} 
                    colorClass="text-blue-600" 
                    bgClass="bg-blue-50" 
                />
                <KpiCard 
                    title="Consumed (PR/PO)" 
                    value={formatShortCurrency(totalConsumed)} 
                    subtitle={`Terserap ${formatPercentage(totalConsumed, totalBudget)}`} 
                    icon={TrendingUp} 
                    colorClass="text-yellow-600" 
                    bgClass="bg-yellow-50" 
                />
                <KpiCard 
                    title="Actual (Realisasi)" 
                    value={formatShortCurrency(totalActual)} 
                    subtitle={`Realisasi ${formatPercentage(totalActual, totalBudget)}`} 
                    icon={CheckCircle} 
                    colorClass="text-green-600" 
                    bgClass="bg-green-50" 
                />
                <KpiCard 
                    title="Available (Sisa Plafon)" 
                    value={formatShortCurrency(totalAvailable)} 
                    subtitle="Sisa anggaran bebas" 
                    icon={AlertCircle} 
                    colorClass="text-indigo-600" 
                    bgClass="bg-indigo-50" 
                />
            </div>

            {/* Subtab Navigation */}
            <div className="flex border-b border-slate-200 bg-white p-2 rounded-2xl border shadow-2xs">
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
                <button
                    onClick={() => setActiveBudgetSubTab('realisasi-abo')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        activeBudgetSubTab === 'realisasi-abo' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <PieIcon className="w-4 h-4" /> Trend Realisasi ABO
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

            {/* Subtab 2: Cost Center (ABO) */}
            {activeBudgetSubTab === 'abo' && (() => {
                const aboDetailsList = searchFilteredBudgetDetails.filter(i => i.kategori === 'ABO');
                const aboGroupMap = {};
                aboDetailsList.forEach(item => {
                    const key = item.fundCent || item.name || 'Unassigned';
                    if (!aboGroupMap[key]) {
                        aboGroupMap[key] = {
                            fundCent: item.fundCent,
                            name: item.name,
                            fungsi: item.fungsi,
                            kategori: 'ABO',
                            budget: 0,
                            consumed: 0,
                            commitment: 0,
                            actual: 0,
                            available: 0
                        };
                    }
                    aboGroupMap[key].budget += (Number(item.budget) || 0);
                    aboGroupMap[key].consumed += (Number(item.consumed) || 0);
                    aboGroupMap[key].commitment += (Number(item.commitment) || 0);
                    aboGroupMap[key].actual += (Number(item.actual) || 0);
                    aboGroupMap[key].available += (Number(item.available) || 0);
                });
                const aboGroupedList = Object.values(aboGroupMap);

                return (
                    <div className="space-y-4 animate-[fadeIn_0.3s_ease-in-out]">
                        <RingkasanVisualization chartData={chartDataAbo} formatCurrency={formatCurrency} formatShortCurrency={formatShortCurrency} getFunctionIcon={getFunctionIcon} titleSuffix="(ABO)" onChartClick={handleChartClick} chartId="budget-ringkasan-abo" />
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                            {/* Table Controls & View Mode Toggle */}
                            <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari Fund Cen, Fungsi, Name, Commit Item, Text..."
                                        value={budgetSearch}
                                        onChange={(e) => setBudgetSearch(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-slate-700 font-semibold"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-slate-200/80 p-1 rounded-xl flex text-[11px] font-bold text-slate-600">
                                        <button
                                            onClick={() => setAboViewMode('detail')}
                                            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                                aboViewMode === 'detail' ? 'bg-white text-blue-600 shadow-xs' : 'hover:text-slate-800'
                                            }`}
                                        >
                                            Rincian Item ({aboDetailsList.length})
                                        </button>
                                        <button
                                            onClick={() => setAboViewMode('grouped')}
                                            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                                aboViewMode === 'grouped' ? 'bg-white text-blue-600 shadow-xs' : 'hover:text-slate-800'
                                            }`}
                                        >
                                            Ringkasan Cost Center ({aboGroupedList.length})
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed 10-column Table */}
                            {aboViewMode === 'detail' && (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs whitespace-nowrap">
                                        <thead className="bg-slate-50 border-b border-slate-200">
                                            <tr>
                                                <th className="p-4 text-slate-500 font-bold w-10 text-center">No</th>
                                                <th className="p-4 text-slate-500 font-bold">Fund Cen</th>
                                                <th className="p-4 text-slate-500 font-bold text-center">Fungsi</th>
                                                <th className="p-4 text-slate-500 font-bold">Name</th>
                                                <th className="p-4 text-slate-500 font-bold">Commitment Item</th>
                                                <th className="p-4 text-slate-500 font-bold max-w-xs text-wrap">Text</th>
                                                <th className="p-4 text-slate-500 font-bold text-right">Consumable Budget(IDR)</th>
                                                <th className="p-4 text-slate-500 font-bold text-right">Consumed Budget(IDR)</th>
                                                <th className="p-4 text-slate-500 font-bold text-right">Commitment(IDR)</th>
                                                <th className="p-4 text-slate-500 font-bold text-right">Actual(IDR)</th>
                                                <th className="p-4 text-slate-500 font-bold text-right">Available(IDR)</th>
                                                {isAdmin && <th className="p-4 text-slate-500 font-bold text-center w-16">Aksi</th>}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {aboDetailsList.slice((aboDetailPage - 1) * 10, aboDetailPage * 10).map((item, idx) => {
                                                const actualIdx = (aboDetailPage - 1) * 10 + idx;
                                                const fungsiName = getClassifiedFunction(item.name, item.fungsi);
                                                return (
                                                    <tr key={item.id || actualIdx} className="hover:bg-slate-50/70 transition-colors">
                                                        <td className="p-4 text-slate-500 text-center font-semibold">{actualIdx + 1}</td>
                                                        <td className="p-4 font-mono text-xs font-extrabold text-slate-700">{item.fundCent || '-'}</td>
                                                        <td className="p-4 text-center">
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                                fungsiName === 'HSSE' ? 'bg-red-50 text-red-700 border border-red-200' :
                                                                fungsiName === 'Operation' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                                                fungsiName === 'Maintenance' ? 'bg-green-50 text-green-700 border border-green-200' :
                                                                fungsiName === 'GPR' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                                'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                                            }`}>
                                                                {fungsiName}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 font-bold text-slate-800">{item.name}</td>
                                                        <td className="p-4 font-mono text-[11px] text-slate-500 font-bold">{item.commitItem || '-'}</td>
                                                        <td className="p-4 max-w-xs text-wrap font-medium text-slate-700 leading-relaxed">{item.text || '-'}</td>
                                                        <td className="p-4 text-right font-mono text-slate-700 font-bold">{formatCurrency(item.budget)}</td>
                                                        <td className="p-4 text-right font-mono text-amber-600 font-bold">{formatCurrency(item.consumed)}</td>
                                                        <td className="p-4 text-right font-mono text-indigo-600 font-bold">{formatCurrency(item.commitment || 0)}</td>
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
                                            {aboDetailsList.length > 0 && (
                                                <tr className="bg-slate-50/80 font-bold border-t-2 border-slate-200">
                                                    <td colSpan={6} className="p-4 text-slate-700 text-right uppercase tracking-wider text-[10px]">Total Akumulasi Terfilter</td>
                                                    <td className="p-4 text-right font-mono text-slate-900 font-extrabold">{formatCurrency(aboDetailsList.reduce((acc, curr) => acc + (Number(curr.budget) || 0), 0))}</td>
                                                    <td className="p-4 text-right font-mono text-amber-700 font-extrabold">{formatCurrency(aboDetailsList.reduce((acc, curr) => acc + (Number(curr.consumed) || 0), 0))}</td>
                                                    <td className="p-4 text-right font-mono text-indigo-700 font-extrabold">{formatCurrency(aboDetailsList.reduce((acc, curr) => acc + (Number(curr.commitment) || 0), 0))}</td>
                                                    <td className="p-4 text-right font-mono text-blue-700 font-extrabold">{formatCurrency(aboDetailsList.reduce((acc, curr) => acc + (Number(curr.actual) || 0), 0))}</td>
                                                    <td className={`p-4 text-right font-mono font-extrabold ${aboDetailsList.reduce((acc, curr) => acc + (Number(curr.available) || 0), 0) >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                                        {formatCurrency(aboDetailsList.reduce((acc, curr) => acc + (Number(curr.available) || 0), 0))}
                                                    </td>
                                                    {isAdmin && <td className="p-4"></td>}
                                                </tr>
                                            )}
                                            {aboDetailsList.length === 0 && (
                                                <tr>
                                                    <td colSpan={isAdmin ? 12 : 11} className="p-12 text-center text-slate-400 font-medium">
                                                        Tidak ada rincian transaksi ABO yang ditemukan.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    <Pagination
                                        currentPage={aboDetailPage}
                                        totalItems={aboDetailsList.length}
                                        itemsPerPage={10}
                                        onPageChange={setAboDetailPage}
                                    />
                                </div>
                            )}

                            {/* Grouped Cost Center Table */}
                            {aboViewMode === 'grouped' && (
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
                                                <th className="p-4 text-slate-500 font-bold text-right">Commitment</th>
                                                <th className="p-4 text-slate-500 font-bold text-right">Actual (Realisasi)</th>
                                                <th className="p-4 text-slate-500 font-bold text-right">Available (Sisa)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {aboGroupedList.slice((aboGroupedPage - 1) * 10, aboGroupedPage * 10).map((item, idx) => {
                                                const actualIdx = (aboGroupedPage - 1) * 10 + idx;
                                                const fungsiName = getClassifiedFunction(item.name, item.fungsi);
                                                return (
                                                    <tr key={item.fundCent || actualIdx} className="hover:bg-slate-50/70 transition-colors">
                                                        <td className="p-4 text-slate-500 text-center font-semibold">{actualIdx + 1}</td>
                                                        <td className="p-4 font-mono text-xs font-extrabold text-slate-700">{item.fundCent || '-'}</td>
                                                        <td className="p-4 font-bold text-slate-800">{item.name}</td>
                                                        <td className="p-4 text-center">
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                                fungsiName === 'HSSE' ? 'bg-red-50 text-red-700 border border-red-200' :
                                                                fungsiName === 'Operation' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                                                fungsiName === 'Maintenance' ? 'bg-green-50 text-green-700 border border-green-200' :
                                                                fungsiName === 'GPR' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                                'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                                            }`}>
                                                                {fungsiName}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-right font-mono text-slate-700 font-bold">{formatCurrency(item.budget)}</td>
                                                        <td className="p-4 text-right font-mono text-amber-600 font-bold">{formatCurrency(item.consumed)}</td>
                                                        <td className="p-4 text-right font-mono text-indigo-600 font-bold">{formatCurrency(item.commitment)}</td>
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
                                                    <td className="p-4 text-right font-mono text-indigo-700 font-extrabold">{formatCurrency(aboGroupedList.reduce((acc, curr) => acc + curr.commitment, 0))}</td>
                                                    <td className="p-4 text-right font-mono text-blue-700 font-extrabold">{formatCurrency(aboGroupedList.reduce((acc, curr) => acc + curr.actual, 0))}</td>
                                                    <td className={`p-4 text-right font-mono font-extrabold ${aboGroupedList.reduce((acc, curr) => acc + curr.available, 0) >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                                                        {formatCurrency(aboGroupedList.reduce((acc, curr) => acc + curr.available, 0))}
                                                    </td>
                                                </tr>
                                            )}
                                            {aboGroupedList.length === 0 && (
                                                <tr>
                                                    <td colSpan={9} className="p-12 text-center text-slate-400 font-medium">
                                                        Tidak ada ringkasan Cost Center (ABO) yang ditemukan.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    <Pagination
                                        currentPage={aboGroupedPage}
                                        totalItems={aboGroupedList.length}
                                        itemsPerPage={10}
                                        onPageChange={setAboGroupedPage}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                );
            })()}

            {/* Subtab 3: WBS Element (ABI) */}
            {activeBudgetSubTab === 'abi' && (
                <div className="space-y-4 animate-[fadeIn_0.3s_ease-in-out]">
                    <RingkasanVisualization chartData={chartDataAbi} formatCurrency={formatCurrency} formatShortCurrency={formatShortCurrency} getFunctionIcon={getFunctionIcon} titleSuffix="(ABI)" onChartClick={handleChartClick} chartId="budget-ringkasan-abi" />
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
                                    {searchFilteredBudgetDetails.filter(i => i.kategori === 'ABI').slice((abiPage - 1) * 10, abiPage * 10).map((item, idx) => {
                                        const actualIdx = (abiPage - 1) * 10 + idx;
                                        const fungsiName = getClassifiedFunction(item.name);
                                        return (
                                            <tr key={item.id || idx} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="p-4 text-slate-500 text-center font-semibold">{actualIdx + 1}</td>
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
                            <Pagination
                                currentPage={abiPage}
                                totalItems={searchFilteredBudgetDetails.filter(i => i.kategori === 'ABI').length}
                                itemsPerPage={10}
                                onPageChange={setAbiPage}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Subtab 4: Realisasi ABO */}
            {activeBudgetSubTab === 'realisasi-abo' && <TabRealisasiAbo budgetDetailsList={budgetDetailsList} onChartClick={handleChartClick} aboYearly={aboYearly} aboKumulatif2026={aboKumulatif2026} aboMonthly2026={aboMonthly2026} />}

            {/* Chart Detail Modal */}
            <ChartDetailModal
                isOpen={isChartModalOpen}
                onClose={() => {
                    setIsChartModalOpen(false);
                    setSelectedChart(null);
                }}
                chartConfig={selectedChart}
            />
        </div>
    );
}
