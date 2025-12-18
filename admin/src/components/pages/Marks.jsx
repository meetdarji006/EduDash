import { useState, useEffect } from 'react';
import { Save, Filter, Search, Award, AlertCircle } from 'lucide-react';
import Button from '../Button';
import useSubjects from '../../hooks/useSubjects';
import useTests from '../../hooks/useTests';
import useStudents from '../../hooks/useStudents';
import { useMarks, useSaveMarks } from '../../hooks/useMarks';
import { useCourseContext } from '../../context/CourseContext';
import PageHeader from '../common/PageHeader';
import Loading from '../common/Loading';
import EmptyState from '../common/EmptyState';
import SearchBar from '../common/SearchBar';

const MarksManager = () => {
    // 1. Global Context
    const { selectedCourseId, selectedSemester } = useCourseContext();

    // 2. Filters (Local) - Only Subject and Test are local now
    const [filters, setFilters] = useState({
        subject: '',
        test: ''
    });

    // Reset local filters when global context changes
    useEffect(() => {
        setFilters({ subject: '', test: '' });
    }, [selectedCourseId, selectedSemester]);

    // State
    const [marksData, setMarksData] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    // --- Hooks ---
    // const { data: courses = [] } = useCourses(); // Removed
    const { data: subjects = [] } = useSubjects(selectedCourseId, selectedSemester);
    const { data: tests = [] } = useTests(selectedCourseId, selectedSemester);

    const { data: students = [], isPending: isStudentsLoading } = useStudents(selectedCourseId, selectedSemester);

    // Fetch existing marks for the selected test
    const { data: existingMarks, isPending: isMarksLoading, refetch: refetchMarks } = useMarks(filters.test);

    // Save mutation
    const saveMarksMutation = useSaveMarks();

    // Derived Data
    const selectedTest = tests.find(t => t.id === filters.test);

    // Filtered Students
    const filteredStudents = students.filter(student =>
        student?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        student?.rollNo?.toString()?.includes(searchTerm)
    );

    // Effect to populate marks when test or student data changes
    useEffect(() => {
        if (existingMarks?.length > 0) {
            const initialMarks = {};
            existingMarks.forEach(record => {
                initialMarks[record.studentId] = record.marks;
            });
            setMarksData(initialMarks);
        } else {
            setMarksData({});
        }
    }, [existingMarks, filters.test]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        // Reset downstream filters
        if (key === 'subject') {
            setFilters(prev => ({ ...prev, subject: value, test: '' }));
        }
    };

    const handleMarkChange = (studentId, value) => {
        // console.log(studentId, value);
        if (selectedTest && Number(value) > selectedTest.maxMarks) return;
        setMarksData(prev => ({ ...prev, [studentId]: value }));
    };

    const handleSave = () => {
        if (!selectedTest) return;

        const payload = {
            testId: selectedTest.id,
            marksDetails: Object.entries(marksData).map(([studentId, marks]) => ({
                studentId,
                marks: Number(marks)
            }))
        };

        saveMarksMutation.mutate(payload, {
            onSuccess: () => {
                alert("Marks Saved Successfully!");
            },
            onError: (error) => {
                console.error("Failed to save marks:", error);
                alert("Failed to save marks. Please try again.");
            }
        });
    };

    // console.log(filteredStudents)

    return (
        <div className="flex flex-col h-[calc(100vh-9rem)] space-y-6">

            {/* 1. Page Header */}
            <div className="shrink-0">
                <PageHeader
                    title="Marks Management"
                    description="Enter and update student grades & exam results"
                    icon={Award}
                />
            </div>

            {/* 2. Filter & Context Bar */}
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
                    {/* Subject Select */}
                    <div className="w-full md:w-56 relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <Filter size={18} />
                        </div>
                        <select
                            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer disabled:bg-slate-50 disabled:text-slate-400 appearance-none"
                            value={filters.subject}
                            onChange={(e) => handleFilterChange('subject', e.target.value)}
                        >
                            <option value="">Select Subject...</option>
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                        </select>
                    </div>

                    {/* Test Select */}
                    <div className="w-full md:w-56 relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <Award size={18} />
                        </div>
                        <select
                            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer disabled:bg-slate-50 disabled:text-slate-400 appearance-none"
                            value={filters.test}
                            onChange={(e) => handleFilterChange('test', e.target.value)}
                            disabled={!filters.subject}
                        >
                            <option value="">Select Test...</option>
                            {tests.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* 3. Empty State or Table */}
            {!filters.test ? (
                <EmptyState
                    title="No Test Selected"
                    description="Select a Subject and Test from the filters above to start grading."
                    icon={Award}
                />
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 overflow-hidden flex flex-col min-h-0 animate-in fade-in slide-in-from-bottom-8 duration-700">

                    {/* Table Header Controls */}
                    <div className="shrink-0 px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-500 text-xs uppercase tracking-wider">
                                Student List <span className="text-slate-400 ml-1">({filteredStudents.length})</span>
                            </h3>
                        </div>
                        {selectedTest && (
                            <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 bg-white px-4 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                                <span className="uppercase tracking-wider text-[10px] font-bold text-slate-400">Max:</span>
                                <span className="text-indigo-600 font-bold text-sm">{selectedTest.maxMarks}</span>
                            </div>
                        )}
                    </div>

                    {/* The Grid Table */}
                    {isStudentsLoading || isMarksLoading ? (
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <Loading text="Loading Marks Data..." size={40} />
                        </div>
                    ) : (
                        <div className="flex-1 overflow-auto relative">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">#</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Profile</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider w-48">Marks Obtained</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredStudents.map((student, index) => (
                                        <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-3 text-xs font-semibold text-slate-500">{index + 1}</td>
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
                                            <td className="px-6 py-3">
                                                <div className="flex items-center justify-end gap-3">
                                                    <div className="relative group/input">
                                                        <input
                                                            type="number"
                                                            className={`w-24 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-right focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 shadow-sm ${marksData[student.id] ? 'bg-indigo-50/10 border-indigo-200 text-indigo-700' : ''
                                                                }`}
                                                            placeholder="0"
                                                            min="0"
                                                            max={selectedTest?.maxMarks}
                                                            value={marksData[student.id] || ''}
                                                            onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                                        />
                                                        {Number(marksData[student.id]) > selectedTest?.maxMarks && (
                                                            <div className="absolute right-0 top-full mt-1 text-[10px] text-rose-500 font-bold flex items-center gap-1 bg-white px-2 py-1 rounded shadow-sm border border-rose-100 z-10 whitespace-nowrap">
                                                                <AlertCircle size={10} />
                                                                Max allowed: {selectedTest?.maxMarks}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredStudents.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="text-center py-20">
                                                <div className="flex flex-col items-center justify-center text-slate-400">
                                                    <Search size={40} className="mb-4 opacity-20" />
                                                    <p className="font-bold">No students match your search.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="shrink-0 p-4 border-t border-slate-100 bg-slate-50/50 backdrop-blur-sm flex justify-end">
                        <Button
                            onClick={handleSave}
                            icon={Save}
                            variant="primary"
                            disabled={saveMarksMutation.isPending}
                            className="shadow-xl shadow-indigo-500/20 font-bold px-8 py-2.5 h-auto rounded-xl"
                        >
                            {saveMarksMutation.isPending ? 'Saving...' : 'Save Marks'}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarksManager;
