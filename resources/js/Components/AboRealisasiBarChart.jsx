import React, { useState } from 'react';

/**
 * AboRealisasiBarChart — Custom SVG chart for Realisasi ABO 2026 Area Lahendong per Fungsi.
 * Features:
 * - Budget (Blue) vs Actual (Green) bars for each function & TOTAL
 * - Broken-axis visual indicators for large bars (Bus. Support 47.80 M & TOTAL 74.84 M)
 * - Difference comparison badges with downward arrows (-72.2%, -53.1%, etc.)
 * - Numerical value labels on top of bars
 * - Hover tooltip and clean aesthetic
 */
export default function AboRealisasiBarChart({
    data = [
        { fungsi: 'Operation', budget: 6.47, actual: 1.80, diff: '-72,2%' },
        { fungsi: 'Maintenance', budget: 11.19, actual: 5.24, diff: '-53,1%' },
        { fungsi: 'GM', budget: 0.37, actual: 0.26, diff: '-29,6%' },
        { fungsi: 'HSSE', budget: 6.73, actual: 2.25, diff: '-66,6%' },
        { fungsi: 'Bus.\nSupport', rawName: 'Bus. Support', budget: 47.80, actual: 26.61, diff: '-44,3%', isBroken: true },
        { fungsi: 'GPR', budget: 2.28, actual: 1.40, diff: '-39%' },
        { fungsi: 'TOTAL', budget: 74.84, actual: 37.55, diff: '-50%', isTotal: true, isBroken: true },
    ],
    className = '',
    onClick,
}) {
    const [hoveredIdx, setHoveredIdx] = useState(null);

    const SVG_WIDTH = 680;
    const SVG_HEIGHT = 380;
    const PADDING = { top: 45, bottom: 50, left: 55, right: 30 };

    const chartWidth = SVG_WIDTH - PADDING.left - PADDING.right;
    const chartHeight = SVG_HEIGHT - PADDING.top - PADDING.bottom;
    const baselineY = SVG_HEIGHT - PADDING.bottom;

    // Normal scale mapping for values <= 12, non-linear compressed mapping above 12 for broken axis
    const mapValueToHeight = (val) => {
        if (val <= 12) {
            // Normal scale: 0 to 12 maps to 0% - 42% of chart height
            return (val / 12) * (chartHeight * 0.42);
        } else if (val <= 50) {
            // Broken scale 1: 12 to 50 maps to 45% - 82% of chart height
            const ratio = (val - 12) / (50 - 12);
            return chartHeight * 0.45 + ratio * (chartHeight * 0.37);
        } else {
            // Broken scale 2: 50 to 80 maps to 85% - 98% of chart height
            const ratio = Math.min(1, (val - 50) / (80 - 50));
            return chartHeight * 0.85 + ratio * (chartHeight * 0.13);
        }
    };

    const numGroups = data.length;
    const groupWidth = chartWidth / numGroups;
    const barWidth = 18;
    const barGap = 3;

    const groupCoords = data.map((item, i) => {
        const groupCenterX = PADDING.left + i * groupWidth + groupWidth / 2;
        const budgetX = groupCenterX - barWidth - barGap / 2;
        const actualX = groupCenterX + barGap / 2;

        const budgetH = mapValueToHeight(item.budget);
        const actualH = mapValueToHeight(item.actual);

        const budgetY = baselineY - budgetH;
        const actualY = baselineY - actualH;

        return {
            ...item,
            index: i,
            groupCenterX,
            budgetX,
            actualX,
            budgetH,
            actualH,
            budgetY,
            actualY,
        };
    });

    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-3xl border border-slate-200 shadow-xs p-5 flex flex-col relative group select-none ${
                onClick ? 'cursor-pointer hover:border-slate-300' : ''
            } ${className}`}
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">Realisasi ABO 2026 Area Lahendong</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">Update per 21 Agustus 2026 (IDR Miliar)</p>
                </div>
                {/* Legend */}
                <div className="flex items-center gap-4 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold">
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-xs bg-[#3B82F6]" />
                        <span className="text-slate-700">Budget</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-xs bg-[#72B340]" />
                        <span className="text-slate-700">Actual</span>
                    </div>
                </div>
            </div>

            {/* Canvas */}
            <div className="relative w-full flex-1 min-h-[300px]">
                <svg
                    viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        <filter id="badgeShadowAbo" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.10" />
                        </filter>
                        <marker
                            id="arrowDownAbo"
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
                    <g transform={`translate(${PADDING.left - 10}, ${baselineY - chartHeight * 0.43})`}>
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
                        const higherY = Math.min(g.budgetY, g.actualY);
                        const bracketY = higherY - 14;

                        return (
                            <g
                                key={g.fungsi}
                                className="cursor-pointer transition-all duration-150"
                                onMouseEnter={() => setHoveredIdx(i)}
                                onMouseLeave={() => setHoveredIdx(null)}
                            >
                                {/* Budget Bar (Blue) */}
                                <rect
                                    x={g.budgetX}
                                    y={g.budgetY}
                                    width={barWidth}
                                    height={g.budgetH}
                                    rx="2"
                                    fill={isHovered ? '#2563EB' : '#3B82F6'}
                                />
                                {/* Budget Label */}
                                <text
                                    x={g.budgetX + barWidth / 2}
                                    y={g.budgetY - 4}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fontWeight="800"
                                    fill="#1e293b"
                                >
                                    {g.budget.toFixed(2).replace('.', ',')}
                                </text>

                                {/* Actual Bar (Green) */}
                                <rect
                                    x={g.actualX}
                                    y={g.actualY}
                                    width={barWidth}
                                    height={g.actualH}
                                    rx="2"
                                    fill={isHovered ? '#5E9F30' : '#72B340'}
                                />
                                {/* Actual Label */}
                                <text
                                    x={g.actualX + barWidth / 2}
                                    y={g.actualY - 4}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fontWeight="800"
                                    fill="#1e293b"
                                >
                                    {g.actual.toFixed(2).replace('.', ',')}
                                </text>

                                {/* Broken Axis Cutout marks on large bars */}
                                {g.isBroken && (
                                    <>
                                        <g transform={`translate(${g.budgetX - 3}, ${baselineY - chartHeight * 0.44})`}>
                                            <rect x="0" y="0" width={barWidth + 6} height="8" fill="#ffffff" />
                                            <line x1="0" y1="2" x2={barWidth + 6} y2="-2" stroke="#475569" strokeWidth="1.2" />
                                            <line x1="0" y1="8" x2={barWidth + 6} y2="4" stroke="#475569" strokeWidth="1.2" />
                                        </g>
                                        <g transform={`translate(${g.actualX - 3}, ${baselineY - chartHeight * 0.44})`}>
                                            <rect x="0" y="0" width={barWidth + 6} height="8" fill="#ffffff" />
                                            <line x1="0" y1="2" x2={barWidth + 6} y2="-2" stroke="#475569" strokeWidth="1.2" />
                                            <line x1="0" y1="8" x2={barWidth + 6} y2="4" stroke="#475569" strokeWidth="1.2" />
                                        </g>
                                    </>
                                )}

                                {/* Stepped comparison bracket from Budget to Actual */}
                                {g.diff && (
                                    <g>
                                        <path
                                            d={`M ${g.budgetX + barWidth / 2} ${g.budgetY} L ${g.actualX + barWidth + 12} ${g.budgetY} L ${g.actualX + barWidth + 12} ${g.actualY} L ${g.actualX + barWidth} ${g.actualY}`}
                                            fill="none"
                                            stroke="#334155"
                                            strokeWidth="1.2"
                                            strokeDasharray="2 2"
                                            markerEnd="url(#arrowDownAbo)"
                                        />
                                        {/* Diff Pill Badge */}
                                        <g transform={`translate(${g.actualX + barWidth + 16}, ${(g.budgetY + g.actualY) / 2})`}>
                                            <rect
                                                x="-16"
                                                y="-8"
                                                width="32"
                                                height="16"
                                                rx="8"
                                                fill="#ffffff"
                                                stroke="#334155"
                                                strokeWidth="1"
                                                filter="url(#badgeShadowAbo)"
                                            />
                                            <text
                                                x="0"
                                                y="3"
                                                textAnchor="middle"
                                                fontSize="8.5"
                                                fontWeight="800"
                                                fill="#0f172a"
                                            >
                                                {g.diff}
                                            </text>
                                        </g>
                                    </g>
                                )}

                                {/* X-Axis Function Label */}
                                <text
                                    x={g.groupCenterX}
                                    y={baselineY + 16}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fontWeight={g.isTotal ? '900' : '700'}
                                    fill={g.isTotal ? '#00529C' : '#334155'}
                                >
                                    {g.fungsi.split('\n').map((line, lIdx) => (
                                        <tspan key={lIdx} x={g.groupCenterX} dy={lIdx > 0 ? 11 : 0}>
                                            {line}
                                        </tspan>
                                    ))}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* Hover Tooltip Overlay */}
                {hoveredIdx !== null && groupCoords[hoveredIdx] && (
                    <div
                        className="absolute z-20 pointer-events-none bg-slate-900/90 text-white text-[11px] p-2.5 rounded-xl shadow-xl border border-slate-700 backdrop-blur-xs"
                        style={{
                            left: `${(groupCoords[hoveredIdx].groupCenterX / SVG_WIDTH) * 100}%`,
                            top: '8%',
                            transform: 'translate(-50%, -100%)',
                        }}
                    >
                        <div className="font-black text-amber-400">{groupCoords[hoveredIdx].rawName || groupCoords[hoveredIdx].fungsi}</div>
                        <div className="text-white mt-1">
                            Budget: <span className="font-extrabold text-blue-300">Rp {groupCoords[hoveredIdx].budget.toFixed(2)} Miliar</span>
                        </div>
                        <div className="text-white">
                            Actual: <span className="font-extrabold text-emerald-400">Rp {groupCoords[hoveredIdx].actual.toFixed(2)} Miliar</span>
                        </div>
                        <div className="text-slate-300 text-[10px] mt-0.5">
                            Deviasi: <span className="font-bold text-rose-300">{groupCoords[hoveredIdx].diff}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
