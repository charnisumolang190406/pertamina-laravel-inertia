import React from 'react';
import {
    ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip as RechartsTooltip, Legend, LabelList
} from 'recharts';

export const aboMonthly2026Data = [
    { bulan: 'JAN', rkap: 3.97, realisasi: 1.10, prognosa: null },
    { bulan: 'FEB', rkap: 4.16, realisasi: 5.41, prognosa: null },
    { bulan: 'MAR', rkap: 7.75, realisasi: 3.61, prognosa: null },
    { bulan: 'APR', rkap: 6.35, realisasi: 8.13, prognosa: null },
    { bulan: 'MEI', rkap: 5.93, realisasi: 2.59, prognosa: null },
    { bulan: 'JUN', rkap: 6.77, realisasi: 6.98, prognosa: null },
    { bulan: 'JUL', rkap: 7.68, realisasi: 5.32, prognosa: null },
    { bulan: 'AGU', rkap: 4.80, realisasi: 4.42, prognosa: 4.42 },
    { bulan: 'SEP', rkap: 7.03, realisasi: null, prognosa: 9.32 },
    { bulan: 'OKT', rkap: 7.56, realisasi: null, prognosa: 9.32 },
    { bulan: 'NOV', rkap: 5.31, realisasi: null, prognosa: 9.32 },
    { bulan: 'DES', rkap: 7.52, realisasi: null, prognosa: 9.32 },
];

export const aboKumulatif2026Data = [
    { bulan: 'JAN', rkap: 3.97, realisasi: 1.10, prognosa: null },
    { bulan: 'FEB', rkap: 8.14, realisasi: 6.51, prognosa: null },
    { bulan: 'MAR', rkap: 15.89, realisasi: 10.11, prognosa: null },
    { bulan: 'APR', rkap: 22.24, realisasi: 18.24, prognosa: null },
    { bulan: 'MEI', rkap: 28.17, realisasi: 20.83, prognosa: null },
    { bulan: 'JUN', rkap: 34.93, realisasi: 27.80, prognosa: null },
    { bulan: 'JUL', rkap: 42.61, realisasi: 33.13, prognosa: null },
    { bulan: 'AGU', rkap: 47.41, realisasi: 37.55, prognosa: 37.55 },
    { bulan: 'SEP', rkap: 54.44, realisasi: null, prognosa: 46.87 },
    { bulan: 'OKT', rkap: 62.00, realisasi: null, prognosa: 56.19 },
    { bulan: 'NOV', rkap: 67.31, realisasi: null, prognosa: 65.51 },
    { bulan: 'DES', rkap: 74.84, realisasi: null, prognosa: 74.84 },
];

export function AboMonthlyLineChart({ data = aboMonthly2026Data }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 15, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="bulan" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis domain={[0, 11]} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <RechartsTooltip formatter={(v, name) => [v ? `Rp ${v} Miliar` : '-', name]} />
                <Legend wrapperStyle={{ fontSize: 10, paddingTop: 6 }} />
                <Line type="monotone" dataKey="rkap" name="RKAP 2026" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 3.5, fill: '#2563EB' }}>
                    <LabelList dataKey="rkap" position="top" offset={6} style={{ fontSize: 8.5, fontWeight: 700, fill: '#2563EB' }} />
                </Line>
                <Line type="monotone" dataKey="realisasi" name="Realisasi" stroke="#16A34A" strokeWidth={2.5} dot={{ r: 3.5, fill: '#16A34A' }}>
                    <LabelList dataKey="realisasi" position="top" offset={6} style={{ fontSize: 8.5, fontWeight: 800, fill: '#16A34A' }} />
                </Line>
                <Line type="monotone" dataKey="prognosa" name="Prognosa" stroke="#F97316" strokeWidth={2.5} strokeDasharray="4 4" dot={{ r: 3.5, fill: '#F97316' }}>
                    <LabelList dataKey="prognosa" position="top" offset={6} style={{ fontSize: 8.5, fontWeight: 700, fill: '#EA580C' }} />
                </Line>
            </LineChart>
        </ResponsiveContainer>
    );
}

export function AboKumulatifLineChart({ data = aboKumulatif2026Data }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 15, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="bulan" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis domain={[0, 85]} tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <RechartsTooltip formatter={(v, name) => [v ? `Rp ${v} Miliar` : '-', name]} />
                <Legend wrapperStyle={{ fontSize: 10, paddingTop: 6 }} />
                <Line type="monotone" dataKey="rkap" name="RKAP 2026" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 3.5, fill: '#2563EB' }}>
                    <LabelList dataKey="rkap" position="top" offset={6} style={{ fontSize: 8.5, fontWeight: 700, fill: '#2563EB' }} />
                </Line>
                <Line type="monotone" dataKey="realisasi" name="Realisasi" stroke="#16A34A" strokeWidth={2.5} dot={{ r: 3.5, fill: '#16A34A' }}>
                    <LabelList dataKey="realisasi" position="top" offset={6} style={{ fontSize: 8.5, fontWeight: 800, fill: '#16A34A' }} />
                </Line>
                <Line type="monotone" dataKey="prognosa" name="Prognosa" stroke="#F97316" strokeWidth={2.5} strokeDasharray="4 4" dot={{ r: 3.5, fill: '#F97316' }}>
                    <LabelList dataKey="prognosa" position="top" offset={6} style={{ fontSize: 8.5, fontWeight: 700, fill: '#EA580C' }} />
                </Line>
            </LineChart>
        </ResponsiveContainer>
    );
}
