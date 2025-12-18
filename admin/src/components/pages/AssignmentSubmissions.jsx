import { useState, useMemo, useEffect } from "react";
import { Loader2, Save, Filter, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import Button from "../Button";
import useSubject from "../../hooks/useSubjects";
import useAssignment from "../../hooks/useAssignments";
import useStudents from "../../hooks/useStudents";
import useAssignmentSubmissions, { useUpdateAssignmentSubmissions } from "../../hooks/useAssignmentSubmissions";
import toast from "react-hot-toast";
import { useCourseContext } from "../../context/CourseContext";
import PageHeader from "../common/PageHeader";
import Loading from "../common/Loading";
import EmptyState from "../common/EmptyState";
import SearchBar from "../common/SearchBar";

const AssignmentSubmissions = () => {
    // 1. Global Context
    const { selectedCourseId, selectedSemester } = useCourseContext();

    // 2. Filter State (Local)
    const [selectedSubjectId, setSelectedSubjectId] = useState("");
    const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Reset local filters when global context changes
    useEffect(() => {
        setSelectedSubjectId("");
        setSelectedAssignmentId("");
        setSearchTerm("");
    }, [selectedCourseId, selectedSemester]);

    // 3. Data Fetching
    const { data: rawSubjects } = useSubject(selectedCourseId, selectedSemester);
    const { data: rawAssignments } = useAssignment(selectedCourseId, selectedSemester);
    const { data: rawStudents, isPending: isStudentsLoading } = useStudents(selectedCourseId, selectedSemester);
    const { data: rawSubmissions, isPending: isSubmissionsLoading } = useAssignmentSubmissions(selectedAssignmentId);

    const updateSubmissions = useUpdateAssignmentSubmissions();

    // Stable Defaults
    const subjects = useMemo(() => rawSubjects || [], [rawSubjects]);
    const assignments = useMemo(() => rawAssignments || [], [rawAssignments]);
    const students = useMemo(() => rawStudents || [], [rawStudents]);
    const submissions = useMemo(() => rawSubmissions || [], [rawSubmissions]);


    // 4. Local State for Edits
    const [submissionMap, setSubmissionMap] = useState({});
    const [changedStudentIds, setChangedStudentIds] = useState(new Set());

    // Derived: Filter assignments by subject if subject selected
    const filteredAssignments = useMemo(() => {
        if (!selectedSubjectId) return [];
        return assignments.filter(a => a.subjectId === selectedSubjectId);
    }, [assignments, selectedSubjectId]);

    // Derived: Filter students by search term
    const filteredStudents = useMemo(() => {
        return students.filter(student =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.rollNo.toString().includes(searchTerm)
        );
    }, [students, searchTerm]);

    // 5. Merge Data on Load
    // Only update map when the underlying data source changes substantially (id change)
    // or when we first load data.
    useEffect(() => {
        if (students.length > 0) {
            const initialMap = {};
            students.forEach(student => {
                const sub = submissions.find(s => s.studentId === student.id);
                initialMap[student.id] = sub ? sub.status : 'PENDING';
            });

            // Only update if the map is empty (first load) or if assignments changed
            // This prevents overwriting user work if a background refetch happens that yields same data
            // However, straightforward way to fix loop is just stable dependency.
            setSubmissionMap(initialMap);
            setChangedStudentIds(new Set());
        }
    }, [students, submissions, selectedAssignmentId]); // Now dependencies are stable due to useMemo

    // 6. Handlers
    const handleStatusChange = (studentId, newStatus) => {
        setSubmissionMap(prev => ({
            ...prev,
            [studentId]: newStatus
        }));
        setChangedStudentIds(prev => new Set(prev).add(studentId));
    };

    const handleSave = () => {
        if (!selectedAssignmentId) return;

        const updates = Array.from(changedStudentIds).map(studentId => ({
            studentId,
            status: submissionMap[studentId]
        }));

        if (updates.length === 0) {
            toast("No changes to save");
            return;
        }

        updateSubmissions.mutate({
            assignmentId: selectedAssignmentId,
            subjectId: selectedSubjectId,
            submissionDetails: updates
        }, {
            onSuccess: () => {
                toast.success("Submissions updated successfully");
                setChangedStudentIds(new Set());
            },
            onError: (e) => {
                console.log(e)
                toast.error("Failed to update submissions");
            }
        });
    };

    const markAll = (status) => {
        const newMap = { ...submissionMap };
        const newChanged = new Set(changedStudentIds);

        students.forEach(student => {
            if (newMap[student.id] !== status) {
                newMap[student.id] = status;
                newChanged.add(student.id);
            }
        });

        setSubmissionMap(newMap);
        setChangedStudentIds(newChanged);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'SUBMITTED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'LATE': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'PENDING': return 'bg-rose-50 text-rose-700 border-rose-200';
            default: return 'bg-slate-50 text-slate-500';
        }
    };

    const isDataLoading = isStudentsLoading || (selectedAssignmentId && isSubmissionsLoading);

    return (
        <div className="flex flex-col h-[calc(100vh-9rem)] space-y-6">

            {/* 1. Page Header */}
            <div className="shrink-0">
                <PageHeader
                    title="Assignment Submissions"
                    description="Track and manage student assignment submissions."
                    icon={CheckCircle}
                />
            </div>

            {/* 2. Filter & Action Bar */}
            <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">

                {/* Search Bar (Left) */}
                <SearchBar
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    label=""
                    className="w-full md:w-80"
                    placeholder="Search students..."
                />

                {/* Filters (Right) */}
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    {/* Subject Filter */}
                    <div className="w-full md:w-56 relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <Filter size={18} />
                        </div>
                        <select
                            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer disabled:bg-slate-50 disabled:text-slate-400 appearance-none"
                            value={selectedSubjectId}
                            onChange={(e) => {
                                setSelectedSubjectId(e.target.value);
                                setSelectedAssignmentId('');
                            }}
                        >
                            <option value="">Select Subject...</option>
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                        </select>
                    </div>

                    {/* Assignment Filter */}
                    <div className="w-full md:w-56 relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <CheckCircle size={18} />
                        </div>
                        <select
                            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer disabled:bg-slate-50 disabled:text-slate-400 appearance-none"
                            value={selectedAssignmentId}
                            onChange={(e) => setSelectedAssignmentId(e.target.value)}
                            disabled={!selectedSubjectId}
                        >
                            <option value="">Select Assignment...</option>
                            {filteredAssignments.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* 3. Main Content */}
            {!selectedAssignmentId ? (
                <EmptyState
                    title="No Assignment Selected"
                    description="Please select a Subject and an Assignment from the filters above to view and grade submissions."
                    icon={Filter}
                />
            ) : isDataLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loading text="Loading Submissions..." size={40} />
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 overflow-hidden flex flex-col min-h-0 animate-in fade-in slide-in-from-bottom-8 duration-700">

                    {/* Toolbar */}
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-500 text-xs uppercase tracking-wider">
                                Student List <span className="text-slate-400 ml-1">({filteredStudents.length})</span>
                            </h3>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => markAll('SUBMITTED')} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 transition-colors">Mark All Submitted</button>
                            <button onClick={() => markAll('PENDING')} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors">Reset All</button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto relative">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">#</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Name</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-64 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStudents.map((student, idx) => (
                                    <tr key={student.id} className="group hover:bg-slate-50 transition-colors duration-150">
                                        <td className="px-6 py-3 text-xs font-bold text-slate-400">{idx + 1}</td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs ring-1 ring-indigo-100">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{student.name}</span>
                                                    <span className="text-xs text-slate-400 font-mono tracking-wide mt-0.5">{student.rollNo}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <div className="flex justify-center gap-2">
                                                {['PENDING', 'SUBMITTED', 'LATE'].map((status) => (
                                                    <button
                                                        key={status}
                                                        onClick={() => handleStatusChange(student.id, status)}
                                                        className={`
                                                            px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border transition-all
                                                            ${submissionMap[student.id] === status
                                                                ? getStatusColor(status) + ' shadow-sm scale-105 ring-1 ring-indigo-500/10'
                                                                : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50 hover:border-slate-200'
                                                            }
                                                        `}
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredStudents.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-slate-400 text-sm font-medium">
                                            No students found for this class.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Actions */}
                    <div className="shrink-0 p-4 border-t border-slate-100 bg-slate-50/50 backdrop-blur-sm flex justify-end">
                        <Button
                            onClick={handleSave}
                            icon={Save}
                            disabled={updateSubmissions.isPending || changedStudentIds.size === 0}
                            className="shadow-xl shadow-indigo-500/20 font-bold px-8 py-2.5 h-auto rounded-xl"
                        >
                            {updateSubmissions.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignmentSubmissions;
