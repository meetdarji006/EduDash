import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AttendancePagination = ({ filteredStudents, startIndex, itemsPerPage, currentPage, totalPages, handlePageChange }) => {
    return (
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
            <p className="text-xs text-slate-500 font-medium">
                Showing <span className="font-bold text-slate-700">{startIndex + 1}</span> to <span className="font-bold text-slate-700">{Math.min(startIndex + itemsPerPage, filteredStudents.length)}</span> of <span className="font-bold text-slate-700">{filteredStudents.length}</span> entries
            </p>
            <div className="flex items-center gap-2">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-1 rounded-lg hover:bg-white disabled:opacity-50 text-slate-500 transition-colors"><ChevronLeft size={18} /></button>
                <div className="flex items-center gap-1">
                    {/* Simple pagination logic */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button key={page} onClick={() => handlePageChange(page)} className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${currentPage === page ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-500 hover:bg-white hover:text-indigo-600'}`}>{page}</button>
                    ))}
                </div>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-1 rounded-lg hover:bg-white disabled:opacity-50 text-slate-500 transition-colors"><ChevronRight size={18} /></button>
            </div>
        </div>
    );
};

export default AttendancePagination;
