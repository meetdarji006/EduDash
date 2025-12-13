import React from 'react';
import { Search } from 'lucide-react';

const AttendanceFilters = ({ searchTerm, setSearchTerm, setCurrentPage, markAll }) => {
    return (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-center">
            <div className="relative w-full lg:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                    type="text"
                    placeholder="Search student..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all focus:bg-white"
                />
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
                <span className="text-xs font-bold text-slate-400 uppercase mr-2 hidden sm:inline-block">Mark All:</span>
                <button onClick={() => markAll('Present')} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold hover:bg-emerald-100 transition-colors border border-emerald-100">All Present</button>
                <button onClick={() => markAll('Absent')} className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-colors border border-rose-100">All Absent</button>
            </div>
        </div>
    );
};

export default AttendanceFilters;
