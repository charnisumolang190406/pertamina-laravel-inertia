import React, { useState } from 'react';

/**
 * Formats numbers into clean string with 2 decimal places.
 */
function formatValue(val) {
    if (val === undefined || val === null || isNaN(val)) return '-';
    const num = Number(val);
    return num.toFixed(2);
}

/**
 * ReliabilityUnitChart — Pixel-perfect interactive SVG chart for PGE Reliability slides.
 * Features:
 * - Title badge (e.g. EAF (%) Unit 1)
 * - Muted line for 2019–2025 with label on top of each node
 * - Highlighted deep teal-green line for 2025–2026 YTD with teal dots and bold green text
 * - Diff YoY comparison badge with arched arrow indicator between 2025 and 2026 YTD
 * - Hover tooltip and click handler
 */
export default function ReliabilityUnitChart({
    title,
    data = [], // [{ year: '2019', value: 99.86 }, ...]
    diff = null, // e.g. '+0,69%' or '-4,81%' or '0,00%'
    isPositive = true, // is diff favorable?
    unit = '%',
    yDomain = null, // [min, max] or auto
    className = '',
    onClick,
}) {
    const [hoveredIdx, setHoveredIdx] = useState(null);

    // Coordinate space for SVG
    const SVG_WIDTH = 380;
    const SVG_HEIGHT = 180;
    const PADDING = { top: 38, bottom: 32, left: 16, right: 18 };

    const chartWidth = SVG_WIDTH - PADDING.left - PADDING.right;
    const chartHeight = SVG_HEIGHT - PADDING.top - PADDING.bottom;
    const baselineY = SVG_HEIGHT - PADDING.bottom;

    // Calculate domain
    const values = data.map(d => Number(d.value)).filter(v => !isNaN(v));
    const rawMin = values.length > 0 ? Math.min(...values) : 0;
    const rawMax = values.length > 0 ? Math.max(...values) : 100;

    let computedMin = yDomain ? yDomain[0] : (rawMin === rawMax ? (rawMin === 0 ? 0 : rawMin * 0.9) : Math.max(0, rawMin - (rawMax - rawMin) * 0.25));
    let computedMax = yDomain ? yDomain[1] : (rawMin === rawMax ? (rawMax === 0 ? 10 : rawMax * 1.15) : rawMax + (rawMax - rawMin) * 0.28);

    if (computedMax === computedMin) {
        computedMax += 1;
    }

    const range = computedMax - computedMin;
    const numPoints = data.length;
    const stepX = numPoints > 1 ? chartWidth / (numPoints - 1) : chartWidth;

    // Map data points to coordinates
    const points = data.map((d, i) => {
        const x = PADDING.left + i * stepX;
        const normalized = (Number(d.value) - computedMin) / range;
        const clampedNorm = Math.max(0, Math.min(1, normalized));
        const y = baselineY - clampedNorm * chartHeight;
        return {
            ...d,
            x,
            y,
            index: i,
            isCurrent: i >= numPoints - 2, // 2025 and 2026 YTD
        };
    });

    // Segment 1: 2019 to 2025 (indices 0 to numPoints - 2)
    const histPoints = points.slice(0, numPoints - 1);
    const histPathD = histPoints.length > 1
        ? histPoints.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '')
        : '';

    // Segment 2: 2025 to 2026 YTD (indices numPoints - 2 to numPoints - 1)
    const targetPoints = points.slice(Math.max(0, numPoints - 2));
    const targetPathD = targetPoints.length > 1
        ? `M ${targetPoints[0].x} ${targetPoints[0].y} L ${targetPoints[1].x} ${targetPoints[1].y}`
        : '';

    // Diff bracket calculation (between 2025 and 2026 YTD)
    const p2025 = points[numPoints - 2];
    const p2026 = points[numPoints - 1];

    let diffBracket = null;
    if (p2025 && p2026 && diff !== null && diff !== undefined) {
        const higherY = Math.min(p2025.y, p2026.y);
        const bracketTopY = Math.max(12, higherY - 26);
        const midX = (p2025.x + p2026.x) / 2;
        diffBracket = {
            p1: p2025,
            p2: p2026,
            bracketTopY,
            midX,
            diff,
            isPositive,
        };
    }

    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 p-4 flex flex-col relative group ${
                onClick ? 'cursor-pointer hover:border-slate-300' : ''
            } ${className}`}
        >
            {/* Header / Title Pill Badge */}
            <div className="flex justify-between items-center mb-1">
                <div className="inline-flex items-center px-3 py-1 bg-white border border-slate-300/80 rounded-lg shadow-2xs">
                    <span className="text-[11px] font-extrabold text-slate-700 tracking-tight">{title}</span>
                </div>
            </div>

            {/* SVG Visual Canvas */}
            <div className="relative w-full flex-1 select-none min-h-[150px]">
                <svg
                    viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        <filter id="diffBadgeShadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.10" />
                        </filter>
                        <marker
                            id="diffArrowGreen"
                            markerWidth="5"
                            markerHeight="5"
                            refX="2.5"
                            refY="4.5"
                            orient="auto"
                        >
                            <path d="M0,0 L5,0 L2.5,4.5 Z" fill="#1b7b64" />
                        </marker>
                        <marker
                            id="diffArrowRed"
                            markerWidth="5"
                            markerHeight="5"
                            refX="2.5"
                            refY="4.5"
                            orient="auto"
                        >
                            <path d="M0,0 L5,0 L2.5,4.5 Z" fill="#dc2626" />
                        </marker>
                    </defs>

                    {/* Y-Axis Line */}
                    <line
                        x1={PADDING.left}
                        y1={PADDING.top - 18}
                        x2={PADDING.left}
                        y2={baselineY}
                        stroke="#475569"
                        strokeWidth="1.2"
                    />

                    {/* X-Axis Line */}
                    <line
                        x1={PADDING.left}
                        y1={baselineY}
                        x2={SVG_WIDTH - PADDING.right + 8}
                        y2={baselineY}
                        stroke="#475569"
                        strokeWidth="1.2"
                    />

                    {/* Diff YoY Bracket & Badge between 2025 and 2026 YTD */}
                    {diffBracket && (
                        <g>
                            {/* Stepped connector line */}
                            <path
                                d={`M ${diffBracket.p1.x} ${diffBracket.p1.y - 12} L ${diffBracket.p1.x} ${diffBracket.bracketTopY} L ${diffBracket.p2.x} ${diffBracket.bracketTopY} L ${diffBracket.p2.x} ${diffBracket.p2.y - 10}`}
                                fill="none"
                                stroke={diffBracket.isPositive ? '#1b7b64' : '#dc2626'}
                                strokeWidth="1"
                                markerEnd={diffBracket.isPositive ? 'url(#diffArrowGreen)' : 'url(#diffArrowRed)'}
                            />
                            {/* Pill Badge */}
                            <g transform={`translate(${diffBracket.midX}, ${diffBracket.bracketTopY})`}>
                                <rect
                                    x="-22"
                                    y="-8.5"
                                    width="44"
                                    height="17"
                                    rx="8.5"
                                    fill={diffBracket.isPositive ? '#f0fdf4' : '#fef2f2'}
                                    stroke={diffBracket.isPositive ? '#1b7b64' : '#dc2626'}
                                    strokeWidth="1"
                                    filter="url(#diffBadgeShadow)"
                                />
                                <text
                                    x="0"
                                    y="3.2"
                                    textAnchor="middle"
                                    fontSize="8.5"
                                    fontWeight="800"
                                    fill={diffBracket.isPositive ? '#166534' : '#b91c1c'}
                                >
                                    {diffBracket.diff}
                                </text>
                            </g>
                        </g>
                    )}

                    {/* Historical Line Segment (2019 to 2025) */}
                    {histPathD && (
                        <path
                            d={histPathD}
                            fill="none"
                            stroke="#8fa89b"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    )}

                    {/* Highlight Target Line Segment (2025 to 2026 YTD) */}
                    {targetPathD && (
                        <path
                            d={targetPathD}
                            fill="none"
                            stroke="#1b7b64"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    )}

                    {/* Dots and Labels */}
                    {points.map((pt, i) => {
                        const isHighlight = i >= numPoints - 2; // 2025 and 2026 YTD
                        const isHovered = hoveredIdx === i;
                        const labelY = pt.y - 6;

                        return (
                            <g key={pt.year} className="cursor-pointer">
                                {/* Dot */}
                                {isHighlight ? (
                                    <circle
                                        cx={pt.x}
                                        cy={pt.y}
                                        r={isHovered ? 5.5 : 4}
                                        fill="#1b7b64"
                                        stroke="#ffffff"
                                        strokeWidth="1.5"
                                        className="transition-all duration-150"
                                    />
                                ) : (
                                    <circle
                                        cx={pt.x}
                                        cy={pt.y}
                                        r={isHovered ? 4 : 2}
                                        fill={isHovered ? '#0f766e' : '#8fa89b'}
                                        stroke="#ffffff"
                                        strokeWidth="1"
                                    />
                                )}

                                {/* Value Label above point */}
                                <text
                                    x={pt.x}
                                    y={labelY}
                                    textAnchor="middle"
                                    fontSize={isHighlight ? '9.5' : '8.5'}
                                    fontWeight={isHighlight ? '800' : '600'}
                                    fill={isHighlight ? '#166534' : '#334155'}
                                >
                                    {formatValue(pt.value)}
                                </text>

                                {/* X-Axis Year Label */}
                                <text
                                    x={pt.x}
                                    y={baselineY + 14}
                                    textAnchor="middle"
                                    fontSize="8.5"
                                    fontWeight={isHighlight ? '800' : '600'}
                                    fill={isHighlight ? '#0f172a' : '#475569'}
                                >
                                    {pt.year.includes('YTD') ? (
                                        <>
                                            <tspan x={pt.x} dy="0">2026</tspan>
                                            <tspan x={pt.x} dy="9" fontSize="7.5" fontWeight="700" fill="#64748b">YTD</tspan>
                                        </>
                                    ) : (
                                        pt.year
                                    )}
                                </text>

                                {/* Hover Target Area */}
                                <rect
                                    x={pt.x - stepX / 2}
                                    y={PADDING.top - 10}
                                    width={stepX}
                                    height={chartHeight + PADDING.bottom}
                                    fill="transparent"
                                    onMouseEnter={() => setHoveredIdx(i)}
                                    onMouseLeave={() => setHoveredIdx(null)}
                                />
                            </g>
                        );
                    })}
                </svg>

                {/* Hover Tooltip Overlay */}
                {hoveredIdx !== null && points[hoveredIdx] && (
                    <div
                        className="absolute z-20 pointer-events-none bg-slate-900/90 text-white text-[10px] px-2.5 py-1.5 rounded-lg shadow-lg border border-slate-700 backdrop-blur-xs transition-all duration-100"
                        style={{
                            left: `${(points[hoveredIdx].x / SVG_WIDTH) * 100}%`,
                            top: `${Math.max(10, (points[hoveredIdx].y / SVG_HEIGHT) * 100 - 24)}%`,
                            transform: 'translate(-50%, -100%)',
                        }}
                    >
                        <div className="font-extrabold text-emerald-400">{title} — {points[hoveredIdx].year}</div>
                        <div className="font-black text-[12px] text-white">
                            {formatValue(points[hoveredIdx].value)} <span className="text-[9px] text-slate-300">{unit}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
