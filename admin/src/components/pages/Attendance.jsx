import { useEffect, useState, useMemo } from "react";
import { Loader2 } from 'lucide-react';
import useAttendance, { useSaveAttendance } from "../../hooks/useAttendance";
import useCourses from "../../hooks/useCourses";

import AttendanceHeader from "../attendance/AttendanceHeader";
import AttendanceFilters from "../attendance/AttendanceFilters";
import AttendanceTable from "../attendance/AttendanceTable";
import AttendancePagination from "../attendance/AttendancePagination";
import toast from "react-hot-toast";

const AttendanceManager = () => {
    // 1. Fetches
    const { data: courses } = useCourses();

    // 2. State Management
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");

    // Set default course/semester when courses load
    useEffect(() => {
        if (courses.length > 0 && !selectedCourseId) {
            setSelectedCourseId(courses[0].id);
            setSelectedSemester(1);
        }
    }, [courses]);

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [changedRows, setChangedRows] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    // const [isSaving, setIsSaving] = useState(false);

    const itemsPerPage = 50;

    // Derived State for Semester Options
    const semesterOptions = useMemo(() => {
        const course = courses.find(c => c.id === selectedCourseId);
        if (!course) return [];
        return Array.from({ length: course.duration }, (_, i) => ({ id: i + 1, name: `Semester ${i + 1}` }));
    }, [courses, selectedCourseId]);

    const { data, isPending } = useAttendance(selectedCourseId, selectedSemester, selectedDate);
    const saveAttendance = useSaveAttendance();

    useEffect(() => {
        if (data) {
            setAttendanceData(data);
        }
    }, [data]);

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
            const originalDataIndex = data.findIndex((s) => s.studentId == id)
            const originalStatus = data[originalDataIndex].status;

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
                const originalEntry = data.find(original => original.studentId === id);
                if (!originalEntry) return;

                const originalStatus = originalEntry.status;

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

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto space-y-6 font-sans text-slate-900">
                {/* Header Section */}
                <AttendanceHeader
                    courses={courses}
                    courseId={selectedCourseId}
                    setCourseId={setSelectedCourseId}
                    semesters={semesterOptions}
                    semester={selectedSemester}
                    setSemester={setSelectedSemester}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    handleSave={handleSave}
                    isSaving={saveAttendance.isPending}
                    isPending={isPending}
                />

                {/* Filters Section */}
                <AttendanceFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    setCurrentPage={setCurrentPage}
                    markAll={markAll}
                />

                {/* Table Section */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
                    {isPending ? (
                        <div className="flex flex-col items-center justify-center flex-1 h-64 text-slate-400">
                            <Loader2 className="animate-spin mb-3 text-indigo-500" size={32} />
                            <p className="text-sm font-medium">Fetching class list...</p>
                        </div>
                    ) : (
                        <>
                            <AttendanceTable
                                currentStudents={currentStudents}
                                handleStatusChange={handleStatusChange}
                            />

                            {/* Pagination */}
                            {filteredStudents.length > 0 && (
                                <AttendancePagination
                                    filteredStudents={filteredStudents}
                                    startIndex={startIndex}
                                    itemsPerPage={itemsPerPage}
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    handlePageChange={handlePageChange}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendanceManager;
