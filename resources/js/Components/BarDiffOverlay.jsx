import React from 'react';

/**
 * BarDiffOverlay — A custom Recharts <Customized> component that renders
 * a bracket+percentage difference indicator between two grouped bars.
 *
 * Usage:
 *   <Customized
 *       component={BarDiffOverlay}
 *       barKey1="rkap"       // first bar dataKey (the "base")
 *       barKey2="realisasi"  // second bar dataKey (the "compare")
 *       activeIndex={activeIndex}  // hovered bar index (null = hidden)
 *   />
 *
 * How it works:
 *   Recharts passes xAxisMap, yAxisMap, and offset to <Customized>,
 *   so we can compute exact pixel positions for each bar group.
 */
export function BarDiffOverlay({
    xAxisMap,
    yAxisMap,
    offset,
    data,
    barKey1,
    barKey2,
    activeIndex,
    label1 = null,    // optional override name for barKey1
    label2 = null,
    yAxisId = 0,
}) {
    if (activeIndex === null || activeIndex === undefined) return null;
    if (!xAxisMap || !yAxisMap || !data) return null;

    const xAxis = Object.values(xAxisMap)[0];
    const yAxis = yAxisId !== 0
        ? Object.values(yAxisMap).find(a => a.axisId === yAxisId) || Object.values(yAxisMap)[0]
        : Object.values(yAxisMap)[0];

    if (!xAxis || !yAxis) return null;

    const entry = data[activeIndex];
    if (!entry) return null;

    const val1 = Number(entry[barKey1] ?? 0);
    const val2 = Number(entry[barKey2] ?? 0);
    if (val1 === 0) return null;

    const pct = ((val2 - val1) / Math.abs(val1)) * 100;
    const isPositive = pct >= 0;
    const pctText = `${isPositive ? '+' : ''}${pct.toFixed(1)}%`;

    // Pixel y-positions for the two bar tips
    const y1 = yAxis.scale(val1);
    const y2 = yAxis.scale(val2);
    const yBottom = yAxis.scale(0);

    // Determine x center of the group from xAxis bandScale
    const bandScale = xAxis.scale;
    const bandWidth = bandScale.bandwidth ? bandScale.bandwidth() : 40;
    const xCenter = bandScale(xAxis.dataKey ? entry[xAxis.dataKey] : activeIndex) + bandWidth;

    const bracketX = xCenter + 4;
    const labelX = bracketX + 16;
    const topY = Math.min(y1, y2);
    const bottomY = Math.max(y1, y2);
    const midY = (topY + bottomY) / 2;

    // Colors
    const color = isPositive ? '#16a34a' : '#dc2626';
    const bgColor = isPositive ? '#dcfce7' : '#fee2e2';
    const borderColor = isPositive ? '#86efac' : '#fca5a5';

    // Don't show if bars are essentially equal (< 0.1%)
    if (Math.abs(pct) < 0.05) return null;

    // Don't render if there's no visible gap to show
    if (Math.abs(topY - bottomY) < 3) return null;

    const LABEL_W = 50;
    const LABEL_H = 20;

    return (
        <g style={{ pointerEvents: 'none' }}>
            {/* Vertical bracket line */}
            <line
                x1={bracketX}
                y1={topY}
                x2={bracketX}
                y2={bottomY}
                stroke={color}
                strokeWidth={1.5}
                strokeDasharray="none"
            />
            {/* Top tick */}
            <line x1={bracketX - 4} y1={topY} x2={bracketX} y2={topY} stroke={color} strokeWidth={1.5} />
            {/* Bottom tick */}
            <line x1={bracketX - 4} y1={bottomY} x2={bracketX} y2={bottomY} stroke={color} strokeWidth={1.5} />

            {/* Horizontal connector to label */}
            <line
                x1={bracketX}
                y1={midY}
                x2={labelX - 2}
                y2={midY}
                stroke={color}
                strokeWidth={1.5}
            />

            {/* Label badge */}
            <rect
                x={labelX - 2}
                y={midY - LABEL_H / 2}
                width={LABEL_W}
                height={LABEL_H}
                rx={5}
                ry={5}
                fill={bgColor}
                stroke={borderColor}
                strokeWidth={1}
            />
            <text
                x={labelX + LABEL_W / 2 - 2}
                y={midY + 4.5}
                textAnchor="middle"
                fill={color}
                fontSize={10}
                fontWeight="800"
                fontFamily="inherit"
            >
                {pctText}
            </text>
        </g>
    );
}

/**
 * useBarHover — a hook that returns event handlers + activeIndex state
 * for tracking which bar group is currently hovered.
 *
 * Usage:
 *   const { activeIndex, barChartProps } = useBarHover();
 *   <BarChart {...barChartProps} ...>
 */
export function useBarHover() {
    const [activeIndex, setActiveIndex] = React.useState(null);

    const barChartProps = {
        onMouseMove: (state) => {
            if (state && state.isTooltipActive && state.activeTooltipIndex !== undefined) {
                setActiveIndex(state.activeTooltipIndex);
            } else {
                setActiveIndex(null);
            }
        },
        onMouseLeave: () => setActiveIndex(null),
    };

    return { activeIndex, barChartProps };
}
