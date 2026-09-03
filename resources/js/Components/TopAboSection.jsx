import React, { useState } from 'react';
import { Trophy, ArrowDown, Activity, Wrench, Globe, Briefcase, ShieldAlert, Maximize2 } from 'lucide-react';

export const TOP_LAHENDONG_DATA = [
    { rank: 1, name: 'LABOR SPRVSN OUTSIDE', anggaran: 22003, labelAnggaran: '22.003 Juta', realisasi: 10633, labelRealisasi: '10.633 Juta', diff: '-51,67%', fungsi: 'Business Support' },
    { rank: 2, name: 'VEHICLES RENTAL', anggaran: 9424, labelAnggaran: '9.424 Juta', realisasi: 6082, labelRealisasi: '6.082 Juta', diff: '-35,46%', fungsi: 'Business Support' },
    { rank: 3, name: 'EQUIPM MAINTNCE SERV', anggaran: 5533, labelAnggaran: '5.533 Juta', realisasi: 2677, labelRealisasi: '2.677 Juta', diff: '-51,63%', fungsi: 'Maintenance' },
];

export const TOP_PER_FUNGSI_DATA = {
    operation: {
        id: 'top-abo-operation',
        title: 'Operation',
        icon: Activity,
        color: 'border-blue-200 bg-blue-50/30 text-blue-700',
        items: [
            { name: 'EMPLOYEE TRAVEL EXPE', anggaran: 1850, realisasi: 716, diff: '-61,29%', isBroken: true },
            { name: 'CHEMICAL EXPENSE', anggaran: 1514, realisasi: 619, diff: '-59,14%' },
            { name: 'GROUP/EXTERN ACCOM', anggaran: 1210, realisasi: 75, diff: '-93,80%' },
        ]
    },
    maintenance: {
        id: 'top-abo-maintenance',
        title: 'Maintenance',
        icon: Wrench,
        color: 'border-green-200 bg-green-50/30 text-green-700',
        items: [
            { name: 'EQUIPM MAINTNCE SERV', anggaran: 5533, realisasi: 2677, diff: '-51,63%', isBroken: true },
            { name: 'MAC ACCES INSTRU', anggaran: 1217, realisasi: 221, diff: '-81,85%' },
            { name: 'EMPLOYEE TRAVEL EXPE', anggaran: 914, realisasi: 642, diff: '-29,77%' },
        ]
    },
    gpr: {
        id: 'top-abo-gpr',
        title: 'GPR',
        icon: Globe,
        color: 'border-amber-200 bg-amber-50/30 text-amber-700',
        items: [
            { name: 'CSR EXPENSE', anggaran: 1677, realisasi: 836, diff: '-50,14%', isBroken: true },
            { name: 'CORPORATE COMMUNICAT', anggaran: 453, realisasi: 382, diff: '-15,80%' },
            { name: 'EMPLOYEE TRAVEL EXPE', anggaran: 150, realisasi: 177, diff: '+18,25%', isPositive: false },
        ]
    },
    business_support: {
        id: 'top-abo-business_support',
        title: 'Business Support',
        icon: Briefcase,
        color: 'border-indigo-200 bg-indigo-50/30 text-indigo-700',
        items: [
            { name: 'LABOR SPRVSN OUTSIDE', anggaran: 22003, realisasi: 10633, diff: '-51,67%', isBroken: true },
            { name: 'VEHICLES RENTAL', anggaran: 9424, realisasi: 6082, diff: '-35,46%' },
            { name: 'ELECTRICITY EXPENSE', anggaran: 4300, realisasi: 3705, diff: '-13,85%' },
        ]
    },
    hsse: {
        id: 'top-abo-hsse',
        title: 'HSSE',
        icon: ShieldAlert,
        color: 'border-red-200 bg-red-50/30 text-red-700',
        items: [
            { name: 'WORK ENVIRON & SAFTY', anggaran: 1912, realisasi: 941, diff: '-50,79%' },
            { name: 'WASTE WATER TREATMNT', anggaran: 1700, realisasi: 674, diff: '-60,33%' },
            { name: 'HOUSHLD FIRE & SAFTY', anggaran: 1217, realisasi: 266, diff: '-78,12%' },
        ]
    }
};

/**
 * Enhanced Spacious SVG bar chart for each function card.
 * Generates ample spacing, clear numbers, non-overlapping diff badges, and broken axis effects.
 */
