import React, { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer, LineChart, Line, Legend, ComposedChart, Area, Customized,
    PieChart, Pie, Cell
} from 'recharts';
import {
    FileSignature, Calculator, Shield,
    Activity, DollarSign, PieChart as PieChartIcon, Zap, TrendingUp, Maximize2,
    UploadCloud, FileSpreadsheet, Download, Search, Plus, Trash2,
    ChevronLeft, ChevronRight, CornerDownLeft
} from 'lucide-react';
import * as XLSX from 'xlsx';
import KpiCard from '../../Components/KpiCard';
import ChartDetailModal from '../../Components/ChartDetailModal';
import { BarDiffOverlay, useBarHover } from '../../Components/BarDiffOverlay';


/* ─── Dummy Data: Kinerja Operasi & Reliability ─── */
const produksiGwh = [
    { tahun: '2018', nilai: 176.16 },
    { tahun: '2019', nilai: 148.55 },
    { tahun: '2020', nilai: 85.60 },
    { tahun: '2021', nilai: 78.32 },
    { tahun: '2022', nilai: 84.25 },
    { tahun: '2023', nilai: 96.68 },
    { tahun: '2024', nilai: 94.66 },
    { tahun: '2025', nilai: 109.63 },
    { tahun: '2026', nilai: 151.20, forecast: true },
];

const realisasiProduksi2025 = [
    { bulan: '1', rkap: 8.5, realisasi: 7.8, kumRkap: 8.5, kumReal: 7.8, rkapRevisi: 8.2 },
    { bulan: '2', rkap: 9.2, realisasi: 8.9, kumRkap: 17.7, kumReal: 16.7, rkapRevisi: 17.0 },
    { bulan: '3', rkap: 9.8, realisasi: 10.1, kumRkap: 27.5, kumReal: 26.8, rkapRevisi: 26.5 },
    { bulan: '4', rkap: 10.2, realisasi: 9.5, kumRkap: 37.7, kumReal: 36.3, rkapRevisi: 36.8 },
    { bulan: '5', rkap: 10.5, realisasi: 11.2, kumRkap: 48.2, kumReal: 47.5, rkapRevisi: 47.8 },
    { bulan: '6', rkap: 10.8, realisasi: 10.4, kumRkap: 59.0, kumReal: 57.9, rkapRevisi: 58.5 },
    { bulan: '7', rkap: 11.0, realisasi: 10.8, kumRkap: 70.0, kumReal: 68.7, rkapRevisi: 69.2 },
    { bulan: '8', rkap: 11.2, realisasi: 11.5, kumRkap: 81.2, kumReal: 80.2, rkapRevisi: 80.5 },
    { bulan: '9', rkap: 11.5, realisasi: 10.9, kumRkap: 92.7, kumReal: 91.1, rkapRevisi: 91.8 },
    { bulan: '10', rkap: 11.8, realisasi: 11.3, kumRkap: 104.5, kumReal: 102.4, rkapRevisi: 103.2 },
    { bulan: '11', rkap: 12.0, realisasi: 11.8, kumRkap: 116.5, kumReal: 114.2, rkapRevisi: 115.0 },
    { bulan: '12', rkap: 12.2, realisasi: 11.5, kumRkap: 128.7, kumReal: 125.7, rkapRevisi: 127.0 },
];

const eafData = [
    { tahun: '2020', nilai: 91.08 },
    { tahun: '2021', nilai: 88.56 },
    { tahun: '2022', nilai: 97.27 },
    { tahun: '2023', nilai: 94.53 },
    { tahun: '2024', nilai: 89.61 },
    { tahun: '2025', nilai: 94.61 },
];

const mtbfData = [
    { tahun: '2019', nilai: 22.81 },
    { tahun: '2020', nilai: 26.07 },
    { tahun: '2021', nilai: 20.28 },
    { tahun: '2022', nilai: 21.47 },
    { tahun: '2023', nilai: 28.50 },
    { tahun: '2024', nilai: 55.83 },
    { tahun: '2025', nilai: 26.54 },
];

const eforData = [
    { tahun: '2020', nilai: 7.60 },
    { tahun: '2021', nilai: 5.09 },
    { tahun: '2022', nilai: 2.51 },
    { tahun: '2023', nilai: 1.42 },
    { tahun: '2024', nilai: 2.23 },
    { tahun: '2025', nilai: 0.81 },
];

const mttrData = [
    { tahun: '2019', nilai: 27.49 },
    { tahun: '2020', nilai: 56.84 },
    { tahun: '2021', nilai: 10.10 },
    { tahun: '2022', nilai: 12.95 },
    { tahun: '2023', nilai: 10.04 },
    { tahun: '2024', nilai: 29.97 },
    { tahun: '2025', nilai: 5.22 },
];

/* ─── Dummy Data: Financial Performance ─── */
const financialTrend = [
    { tahun: '2018', revenue: 12.5, cost: 5.2, depreciation: 8.1, profitLoss: -0.8 },
    { tahun: '2019', revenue: 10.8, cost: 5.0, depreciation: 9.5, profitLoss: -3.7 },
    { tahun: '2020', revenue: 6.2, cost: 4.8, depreciation: 10.2, profitLoss: -8.8 },
    { tahun: '2021', revenue: 5.8, cost: 4.5, depreciation: 11.0, profitLoss: -9.7 },
    { tahun: '2022', revenue: 6.5, cost: 4.9, depreciation: 11.8, profitLoss: -10.2 },
    { tahun: '2023', revenue: 7.8, cost: 5.1, depreciation: 12.5, profitLoss: -9.8 },
    { tahun: '2024', revenue: 9.2, cost: 5.3, depreciation: 13.2, profitLoss: -9.3 },
    { tahun: '2025', revenue: 10.13, cost: 5.43, depreciation: 14.31, profitLoss: -10.79 },
];

const costKwhData = [
    { tahun: '2018', nilai: 9.46 },
    { tahun: '2019', nilai: 12.30 },
    { tahun: '2020', nilai: 18.50 },
    { tahun: '2021', nilai: 23.94 },
    { tahun: '2022', nilai: 22.10 },
    { tahun: '2023', nilai: 21.50 },
    { tahun: '2024', nilai: 20.49 },
    { tahun: '2025', nilai: 20.23 },
];

const ebitdaData = [
    { tahun: '2018', nilai: 11.04 },
    { tahun: '2019', nilai: 8.50 },
    { tahun: '2020', nilai: 3.20 },
    { tahun: '2021', nilai: 1.72 },
    { tahun: '2022', nilai: 2.80 },
    { tahun: '2023', nilai: 3.50 },
    { tahun: '2024', nilai: 4.58 },
    { tahun: '2025', nilai: 4.13, label: 'ytd Nov' },
];

const productionCostScatter = [
    { label: 'RKAP 2025', costKwh: 16.90, produksi: 126 },
    { label: 'RKAP Revisi', costKwh: 20.10, produksi: 116 },
    { label: 'Q1 2025', costKwh: 20.01, produksi: 25 },
    { label: 'Q2 2025', costKwh: 20.15, produksi: 55 },
    { label: 'Q3 2025', costKwh: 20.20, produksi: 82 },
    { label: 'Q4 2025', costKwh: 20.23, produksi: 110 },
];

/* Realisasi ABO moved to Budgeting */

const PERTAMINA_BLUE = '#00529C';
const PERTAMINA_GREEN = '#8DC63F';
const PERTAMINA_YELLOW = '#F59E0B';
const PERTAMINA_RED = '#E52B2D';

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
                    <span className="p-1 text-slate-350 group-hover:text-blue-600 rounded-lg group-hover:bg-blue-55 transition-all opacity-0 group-hover:opacity-100 shrink-0" title="Detail Chart">
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

function ReliabilityLineChart({ data, dataKey, unit, color = PERTAMINA_BLUE, domain }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="tahun" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis domain={domain} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <RechartsTooltip formatter={(v) => [`${v} ${unit}`, '']} />
                <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} dot={{ r: 4, fill: color }} activeDot={{ r: 6 }} />
            </LineChart>
        </ResponsiveContainer>
    );
}

