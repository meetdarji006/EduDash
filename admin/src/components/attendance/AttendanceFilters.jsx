import React from 'react';
import { Search } from 'lucide-react';

const AttendanceFilters = ({
    searchTerm, setSearchTerm, setCurrentPage, markAll,
    selectedDate, setSelectedDate
}) => {
    return (
        <div className="space-y-4">
            {/* Top Row: Date & Search */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                {/* Date */}
                <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wide mb-1.5 ml-1">Date</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-200 transition-all cursor-pointer"
                    />
                </div>

                {/* Search */}
                <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-wide mb-1.5 ml-1">Search Student</label>
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all focus:bg-white"
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Row: Actions */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    Quick Actions
                </div>
                <div className="flex gap-2">
                    <button onClick={() => markAll('Present')} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold hover:bg-emerald-100 transition-colors border border-emerald-100">All Present</button>
                    <button onClick={() => markAll('Absent')} className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-colors border border-rose-100">All Absent</button>
                </div>
            </div>
        </div>
    );
};

export default AttendanceFilters;
