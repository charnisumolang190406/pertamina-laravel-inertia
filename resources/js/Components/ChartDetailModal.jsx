import React, { useState, useMemo } from 'react';
import {
    X, Filter, Calendar, Layers, Table, TrendingUp, Info, Check, Sparkles
} from 'lucide-react';
import {
    ResponsiveContainer, LineChart, Line, BarChart, Bar,
    ComposedChart, AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip as RechartsTooltip, Legend, LabelList, Customized
} from 'recharts';
import { BarDiffOverlay, useBarHover } from './BarDiffOverlay';
import ProduksiBarChart from './ProduksiBarChart';
import Pagination from './Pagination';

/**
 * CustomPointLabel — Renders a crisp badge with data values above Line / Dot / Area points
 */
const CustomPointLabel = (props) => {
    const { x, y, value, stroke, fill, unit } = props;
    if (value === undefined || value === null || isNaN(value)) return null;

    const formattedVal = typeof value === 'number'
        ? (Number.isInteger(value) ? value.toLocaleString('id-ID') : value.toFixed(2))
        : value;

    const textWidth = Math.max(String(formattedVal).length * 7 + 10, 28);
    const badgeHeight = 16;
    const badgeY = y - 18;

    return (
        <g>
            <rect
                x={x - textWidth / 2}
                y={badgeY}
                width={textWidth}
                height={badgeHeight}
                rx={4}
                fill="#ffffff"
                fillOpacity={0.92}
                stroke={stroke || '#cbd5e1'}
                strokeWidth={1}
                filter="drop-shadow(0 1px 2px rgba(0,0,0,0.06))"
            />
            <text
                x={x}
                y={badgeY + 11.5}
                fill="#0f172a"
                fontSize={9.5}
                fontWeight="800"
                textAnchor="middle"
            >
                {formattedVal}
            </text>
        </g>
    );
};

/**
 * CustomBarLabel — Renders clean numerical label on top of each Bar
 */
