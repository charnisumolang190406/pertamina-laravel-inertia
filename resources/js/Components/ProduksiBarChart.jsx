import React, { useState } from 'react';

/**
 * ProduksiBarChart — Custom interactive SVG bar chart mimicking the PGE production achievement slide.
 * Features:
 * - Green bars for each year (2019 - 2025)
 * - Exact production numbers directly on top of each bar
 * - Year-over-Year (YoY) percentage difference bracket & badge between consecutive bars
 * - Top overarching growth trend arrow
 * - Hover tooltips and active state styling
 */
export default function ProduksiBarChart({
    data = [
        { tahun: '2019', nilai: 820 },
        { tahun: '2020', nilai: 828, diff: '+0.98%', isPositive: true },
        { tahun: '2021', nilai: 775, diff: '-6.40%', isPositive: false },
        { tahun: '2022', nilai: 864, diff: '+11.48%', isPositive: true },
        { tahun: '2023', nilai: 869, diff: '+0.58%', isPositive: true },
        { tahun: '2024', nilai: 872, diff: '+0.35%', isPositive: true },
        { tahun: '2025', nilai: 849, diff: '-2.64%', isPositive: false },
    ],
    className = '',
    height = '100%',
}) {
    const [hoveredIdx, setHoveredIdx] = useState(null);

    // Coordinate space
    const SVG_WIDTH = 760;
    const SVG_HEIGHT = 310;
    const PADDING = { top: 48, bottom: 35, left: 35, right: 35 };

    const chartWidth = SVG_WIDTH - PADDING.left - PADDING.right;
    const chartHeight = SVG_HEIGHT - PADDING.top - PADDING.bottom;

    const maxVal = 1000;
    const barWidth = 44;
    const numBars = data.length;
    const stepX = chartWidth / (numBars);

    // Calculate center X and top Y for each bar
    const barCoords = data.map((d, i) => {
        const x = PADDING.left + i * stepX + (stepX - barWidth) / 2;
        const centerX = x + barWidth / 2;
        const barH = (d.nilai / maxVal) * chartHeight;
        const y = SVG_HEIGHT - PADDING.bottom - barH;
        return { ...d, x, centerX, y, barH };
    });

    const baselineY = SVG_HEIGHT - PADDING.bottom;

    return (
        <div className={`relative w-full h-full select-none ${className}`}>
            <svg
                viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                className="w-full h-full overflow-visible"
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <linearGradient id="pertaminaBarGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#72B340" />
                        <stop offset="100%" stopColor="#55992E" />
                    </linearGradient>
                    <linearGradient id="pertaminaBarGradHover" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#82C848" />
                        <stop offset="100%" stopColor="#63AB34" />
                    </linearGradient>
                    <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.12" />
                    </filter>
                    <marker
                        id="arrowHead"
                        markerWidth="6"
                        markerHeight="6"
                        refX="4"
                        refY="3"
                        orient="auto"
                    >
                        <path d="M0,1 L5,3 L0,5 Z" fill="#334155" />
                    </marker>
                    <marker
                        id="bracketArrowDown"
                        markerWidth="5"
                        markerHeight="5"
                        refX="2.5"
                        refY="4"
                        orient="auto"
                    >
                        <path d="M0,0 L5,0 L2.5,4 Z" fill="#475569" />
                    </marker>
                </defs>

                {/* Subtle horizontal grid lines */}
                {[200, 400, 600, 800, 1000].map((tick) => {
                    const gridY = baselineY - (tick / maxVal) * chartHeight;
                    return (
                        <g key={tick}>
                            <line
                                x1={PADDING.left - 10}
                                y1={gridY}
                                x2={SVG_WIDTH - PADDING.right + 10}
                                y2={gridY}
                                stroke="#f1f5f9"
                                strokeDasharray="3 3"
                                strokeWidth="1"
                            />
                            <text
                                x={PADDING.left - 14}
                                y={gridY + 3.5}
                                textAnchor="end"
                                fontSize="9"
                                fill="#94a3b8"
                                fontWeight="600"
                            >
                                {tick}
                            </text>
                        </g>
                    );
                })}

                {/* Baseline Axis */}
                <line
                    x1={PADDING.left - 10}
                    y1={baselineY}
                    x2={SVG_WIDTH - PADDING.right + 10}
                    y2={baselineY}
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                />

                {/* Top overarching trend line/arrow (2019 to 2025) */}
                {barCoords.length >= 2 && (
                    <g>
                        <path
                            d={`M ${barCoords[0].centerX - 10} ${PADDING.top - 28} L ${barCoords[barCoords.length - 1].centerX + 15} ${PADDING.top - 36}`}
                            stroke="#334155"
                            strokeWidth="1.8"
                            markerEnd="url(#arrowHead)"
                        />
                        {/* Overall growth badge */}
                        <g transform={`translate(${(barCoords[0].centerX + barCoords[barCoords.length - 1].centerX) / 2}, ${PADDING.top - 33})`}>
                            <rect
                                x="-32"
                                y="-11"
                                width="64"
                                height="20"
                                rx="10"
                                ry="10"
                                fill="#ffffff"
                                stroke="#0f172a"
                                strokeWidth="1.2"
                                filter="url(#badgeShadow)"
                            />
                            <text
                                x="0"
                                y="3"
                                textAnchor="middle"
                                fontSize="10"
                                fontWeight="800"
                                fill="#0f172a"
                            >
                                +0,58%
                            </text>
                        </g>
                    </g>
                )}

                {/* Consecutive YoY Difference Brackets & Badges */}
                {barCoords.map((bar, i) => {
                    if (i === 0) return null;
                    const prevBar = barCoords[i - 1];
                    const bracketY = Math.min(prevBar.y, bar.y) - 18;
                    const midX = (prevBar.centerX + bar.centerX) / 2;
                    const diffText = bar.diff || `${((bar.nilai - prevBar.nilai) / prevBar.nilai * 100).toFixed(2)}%`;
                    const isPos = bar.isPositive ?? (bar.nilai >= prevBar.nilai);

                    return (
                        <g key={`diff-${i}`}>
                            {/* Stepped connector line */}
                            <path
                                d={`M ${prevBar.centerX} ${prevBar.y - 12} L ${prevBar.centerX} ${bracketY} L ${bar.centerX} ${bracketY} L ${bar.centerX} ${bar.y - 12}`}
                                fill="none"
                                stroke="#64748b"
                                strokeWidth="1.2"
                                markerEnd="url(#bracketArrowDown)"
                            />

                            {/* Pill Badge */}
                            <g transform={`translate(${midX}, ${bracketY})`}>
                                <rect
                                    x="-27"
                                    y="-9"
                                    width="54"
                                    height="18"
                                    rx="9"
                                    ry="9"
                                    fill={isPos ? '#f0fdf4' : '#fef2f2'}
                                    stroke={isPos ? '#22c55e' : '#ef4444'}
                                    strokeWidth="1.2"
                                    filter="url(#badgeShadow)"
                                />
                                <text
                                    x="0"
                                    y="3.5"
                                    textAnchor="middle"
                                    fontSize="9.5"
                                    fontWeight="800"
                                    fill={isPos ? '#15803d' : '#b91c1c'}
                                >
                                    {diffText}
                                </text>
                            </g>
                        </g>
                    );
                })}

                {/* Bars, Top Numbers, and Year Labels */}
                {barCoords.map((bar, i) => {
                    const isHovered = hoveredIdx === i;

                    return (
                        <g
                            key={bar.tahun}
                            className="cursor-pointer transition-all duration-200"
                            onMouseEnter={() => setHoveredIdx(i)}
                            onMouseLeave={() => setHoveredIdx(null)}
                        >
                            {/* The Bar */}
                            <rect
                                x={bar.x}
                                y={bar.y}
                                width={barWidth}
                                height={bar.barH}
                                rx="3"
                                ry="3"
                                fill={isHovered ? 'url(#pertaminaBarGradHover)' : 'url(#pertaminaBarGrad)'}
                                filter={isHovered ? 'url(#badgeShadow)' : undefined}
                                className="transition-all duration-200"
                            />

                            {/* Top Production Value */}
                            <text
                                x={bar.centerX}
                                y={bar.y - 4}
                                textAnchor="middle"
                                fontSize="11.5"
                                fontWeight="800"
                                fill="#1e293b"
                            >
                                {bar.nilai}
                            </text>

                            {/* Year X-Axis Label */}
                            <text
                                x={bar.centerX}
                                y={baselineY + 18}
                                textAnchor="middle"
                                fontSize="11"
                                fontWeight={isHovered ? '800' : '700'}
                                fill={isHovered ? '#00529c' : '#475569'}
                            >
                                {bar.tahun}
                            </text>

                            {/* Invisible expanded hover target */}
                            <rect
                                x={bar.centerX - stepX / 2}
                                y={PADDING.top}
                                width={stepX}
                                height={chartHeight + PADDING.bottom}
                                fill="transparent"
                            />
                        </g>
                    );
                })}
            </svg>

            {/* Interactive Tooltip Card when hovering a bar */}
            {hoveredIdx !== null && (
                <div
                    className="absolute z-20 pointer-events-none bg-slate-900/90 text-white text-xs px-3 py-2 rounded-xl shadow-lg border border-slate-700 backdrop-blur-xs transition-all duration-150"
                    style={{
                        left: `${(barCoords[hoveredIdx].centerX / SVG_WIDTH) * 100}%`,
                        top: '12%',
                        transform: 'translate(-50%, -100%)',
                    }}
                >
                    <div className="font-black text-[12px] text-emerald-400">Tahun {data[hoveredIdx].tahun}</div>
                    <div className="font-extrabold text-[13px] text-white">
                        {data[hoveredIdx].nilai} <span className="text-[10px] text-slate-300">GWh</span>
                    </div>
                    {hoveredIdx > 0 && (
                        <div className="text-[10px] text-slate-300 mt-0.5">
                            YoY: <span className={data[hoveredIdx].isPositive ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{data[hoveredIdx].diff}</span> vs {data[hoveredIdx - 1].tahun}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
