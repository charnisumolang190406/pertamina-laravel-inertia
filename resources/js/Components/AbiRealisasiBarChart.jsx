import React, { useState } from 'react';

/**
 * AbiRealisasiBarChart — Custom SVG chart for Realisasi Biaya ABI 2026 (11 Proyek Investasi).
 * Features:
 * - 11 Projects with Rencana (Blue) vs Realisasi (Green)
 * - Broken-axis visual scale on large values (110.12 M & 79.98 M)
 * - Comparison badges with downward arrows (-54.74%, -91.61%, -98.08%, -93.69%)
 * - Numbers directly on top of bars
 * - Full interactive hover tooltip
 */
export default function AbiRealisasiBarChart({
    data = [
        { id: 1, name: 'Pengadaan Logging\nTruck Unit', rawName: 'Pengadaan Logging Truck Unit', rencana: 15.00, realisasi: 6.79, diff: '-54,74%' },
        { id: 2, name: 'Pemindahan\nAFT Cluster 37', rawName: 'Pemindahan AFT Cluster 37', rencana: 8.85, realisasi: 0.74, diff: '-91,61%' },
        { id: 3, name: 'Pemipaan Jalur\nEDV ke AFT Cl. 27', rawName: 'Pemipaan Jalur EDV menuju AFT Uji Cluster 27', rencana: 1.96, realisasi: 0.00 },
        { id: 4, name: 'Pengadaan Master\nValve LHD-31', rawName: 'Pengadaan Master Valve LHD-31 size 12"#900', rencana: 2.21, realisasi: 0.00 },
        { id: 5, name: '1 Set Aktuator\nMCV Unit 5&6', rawName: 'Pengadaan 1 set Aktuator MCV untuk PLTP LHD Unit 5&6', rencana: 7.16, realisasi: 0.00 },
        { id: 6, name: 'Perbaikan Main\nSteam Line Unit 1-4', rawName: 'Perbaikan Fasilitas Main Steam Line LHD Unit 1-4', rencana: 4.22, realisasi: 0.00 },
        { id: 7, name: 'Pembelian PSV\nUnit 1-4*', rawName: 'Pembelian PSV Unit 1-4*', rencana: 2.70, realisasi: 0.00 },
        { id: 8, name: 'Pemboran Sumur\nMake-Up TPS-P1.2*', rawName: 'Pemboran Sumur Make-Up TPS-P1.2*', rencana: 110.12, realisasi: 2.11, diff: '-98,08%', isBroken: true },
        { id: 9, name: 'Surveillance\nSystem LHD*', rawName: 'Perbaikan Surveillance System Area Lahendong*', rencana: 2.30, realisasi: 0.00 },
        { id: 10, name: 'Pemagaran Pagar\nBalong Cluster*', rawName: 'Pemagaran dan perbaikan pagar balong cluster*', rencana: 5.91, realisasi: 0.00 },
        { id: 11, name: 'TA Area LHD\nUnit 5&6', rawName: 'TA Area Lahendong Unit 5&6', rencana: 79.98, realisasi: 5.05, diff: '-93,69%', isBroken: true },
    ],
    className = '',
    onClick,
}) {
    const [hoveredIdx, setHoveredIdx] = useState(null);

    const SVG_WIDTH = 1020;
    const SVG_HEIGHT = 440;
    const PADDING = { top: 50, bottom: 95, left: 55, right: 35 };

    const chartWidth = SVG_WIDTH - PADDING.left - PADDING.right;
    const chartHeight = SVG_HEIGHT - PADDING.top - PADDING.bottom;
    const baselineY = SVG_HEIGHT - PADDING.bottom;

    // Normal scale for 0 to 16, broken non-linear scale above 16
    const mapValueToHeight = (val) => {
        if (val <= 0) return 0;
        if (val <= 16) {
            // 0 - 16 maps to 0% - 46% of chart height
            return (val / 16) * (chartHeight * 0.46);
        } else if (val <= 85) {
            // 16 - 85 maps to 48% - 82% of chart height
            const ratio = (val - 16) / (85 - 16);
            return chartHeight * 0.48 + ratio * (chartHeight * 0.34);
        } else {
            // 85 - 115 maps to 85% - 98% of chart height
            const ratio = Math.min(1, (val - 85) / (115 - 85));
            return chartHeight * 0.85 + ratio * (chartHeight * 0.13);
        }
    };

    const numGroups = data.length;
    const groupWidth = chartWidth / numGroups;
    const barWidth = 17;
    const barGap = 3;

    const groupCoords = data.map((item, i) => {
        const groupCenterX = PADDING.left + i * groupWidth + groupWidth / 2;
        const rencanaX = groupCenterX - barWidth - barGap / 2;
        const realisasiX = groupCenterX + barGap / 2;

        const rencanaH = mapValueToHeight(item.rencana);
        const realisasiH = mapValueToHeight(item.realisasi);

        const rencanaY = baselineY - rencanaH;
        const realisasiY = baselineY - realisasiH;

        return {
            ...item,
            index: i,
            groupCenterX,
            rencanaX,
            realisasiX,
            rencanaH,
            realisasiH,
            rencanaY,
            realisasiY,
        };
    });

    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col relative select-none ${
                onClick ? 'cursor-pointer hover:border-slate-300' : ''
            } ${className}`}
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                <div>
                    <h3 className="text-base font-black text-slate-800 tracking-tight">Realisasi Biaya ABI 2026</h3>
                    <p className="text-[11px] text-slate-500 font-bold mt-0.5">Update per 21 Agustus 2026 (Anggaran Investasi dalam IDR Miliar)</p>
                </div>
                {/* Legend */}
                <div className="flex items-center gap-4 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold">
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-xs bg-[#3B82F6]" />
                        <span className="text-slate-700">Rencana</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-xs bg-[#72B340]" />
                        <span className="text-slate-700">Realisasi</span>
                    </div>
                </div>
            </div>

            {/* Canvas */}
            <div className="relative w-full flex-1 min-h-[350px]">
                <svg
                    viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        <filter id="badgeShadowAbi" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.10" />
                        </filter>
                        <marker
                            id="arrowDownAbi"
                            markerWidth="6"
                            markerHeight="6"
                            refX="3"
                            refY="5"
                            orient="auto"
                        >
                            <path d="M0,0 L6,0 L3,5 Z" fill="#334155" />
                        </marker>
                    </defs>

                    {/* Y-Axis Label */}
                    <text
                        x={16}
                        y={baselineY - chartHeight / 2}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="700"
                        fill="#64748b"
                        transform={`rotate(-90, 16, ${baselineY - chartHeight / 2})`}
                    >
                        IDR Miliar
                    </text>

                    {/* Left Broken Axis Symbol on Y-Axis */}
                    <g transform={`translate(${PADDING.left - 10}, ${baselineY - chartHeight * 0.47})`}>
                        <line x1="0" y1="0" x2="16" y2="-6" stroke="#475569" strokeWidth="1.5" />
                        <line x1="0" y1="6" x2="16" y2="0" stroke="#475569" strokeWidth="1.5" />
                    </g>
                    <g transform={`translate(${PADDING.left - 10}, ${baselineY - chartHeight * 0.83})`}>
                        <line x1="0" y1="0" x2="16" y2="-6" stroke="#475569" strokeWidth="1.5" />
                        <line x1="0" y1="6" x2="16" y2="0" stroke="#475569" strokeWidth="1.5" />
                    </g>

                    {/* Baseline */}
                    <line
                        x1={PADDING.left - 5}
                        y1={baselineY}
                        x2={SVG_WIDTH - PADDING.right + 5}
                        y2={baselineY}
                        stroke="#475569"
                        strokeWidth="1.2"
                    />

                    {/* Bars & Connectors */}
                    {groupCoords.map((g, i) => {
                        const isHovered = hoveredIdx === i;

                        return (
                            <g
                                key={g.id}
                                className="cursor-pointer transition-all duration-150"
                                onMouseEnter={() => setHoveredIdx(i)}
                                onMouseLeave={() => setHoveredIdx(null)}
                            >
                                {/* Rencana Bar (Blue) */}
                                <rect
                                    x={g.rencanaX}
                                    y={g.rencanaY}
                                    width={barWidth}
                                    height={g.rencanaH}
                                    rx="2"
                                    fill={isHovered ? '#2563EB' : '#3B82F6'}
                                />
                                {/* Rencana Label */}
                                <text
                                    x={g.rencanaX + barWidth / 2}
                                    y={g.rencanaY - 4}
                                    textAnchor="middle"
                                    fontSize="9.5"
                                    fontWeight="800"
                                    fill="#1e293b"
                                >
                                    {g.rencana.toFixed(2).replace('.', ',')}
                                </text>

                                {/* Realisasi Bar (Green) */}
                                <rect
                                    x={g.realisasiX}
                                    y={g.realisasiY}
                                    width={barWidth}
                                    height={Math.max(2, g.realisasiH)}
                                    rx="2"
                                    fill={isHovered ? '#5E9F30' : '#72B340'}
                                />
                                {/* Realisasi Label */}
                                <text
                                    x={g.realisasiX + barWidth / 2}
                                    y={g.realisasiY - 4}
                                    textAnchor="middle"
                                    fontSize="9.5"
                                    fontWeight="800"
                                    fill={g.realisasi > 0 ? '#166534' : '#64748b'}
                                >
                                    {g.realisasi.toFixed(2).replace('.', ',')}
                                </text>

                                {/* Broken Axis Cutout marks on large bars */}
                                {g.isBroken && (
                                    <g transform={`translate(${g.rencanaX - 3}, ${baselineY - chartHeight * 0.47})`}>
                                        <rect x="0" y="0" width={barWidth + 6} height="8" fill="#ffffff" />
                                        <line x1="0" y1="2" x2={barWidth + 6} y2="-2" stroke="#475569" strokeWidth="1.2" />
                                        <line x1="0" y1="8" x2={barWidth + 6} y2="4" stroke="#475569" strokeWidth="1.2" />
                                    </g>
                                )}

                                {/* Stepped comparison bracket from Rencana to Realisasi */}
                                {g.diff && (
                                    <g>
                                        <path
                                            d={`M ${g.rencanaX + barWidth / 2} ${g.rencanaY} L ${g.realisasiX + barWidth + 10} ${g.rencanaY} L ${g.realisasiX + barWidth + 10} ${g.realisasiY} L ${g.realisasiX + barWidth} ${g.realisasiY}`}
                                            fill="none"
                                            stroke="#334155"
                                            strokeWidth="1.2"
                                            strokeDasharray="2 2"
                                            markerEnd="url(#arrowDownAbi)"
                                        />
                                        {/* Diff Pill Badge */}
                                        <g transform={`translate(${g.realisasiX + barWidth + 14}, ${(g.rencanaY + g.realisasiY) / 2})`}>
                                            <rect
                                                x="-19"
                                                y="-8"
                                                width="38"
                                                height="16"
                                                rx="8"
                                                fill="#ffffff"
                                                stroke="#334155"
                                                strokeWidth="1"
                                                filter="url(#badgeShadowAbi)"
                                            />
                                            <text
                                                x="0"
                                                y="3"
                                                textAnchor="middle"
                                                fontSize="8"
                                                fontWeight="800"
                                                fill="#0f172a"
                                            >
                                                {g.diff}
                                            </text>
                                        </g>
                                    </g>
                                )}

                                {/* X-Axis Project Name Label */}
                                <text
                                    x={g.groupCenterX}
                                    y={baselineY + 14}
                                    textAnchor="middle"
                                    fontSize="8.5"
                                    fontWeight="700"
                                    fill={isHovered ? '#00529C' : '#475569'}
                                >
                                    {g.name.split('\n').map((line, lIdx) => (
                                        <tspan key={lIdx} x={g.groupCenterX} dy={lIdx > 0 ? 10 : 0}>
                                            {line}
                                        </tspan>
                                    ))}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* Hover Tooltip */}
                {hoveredIdx !== null && groupCoords[hoveredIdx] && (
                    <div
                        className="absolute z-20 pointer-events-none bg-slate-900/90 text-white text-xs p-3 rounded-2xl shadow-xl border border-slate-700 backdrop-blur-xs max-w-xs"
                        style={{
                            left: `${(groupCoords[hoveredIdx].groupCenterX / SVG_WIDTH) * 100}%`,
                            top: '5%',
                            transform: 'translate(-50%, -100%)',
                        }}
                    >
                        <div className="font-black text-amber-400 text-[11px] leading-tight mb-1">
                            {groupCoords[hoveredIdx].rawName}
                        </div>
                        <div className="text-white text-[11px]">
                            Rencana: <span className="font-extrabold text-blue-300">Rp {groupCoords[hoveredIdx].rencana.toFixed(2)} Miliar</span>
                        </div>
                        <div className="text-white text-[11px]">
                            Realisasi: <span className="font-extrabold text-emerald-400">Rp {groupCoords[hoveredIdx].realisasi.toFixed(2)} Miliar</span>
                        </div>
                        {groupCoords[hoveredIdx].diff && (
                            <div className="text-slate-300 text-[10px] mt-0.5">
                                Serapan vs Rencana: <span className="font-bold text-rose-300">{groupCoords[hoveredIdx].diff}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