const CustomBarLabel = (props) => {
    const { x, y, width, height, value } = props;
    if (value === undefined || value === null || isNaN(value) || value === 0) return null;

    const formattedVal = typeof value === 'number'
        ? (Number.isInteger(value) ? value.toLocaleString('id-ID') : value.toFixed(2))
        : value;

    return (
        <text
            x={x + width / 2}
            y={y - 6}
            fill="#1e293b"
            fontSize={10}
            fontWeight="800"
            textAnchor="middle"
        >
            {formattedVal}
        </text>
    );
};

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
        series = [],
        rawData = []
    } = chartConfig;

    const barHover = useBarHover();

    // --- State: Category/Series Filter ---
    const [selectedSeriesKeys, setSelectedSeriesKeys] = useState(() =>
        series.map(s => s.key)
    );

    // --- State: Time Filters ---
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
            return uniqueTimeValues;
        }
        return [];
    });

    // Scatter/Other filter (multiselect)
    const [selectedItems, setSelectedItems] = useState(() => {
        if (timeType !== 'year' && timeType !== 'month') {
            return uniqueTimeValues;
        }
        return [];
    });

    const [tablePage, setTablePage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // --- Filter Handlers ---
    const toggleSeries = (key) => {
        setSelectedSeriesKeys(prev => {
            if (prev.includes(key)) {
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

    React.useEffect(() => {
        setTablePage(1);
    }, [startYear, endYear, selectedMonths, selectedItems, selectedSeriesKeys]);

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

    // Helper to translate monthly numbers to Indonesian months
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
        const num = typeof value === 'number' ? value.toLocaleString('id-ID') : value;
        return [`${num}${unitStr}`, s ? s.label : name];
    };

    // Determine bar keys for overlay comparison
    const barSeries = series.filter(s => (s.type || (type === 'bar' ? 'bar' : 'line')) === 'bar');
    const hasMultipleBars = barSeries.length >= 2;
    const barKey1 = hasMultipleBars ? barSeries[0]?.key : null;
    const barKey2 = hasMultipleBars ? barSeries[1]?.key : null;

    // Check if this chart is Produksi GWh
    const isProduksiGwhChart = id === 'produksi-gwh';

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 font-sans animate-[fadeIn_0.2s_ease-in-out]">
            <div className="bg-white rounded-3xl w-full max-w-6xl h-[90vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-[slideUp_0.3s_ease-out]">

                {/* Header */}
                <div className="px-6 py-4.5 border-b border-slate-150 flex justify-between items-center bg-slate-50 shrink-0">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                            <h3 className="font-extrabold text-slate-800 text-sm">{title}</h3>
                        </div>
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
                                <Layers className="w-4 h-4 text-emerald-600" />
                                <span>Filter Kategori / Kolom Data</span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                                Pilih kategori yang ingin ditampilkan pada grafik dan tabel. Angka data tertera di setiap titik & bar.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {series.map(s => {
                                    const isSelected = selectedSeriesKeys.includes(s.key);
                                    return (
                                        <button
                                            key={s.key}
                                            type="button"
                                            onClick={() => toggleSeries(s.key)}
                                            className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                                                isSelected
                                                    ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                                                    : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            <span
                                                className="w-2.5 h-2.5 rounded-full"
                                                style={{ backgroundColor: s.color }}
                                            />
                                            <span>{s.label}</span>
                                            {isSelected && <Check className="w-3.5 h-3.5 ml-0.5" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Chart Container */}
                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col h-[400px]">
                        <div className="mb-2 flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Visualisasi Chart Detail (Interaktif & Lengkap dengan Angka Data)
                            </h4>
                            {hasMultipleBars && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> Hover bar untuk melihat selisih %
                                </span>
                            )}
                        </div>

                        <div className="flex-1 w-full min-h-0 text-[11px]">
                            {filteredData.length > 0 && (
                                <>
                                    {(() => {
                                        const computedYDomain = yAxisDomain || [
                                            dataMin => (dataMin > 10 ? Math.max(0, Math.floor(dataMin * 0.88)) : Math.max(0, Math.floor(dataMin - 1))),
                                            dataMax => (dataMax > 10 ? Math.ceil(dataMax * 1.12) : Math.ceil(dataMax + 1))
                                        ];

                                        if (isProduksiGwhChart) {
                                            return <ProduksiBarChart data={filteredData} className="w-full h-full" />;
                                        }

                                        return (
                                        <ResponsiveContainer width="100%" height="100%">
                                            {type === 'line' ? (
                                                <LineChart data={filteredData} margin={{ top: 30, right: 25, left: -5, bottom: 5 }}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                    <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                                                    <YAxis domain={computedYDomain} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
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
                                                                dot={{ r: 5, fill: s.color }}
                                                                activeDot={{ r: 7 }}
                                                            >
                                                                <LabelList
                                                                    dataKey={s.key}
                                                                    content={<CustomPointLabel stroke={s.color} unit={s.unit} />}
                                                                />
                                                            </Line>
                                                        );
                                                    })}
                                                </LineChart>
                                            ) : type === 'bar' ? (
                                                <BarChart data={filteredData} margin={{ top: 30, right: 45, left: -5, bottom: 5 }} {...barHover.barChartProps}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                    <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                                                    <YAxis domain={computedYDomain} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
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
                                                                barSize={32}
                                                            >
                                                                <LabelList
                                                                    dataKey={s.key}
                                                                    content={<CustomBarLabel />}
                                                                />
                                                            </Bar>
                                                        );
                                                    })}
                                                    {hasMultipleBars && barKey1 && barKey2 && (
                                                        <Customized
                                                            component={BarDiffOverlay}
                                                            barKey1={barKey1}
                                                            barKey2={barKey2}
                                                            activeIndex={barHover.activeIndex}
                                                        />
                                                    )}
                                                </BarChart>
                                            ) : type === 'composed' ? (
                                                <ComposedChart data={filteredData} margin={{ top: 30, right: 45, left: -5, bottom: 5 }} {...barHover.barChartProps}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                    <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />

                                                    {/* Dual Axis Support if defined */}
                                                    {yAxisIdLeft && yAxisIdRight ? (
                                                        <>
                                                            <YAxis yAxisId="left" domain={computedYDomain} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                                                            <YAxis yAxisId="right" orientation="right" domain={computedYDomain} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                                                        </>
                                                    ) : (
                                                        <YAxis domain={computedYDomain} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
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
                                                                    radius={[4, 4, 0, 0]}
                                                                    barSize={16}
                                                                >
                                                                    <LabelList
                                                                        dataKey={s.key}
                                                                        content={<CustomBarLabel />}
                                                                    />
                                                                </Bar>
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
                                                                    dot={{ r: 4, fill: s.color }}
                                                                >
                                                                    <LabelList
                                                                        dataKey={s.key}
                                                                        content={<CustomPointLabel stroke={s.color} unit={s.unit} />}
                                                                    />
                                                                </Line>
                                                            );
                                                        }
                                                    })}
                                                    {hasMultipleBars && barKey1 && barKey2 && (
                                                        <Customized
                                                            component={BarDiffOverlay}
                                                            barKey1={barKey1}
                                                            barKey2={barKey2}
                                                            activeIndex={barHover.activeIndex}
                                                            yAxisId={yAxisIdLeft ? 'left' : 0}
                                                        />
                                                    )}
                                                </ComposedChart>
                                            ) : type === 'area' ? (
                                                <AreaChart data={filteredData} margin={{ top: 30, right: 25, left: -5, bottom: 5 }}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                    <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                                                    <YAxis domain={computedYDomain} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
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
                                                                fill={`${s.color}25`}
                                                                stroke={s.color}
                                                                strokeWidth={2.5}
                                                                dot={{ r: 4, fill: s.color }}
                                                            >
                                                                <LabelList
                                                                    dataKey={s.key}
                                                                    content={<CustomPointLabel stroke={s.color} unit={s.unit} />}
                                                                />
                                                            </Area>
                                                        );
                                                    })}
                                                </AreaChart>
                                            ) : null}
                                        </ResponsiveContainer>
                                        );
                                    })()}
                                </>
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
                                            <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: s.color }} />
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
                            <span>Tabel Rincian Data Lengkap</span>
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
                                            {filteredData.slice((tablePage - 1) * ITEMS_PER_PAGE, tablePage * ITEMS_PER_PAGE).map((d, index) => (
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
                                    <Pagination
                                        currentPage={tablePage}
                                        totalItems={filteredData.length}
                                        itemsPerPage={ITEMS_PER_PAGE}
                                        onPageChange={setTablePage}
                                    />
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