/* ─── Tab: Kinerja Operasi & Reliability ─── */
function TabOperasi({ onChartClick }) {
    const realisasiHover = useBarHover();
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ChartCard 
                    title="Produksi (GWh)" 
                    subtitle="Trend produksi tahunan Area Lahendong 2018–2026 (forecast)" 
                    className="h-72"
                    onClick={() => onChartClick('produksi-gwh')}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={produksiGwh} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="tahun" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} domain={[0, 200]} />
                            <RechartsTooltip formatter={(v) => [`${v} GWh`, 'Produksi']} />
                            <Line type="monotone" dataKey="nilai" stroke={PERTAMINA_BLUE} strokeWidth={2.5} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard 
                    title="Realisasi Produksi 2025 (GWh)" 
                    subtitle="RKAP vs Realisasi bulanan & kumulatif — Total: 109,63 GWh" 
                    className="h-72"
                    onClick={() => onChartClick('realisasi-produksi-2025')}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={realisasiProduksi2025} margin={{ top: 10, right: 55, left: -10, bottom: 5 }} {...realisasiHover.barChartProps}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="bulan" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} label={{ value: 'Bulan', position: 'insideBottom', offset: -2, style: { fontSize: 9 } }} />
                            <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                            <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                            <RechartsTooltip />
                            <Legend wrapperStyle={{ fontSize: 9 }} />
                            <Bar yAxisId="left" dataKey="rkap" name="RKAP" fill="#93c5fd" radius={[2, 2, 0, 0]} barSize={8} />
                            <Bar yAxisId="left" dataKey="realisasi" name="Realisasi" fill={PERTAMINA_GREEN} radius={[2, 2, 0, 0]} barSize={8} />
                            <Line yAxisId="right" type="monotone" dataKey="kumRkap" name="Kum. RKAP" stroke={PERTAMINA_BLUE} strokeWidth={2} dot={false} />
                            <Line yAxisId="right" type="monotone" dataKey="kumReal" name="Kum. Realisasi" stroke="#16a34a" strokeWidth={2} dot={false} />
                            <Customized component={BarDiffOverlay} barKey1="rkap" barKey2="realisasi" activeIndex={realisasiHover.activeIndex} yAxisId="left" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <ChartCard 
                    title="EAF (%)" 
                    subtitle="Equivalent Availability Factor — Higher is better" 
                    className="h-56"
                    onClick={() => onChartClick('eaf')}
                >
                    <ReliabilityLineChart data={eafData} dataKey="nilai" unit="%" color={PERTAMINA_GREEN} domain={[80, 100]} />
                </ChartCard>
                <ChartCard 
                    title="MTBF (Day)" 
                    subtitle="Mean Time Between Failures" 
                    className="h-56"
                    onClick={() => onChartClick('mtbf')}
                >
                    <ReliabilityLineChart data={mtbfData} dataKey="nilai" unit="hari" color={PERTAMINA_BLUE} />
                </ChartCard>
                <ChartCard 
                    title="EFOR (%)" 
                    subtitle="Equivalent Forced Outage Rate — Lower is better" 
                    className="h-56"
                    onClick={() => onChartClick('efor')}
                >
                    <ReliabilityLineChart data={eforData} dataKey="nilai" unit="%" color={PERTAMINA_YELLOW} domain={[0, 10]} />
                </ChartCard>
                <ChartCard 
                    title="MTTR (Hour)" 
                    subtitle="Mean Time To Repair — Lower is better" 
                    className="h-56"
                    onClick={() => onChartClick('mttr')}
                >
                    <ReliabilityLineChart data={mttrData} dataKey="nilai" unit="jam" color={PERTAMINA_RED} />
                </ChartCard>
            </div>
        </div>
    );
}

