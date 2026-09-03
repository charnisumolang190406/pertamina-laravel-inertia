import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

/**
 * BetterIndicator — Vertical visual pillar indicating whether "Higher is better" or "Lower is better".
 * Matches the official PGE slide style with an arrow and pill badge.
 */
export default function BetterIndicator({ direction = 'up', className = '' }) {
    const isUp = direction === 'up';

    return (
        <div className={`flex flex-col items-center justify-center select-none py-2 px-1 ${className}`}>
            {/* Top Arrow Head if UP */}
            {isUp && (
                <div className="w-0 h-0 border-x-[7px] border-x-transparent border-b-[12px] border-b-amber-200/90 drop-shadow-xs mb-1 animate-pulse" />
            )}

            {/* Vertical Line Top */}
            <div className="w-1.5 flex-1 bg-gradient-to-b from-amber-150 via-slate-250 to-slate-200 rounded-full min-h-[40px]" />

            {/* "Better" Pill Badge */}
            <div className="my-2.5 px-1.5 py-3 rounded-full bg-white border-2 border-blue-400/80 shadow-xs flex flex-col items-center justify-center gap-1">
                {isUp ? (
                    <ArrowUp className="w-3.5 h-3.5 text-blue-600 stroke-[2.5]" />
                ) : (
                    <ArrowDown className="w-3.5 h-3.5 text-blue-600 stroke-[2.5]" />
                )}
                <span
                    className="text-[10px] font-black text-blue-700 tracking-wider"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                    Better
                </span>
            </div>

            {/* Vertical Line Bottom */}
            <div className="w-1.5 flex-1 bg-gradient-to-b from-slate-200 via-slate-250 to-amber-150 rounded-full min-h-[40px]" />

            {/* Bottom Arrow Head if DOWN */}
            {!isUp && (
                <div className="w-0 h-0 border-x-[7px] border-x-transparent border-t-[12px] border-t-amber-200/90 drop-shadow-xs mt-1 animate-pulse" />
            )}
        </div>
    );
}
