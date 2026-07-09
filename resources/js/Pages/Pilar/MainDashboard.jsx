import React, { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer, LineChart, Line, Legend, ComposedChart, Area,
} from 'recharts';
import {
    FileSignature, Calculator, Shield,
    Activity, DollarSign, PieChart as PieChartIcon, Zap, TrendingUp,
} from 'lucide-react';
import KpiCard from '../../Components/KpiCard';

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

/* ─── Dummy Data: Realisasi ABO ─── */
const aboYearly = [
    { tahun: '2019', rkap: 28.5, actual: 26.0, variance: -8.78 },
    { tahun: '2020', rkap: 30.2, actual: 24.2, variance: -19.99 },
    { tahun: '2021', rkap: 31.8, actual: 28.5, variance: -10.38 },
    { tahun: '2022', rkap: 33.5, actual: 31.2, variance: -6.87 },
    { tahun: '2023', rkap: 35.0, actual: 33.8, variance: -3.43 },
    { tahun: '2024', rkap: 36.5, actual: 35.2, variance: -3.56 },
    { tahun: '2025', rkap: 38.0, actual: 37.5, variance: -1.32 },
    { tahun: '2026', rkap: 39.5, actual: 38.8, variance: -1.77 },
];

const aboKumulatif2026 = [
    { bulan: '1', rkap: 3.2, realisasi: 3.0 },
    { bulan: '2', rkap: 6.5, realisasi: 6.2 },
    { bulan: '3', rkap: 9.8, realisasi: 9.5 },
    { bulan: '4', rkap: 13.2, realisasi: 12.8 },
    { bulan: '5', rkap: 16.5, realisasi: 16.0 },
    { bulan: '6', rkap: 19.8, realisasi: 19.2 },
    { bulan: '7', rkap: 23.2, realisasi: 22.5 },
    { bulan: '8', rkap: 26.5, realisasi: 25.8 },
    { bulan: '9', rkap: 29.8, realisasi: 29.0 },
    { bulan: '10', rkap: 33.2, realisasi: 32.2 },
    { bulan: '11', rkap: 36.5, realisasi: 35.5 },
    { bulan: '12', rkap: 39.5, realisasi: 38.8 },
];

const aboMonthly2026 = [
    { bulan: '1', rkap: 3.2, realisasi: 3.0 },
    { bulan: '2', rkap: 3.3, realisasi: 3.2 },
    { bulan: '3', rkap: 3.3, realisasi: 3.3 },
    { bulan: '4', rkap: 3.4, realisasi: 3.3 },
    { bulan: '5', rkap: 3.3, realisasi: 3.2 },
    { bulan: '6', rkap: 3.3, realisasi: 3.2 },
    { bulan: '7', rkap: 3.4, realisasi: 3.3 },
    { bulan: '8', rkap: 3.3, realisasi: 3.3 },
    { bulan: '9', rkap: 3.3, realisasi: 3.2 },
    { bulan: '10', rkap: 3.4, realisasi: 3.2 },
    { bulan: '11', rkap: 3.3, realisasi: 3.3 },
    { bulan: '12', rkap: 3.0, realisasi: 3.3 },
];

const aboPerFungsi = [
    { fungsi: 'Operation', budget: 12.5, actual: 12.4, variance: -0.8 },
    { fungsi: 'Maintenance', budget: 10.2, actual: 10.1, variance: -1.0 },
    { fungsi: 'GM', budget: 5.8, actual: 5.7, variance: -1.7 },
    { fungsi: 'HSSE', budget: 4.5, actual: 4.5, variance: 0.0 },
    { fungsi: 'Bus. Support', budget: 6.5, actual: 6.1, variance: -6.2 },
];

const PERTAMINA_BLUE = '#00529C';
const PERTAMINA_GREEN = '#8DC63F';
const PERTAMINA_YELLOW = '#F59E0B';
const PERTAMINA_RED = '#E52B2D';

