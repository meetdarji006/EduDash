import React from 'react';
import { CheckCircle, XCircle, Clock, Search } from 'lucide-react';

const AttendanceTable = ({ currentStudents, handleStatusChange, selectedCourseId, selectedSemester }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
                <thead className="bg-slate-50/50 border-b border-slate-100 text-left">
                    <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Student Profile</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Attendance Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {currentStudents.length > 0 ? (
                        currentStudents.map((student) => (
                            <tr key={student.studentId} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold uppercase">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{student.name}</div>
                                            <div className="text-xs text-slate-500 font-mono mt-0.5 bg-slate-100 px-1.5 py-0.5 rounded w-fit">{student.rollNo}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center gap-2">
                                        {['PRESENT', 'ABSENT', 'LATE'].map(status => {
                                            const isSelected = student.status === status;
                                            let theme = { bg: 'bg-white', text: 'text-slate-400', border: 'border-slate-200', icon: null };

                                            if (isSelected) {
                                                if (status === 'PRESENT') theme = { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle };
                                                if (status === 'ABSENT') theme = { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: XCircle };
                                                if (status === 'LATE') theme = { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock };
                                            }

                                            return (
                                                <button
                                                    key={status}
                                                    onClick={() => handleStatusChange(student.studentId, status)}
                                                    className={`
                                                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-200
                                                    ${theme.bg} ${theme.border} ${theme.text}
                                                    ${isSelected ? 'shadow-sm ring-1 ring-offset-0 ring-opacity-50' : 'hover:bg-slate-50 hover:border-slate-300'}
                                                `}
                                                >
                                                    {status === 'PRESENT' && <CheckCircle size={14} className={isSelected ? "fill-emerald-600 text-white" : "text-slate-300"} />}
                                                    {status === 'ABSENT' && <XCircle size={14} className={isSelected ? "fill-rose-600 text-white" : "text-slate-300"} />}
                                                    {status === 'LATE' && <Clock size={14} className={isSelected ? "fill-amber-600 text-white" : "text-slate-300"} />}
                                                    <span className="text-xs font-bold">{status}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="px-6 py-12 text-center">
                                <div className="flex flex-col items-center justify-center text-slate-400">
                                    <Search size={48} className="text-slate-200 mb-4" />
                                    <h3 className="text-slate-900 font-bold text-lg">
                                        {(!selectedCourseId || !selectedSemester) ? "No Course Selected" : "No Students Found"}
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {(!selectedCourseId || !selectedSemester)
                                            ? "Please select a Course and Semester above to view the attendance list."
                                            : "Try adjusting your search terms or checks back later."}
                                    </p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceTable;
