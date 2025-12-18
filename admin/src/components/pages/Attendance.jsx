import { useEffect, useState, useMemo } from "react";
import { Loader2, Calendar, Save, CheckCircle, XCircle, Clock, AlertTriangle, Search, Filter } from 'lucide-react';
import useAttendance, { useSaveAttendance } from "../../hooks/useAttendance";
import useCourses from "../../hooks/useCourses";
import useStudents from "../../hooks/useStudents";
import toast from "react-hot-toast";

import { useCourseContext } from "../../context/CourseContext";
import PageHeader from "../common/PageHeader";
import SearchBar from "../common/SearchBar";
import Loading from "../common/Loading";
import EmptyState from "../common/EmptyState";
import Button from "../Button";
import Pagination from "../Pagination";

const AttendanceManager = () => {
    // 1. Fetches
    const { data: courses } = useCourses();

    // 2. Global Context
    const { selectedCourseId, selectedSemester } = useCourseContext();

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [changedRows, setChangedRows] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    // const [isSaving, setIsSaving] = useState(false);

    const itemsPerPage = 50;

    // FETCH STUDENTS (Base List) from Global Context
    const { data: studentsList, isPending: isStudentsLoading } = useStudents(selectedCourseId, selectedSemester);

    // FETCH ATTENDANCE (Status) from Global Context
    const { data: attendanceRecords, isPending: isAttendanceLoading } = useAttendance(selectedCourseId, selectedSemester, selectedDate);

    const saveAttendance = useSaveAttendance();

    // Merge Logic
    useEffect(() => {
        if (studentsList && studentsList.length > 0) {
            const mergedData = studentsList.map(student => {
                // Find existing record for this student in the fetched attendance
                const record = attendanceRecords?.find(r => r.studentId === student.id);

                return {
                    ...student,
                    studentId: student.id, // Ensure consistent ID naming for Table
                    status: record ? record.status : 'PENDING' // Default to PENDING if no record
                };
            });
            setAttendanceData(mergedData);
        } else {
            setAttendanceData([]);
        }
    }, [studentsList, attendanceRecords]);

    // 3. Save Handler
    const handleSave = async () => {

        const payload = {
            date: selectedDate,
            attendanceDetails: changedRows.map(s => ({
                studentId: s.studentId,
                status: s.status.toUpperCase()
            }))
        };
        saveAttendance.mutate(payload, {
            onSuccess: () => {
                toast.success("Attendance saved successfully!");
                setChangedRows([]);
                setCurrentPage((prev) => prev < totalPages ? prev + 1 : 1)
            },
            onError: (e) => {
                toast.error("Failed to save attendance!");
                console.log(e);
            }
        });
    };

    // 4. Filter & Pagination Logic
    const filteredStudents = attendanceData.filter(student =>
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;

    const currentStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
    };

    const handleStatusChange = (id, status) => {
        setAttendanceData(prev => prev.map(s => s.studentId === id ? { ...s, status } : s));

        setChangedRows(prev => {
            // Find original status from the fetched attendance records (DB state)
            const originalRecord = attendanceRecords?.find((s) => s.studentId == id);
            const originalStatus = originalRecord ? originalRecord.status : 'PENDING';

            if (originalStatus == status) {
                return prev.filter(item => item.studentId !== id);
            }

            const existingIndex = prev.findIndex(item => item.studentId === id);

            if (existingIndex !== -1) {
                // Update existing entry in a generic immutable way
                const newArray = [...prev];
                newArray[existingIndex] = { ...newArray[existingIndex], status: status };
                return newArray;
            } else {
                // Add new entry
                return [...prev, { studentId: id, status: status }];
            }
        })
    };

    const markAll = (status) => {
        const visibleStudentIds = new Set(filteredStudents.map(f => f.studentId));

        setAttendanceData(prev => prev.map(s => {
            if (visibleStudentIds.has(s.studentId)) {
                return { ...s, status };
            }
            return s;
        }));

        setChangedRows(prev => {
            let newChangedRows = [...prev];

            visibleStudentIds.forEach(id => {
                const originalEntry = attendanceRecords?.find(original => original.studentId === id);
                const originalStatus = originalEntry ? originalEntry.status : 'PENDING';

                // Remove existing change for this student if it exists (we will re-evaluate)
                newChangedRows = newChangedRows.filter(item => item.studentId !== id);

                // If new status is different from original, add to changes
                if (originalStatus !== status) {
                    newChangedRows.push({ studentId: id, status });
                }
            });

            return newChangedRows;
        });
    };

    const getInitials = (name) => {
        return name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';
    };

    return (
        <div className="flex flex-col h-[calc(100vh-9rem)] space-y-6">

            {/* 1. Header with Stats placeholder */}
            <div className="shrink-0">
                <PageHeader
                    title="Daily Attendance"
                    description="Track and manage student daily attendance records"
                    icon={Calendar}
                />
            </div>

            {/* 2. Filter & Action Bar */}
            <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    {/* Search Input */}
                    <SearchBar
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        label=""
                        className="w-full md:w-80"
                        placeholder="Search Students..."
                    />

                    {/* Date Picker */}
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                            <Calendar size={20} strokeWidth={2.5} />
                        </div>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className="bg-white border-0 ring-1 ring-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm group-hover:shadow-md focus:shadow-xl transition-all duration-300 w-48"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-2 md:mt-0">
                    {selectedCourseId && selectedSemester && (
                        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 hidden lg:block">Bulk Actions</span>
                            <div className="h-4 w-px bg-slate-200 hidden lg:block"></div>

                            <button
                                onClick={() => markAll('PRESENT')}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100 transition-all text-xs font-bold hover:shadow-md hover:shadow-emerald-100 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <CheckCircle size={16} className="fill-emerald-200 text-emerald-600" />
                                All Present
                            </button>

                            <button
                                onClick={() => markAll('ABSENT')}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-100 transition-all text-xs font-bold hover:shadow-md hover:shadow-rose-100 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <XCircle size={16} className="fill-rose-200 text-rose-600" />
                                All Absent
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* 3. Students Table */}
            {!selectedCourseId || !selectedSemester ? (
                <EmptyState
                    title="No Course Selected"
                    description="Please select a Course and Semester from the header above to view the student list."
                />
            ) : (isStudentsLoading || isAttendanceLoading) ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loading text="Loading Attendance Data..." size={40} />
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 overflow-hidden flex flex-col min-h-0 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="flex-1 overflow-auto relative">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[40%]">Student Profile</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Attendance Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {currentStudents.length > 0 ? currentStudents.map((student) => (
                                    <tr key={student.studentId} className="group hover:bg-slate-50 transition-colors duration-150">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs ring-1 ring-slate-200">
                                                    {getInitials(student.name)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{student.name}</span>
                                                    <span className="text-xs text-slate-400 font-mono tracking-wide">{student.rollNo}</span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                {['PRESENT', 'ABSENT', 'LATE'].map(status => {
                                                    const isSelected = student.status === status;
                                                    let theme = { bg: 'bg-white', text: 'text-slate-400', border: 'border-slate-200' };

                                                    if (isSelected) {
                                                        if (status === 'PRESENT') theme = { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
                                                        if (status === 'ABSENT') theme = { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
                                                        if (status === 'LATE') theme = { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
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
                                )) : (
                                    <tr>
                                        <td colSpan="2" className="text-center py-20">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <Filter size={48} className="mb-4 opacity-20" />
                                                <p className="font-bold">No students found.</p>
                                                <p className="text-xs mt-1">Try adjusting your search.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Actions */}
                    <div className="shrink-0 p-4 border-t border-slate-100 bg-slate-50/50 backdrop-blur-sm flex justify-between items-center">
                        <div className="flex-1">
                            {filteredStudents.length > 0 && (
                                <Pagination
                                    totalItems={filteredStudents.length}
                                    itemsPerPage={itemsPerPage}
                                    currentPage={currentPage}
                                    onPageChange={(page) => setCurrentPage(page)}
                                    startIndex={startIndex}
                                />
                            )}
                        </div>
                        <div className="flex justify-end ml-4">
                            <Button
                                onClick={handleSave}
                                icon={Save}
                                variant="primary"
                                disabled={saveAttendance.isPending}
                                className="shadow-xl shadow-indigo-500/20 font-bold px-8 py-3 h-auto rounded-xl"
                            >
                                {saveAttendance.isPending ? 'Saving...' : 'Save Attendance'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceManager;