function ChartCard({ title, subtitle, children, className = '' }) {
    return (
        <div className={`bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col ${className}`}>
            <div className="mb-3">
                <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
                {subtitle && <p className="text-[10px] text-slate-400 font-bold mt-0.5">{subtitle}</p>}
            </div>
            <div className="flex-1 w-full min-h-0 text-[10px]">{children}</div>
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
function TabOperasi() {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ChartCard title="Produksi (GWh)" subtitle="Trend produksi tahunan Area Lahendong 2018–2026 (forecast)" className="h-72">
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

                <ChartCard title="Realisasi Produksi 2025 (GWh)" subtitle="RKAP vs Realisasi bulanan & kumulatif — Total: 109,63 GWh" className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={realisasiProduksi2025} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
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
                        </ComposedChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <ChartCard title="EAF (%)" subtitle="Equivalent Availability Factor — Higher is better" className="h-56">
                    <ReliabilityLineChart data={eafData} dataKey="nilai" unit="%" color={PERTAMINA_GREEN} domain={[80, 100]} />
                </ChartCard>
                <ChartCard title="MTBF (Day)" subtitle="Mean Time Between Failures" className="h-56">
                    <ReliabilityLineChart data={mtbfData} dataKey="nilai" unit="hari" color={PERTAMINA_BLUE} />
                </ChartCard>
                <ChartCard title="EFOR (%)" subtitle="Equivalent Forced Outage Rate — Lower is better" className="h-56">
                    <ReliabilityLineChart data={eforData} dataKey="nilai" unit="%" color={PERTAMINA_YELLOW} domain={[0, 10]} />
                </ChartCard>
                <ChartCard title="MTTR (Hour)" subtitle="Mean Time To Repair — Lower is better" className="h-56">
                    <ReliabilityLineChart data={mttrData} dataKey="nilai" unit="jam" color={PERTAMINA_RED} />
                </ChartCard>
            </div>
        </div>
    );
}

/* ─── Tab: Financial Performance ─── */
function TabFinancial() {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ChartCard title="Revenue, Cost & Profit/Loss (Juta USD)" subtitle="Trend finansial tahunan Area Lahendong" className="h-80">
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

                <ChartCard title="Production vs Cost per kWh" subtitle="Korelasi produksi (GWh) dan biaya per kWh (cent USD)" className="h-80">
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
                <ChartCard title="Cost/kWh (cent USD)" subtitle="Biaya produksi per kWh — 2025: 20,23 cent USD" className="h-64">
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

                <ChartCard title="EBITDA (Juta USD)" subtitle="Earnings Before Interest, Taxes, Depreciation & Amortization" className="h-64">
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

/* ─── Tab: Realisasi ABO ─── */
function TabAbo() {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ChartCard title="ABO 2019 – 2026 (USD Juta)" subtitle="Perbandingan RKAP vs Actual — Kenaikan anggaran ABO Area Lahendong" className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={aboYearly} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="tahun" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                            <RechartsTooltip formatter={(v, name) => [`${v} Juta USD`, name]} />
                            <Legend wrapperStyle={{ fontSize: 9 }} />
                            <Bar dataKey="rkap" name="RKAP (USD)" fill="#93c5fd" radius={[3, 3, 0, 0]} />
                            <Bar dataKey="actual" name="Actual (USD)" fill={PERTAMINA_GREEN} radius={[3, 3, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Actual ABO Area Lahendong 2026 — Kumulatif" subtitle="Serapan anggaran kumulatif RKAP vs Realisasi (IDR Miliar)" className="h-72">
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
                <ChartCard title="Actual ABO Area Lahendong 2026 — Monthly" subtitle="Realisasi bulanan RKAP vs Actual (IDR Miliar)" className="h-64">
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

                <ChartCard title="Rincian Realisasi ABO per Fungsi" subtitle="Budget vs Actual per fungsi — Area Lahendong 2026 (IDR Miliar)" className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={aboPerFungsi} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="fungsi" tickLine={false} axisLine={false} tick={{ fontSize: 9 }} />
                            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                            <RechartsTooltip formatter={(v, name) => [`${v} Miliar`, name]} />
                            <Legend wrapperStyle={{ fontSize: 9 }} />
                            <Bar dataKey="budget" name="Budget" fill="#93c5fd" radius={[3, 3, 0, 0]} />
                            <Bar dataKey="actual" name="Actual" fill={PERTAMINA_GREEN} radius={[3, 3, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
}

/* ─── Main Dashboard ─── */
export default function MainDashboard(props) {
    const { scmList, budgetDetailsList } = props;

    const [activeSubTab, setActiveSubTab] = useState('operasi');

    const totalScmContracts = scmList.length;
    const totalScmValue = scmList.reduce((acc, c) => acc + c.nilai, 0);
    const totalBudget = budgetDetailsList.reduce((acc, b) => acc + b.budget, 0);
    const totalActual = budgetDetailsList.reduce((acc, b) => acc + b.actual, 0);

    const formatShortCurrency = (val) => {
        if (val >= 1000000000) return `Rp ${(val / 1000000000).toFixed(1)} M`;
        if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(1)} Jt`;
        return `Rp ${val}`;
    };

    const tabs = [
        { id: 'operasi', label: 'Kinerja Operasi & Reliability', icon: Activity },
        { id: 'financial', label: 'Financial Performance', icon: DollarSign },
        { id: 'abo', label: 'Realisasi ABO', icon: PieChartIcon },
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard title="Produksi 2025" value="109,63 GWh" subtitle="Realisasi produksi tahunan" icon={Zap} colorClass="text-blue-600" bgClass="bg-blue-50" />
                <KpiCard title="Total Plafon Budget" value={formatShortCurrency(totalBudget)} subtitle={`Realisasi: ${formatShortCurrency(totalActual)}`} icon={Calculator} colorClass="text-green-600" bgClass="bg-green-50" />
                <KpiCard title="EAF 2025" value="94,61%" subtitle="Equivalent Availability Factor" icon={TrendingUp} colorClass="text-indigo-600" bgClass="bg-indigo-50" />
                <KpiCard title="Total Kontrak SCM" value={`${totalScmContracts} Kontrak`} subtitle={formatShortCurrency(totalScmValue)} icon={FileSignature} colorClass="text-purple-600" bgClass="bg-purple-50" />
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
            {activeSubTab === 'operasi' && <TabOperasi />}
            {activeSubTab === 'financial' && <TabFinancial />}
            {activeSubTab === 'abo' && <TabAbo />}
        </div>
    );
}