/* ─── Tab: Financial Performance ─── */
function TabFinancial({ onChartClick }) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ChartCard 
                    title="Revenue, Cost & Profit/Loss (Juta USD)" 
                    subtitle="Trend finansial tahunan Area Lahendong" 
                    className="h-80"
                    onClick={() => onChartClick('financial-trend')}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={financialTrend} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="tahun" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                            <RechartsTooltip formatter={(v, name) => [`${v} Juta USD`, name]} />
                            <Legend wrapperStyle={{ fontSize: 9 }} />
                            <Line type="monotone" dataKey="revenue" name="Revenue" stroke={PERTAMINA_BLUE} strokeWidth={2} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="cost" name="Cost" stroke={PERTAMINA_GREEN} strokeWidth={2} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="depreciation" name="Depreciation" stroke={PERTAMINA_YELLOW} strokeWidth={2} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="profitLoss" name="Profit/Loss Net" stroke="#94a3b8" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard 
                    title="Production vs Cost per kWh" 
                    subtitle="Korelasi produksi (GWh) dan biaya per kWh (cent USD)" 
                    className="h-80"
                    onClick={() => onChartClick('production-cost-scatter')}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={productionCostScatter} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="costKwh" type="number" domain={[16, 21]} tickLine={false} axisLine={false} tick={{ fontSize: 10 }} label={{ value: 'Cost/kWh (cent USD)', position: 'insideBottom', offset: -2, style: { fontSize: 9 } }} />
                            <YAxis dataKey="produksi" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} label={{ value: 'Produksi (GWh)', angle: -90, position: 'insideLeft', style: { fontSize: 9 } }} />
                            <RechartsTooltip formatter={(v, name) => [v, name === 'produksi' ? 'Produksi (GWh)' : 'Cost/kWh']} labelFormatter={(_, payload) => payload?.[0]?.payload?.label ?? ''} />
                            <Line type="monotone" dataKey="produksi" stroke={PERTAMINA_BLUE} strokeWidth={2} dot={{ r: 5, fill: PERTAMINA_BLUE }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ChartCard 
                    title="Cost/kWh (cent USD)" 
                    subtitle="Biaya produksi per kWh — 2025: 20,23 cent USD" 
                    className="h-64"
                    onClick={() => onChartClick('cost-kwh')}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={costKwhData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="tahun" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} domain={[5, 26]} />
                            <RechartsTooltip formatter={(v) => [`${v} cent USD`, 'Cost/kWh']} />
                            <Line type="monotone" dataKey="nilai" stroke={PERTAMINA_BLUE} strokeWidth={2.5} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard 
                    title="EBITDA (Juta USD)" 
                    subtitle="Earnings Before Interest, Taxes, Depreciation & Amortization" 
                    className="h-64"
                    onClick={() => onChartClick('ebitda')}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={ebitdaData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="tahun" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                            <RechartsTooltip formatter={(v) => [`${v} Juta USD`, 'EBITDA']} />
                            <Area type="monotone" dataKey="nilai" fill="#dbeafe" stroke={PERTAMINA_BLUE} strokeWidth={2.5} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
}

/* ─── Risk Register Map & Data Synchronizer ─── */
const defaultInherentMap = [
    { prob: 5, dampak: 2, risks: [23, 24] },
    { prob: 4, dampak: 2, risks: [34] },
    { prob: 4, dampak: 5, risks: [5] },
    { prob: 3, dampak: 3, risks: [21, 22, 39, 40, 41, 49, 53] },
    { prob: 3, dampak: 4, risks: [15, 20, 29] },
    { prob: 3, dampak: 5, risks: [6, 7, 8, 14, 35, 36] },
    { prob: 2, dampak: 2, risks: [55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69] },
    { prob: 2, dampak: 3, risks: [4, 18, 25, 26, 27, 28, 31, 32, 33, 42, 48, 50, 51, 54] },
    { prob: 2, dampak: 4, risks: [16, 17, 19, 30, 52] },
    { prob: 2, dampak: 5, risks: [2, 9, 10, 11, 12, 13, 37, 38, 46] },
    { prob: 1, dampak: 5, risks: [1, 3, 43, 44, 45, 47] },
];

const defaultResidualMap = [
    { prob: 3, dampak: 1, risks: [23, 24] },
    { prob: 2, dampak: 1, risks: [34, 53] },
    { prob: 2, dampak: 2, risks: [2, 9, 10, 11, 12, 13, 15, 20, 29, 35, 36, 38, 49, 54] },
    { prob: 2, dampak: 3, risks: [5, 6, 7, 8, 14, 37, 39, 40, 41] },
    { prob: 1, dampak: 1, risks: [17, 18, 21, 22, 25, 26, 27, 28, 30, 31, 32, 33] },
    { prob: 1, dampak: 2, risks: [1, 3, 4, 16, 19, 42, 48, 50, 51, 52, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69] },
    { prob: 1, dampak: 3, risks: [43, 44, 45, 46, 47] },
];

function findCellForRisk(num, mapData) {
    for (let entry of mapData) {
        if (entry.risks.includes(num)) {
            return { prob: entry.prob, dampak: entry.dampak };
        }
    }
    return { prob: 1, dampak: 1 };
}

// Matrix Colors according to official Pertamina Risk Matrix
const riskColors = [
    // prob=1
    { prob: 1, dampak: 1, color: '#009944' },   // Low Risk (Dark Green)
    { prob: 1, dampak: 2, color: '#009944' },   // Low Risk
    { prob: 1, dampak: 3, color: '#009944' },   // Low Risk
    { prob: 1, dampak: 4, color: '#99cc33' },   // Low to Moderate Risk (Light Green)
    { prob: 1, dampak: 5, color: '#ffff00' },   // Moderate Risk (Yellow - User specified)
    // prob=2
    { prob: 2, dampak: 1, color: '#009944' },   // Low Risk
    { prob: 2, dampak: 2, color: '#99cc33' },   // Low to Moderate Risk
    { prob: 2, dampak: 3, color: '#ffff00' },   // Moderate Risk
    { prob: 2, dampak: 4, color: '#ffff00' },   // Moderate Risk
    { prob: 2, dampak: 5, color: '#ff9900' },   // Moderate to High Risk (Orange)
    // prob=3
    { prob: 3, dampak: 1, color: '#009944' },   // Low Risk
    { prob: 3, dampak: 2, color: '#ffff00' },   // Moderate Risk
    { prob: 3, dampak: 3, color: '#ffff00' },   // Moderate Risk
    { prob: 3, dampak: 4, color: '#ff9900' },   // Moderate to High Risk
    { prob: 3, dampak: 5, color: '#ff0000' },   // High Risk (Red)
    // prob=4
    { prob: 4, dampak: 1, color: '#99cc33' },   // Low to Moderate Risk
    { prob: 4, dampak: 2, color: '#ffff00' },   // Moderate Risk
    { prob: 4, dampak: 3, color: '#ff9900' },   // Moderate to High Risk
    { prob: 4, dampak: 4, color: '#ff0000' },   // High Risk
    { prob: 4, dampak: 5, color: '#ff0000' },   // High Risk
    // prob=5
    { prob: 5, dampak: 1, color: '#ffff00' },   // Moderate Risk
    { prob: 5, dampak: 2, color: '#ff9900' },   // Moderate to High Risk
    { prob: 5, dampak: 3, color: '#ff0000' },   // High Risk
    { prob: 5, dampak: 4, color: '#ff0000' },   // High Risk
    { prob: 5, dampak: 5, color: '#ff0000' },   // High Risk
];

function getRiskColor(prob, dampak) {
    const entry = riskColors.find(r => r.prob === prob && r.dampak === dampak);
    return entry ? entry.color : '#ffff00';
}

function getRiskLevelInfo(prob, dampak) {
    const entry = riskColors.find(r => r.prob === Number(prob) && r.dampak === Number(dampak));
    const color = entry ? entry.color : '#ffff00';

    if (color === '#009944') return { label: 'LOW RISK' };
    if (color === '#99cc33') return { label: 'LOW TO MODERATE RISK' };
    if (color === '#ffff00') return { label: 'MODERATE RISK' };
    if (color === '#ff9900') return { label: 'MODERATE TO HIGH RISK' };
    return { label: 'HIGH RISK' };
}

function getBadgeTdStyle(peringkat = '') {
    const pUpper = String(peringkat).toUpperCase();
    const base = 'p-3 text-center font-extrabold text-[11px] uppercase leading-tight';
    if (pUpper.includes('HIGH RISK') && !pUpper.includes('MODERATE TO HIGH')) {
        return `${base} bg-[#ff0000] text-white border-r border-red-600`;
    }
    if (pUpper.includes('MODERATE TO HIGH') || pUpper.includes('MODERATE-TO-HIGH')) {
        return `${base} bg-[#ff9900] text-white border-r border-orange-500`;
    }
    if (pUpper.includes('MODERATE RISK') || pUpper === 'MODERATE') {
        return `${base} bg-[#ffff00] text-slate-900 border-r border-yellow-400`;
    }
    if (pUpper.includes('LOW TO MODERATE') || pUpper.includes('LOW-TO-MODERATE')) {
        return `${base} bg-[#99cc33] text-slate-900 border-r border-lime-500`;
    }
    return `${base} bg-[#009944] text-white border-r border-green-700`;
}

function parseLevelFromText(text) {
    const tUpper = String(text || '').toUpperCase().trim();
    if (tUpper.includes('HIGH RISK') && !tUpper.includes('MODERATE TO HIGH')) {
        return { prob: 4, dampak: 4 };
    }
    if (tUpper.includes('MODERATE TO HIGH') || tUpper.includes('MODERATE-TO-HIGH')) {
        return { prob: 3, dampak: 4 };
    }
    if (tUpper.includes('MODERATE RISK') || tUpper === 'MODERATE') {
        return { prob: 2, dampak: 3 };
    }
    if (tUpper.includes('LOW TO MODERATE') || tUpper.includes('LOW-TO-MODERATE')) {
        return { prob: 2, dampak: 2 };
    }
    return { prob: 1, dampak: 2 };
}

function extractFirstDigit(val) {
    if (val === undefined || val === null || val === '') return NaN;
    const str = String(val).trim();
    const num = parseInt(str, 10);
    if (!isNaN(num) && num >= 1 && num <= 5) return num;
    const match = str.match(/[1-5]/);
    if (match) {
        return parseInt(match[0], 10);
    }
    return NaN;
}

function deriveResidualPI(resText, pInh, dInh) {
    const resUpper = String(resText || '').toUpperCase().trim();
    if (resUpper.includes('LOW RISK') && !resUpper.includes('MODERATE')) {
        return { prob: 1, dampak: Math.min(dInh, 2) };
    }
    if (resUpper.includes('LOW TO MODERATE') || resUpper.includes('LOW-TO-MODERATE')) {
        return { prob: 2, dampak: 2 };
    }
    if (resUpper.includes('MODERATE TO HIGH') || resUpper.includes('MODERATE-TO-HIGH')) {
        return { prob: Math.max(2, pInh - 1), dampak: Math.max(3, dInh) };
    }
    if (resUpper.includes('MODERATE RISK') || resUpper === 'MODERATE') {
        return { prob: Math.max(1, pInh - 1), dampak: Math.max(2, dInh - 1) };
    }
    if (resUpper.includes('HIGH RISK') || resUpper === 'HIGH') {
        return { prob: pInh, dampak: dInh };
    }
    return { prob: Math.max(1, pInh - 1), dampak: Math.max(1, dInh - 1) };
}

const probLabels = [
    { val: 5, label: '5 - Hampir\nPasti Terjadi' },
    { val: 4, label: '4 - Sangat\nMungkin Terjadi' },
    { val: 3, label: '3 - Bisa\nTerjadi' },
    { val: 2, label: '2 - Jarang\nTerjadi' },
    { val: 1, label: '1 - Hampir\nTidak Mungkin\nTerjadi' },
];

const dampakLabels = [
    { val: 1, label: '1 - Sangat Kecil' },
    { val: 2, label: '2 - Kecil' },
    { val: 3, label: '3 - Sedang' },
    { val: 4, label: '4 - Besar' },
    { val: 5, label: '5 - Sangat Besar' },
];

function RiskBubble({ num, onSelectRisk }) {
    return (
        <button
            type="button"
            onClick={() => onSelectRisk && onSelectRisk(num)}
            className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white border-2 border-slate-600 text-slate-800 text-[9px] font-black leading-none shrink-0 shadow-2xs hover:scale-125 hover:border-blue-600 hover:text-blue-600 transition-all cursor-pointer active:scale-95"
            title={`Klik untuk navigasi ke Risiko No. ${num} di tabel`}
        >
            {num}
        </button>
    );
}

function RiskMapGrid({ riskData, title, onSelectRisk }) {
    return (
        <div className="flex flex-col items-center w-full">
            <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-widest mb-3">{title}</h3>
            <div className="flex w-full">
                {/* Y-Axis Label */}
                <div className="flex items-center justify-center shrink-0" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', width: 20 }}>
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">PROBABILITAS</span>
                </div>
                {/* Y-Axis Prob Labels */}
                <div className="flex flex-col shrink-0" style={{ width: 80 }}>
                    {probLabels.map(p => (
                        <div key={p.val} className="h-[64px] flex items-center justify-end pr-2 border-b border-transparent">
                            <span className="text-[8.5px] font-semibold text-slate-600 text-right leading-tight whitespace-pre-line">{p.label}</span>
                        </div>
                    ))}
                </div>
                {/* Grid */}
                <div className="flex-1 grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                    {probLabels.map(p =>
                        dampakLabels.map(d => {
                            const found = riskData.find(r => r.prob === p.val && r.dampak === d.val);
                            const risks = found ? found.risks : [];
                            const bgColor = getRiskColor(p.val, d.val);
                            return (
                                <div
                                    key={`${p.val}-${d.val}`}
                                    className="border border-white/50 flex flex-wrap items-center justify-center gap-0.5 p-1 h-[64px] overflow-y-auto"
                                    style={{ backgroundColor: bgColor }}
                                >
                                    {risks.map(num => (
                                        <RiskBubble key={num} num={num} onSelectRisk={onSelectRisk} />
                                    ))}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
            {/* X-Axis Dampak Labels */}
            <div className="flex" style={{ marginLeft: 100, width: 'calc(100% - 100px)' }}>
                {dampakLabels.map(d => (
                    <div key={d.val} className="flex-1 text-center pt-2">
                        <span className="text-[8px] font-semibold text-slate-600 leading-tight block">{d.label}</span>
                    </div>
                ))}
            </div>
            {/* X-Axis Title: DAMPAK */}
            <div className="flex" style={{ marginLeft: 100, width: 'calc(100% - 100px)' }}>
                <div className="flex-1 text-center pt-1">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">DAMPAK</span>
                </div>
            </div>
        </div>
    );
}

const sampleRiskDescriptions = [
    "Penurunan Pasokan Uap Sumur Produksi Unit 1-4",
    "Penurunan Pasokan Uap Sumur Produksi Unit 5&6",
    "Kualitas Uap PLTP Unit 1-4 Tidak Memenuhi Persyaratan Kontrak",
    "Hambatan Kegiatan Sampling Fluida Field Lahendong",
    "Unplanned Shutdown & Dispatching PLTP Unit 1 milik PT PLN",
    "Kegagalan Operasi Turbine Generator Unit 1-4",
    "Penurunan EAF PLTP Unit 5&6 akibat Gangguan Kondenser",
    "Penurunan Flow Rate Fluid Geothermal di Field Lahendong",
    "Scaling Silica pada Pipanisasi Injeksi Air Terproduksi",
    "Korosi Pipanisasi Kondensat & Gas Removal System",
    "Keterlambatan Pengadaan Sparepart Major Overhaul",
    "Gangguan Sistem Kelistrikan Intern Substation 150kV",
    "Risiko Penurunan Pressurised Steam Header Unit 1",
    "Kerusakan Cooling Tower Cell akibat Bio-fouling",
    "Keterlambatan Inspeksi Bejana Tekan & Safety Valve",
    "Kenaikan Non-Condensable Gas (NCG) Sumur LHD-23",
    "Terhentinya Suplai Air Bersih Operasional PLTP",
    "Risiko Penurunan Kualitas Kondensat Masuk Re-injection",
    "Keterlambatan Calibrasi Instrumentasi Transducer",
    "Kerusakan Katup Utama Main Steam Isolation Valve (MSIV)",
    "Kebocoran Pipanisasi Brine Line Area Cluster 2",
    "Vibrasi High Level pada Main Steam Turbine Bearing",
    "Gangguan Suplai Listrik PLN untuk Auxiliary Equipment",
    "Keterlambatan Perizinan Lingkungan AMDAL/UKL-UPL Extension",
    "Risiko Kebakaran di Area Switchgear Substation",
    "Tumpahan Bahan Kimia Dosing Water Treatment",
    "Risiko Kecelakaan Kerja pada Heavy Lifting Crane Unit",
    "Keterlambatan Penyelesaian Pekerjaan Land Slide Protection",
    "Kerusakan Alat Berat Excavator & Bulldozer Operasional",
    "Keterlambatan Pelaporan Limbah B3 ke KLHK",
    "Risiko Penurunan Debit Sumur Re-injection LHD-17",
    "Gangguan Sistem Komunikasi Scada & Fiber Optic",
    "Risiko Kegagalan Tes Pressure Relief Valve",
    "Kecelakaan kerja yang bersumber dari kontraktor",
    "Terjadinya Trip pada Generator Transformer 50MVA",
    "Kebocoran Gasket Flange Line Main Steam Unit 3",
    "Kenaikan Temp Bearing Lubrication Oil Turbine",
    "Keterlambatan Pengiriman Chemical Scale Inhibitor",
    "Kegagalan Sistem Emergency Diesel Generator (EDG)",
    "Penurunan Efisiensi Demister Separator Unit 2",
    "Terjadi Siltation di Basin Catchment Area Sumur",
    "Keterlambatan Sertifikasi K3 Layak Operasi Equipment",
    "Risiko Erosi pada Piping Steam akibat Wet Steam",
    "Kerusakan Valve Actuator Steam Field Cluster 4",
    "Risiko Penurunan Suplai Air Pendingin Utama",
    "Kebocoran Silinder Hidrolik Valve Control Unit",
    "Risiko Kenaikan Vibration Level pada Pump Hotwell",
    "Gangguan Sistem Fire Protection & Sprinkler Field",
    "Keterlambatan Pengadaan Jasa Maintenance Vendor",
    "Kebocoran Heat Exchanger Lube Oil Cooler Unit 4",
    "Risiko Kegagalan Power Transformer 150kV Unit 5",
    "Terjadi Overheating pada Motor High Voltage 6.6kV",
    "Risiko Terhambatnya Mobilisasi Drilling Rig",
    "Kerusakan Panel Control PLC Turbine Unit 1",
    "Risiko Keterlambatan Kalibrasi Gas Detector",
    "Kebocoran Pipe Steam Venting Silencer",
    "Risiko Penurunan Kapasitas Air Handling Unit",
    "Terjadi Jamming pada Valve Butterfly Condenser",
    "Keterlambatan Pengiriman Filter Element Oil",
    "Risiko Kegagalan Battery Charger DC System 110V",
    "Kerusakan Mechanical Seal Pump Condensate",
    "Risiko Kenaikan Pressure Loss di Steam Header",
    "Terjadi Sparking pada Brush Carbon Generator",
    "Keterlambatan Re-certification Crane Overhead",
    "Risiko Kebocoran Tube Inter-condenser Vacuum System",
    "Gangguan Sistem Automatic Voltage Regulator (AVR)",
    "Risiko Penurunan Performance Gland Sealing System",
    "Terjadi Trips akibat Differential Protection Transformer",
    "Risiko Keterlambatan Pembayaran Kontrak SCM Vendor"
];

const initialRiskTableData = Array.from({ length: 69 }, (_, idx) => {
    const no = idx + 1;
    const padNo = String(no).padStart(3, '0');
    const kode = `LHD-OPS-260${padNo}`;

    const inhCell = findCellForRisk(no, defaultInherentMap);
    const resCell = findCellForRisk(no, defaultResidualMap);

    const probInherent = inhCell.prob;
    const dampakInherent = inhCell.dampak;
    const bobotInherent = probInherent * dampakInherent;

    const probResidual = resCell.prob;
    const dampakResidual = resCell.dampak;

    return {
        kode,
        no,
        deskripsi: sampleRiskDescriptions[idx] || `Kejadian Risiko Operasional #${no}`,
        akar: `1. Penurunan kriteria operasional / teknis\n2. Keterlambatan perawatan rutin unit #${no}\n3. Kondisi lingkungan / operasional eksternal`,
        probInherent,
        dampakInherent,
        bobotInherent,
        peringkatInherent: getRiskLevelInfo(probInherent, dampakInherent).label,
        strategi: 'MITIGATE',
        probResidual,
        dampakResidual,
        peringkatResidual: getRiskLevelInfo(probResidual, dampakResidual).label
    };
});

function buildMapDataFromTable(tableData, isResidual = false) {
    const result = [];
    for (let p = 5; p >= 1; p--) {
        for (let d = 1; d <= 5; d++) {
            const risks = tableData
                .filter(item => {
                    const prob = isResidual ? item.probResidual : item.probInherent;
                    const damp = isResidual ? item.dampakResidual : item.dampakInherent;
                    return Number(prob) === p && Number(damp) === d;
                })
                .map(item => item.no)
                .sort((a, b) => a - b);
            result.push({ prob: p, dampak: d, risks });
        }
    }
    return result;
}

function getPageNumbers(current, total) {
    if (total <= 5) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages = [];
    pages.push(1);
    if (current > 3) pages.push('...');

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
    }

    if (current < total - 2) pages.push('...');
    if (!pages.includes(total)) pages.push(total);

    return pages;
}

function RiskPieChartCard({ title, data, total }) {
    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <PieChartIcon className="w-4 h-4 text-pertamina-blue" />
                        {title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Sebaran kategori risiko dari total <span className="font-bold text-slate-800">{total} risiko</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 pt-4">
                {/* Pie Chart Canvas */}
                <div className="h-48 w-full relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={72}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                                ))}
                            </Pie>
                            <RechartsTooltip
                                formatter={(val, name) => [
                                    `${val} Risiko (${total > 0 ? ((val / total) * 100).toFixed(1) : 0}%)`,
                                    name
                                ]}
                                contentStyle={{ borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xl font-black text-slate-800 leading-none">{total}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Risiko</span>
                    </div>
                </div>

                {/* Legend list */}
                <div className="space-y-2">
                    {data.map((item) => {
                        const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0';
                        return (
                            <div key={item.name} className="flex items-center justify-between text-[11px] p-1.5 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="w-3 h-3 rounded-full shrink-0 shadow-xs border border-black/10" style={{ backgroundColor: item.color }} />
                                    <span className="font-semibold text-slate-700 truncate text-[11px]">{item.name}</span>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                    <span className="font-extrabold text-slate-800 text-[11.5px]">{item.value}</span>
                                    <span className="text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono">{pct}%</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function TabRiskRegister({ auth }) {
    const userRole = (auth?.user?.role || '').toLowerCase();
    const isAdmin = userRole.includes('admin');
    const [tableData, setTableData] = useState(() => {
        try {
            const saved = localStorage.getItem('pertamina_risk_register_data');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) return parsed;
            }
        } catch (e) {
            console.error('Failed to load risk data from localStorage', e);
        }
        return [];
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [gotoInput, setGotoInput] = useState('');
    const [highlightedNo, setHighlightedNo] = useState(null);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const tableRef = React.useRef(null);

    // Compute maps dynamically from current tableData state
    const inherentRisks = buildMapDataFromTable(tableData, false);
    const residualRisks = buildMapDataFromTable(tableData, true);

    const computePieData = (data, isResidual = false) => {
        const counts = {
            'Low Risk': 0,
            'Low to Moderate Risk': 0,
            'Moderate Risk': 0,
            'Moderate to High Risk': 0,
            'High Risk': 0
        };

        data.forEach(item => {
            let rank = isResidual ? item.peringkatResidual : item.peringkatInherent;
            rank = String(rank || '').toUpperCase().trim();

            if (rank.includes('LOW RISK') && !rank.includes('MODERATE')) {
                counts['Low Risk']++;
            } else if (rank.includes('LOW TO MODERATE') || rank.includes('LOW-TO-MODERATE')) {
                counts['Low to Moderate Risk']++;
            } else if (rank.includes('MODERATE TO HIGH') || rank.includes('MODERATE-TO-HIGH')) {
                counts['Moderate to High Risk']++;
            } else if (rank.includes('MODERATE RISK') || rank === 'MODERATE') {
                counts['Moderate Risk']++;
            } else if (rank.includes('HIGH RISK') || rank === 'HIGH') {
                counts['High Risk']++;
            } else {
                const prob = isResidual ? item.probResidual : item.probInherent;
                const damp = isResidual ? item.dampakResidual : item.dampakInherent;
                const level = getRiskLevelInfo(prob, damp).label;
                if (counts[level] !== undefined) counts[level]++;
                else counts['Low Risk']++;
            }
        });

        return [
            { name: 'Low Risk', value: counts['Low Risk'], color: '#009944' },
            { name: 'Low to Moderate Risk', value: counts['Low to Moderate Risk'], color: '#99cc33' },
            { name: 'Moderate Risk', value: counts['Moderate Risk'], color: '#eab308' },
            { name: 'Moderate to High Risk', value: counts['Moderate to High Risk'], color: '#ff9900' },
            { name: 'High Risk', value: counts['High Risk'], color: '#ff0000' },
        ];
    };

    const inherentPieData = computePieData(tableData, false);
    const residualPieData = computePieData(tableData, true);

    const filteredData = tableData.filter(item =>
        String(item.no).includes(searchTerm) ||
        item.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.akar.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    // Handle clicking a risk bubble circle in either map
    const handleSelectRisk = (riskNo) => {
        const targetNo = Number(riskNo);
        let index = filteredData.findIndex(item => Number(item.no) === targetNo);
        if (index === -1 && searchTerm) {
            setSearchTerm('');
            index = tableData.findIndex(item => Number(item.no) === targetNo);
        }

        if (index !== -1) {
            const targetPage = Math.floor(index / itemsPerPage) + 1;
            setCurrentPage(targetPage);
            setHighlightedNo(targetNo);

            if (tableRef.current) {
                tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            setTimeout(() => {
                setHighlightedNo(null);
            }, 3500);
        }
    };

    const handleGoToPage = () => {
        const pageNum = parseInt(gotoInput, 10);
        if (pageNum >= 1 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
            setGotoInput('');
        } else {
            alert(`Silakan masukkan nomor halaman antara 1 hingga ${totalPages}`);
        }
    };

    const handleClearData = () => {
        setTableData([]);
        setCurrentPage(1);
        setSearchTerm('');
        setHighlightedNo(null);
        setShowClearConfirm(false);
        try {
            localStorage.removeItem('pertamina_risk_register_data');
        } catch (e) {
            console.error('Failed to clear risk data from localStorage', e);
        }
    };

    const handleExcelUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const data = new Uint8Array(evt.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

                // Read raw 2D array from sheet
                const rawRows = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });
                if (!rawRows || rawRows.length === 0) {
                    alert('File Excel kosong.');
                    return;
                }

                // Locate main header row index
                let headerRowIdx = rawRows.findIndex(row =>
                    Array.isArray(row) && row.some(cell => {
                        const c = String(cell).toLowerCase().replace(/[^a-z0-9]/g, '');
                        return c.includes('kode') || c.includes('deskripsi') || c.includes('kejadian') || c.includes('peristiwa') || c.includes('probabilitas') || c.includes('dampak');
                    })
                );

                if (headerRowIdx === -1) headerRowIdx = 0;

                const hRow1 = rawRows[headerRowIdx] || [];
                const hRow2 = rawRows[headerRowIdx + 1] || [];
                const maxCols = Math.max(hRow1.length, hRow2.length);

                let kodeColIdx = -1;
                let noColIdx = -1;
                let deskColIdx = -1;
                let akarColIdx = -1;
                let strategiColIdx = -1;
                let probInhColIdx = -1;
                let dampInhColIdx = -1;
                let bobotInhColIdx = -1;
                let peringkatInhColIdx = -1;
                let probResColIdx = -1;
                let dampResColIdx = -1;
                let peringkatResColIdx = -1;

                // Scan columns dynamically by scanning header text
                for (let c = 0; c < maxCols; c++) {
                    const cell1 = String(hRow1[c] || '').trim().toLowerCase();
                    const cell2 = String(hRow2[c] || '').trim().toLowerCase();
                    const fullText = (cell1 + ' ' + cell2).replace(/[^a-z0-9]/g, '');

                    const isRes = fullText.includes('residual') || fullText.includes('res');

                    if (fullText.includes('kode')) {
                        kodeColIdx = c;
                    } else if (fullText.includes('no') || fullText.includes('nomor')) {
                        if (noColIdx === -1) noColIdx = c;
                    } else if (fullText.includes('deskripsi') || fullText.includes('kejadian') || fullText.includes('peristiwa') || fullText.includes('namarisiko') || fullText.includes('description') || fullText.includes('event')) {
                        deskColIdx = c;
                    } else if (fullText.includes('akar') || fullText.includes('penyebab') || fullText.includes('rootcause')) {
                        akarColIdx = c;
                    } else if (fullText.includes('strategi') || fullText.includes('mitigasi') || fullText.includes('response')) {
                        strategiColIdx = c;
                    } else if (fullText.includes('bobot') || fullText.includes('weight') || fullText.includes('score')) {
                        if (bobotInhColIdx === -1) bobotInhColIdx = c;
                    } else if (isRes) {
                        if (fullText.includes('prob') || fullText.includes('pinherent') || fullText.includes('presidual') || fullText === 'p') {
                            probResColIdx = c;
                        } else if (fullText.includes('dampak') || fullText.includes('iresidual') || fullText.includes('impact') || fullText === 'i') {
                            dampResColIdx = c;
                        } else if (fullText.includes('peringkat') || fullText.includes('level') || fullText.includes('risk')) {
                            peringkatResColIdx = c;
                        }
                    } else {
                        if (fullText.includes('probabilitas') || fullText.includes('pinherent') || (fullText.includes('prob') && !fullText.includes('peringkat')) || fullText === 'p') {
                            if (probInhColIdx === -1) probInhColIdx = c;
                            else if (probResColIdx === -1) probResColIdx = c;
                        } else if (fullText.includes('dampak') || fullText.includes('iinherent') || (fullText.includes('impact') && !fullText.includes('peringkat')) || fullText === 'i') {
                            if (dampInhColIdx === -1) dampInhColIdx = c;
                            else if (dampResColIdx === -1) dampResColIdx = c;
                        } else if (fullText.includes('peringkat')) {
                            if (peringkatInhColIdx === -1) peringkatInhColIdx = c;
                            else if (peringkatResColIdx === -1) peringkatResColIdx = c;
                        }
                    }
                }

                // Fallback for standard Pertamina Risk Register Excel layout (K=10, M=12, AA=26, AB=27)
                if (probInhColIdx === -1 && maxCols > 10) probInhColIdx = 10;
                if (dampInhColIdx === -1 && maxCols > 12) dampInhColIdx = 12;
                if (probResColIdx === -1 && maxCols > 26) probResColIdx = 26;
                if (dampResColIdx === -1 && maxCols > 27) dampResColIdx = 27;

                // Determine start row of data
                let dataStartRow = headerRowIdx + 1;
                const rowAfterHeader = rawRows[headerRowIdx + 1];
                if (Array.isArray(rowAfterHeader)) {
                    const isSubHeader = rowAfterHeader.some(cell => {
                        const val = String(cell || '').trim().toLowerCase();
                        return val === 'p' || val === 'i' || val === 'w' || val === 'prob' || val === 'dampak' || val === 'probabilitas' || val === 'inherent' || val === 'residual';
                    });
                    if (isSubHeader) {
                        dataStartRow = headerRowIdx + 2;
                    }
                }

                const mapped = [];

                for (let r = dataStartRow; r < rawRows.length; r++) {
                    const row = rawRows[r];
                    if (!Array.isArray(row)) continue;

                    const rawDesk = deskColIdx !== -1 ? String(row[deskColIdx] || '').trim() : '';
                    const rawKode = kodeColIdx !== -1 ? String(row[kodeColIdx] || '').trim() : '';
                    const rawNo = noColIdx !== -1 ? row[noColIdx] : null;

                    // STRICT FILTER: Skip empty/dummy/footer rows!
                    if (!rawDesk && !rawKode && (rawNo === null || rawNo === '' || isNaN(parseInt(rawNo, 10)))) {
                        continue;
                    }
                    const lowerDesk = rawDesk.toLowerCase();
                    if (lowerDesk.startsWith('catatan') || lowerDesk.startsWith('disetujui') || lowerDesk.startsWith('total') || lowerDesk.startsWith('laporan')) {
                        continue;
                    }

                    const no = (rawNo !== null && !isNaN(parseInt(rawNo, 10))) ? parseInt(rawNo, 10) : (mapped.length + 1);
                    const kode = rawKode || `LHD-OPS-260${String(no).padStart(3, '0')}`;
                    const deskripsi = rawDesk || `Kejadian Risiko Operasional #${no}`;
                    const akar = akarColIdx !== -1 ? String(row[akarColIdx] || '-').trim() : '-';

                    let probInherent = probInhColIdx !== -1 ? extractFirstDigit(row[probInhColIdx]) : NaN;
                    let dampakInherent = dampInhColIdx !== -1 ? extractFirstDigit(row[dampInhColIdx]) : NaN;
                    let pInhText = peringkatInhColIdx !== -1 ? String(row[peringkatInhColIdx] || '').trim() : '';

                    if (isNaN(probInherent) || probInherent < 1 || probInherent > 5 || isNaN(dampakInherent) || dampakInherent < 1 || dampakInherent > 5) {
                        const parsed = parseLevelFromText(pInhText);
                        probInherent = parsed.prob;
                        dampakInherent = parsed.dampak;
                    }

                    const bobotInherent = (bobotInhColIdx !== -1 && !isNaN(parseInt(row[bobotInhColIdx], 10)))
                        ? parseInt(row[bobotInhColIdx], 10)
                        : (probInherent * dampakInherent);

                    const peringkatInherent = pInhText || getRiskLevelInfo(probInherent, dampakInherent).label;
                    const strategi = strategiColIdx !== -1 ? String(row[strategiColIdx] || 'MITIGATE').trim() : 'MITIGATE';

                    let probResidual = probResColIdx !== -1 ? extractFirstDigit(row[probResColIdx]) : NaN;
                    let dampakResidual = dampResColIdx !== -1 ? extractFirstDigit(row[dampResColIdx]) : NaN;
                    let pResText = peringkatResColIdx !== -1 ? String(row[peringkatResColIdx] || '').trim() : '';

                    if (isNaN(probResidual) || probResidual < 1 || probResidual > 5 || isNaN(dampakResidual) || dampakResidual < 1 || dampakResidual > 5) {
                        const derived = deriveResidualPI(pResText, probInherent, dampakInherent);
                        probResidual = derived.prob;
                        dampakResidual = derived.dampak;
                    }

                    const peringkatResidual = pResText || getRiskLevelInfo(probResidual, dampakResidual).label;

                    mapped.push({
                        kode,
                        no,
                        deskripsi,
                        akar,
                        probInherent,
                        dampakInherent,
                        bobotInherent,
                        peringkatInherent,
                        strategi,
                        probResidual,
                        dampakResidual,
                        peringkatResidual
                    });
                }

                if (mapped.length > 0) {
                    setTableData(mapped);
                    try {
                        localStorage.setItem('pertamina_risk_register_data', JSON.stringify(mapped));
                    } catch (e) {
                        console.error('Failed to save risk data to localStorage', e);
                    }
                    setCurrentPage(1);
                    setSearchTerm('');
                    setHighlightedNo(null);
                    alert(`Berhasil mengimpor ${mapped.length} data Risk Register dari Excel! Data telah tersimpan secara permanen.`);
                } else {
                    alert('Tidak dapat menemukan data risiko yang valid dari file Excel ini.');
                }
            } catch (err) {
                console.error('Failed to parse excel file', err);
                alert('Gagal membaca file Excel. Pastikan format file .xlsx / .xls valid.');
            }
        };
        reader.readAsArrayBuffer(file);
    };



    return (
        <>
        <div className="space-y-6">
            {/* PETA RISIKO MAPS */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Inherent Risk Map */}
                    <div className="flex-1 min-w-0">
                        <RiskMapGrid riskData={inherentRisks} title="Peta Risiko — Inherent" onSelectRisk={handleSelectRisk} />
                    </div>

                    {/* Residual Risk Map */}
                    <div className="flex-1 min-w-0">
                        <RiskMapGrid riskData={residualRisks} title="Peta Risiko — Residual" onSelectRisk={handleSelectRisk} />
                    </div>
                </div>

                {/* Shared Legend */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 mb-2">Keterangan Matriks Risiko:</p>
                            <div className="flex flex-wrap gap-x-6 gap-y-2">
                                {[
                                    { color: '#009944', label: 'Low Risk' },
                                    { color: '#99cc33', label: 'Low to Moderate Risk' },
                                    { color: '#ffff00', label: 'Moderate Risk' },
                                    { color: '#ff9900', label: 'Moderate to High Risk' },
                                    { color: '#ff0000', label: 'High Risk' },
                                ].map(l => (
                                    <div key={l.label} className="flex items-center gap-2">
                                        <div className="w-7 h-3.5 rounded shrink-0 border border-black/10" style={{ backgroundColor: l.color }} />
                                        <span className="text-[10px] text-slate-700 font-bold">{l.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-3 py-1.5 rounded-xl border border-blue-100 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                            Klik bulatan nomor pada peta untuk navigasi langsung ke baris tabel
                        </div>
                    </div>
                </div>
            </div>

            {/* DIAGRAM PIE / PROPORSI PERINGKAT RISIKO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RiskPieChartCard
                    title="Proporsi Peringkat Risiko — Inherent"
                    data={inherentPieData}
                    total={tableData.length}
                />
                <RiskPieChartCard
                    title="Proporsi Peringkat Risiko — Residual"
                    data={residualPieData}
                    total={tableData.length}
                />
            </div>

            {/* DETAIL RISK REGISTER TABLE & EXCEL UPLOAD */}
            <div ref={tableRef} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
                    <div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            <FileSpreadsheet className="w-4 h-4 text-pertamina-blue" />
                            Detail Data Risk Register ({tableData.length} Risiko)
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            Daftar rincian risiko PGE Area Lahendong beserta mitigasi & peringkat risiko residual.
                        </p>
                    </div>

                    {/* Upload & Action Controls */}
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Cari risiko / kode..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-44"
                            />
                        </div>

                        <label className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3.5 py-1.5 rounded-xl text-[11px] font-bold shadow-xs cursor-pointer transition-all active:scale-95">
                            <UploadCloud className="w-3.5 h-3.5" /> Upload Excel (.xlsx)
                            <input
                                type="file"
                                accept=".xlsx, .xls, .csv"
                                onChange={handleExcelUpload}
                                className="hidden"
                            />
                        </label>

                        {tableData.length > 0 && (
                            <button
                                onClick={() => setShowClearConfirm(true)}
                                className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer active:scale-95"
                                title="Hapus seluruh data Risk Register"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> Hapus Semua Data
                            </button>
                        )}
                    </div>
                </div>

                {/* TABLE CONTAINER */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-left text-[11px] border-collapse">
                        <thead>
                            <tr className="bg-slate-100/80 text-slate-700 font-extrabold border-b border-slate-200 uppercase tracking-tight text-[10px]">
                                <th className="p-3 border-r border-slate-200 text-center w-28">Kode Risiko</th>
                                <th className="p-3 border-r border-slate-200 text-center w-10">No</th>
                                <th className="p-3 border-r border-slate-200 min-w-[200px]">Deskripsi atau Kejadian Risiko</th>
                                <th className="p-3 border-r border-slate-200 min-w-[220px]">Akar Penyebab</th>
                                <th className="p-3 border-r border-slate-200 text-center w-14">Prob (P)</th>
                                <th className="p-3 border-r border-slate-200 text-center w-14">Dampak (I)</th>
                                <th className="p-3 border-r border-slate-200 text-center w-16">Bobot (W)</th>
                                <th className="p-3 border-r border-slate-200 text-center min-w-[140px]">Peringkat Risiko Inherent</th>
                                <th className="p-3 border-r border-slate-200 text-center w-24">Strategi</th>
                                <th className="p-3 text-center min-w-[140px]">Peringkat Risiko Residual</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 font-medium text-slate-800 bg-white">
                            {paginatedData.length > 0 ? (
                                paginatedData.map((item) => {
                                    const isHighlighted = Number(item.no) === Number(highlightedNo);
                                    return (
                                        <tr
                                            key={item.kode}
                                            className={`transition-all duration-300 ${
                                                isHighlighted
                                                    ? 'bg-blue-100/90 ring-2 ring-blue-500 font-extrabold text-blue-900 shadow-md scale-[1.002]'
                                                    : 'hover:bg-slate-50/80'
                                            }`}
                                        >
                                            <td className="p-3 border-r border-slate-200 font-bold text-slate-700 text-center font-mono">{item.kode}</td>
                                            <td className="p-3 border-r border-slate-200 text-center font-bold">
                                                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black ${
                                                    isHighlighted ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                    {item.no}
                                                </span>
                                            </td>
                                            <td className="p-3 border-r border-slate-200 font-semibold">{item.deskripsi}</td>
                                            <td className="p-3 border-r border-slate-200 whitespace-pre-line text-[10.5px] leading-relaxed text-slate-600">{item.akar}</td>
                                            <td className="p-3 border-r border-slate-200 text-center font-bold">{item.probInherent}</td>
                                            <td className="p-3 border-r border-slate-200 text-center font-bold">{item.dampakInherent}</td>
                                            <td className="p-3 border-r border-slate-200 text-center font-extrabold text-blue-700">{item.bobotInherent}</td>
                                            <td className={getBadgeTdStyle(item.peringkatInherent)}>
                                                {item.peringkatInherent}
                                            </td>
                                            <td className="p-3 border-r border-slate-200 text-center font-extrabold text-slate-700">{item.strategi}</td>
                                            <td className={getBadgeTdStyle(item.peringkatResidual).replace('border-r', '')}>
                                                {item.peringkatResidual}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={10} className="p-10 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                                                <FileSpreadsheet className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-700">Belum Ada Data Risk Register</p>
                                                <p className="text-[11px] text-slate-400 mt-0.5">Silakan unggah file Excel (.xlsx) untuk menampilkan data & Peta Risiko.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION CONTROLS */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-3">
                    <div className="text-[11px] text-slate-500 font-semibold">
                        Menampilkan <span className="font-bold text-slate-800">{filteredData.length > 0 ? startIndex + 1 : 0}</span> - <span className="font-bold text-slate-800">{Math.min(startIndex + itemsPerPage, filteredData.length)}</span> dari <span className="font-bold text-slate-800">{filteredData.length}</span> data
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Prev Button */}
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer disabled:cursor-not-allowed"
                            title="Halaman Sebelumnya"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">
                            {getPageNumbers(currentPage, totalPages).map((p, idx) => (
                                p === '...' ? (
                                    <span key={`dots-${idx}`} className="px-1.5 text-slate-400 font-bold text-xs">...</span>
                                ) : (
                                    <button
                                        key={`page-${p}`}
                                        onClick={() => setCurrentPage(p)}
                                        className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                            currentPage === p
                                                ? 'bg-pertamina-blue text-white shadow-xs'
                                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                )
                            ))}
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer disabled:cursor-not-allowed"
                            title="Halaman Berikutnya"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>

                        {/* Jump Input & Go Button */}
                        <div className="flex items-center gap-1.5 ml-2">
                            <input
                                type="number"
                                min="1"
                                max={totalPages}
                                placeholder=""
                                value={gotoInput}
                                onChange={(e) => setGotoInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleGoToPage()}
                                className="w-14 h-8 px-2 border border-slate-200 bg-slate-50 rounded-xl text-center text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                            <button
                                onClick={handleGoToPage}
                                className="h-8 bg-pertamina-blue hover:bg-blue-800 text-white px-3.5 rounded-xl text-xs font-extrabold flex items-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer"
                            >
                                <CornerDownLeft className="w-3.5 h-3.5" /> Go
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* CLEAR DATA CONFIRMATION MODAL */}
        {showClearConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-[fadeIn_0.15s_ease-in-out]">
                <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-sm mx-4 p-6 space-y-4">
                    <div className="flex flex-col items-center text-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">
                            <Trash2 className="w-7 h-7 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-slate-800">Hapus Semua Data?</h3>
                            <p className="text-[12px] text-slate-500 font-medium mt-1 leading-relaxed">
                                Seluruh <span className="font-bold text-slate-700">{tableData.length} data Risk Register</span> akan dihapus secara permanen dan tidak dapat dikembalikan. Peta Risiko akan kosong setelahnya.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => setShowClearConfirm(false)}
                            className="flex-1 py-2.5 rounded-2xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleClearData}
                            className="flex-1 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                        >
                            <Trash2 className="w-3.5 h-3.5" /> Ya, Hapus Semua
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}

/* ─── Main Dashboard ─── */
export default function MainDashboard(props) {
    const { scmList, budgetDetailsList } = props;

    const [activeSubTab, setActiveSubTab] = useState('operasi');
    const [selectedChart, setSelectedChart] = useState(null);
    const [isChartModalOpen, setIsChartModalOpen] = useState(false);

    const totalScmContracts = scmList.length;
    const totalScmValue = scmList.reduce((acc, c) => acc + c.nilai, 0);
    const totalBudget = budgetDetailsList.reduce((acc, b) => acc + b.budget, 0);
    const totalActual = budgetDetailsList.reduce((acc, b) => acc + b.actual, 0);

    const formatShortCurrency = (val) => {
        if (val >= 1000000000) return `Rp ${(val / 1000000000).toFixed(1)} M`;
        if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(1)} Jt`;
        return `Rp ${val}`;
    };

    // Configuration Registry for Clickable Detail Modal
    const chartConfigs = {
        'produksi-gwh': {
            id: 'produksi-gwh',
            title: 'Produksi (GWh)',
            subtitle: 'Trend produksi tahunan Area Lahendong 2018–2026 (forecast)',
            type: 'line',
            xAxisKey: 'tahun',
            timeType: 'year',
            yAxisDomain: [0, 200],
            series: [
                { key: 'nilai', label: 'Produksi', color: PERTAMINA_BLUE, unit: 'GWh' }
            ],
            rawData: produksiGwh
        },
        'realisasi-produksi-2025': {
            id: 'realisasi-produksi-2025',
            title: 'Realisasi Produksi 2025 (GWh)',
            subtitle: 'RKAP vs Realisasi bulanan & kumulatif — Total: 109,63 GWh',
            type: 'composed',
            xAxisKey: 'bulan',
            timeType: 'month',
            yAxisIdLeft: 'left',
            yAxisIdRight: 'right',
            series: [
                { key: 'rkap', label: 'RKAP', color: '#93c5fd', type: 'bar', yAxisId: 'left', unit: 'GWh' },
                { key: 'realisasi', label: 'Realisasi', color: PERTAMINA_GREEN, type: 'bar', yAxisId: 'left', unit: 'GWh' },
                { key: 'kumRkap', label: 'Kum. RKAP', color: PERTAMINA_BLUE, type: 'line', yAxisId: 'right', unit: 'GWh' },
                { key: 'kumReal', label: 'Kum. Realisasi', color: '#16a34a', type: 'line', yAxisId: 'right', unit: 'GWh' }
            ],
            rawData: realisasiProduksi2025
        },
        'eaf': {
            id: 'eaf',
            title: 'EAF (%)',
            subtitle: 'Equivalent Availability Factor — Higher is better',
            type: 'line',
            xAxisKey: 'tahun',
            timeType: 'year',
            yAxisDomain: [80, 100],
            series: [
                { key: 'nilai', label: 'EAF', color: PERTAMINA_GREEN, unit: '%' }
            ],
            rawData: eafData
        },
        'mtbf': {
            id: 'mtbf',
            title: 'MTBF (Day)',
            subtitle: 'Mean Time Between Failures',
            type: 'line',
            xAxisKey: 'tahun',
            timeType: 'year',
            series: [
                { key: 'nilai', label: 'MTBF', color: PERTAMINA_BLUE, unit: 'hari' }
            ],
            rawData: mtbfData
        },
        'efor': {
            id: 'efor',
            title: 'EFOR (%)',
            subtitle: 'Equivalent Forced Outage Rate — Lower is better',
            type: 'line',
            xAxisKey: 'tahun',
            timeType: 'year',
            yAxisDomain: [0, 10],
            series: [
                { key: 'nilai', label: 'EFOR', color: PERTAMINA_YELLOW, unit: '%' }
            ],
            rawData: eforData
        },
        'mttr': {
            id: 'mttr',
            title: 'MTTR (Hour)',
            subtitle: 'Mean Time To Repair — Lower is better',
            type: 'line',
            xAxisKey: 'tahun',
            timeType: 'year',
            series: [
                { key: 'nilai', label: 'MTTR', color: PERTAMINA_RED, unit: 'jam' }
            ],
            rawData: mttrData
        },
        'financial-trend': {
            id: 'financial-trend',
            title: 'Revenue, Cost & Profit/Loss (Juta USD)',
            subtitle: 'Trend finansial tahunan Area Lahendong',
            type: 'line',
            xAxisKey: 'tahun',
            timeType: 'year',
            series: [
                { key: 'revenue', label: 'Revenue', color: PERTAMINA_BLUE, unit: 'Juta USD' },
                { key: 'cost', label: 'Cost', color: PERTAMINA_GREEN, unit: 'Juta USD' },
                { key: 'depreciation', label: 'Depreciation', color: PERTAMINA_YELLOW, unit: 'Juta USD' },
                { key: 'profitLoss', label: 'Profit/Loss Net', color: '#94a3b8', unit: 'Juta USD' }
            ],
            rawData: financialTrend
        },
        'production-cost-scatter': {
            id: 'production-cost-scatter',
            title: 'Production vs Cost per kWh',
            subtitle: 'Korelasi produksi (GWh) dan biaya per kWh (cent USD)',
            type: 'composed',
            xAxisKey: 'costKwh',
            timeType: 'other',
            series: [
                { key: 'produksi', label: 'Produksi', color: PERTAMINA_BLUE, type: 'line', unit: 'GWh' }
            ],
            rawData: productionCostScatter
        },
        'cost-kwh': {
            id: 'cost-kwh',
            title: 'Cost/kWh (cent USD)',
            subtitle: 'Biaya produksi per kWh — 2025: 20,23 cent USD',
            type: 'line',
            xAxisKey: 'tahun',
            timeType: 'year',
            yAxisDomain: [5, 26],
            series: [
                { key: 'nilai', label: 'Cost/kWh', color: PERTAMINA_BLUE, unit: 'cent USD' }
            ],
            rawData: costKwhData
        },
        'ebitda': {
            id: 'ebitda',
            title: 'EBITDA (Juta USD)',
            subtitle: 'Earnings Before Interest, Taxes, Depreciation & Amortization',
            type: 'area',
            xAxisKey: 'tahun',
            timeType: 'year',
            series: [
                { key: 'nilai', label: 'EBITDA', color: PERTAMINA_BLUE, unit: 'Juta USD' }
            ],
            rawData: ebitdaData
        }
    };

    const handleChartClick = (chartId) => {
        setSelectedChart(chartConfigs[chartId]);
        setIsChartModalOpen(true);
    };

    const tabs = [
        { id: 'operasi', label: 'Kinerja Operasi & Reliability', icon: Activity },
        { id: 'financial', label: 'Financial Performance', icon: DollarSign },
        { id: 'risk', label: 'Risk Register', icon: Shield },
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-[fadeIn_0.3s_ease-in-out] font-sans text-slate-800">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-800 p-6 rounded-3xl shadow-md text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-15">
                    <Shield className="w-64 h-64 text-white" />
                </div>
                <div className="z-10">
                    <h2 className="text-xl font-black tracking-tight leading-none">Selamat Datang di Executive Dashboard</h2>
                    <p className="text-blue-100 text-xs mt-2 font-semibold">Monitor kinerja operasi, finansial, dan realisasi anggaran PGE Area Lahendong.</p>
                </div>
                <div className="z-10 bg-white/10 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-xs text-xs font-bold whitespace-nowrap">
                    Periode Laporan: Tahun 2026
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <KpiCard title="Produksi 2025" value="109,63 GWh" subtitle="Realisasi produksi tahunan" icon={Zap} colorClass="text-blue-600" bgClass="bg-blue-50" />
                <KpiCard title="Total Plafon Budget" value={formatShortCurrency(totalBudget)} subtitle={`Realisasi: ${formatShortCurrency(totalActual)}`} icon={Calculator} colorClass="text-green-600" bgClass="bg-green-50" />
                <KpiCard title="EAF 2025" value="94,61%" subtitle="Equivalent Availability Factor" icon={TrendingUp} colorClass="text-indigo-600" bgClass="bg-indigo-50" />
            </div>

            {/* Sub-tab Navigation */}
            <div className="flex flex-wrap border-b border-slate-200 bg-white p-2 rounded-2xl border shadow-2xs gap-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSubTab(tab.id)}
                            className={`flex-1 min-w-[180px] py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                activeSubTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            {activeSubTab === 'operasi' && <TabOperasi onChartClick={handleChartClick} />}
            {activeSubTab === 'financial' && <TabFinancial onChartClick={handleChartClick} />}
            {activeSubTab === 'risk' && <TabRiskRegister auth={props.auth} />}

            {/* Premium Chart Detail Modal */}
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
