import React from 'react';

export default function KpiCard({ title, value, subtitle, icon: Icon, colorClass = "text-blue-600", bgClass = "bg-blue-50" }) {
    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between hover:shadow-md transition-all duration-200">
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{title}</p>
                <h3 className="text-2xl font-black text-slate-800 mt-2 leading-none">{value}</h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-2 leading-none">{subtitle}</p>
            </div>
            <div className={`p-3.5 ${bgClass} ${colorClass} rounded-2xl shrink-0`}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
    );
}
