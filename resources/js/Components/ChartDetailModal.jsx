import React, { useState, useMemo } from 'react';
import {
    X, Filter, Calendar, Layers, Table, TrendingUp, Info, Check
} from 'lucide-react';
import {
    ResponsiveContainer, LineChart, Line, BarChart, Bar,
    ComposedChart, AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip as RechartsTooltip, Legend
} from 'recharts';

export default function ChartDetailModal({ isOpen, onClose, chartConfig }) {
    if (!isOpen || !chartConfig) return null;

    const {
        id,
        title,
        subtitle,
        type,
        xAxisKey,
        timeType,
        yAxisDomain,
        yAxisIdLeft,
        yAxisIdRight,
        xAxisLabel,
        yAxisLabel,
        series,
        rawData
    } = chartConfig;

    // --- State: Category/Series Filter ---
    // Track which series are selected for rendering. Default to all.
    const [selectedSeriesKeys, setSelectedSeriesKeys] = useState(() => 
        series.map(s => s.key)
    );

    // --- State: Time Filters ---
    // Get unique list of time steps
    const uniqueTimeValues = useMemo(() => {
        const values = rawData.map(d => d[xAxisKey]);
        return [...new Set(values)];
    }, [rawData, xAxisKey]);

    // Year range filters
    const [startYear, setStartYear] = useState(() => {
        if (timeType === 'year' && uniqueTimeValues.length > 0) {
            return uniqueTimeValues[0];
        }
        return '';
    });
    const [endYear, setEndYear] = useState(() => {
        if (timeType === 'year' && uniqueTimeValues.length > 0) {
            return uniqueTimeValues[uniqueTimeValues.length - 1];
        }
        return '';
    });

    // Month filter (checkbox-based/multi-select)
    const [selectedMonths, setSelectedMonths] = useState(() => {
        if (timeType === 'month') {
            return uniqueTimeValues; // Default select all
        }
        return [];
    });

    // Scatter/Other filter (multiselect)
    const [selectedItems, setSelectedItems] = useState(() => {
        if (timeType !== 'year' && timeType !== 'month') {
            return uniqueTimeValues; // Default select all
        }
        return [];
    });

    // --- Filter Handlers ---
    const toggleSeries = (key) => {
        setSelectedSeriesKeys(prev => {
            if (prev.includes(key)) {
                // Keep at least one series selected to avoid empty chart
                if (prev.length === 1) return prev;
                return prev.filter(k => k !== key);
            } else {
                return [...prev, key];
            }
        });
    };

    const toggleMonth = (m) => {
        setSelectedMonths(prev => 
            prev.includes(m) ? prev.filter(item => item !== m) : [...prev, m]
        );
    };

    const selectQuarter = (quarter) => {
        let months = [];
        if (quarter === 'Q1') months = ['1', '2', '3'];
        else if (quarter === 'Q2') months = ['4', '5', '6'];
        else if (quarter === 'Q3') months = ['7', '8', '9'];
        else if (quarter === 'Q4') months = ['10', '11', '12'];
        else if (quarter === 'ALL') months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
        
        setSelectedMonths(months);
    };

    const toggleItem = (item) => {
        setSelectedItems(prev => 
            prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
        );
    };

    // --- Filtered Data ---
    const filteredData = useMemo(() => {
        return rawData.filter(d => {
            const timeVal = d[xAxisKey];

            // 1. Time range filter (Year)
            if (timeType === 'year') {
                const yearNum = parseInt(timeVal, 10);
                const startNum = parseInt(startYear, 10);
                const endNum = parseInt(endYear, 10);
                if (!isNaN(yearNum)) {
                    if (!isNaN(startNum) && yearNum < startNum) return false;
                    if (!isNaN(endNum) && yearNum > endNum) return false;
                }
            }

            // 2. Month filter
            if (timeType === 'month') {
                if (!selectedMonths.includes(timeVal)) return false;
            }

            // 3. Other categorization filters
            if (timeType !== 'year' && timeType !== 'month') {
                if (!selectedItems.includes(timeVal)) return false;
            }

            return true;
        });
    }, [rawData, xAxisKey, timeType, startYear, endYear, selectedMonths, selectedItems]);

    // --- KPI calculations ---
    const kpiSummary = useMemo(() => {
        const summaries = {};
        series.forEach(s => {
            if (!selectedSeriesKeys.includes(s.key)) return;

            const values = filteredData
                .map(d => d[s.key])
                .filter(v => typeof v === 'number' && !isNaN(v));

            if (values.length === 0) {
                summaries[s.key] = { min: 0, max: 0, avg: 0, sum: 0, unit: s.unit || '' };
                return;
            }

            const min = Math.min(...values);
            const max = Math.max(...values);
            const sum = values.reduce((a, b) => a + b, 0);
            const avg = sum / values.length;

            summaries[s.key] = {
                min: min.toFixed(2),
                max: max.toFixed(2),
                avg: avg.toFixed(2),
                sum: sum.toFixed(2),
                unit: s.unit || ''
            };
        });
        return summaries;
    }, [filteredData, series, selectedSeriesKeys]);

    // Helper to translate monthly numbers to Indonensian months
    const getMonthName = (mStr) => {
        const months = {
            '1': 'Januari', '2': 'Februari', '3': 'Maret', '4': 'April',
            '5': 'Mei', '6': 'Juni', '7': 'Juli', '8': 'Agustus',
            '9': 'September', '10': 'Oktober', '11': 'November', '12': 'Desember'
        };
        return months[mStr] || `Bulan ${mStr}`;
    };

    // Reusable Recharts Tooltip Formatter
    const customTooltipFormatter = (value, name) => {
        const s = series.find(x => x.key === name);
        const unitStr = s ? ` ${s.unit || ''}` : '';
        return [`${value}${unitStr}`, s ? s.label : name];
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 font-sans animate-[fadeIn_0.2s_ease-in-out]">
            <div className="bg-white rounded-3xl w-full max-w-6xl h-[90vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-[slideUp_0.3s_ease-out]">
                
                {/* Header */}
                <div className="px-6 py-4.5 border-b border-slate-150 flex justify-between items-center bg-slate-50 shrink-0">
                    <div>
                        <h3 className="font-extrabold text-slate-800 text-sm">{title}</h3>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">{subtitle}</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 cursor-pointer transition-colors"
                        title="Tutup Detail"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Workspace */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Filters Dashboard Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 bg-slate-50/80 p-5 rounded-2xl border border-slate-200">
                        {/* Time Filter Column */}
                        <div className="md:col-span-6 space-y-3">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                <span>Filter Periode ({timeType === 'year' ? 'Tahun' : timeType === 'month' ? 'Bulan' : 'Lainnya'})</span>
                            </div>

                            {/* Year-Based Filter */}
                            {timeType === 'year' && (
                                <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <label className="block text-[10px] text-slate-400 font-bold mb-1">Mulai Tahun</label>
                                        <select
                                            value={startYear}
                                            onChange={(e) => setStartYear(e.target.value)}
                                            className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
                                        >
                                            {uniqueTimeValues.map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-[10px] text-slate-400 font-bold mb-1">Sampai Tahun</label>
                                        <select
                                            value={endYear}
                                            onChange={(e) => setEndYear(e.target.value)}
                                            className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
                                        >
                                            {uniqueTimeValues.map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Month-Based Filter */}
                            {timeType === 'month' && (
                                <div className="space-y-2">
                                    {/* Quarter Shortcut buttons */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {['Q1', 'Q2', 'Q3', 'Q4', 'ALL'].map(q => (
                                            <button
                                                key={q}
                                                type="button"
                                                onClick={() => selectQuarter(q)}
                                                className="px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-[10px] font-extrabold rounded-lg text-slate-600 cursor-pointer transition-all"
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                    {/* Month list */}
                                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                                        {uniqueTimeValues.map(m => {
                                            const isActive = selectedMonths.includes(m);
                                            return (
                                                <button
                                                    key={m}
                                                    type="button"
                                                    onClick={() => toggleMonth(m)}
                                                    className={`py-1.5 text-center text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                                                        isActive
                                                            ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                                                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    {getMonthName(m).substring(0, 3)}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Scatter or Generic items Filter */}
                            {timeType !== 'year' && timeType !== 'month' && (
                                <div className="flex flex-wrap gap-2">
                                    {uniqueTimeValues.map(item => {
                                        const isActive = selectedItems.includes(item);
                                        return (
                                            <button
                                                key={item}
                                                type="button"
                                                onClick={() => toggleItem(item)}
                                                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                                                    isActive
                                                        ? 'bg-blue-600 border-blue-600 text-white'
                                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                }`}
                                            >
                                                {item}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Category/Series Filter Column */}
                        <div className="md:col-span-6 space-y-3 border-t md:border-t-0 md:border-l border-slate-200 md:pl-5 pt-3 md:pt-0">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                <Layers className="w-4 h-4 text-pertamina-green" />
                                <span>Filter Kategori / Kolom Data</span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                                Pilih kategori/variabel yang ingin ditampilkan pada chart dan tabel data di bawah.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {series.map(s => {
                                    const isSelected = selectedSeriesKeys.includes(s.key);
                                    return (
                                        <button
                                            key={s.key}
                                            type="button"
                                            onClick={() => toggleSeries(s.key)}
                                            style={{
                                                backgroundColor: isSelected ? s.color : 'white',
                                                borderColor: isSelected ? s.color : '#e2e8f0',
                                                color: isSelected ? 'white' : '#475569'
                                            }}
                                            className={`px-3 py-1.5 text-[11px] font-bold rounded-full border transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95`}
                                        >
                                            {isSelected && <Check className="w-3 h-3 text-white" />}
                                            <span>{s.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Main Chart Rendering Panel */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 h-96 flex flex-col">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Visualisasi Chart Detail</span>
                            {filteredData.length === 0 && (
                                <span className="text-red-500 text-xs font-bold">Tidak ada data untuk filter saat ini.</span>
                            )}
                        </div>
                        <div className="flex-1 w-full min-h-0 text-[11px]">
                            {filteredData.length > 0 && (
                                <ResponsiveContainer width="100%" height="100%">
                                    {type === 'line' ? (
                                        <LineChart data={filteredData} margin={{ top: 15, right: 15, left: -5, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                                            <YAxis domain={yAxisDomain} tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                                            <RechartsTooltip formatter={customTooltipFormatter} />
                                            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                                            {series.map(s => {
                                                if (!selectedSeriesKeys.includes(s.key)) return null;
                                                return (
                                                    <Line
                                                        key={s.key}
                                                        type="monotone"
                                                        dataKey={s.key}
                                                        name={s.label}
                                                        stroke={s.color}
                                                        strokeWidth={3}
                                                        dot={{ r: 4, fill: s.color }}
                                                        activeDot={{ r: 6 }}
                                                    />
                                                );
                                            })}
                                        </LineChart>
                                    ) : type === 'bar' ? (
                                        <BarChart data={filteredData} margin={{ top: 15, right: 15, left: -5, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                                            <YAxis domain={yAxisDomain} tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                                            <RechartsTooltip formatter={customTooltipFormatter} />
                                            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                                            {series.map(s => {
                                                if (!selectedSeriesKeys.includes(s.key)) return null;
                                                return (
                                                    <Bar
                                                        key={s.key}
                                                        dataKey={s.key}
                                                        name={s.label}
                                                        fill={s.color}
                                                        radius={[4, 4, 0, 0]}
                                                        barSize={20}
                                                    />
                                                );
                                            })}
                                        </BarChart>
                                    ) : type === 'composed' ? (
                                        <ComposedChart data={filteredData} margin={{ top: 15, right: 15, left: -5, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                                            
                                            {/* Dual Axis Support if defined */}
                                            {yAxisIdLeft && yAxisIdRight ? (
                                                <>
                                                    <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                                                    <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                                                </>
                                            ) : (
                                                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                                            )}
                                            
                                            <RechartsTooltip formatter={customTooltipFormatter} />
                                            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                                            {series.map(s => {
                                                if (!selectedSeriesKeys.includes(s.key)) return null;
                                                const sType = s.type || 'line';
                                                const axisId = s.yAxisId || 'left';
                                                if (sType === 'bar') {
                                                    return (
                                                        <Bar
                                                            key={s.key}
                                                            yAxisId={yAxisIdLeft && yAxisIdRight ? axisId : undefined}
                                                            dataKey={s.key}
                                                            name={s.label}
                                                            fill={s.color}
                                                            radius={[3, 3, 0, 0]}
                                                            barSize={12}
                                                        />
                                                    );
                                                } else {
                                                    return (
                                                        <Line
                                                            key={s.key}
                                                            yAxisId={yAxisIdLeft && yAxisIdRight ? axisId : undefined}
                                                            type="monotone"
                                                            dataKey={s.key}
                                                            name={s.label}
                                                            stroke={s.color}
                                                            strokeWidth={2.5}
                                                            dot={{ r: 3, fill: s.color }}
                                                        />
                                                    );
                                                }
                                            })}
                                        </ComposedChart>
                                    ) : type === 'area' ? (
                                        <AreaChart data={filteredData} margin={{ top: 15, right: 15, left: -5, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                                            <YAxis domain={yAxisDomain} tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                                            <RechartsTooltip formatter={customTooltipFormatter} />
                                            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                                            {series.map(s => {
                                                if (!selectedSeriesKeys.includes(s.key)) return null;
                                                return (
                                                    <Area
                                                        key={s.key}
                                                        type="monotone"
                                                        dataKey={s.key}
                                                        name={s.label}
                                                        fill={`${s.color}20`}
                                                        stroke={s.color}
                                                        strokeWidth={2.5}
                                                    />
                                                );
                                            })}
                                        </AreaChart>
                                    ) : null}
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Summary statistics & Key KPI widgets based on filters */}
                    {filteredData.length > 0 && selectedSeriesKeys.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                <TrendingUp className="w-4 h-4 text-blue-600" />
                                <span>Statistik Summary Performa ({filteredData.length} data point terfilter)</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {series.map(s => {
                                    if (!selectedSeriesKeys.includes(s.key) || !kpiSummary[s.key]) return null;
                                    const kpi = kpiSummary[s.key];
                                    return (
                                        <div key={s.key} className="bg-slate-50 p-4 rounded-2xl border border-slate-150 relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: s.color }} />
                                            <h5 className="font-extrabold text-[11px] text-slate-700 truncate pl-1">{s.label}</h5>
                                            <div className="grid grid-cols-2 gap-2 mt-2.5 pl-1 text-[10px]">
                                                <div>
                                                    <span className="text-slate-400 block font-bold">Rata-rata</span>
                                                    <span className="font-extrabold text-slate-800">{kpi.avg} {kpi.unit}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 block font-bold">Total</span>
                                                    <span className="font-extrabold text-slate-800">{kpi.sum} {kpi.unit}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 block font-bold">Minimum</span>
                                                    <span className="font-bold text-slate-700">{kpi.min} {kpi.unit}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 block font-bold">Maximum</span>
                                                    <span className="font-bold text-slate-700">{kpi.max} {kpi.unit}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Detailed Data Table */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                            <Table className="w-4 h-4 text-slate-600" />
                            <span>Tabel Rincian Data</span>
                        </div>
                        {filteredData.length > 0 ? (
                            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs font-semibold">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[9px]">
                                                <th className="px-6 py-3">
                                                    {timeType === 'year' ? 'Tahun' : timeType === 'month' ? 'Bulan' : xAxisKey}
                                                </th>
                                                {series.map(s => {
                                                    if (!selectedSeriesKeys.includes(s.key)) return null;
                                                    return (
                                                        <th key={s.key} className="px-6 py-3">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: s.color }} />
                                                                <span>{s.label} ({s.unit || 'unit'})</span>
                                                            </div>
                                                        </th>
                                                    );
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-slate-700">
                                            {filteredData.map((d, index) => (
                                                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-2.5 font-bold text-slate-800">
                                                        {timeType === 'month' ? getMonthName(d[xAxisKey]) : d[xAxisKey]}
                                                    </td>
                                                    {series.map(s => {
                                                        if (!selectedSeriesKeys.includes(s.key)) return null;
                                                        const val = d[s.key];
                                                        return (
                                                            <td key={s.key} className="px-6 py-2.5 font-medium text-slate-600">
                                                                {typeof val === 'number' ? val.toLocaleString('id-ID') : val}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <Info className="w-8 h-8 text-slate-350 mx-auto mb-2" />
                                <p className="text-xs text-slate-400 font-bold">Tidak ada data untuk ditampilkan</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="px-6 py-4.5 border-t border-slate-150 bg-slate-50 text-right shrink-0">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