function MiniFunctionBarChart({ items }) {
    const SVG_WIDTH = 380;
    const SVG_HEIGHT = 210;
    const PADDING = { top: 32, bottom: 50, left: 20, right: 20 };

    const chartWidth = SVG_WIDTH - PADDING.left - PADDING.right;
    const chartHeight = SVG_HEIGHT - PADDING.top - PADDING.bottom;
    const baselineY = SVG_HEIGHT - PADDING.bottom;

    const maxVal = Math.max(...items.map(it => Math.max(it.anggaran, it.realisasi)), 1);

    const mapHeight = (val, isBroken) => {
        if (!isBroken) {
            return (val / maxVal) * (chartHeight * 0.82);
        }
        return chartHeight * 0.88;
    };

    const numGroups = items.length;
    const groupWidth = chartWidth / numGroups;
    const barW = 20;
    const gap = 3.5;

    return (
        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-full overflow-visible select-none">
            <defs>
                <filter id="topAboShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.12" />
                </filter>
                <marker id="miniArrowDownSpacious" markerWidth="6" markerHeight="6" refX="3" refY="4.5" orient="auto">
                    <path d="M0,0 L6,0 L3,4.5 Z" fill="#334155" />
                </marker>
            </defs>

            {/* Baseline */}
            <line
                x1={PADDING.left - 5}
                y1={baselineY}
                x2={SVG_WIDTH - PADDING.right + 5}
                y2={baselineY}
                stroke="#cbd5e1"
                strokeWidth="1.2"
            />

            {items.map((it, idx) => {
                const groupX = PADDING.left + idx * groupWidth + groupWidth / 2;
                const bX = groupX - barW - gap / 2;
                const aX = groupX + gap / 2;

                const bH = mapHeight(it.anggaran, it.isBroken);
                const aH = it.isBroken ? bH * (it.realisasi / it.anggaran) : mapHeight(it.realisasi, false);

                const bY = baselineY - bH;
                const aY = baselineY - aH;

                const formattedAnggaran = it.anggaran >= 1000 ? (it.anggaran / 1000).toFixed(3).replace('.', ',') : it.anggaran;
                const formattedRealisasi = it.realisasi >= 1000 ? (it.realisasi / 1000).toFixed(3).replace('.', ',') : it.realisasi;

                return (
                    <g key={it.name}>
                        {/* Anggaran Bar (Blue) */}
                        <rect x={bX} y={bY} width={barW} height={bH} rx="3" fill="#3B82F6" />
                        <text
                            x={bX + barW / 2}
                            y={bY - 4}
                            textAnchor="middle"
                            fontSize="9.5"
                            fontWeight="800"
                            fill="#1e293b"
                        >
                            {formattedAnggaran}
                        </text>

                        {/* Realisasi Bar (Green) */}
                        <rect x={aX} y={aY} width={barW} height={Math.max(2, aH)} rx="3" fill="#72B340" />
                        <text
                            x={aX + barW / 2}
                            y={aY - 4}
                            textAnchor="middle"
                            fontSize="9.5"
                            fontWeight="800"
                            fill="#1e293b"
                        >
                            {formattedRealisasi}
                        </text>

                        {/* Broken Axis mark on highest bar if specified */}
                        {it.isBroken && (
                            <g transform={`translate(${bX - 2}, ${baselineY - bH * 0.48})`}>
                                <rect x="0" y="0" width={barW + 4} height="7" fill="#ffffff" />
                                <line x1="0" y1="1.5" x2={barW + 4} y2="-1.5" stroke="#475569" strokeWidth="1.2" />
                                <line x1="0" y1="7" x2={barW + 4} y2="4" stroke="#475569" strokeWidth="1.2" />
                            </g>
                        )}

                        {/* Diff Stepped Bracket & Pill */}
                        {it.diff && (
                            <g>
                                <path
                                    d={`M ${bX + barW / 2} ${bY} L ${aX + barW + 11} ${bY} L ${aX + barW + 11} ${aY} L ${aX + barW} ${aY}`}
                                    fill="none"
                                    stroke="#334155"
                                    strokeWidth="1"
                                    strokeDasharray="2 2"
                                    markerEnd="url(#miniArrowDownSpacious)"
                                />
                                <g transform={`translate(${aX + barW + 14}, ${(bY + aY) / 2})`}>
                                    <rect
                                        x="-16"
                                        y="-7"
                                        width="32"
                                        height="14"
                                        rx="7"
                                        fill="#ffffff"
                                        stroke="#334155"
                                        strokeWidth="0.9"
                                        filter="url(#topAboShadow)"
                                    />
                                    <text
                                        x="0"
                                        y="3"
                                        textAnchor="middle"
                                        fontSize="7.5"
                                        fontWeight="800"
                                        fill={it.isPositive === false ? '#15803d' : '#0f172a'}
                                    >
                                        {it.diff}
                                    </text>
                                </g>
                            </g>
                        )}

                        {/* Item Name Label */}
                        <text
                            x={groupX}
                            y={baselineY + 14}
                            textAnchor="middle"
                            fontSize="8"
                            fontWeight="700"
                            fill="#475569"
                        >
                            {it.name.split(' ').map((word, wIdx) => (
                                <tspan key={wIdx} x={groupX} dy={wIdx > 0 ? 10 : 0}>
                                    {word}
                                </tspan>
                            ))}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}

export default function TopAboSection({ onChartClick }) {
    return (
        <div className="space-y-6">
            {/* ─── 1. TOP 3 LAHENDONG (PROMINENT AT TOP) ─── */}
            <div
                onClick={() => onChartClick && onChartClick('top-abo-lahendong')}
                className={`bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 shadow-md border border-blue-800 text-white relative overflow-hidden group ${
                    onChartClick ? 'cursor-pointer hover:border-blue-600 transition-all' : ''
                }`}
            >
                <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10 pointer-events-none">
                    <Trophy className="w-64 h-64 text-white" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/10 mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-inner">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                                TOP 3 ABO Area Lahendong 2026
                                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                                    Prioritas Anggaran Terbesar
                                </span>
                            </h3>
                            <p className="text-xs text-blue-200/80 font-medium mt-0.5">
                                Tiga pos alokasi anggaran terbesar Area Lahendong pada tahun 2026
                            </p>
                        </div>
                    </div>

                    {onChartClick && (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 group-hover:bg-white/20 transition-all">
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>Lihat Detail Tabel</span>
                        </div>
                    )}
                </div>

                {/* 3 Prominent Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                    {TOP_LAHENDONG_DATA.map((item) => (
                        <div
                            key={item.name}
                            className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-5 flex flex-col justify-between hover:bg-white/15 transition-all shadow-sm group/card"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-3">
                                    <span className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-xs">
                                        #{item.rank}
                                    </span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/15 text-blue-200">
                                        {item.fungsi}
                                    </span>
                                </div>
                                <h4 className="font-black text-sm text-white leading-snug group-hover/card:text-amber-300 transition-colors">
                                    {item.name}
                                </h4>
                            </div>

                            <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-300 font-medium">Anggaran:</span>
                                    <span className="font-black text-white">{item.labelAnggaran}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-300 font-medium">Realisasi:</span>
                                    <span className="font-black text-emerald-400">{item.labelRealisasi}</span>
                                </div>
                                <div className="flex justify-between items-center pt-1">
                                    <span className="text-slate-300 font-medium">Deviasi Serapan:</span>
                                    <span className="font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[11px] border border-emerald-500/30">
                                        {item.diff}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ─── 2. TOP 3 ABO PER FUNGSI (SPACIOUS GRID) ─── */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
                    <div>
                        <h4 className="text-sm font-black text-slate-800 tracking-tight">
                            Top 3 ABO 2026 Per Fungsi (Juta IDR)
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            Update per 21 Agustus 2026 — 3 Pos anggaran tertinggi di setiap fungsi operasional
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold">
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-2.5 rounded-xs bg-[#3B82F6]" />
                            <span className="text-slate-700">Anggaran</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-2.5 rounded-xs bg-[#72B340]" />
                            <span className="text-slate-700">Realisasi</span>
                        </div>
                    </div>
                </div>

                {/* 5 Functions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-1">
                    {Object.entries(TOP_PER_FUNGSI_DATA).map(([key, func]) => {
                        const Icon = func.icon;
                        return (
                            <div
                                key={func.title}
                                onClick={() => onChartClick && onChartClick(func.id)}
                                className="bg-slate-50/70 rounded-3xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md hover:border-blue-300 hover:bg-blue-50/20 transition-all cursor-pointer relative group"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs group-hover:border-blue-400 transition-colors">
                                        <Icon className="w-4 h-4 text-blue-600" />
                                        <span className="text-xs font-black text-slate-800">{func.title}</span>
                                    </div>
                                    <span className="p-1 text-slate-400 group-hover:text-blue-600 rounded-lg group-hover:bg-blue-100/50 transition-all opacity-0 group-hover:opacity-100" title="Klik untuk Rincian Detail">
                                        <Maximize2 className="w-4 h-4" />
                                    </span>
                                </div>

                                <div className="h-56 w-full py-1">
                                    <MiniFunctionBarChart items={func.items} />
                                </div>

                                <div className="text-right pt-2 border-t border-slate-200/60 text-[9px] font-extrabold text-blue-600 tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                                    KLIK UNTUK DETAIL & TABEL
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
