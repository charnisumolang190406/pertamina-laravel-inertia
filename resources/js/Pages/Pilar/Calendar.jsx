import React from 'react';
import CalendarWidget from '../../Components/CalendarWidget';
import { Calendar } from 'lucide-react';

export default function CalendarTab(props) {
    const { calendarEvents, auth } = props;
    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-[fadeIn_0.3s_ease-in-out] font-sans">
            <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 rounded-3xl shadow-md text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-15">
                    <Calendar className="w-64 h-64 text-white" />
                </div>
                <div className="z-10">
                    <h2 className="text-xl font-black tracking-tight leading-none">Kalender Agenda Kegiatan</h2>
                    <p className="text-blue-100 text-xs mt-2 font-medium">Jadwal agenda kerja, monitoring rapat koordinasi, dan milestones penting PGE Lahendong.</p>
                </div>
            </div>

            <div className="bg-white p-2 rounded-3xl border border-slate-200 shadow-sm">
                <CalendarWidget 
                    events={calendarEvents}
                    currentUser={auth.user}
                />
            </div>
        </div>
    );
}
