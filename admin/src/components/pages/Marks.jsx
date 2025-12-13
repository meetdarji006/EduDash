import React, { useState } from 'react';
import { Save, Filter, Search, Award, AlertCircle } from 'lucide-react';
import Button from '../Button';

// --- Local Mock Data for Dropdowns ---
const COURSES = ['B.Tech CSE', 'B.Tech ME', 'B.Com', 'MBA'];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
const SUBJECTS = [
    { id: 's1', name: 'Data Structures', code: 'CS-301' },
    { id: 's2', name: 'Database Management', code: 'CS-302' },
    { id: 's3', name: 'Linear Algebra', code: 'MA-201' },
];
const TESTS = [
    { id: 't1', title: 'Mid-Term Exam', maxMarks: 50 },
    { id: 't2', title: 'Unit Test 1', maxMarks: 20 },
    { id: 't3', title: 'Final Exam', maxMarks: 100 },
];

// --- Mock Students Data ---
const STUDENTS_DATA = [
    { id: '1', name: 'Rahul Sharma', rollNo: '2021-CS-045', course: 'B.Tech CSE', semester: 6 },
    { id: '2', name: 'Priya Verma', rollNo: '2022-EC-012', course: 'B.Tech CSE', semester: 6 },
    { id: '3', name: 'Amit Patel', rollNo: '2023-CS-102', course: 'B.Tech CSE', semester: 6 },
    { id: '4', name: 'Sneha Gupta', rollNo: '2021-CS-050', course: 'B.Tech CSE', semester: 6 },
];

const MarksManager = () => {
    // Filters
    const [filters, setFilters] = useState({
        course: '',
        semester: '',
        subject: '',
        test: ''
    });

    // State
    const [marksData, setMarksData] = useState({});
    const [isTableVisible, setIsTableVisible] = useState(false);

    // Derived Data
    const selectedTest = TESTS.find(t => t.id === filters.test);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        // Hide table if filters change to force "Load"
        setIsTableVisible(false);
    };

    const handleLoadStudents = () => {
        if (filters.course && filters.semester && filters.subject && filters.test) {
            setIsTableVisible(true);
        }
    };

    const handleMarkChange = (studentId, value) => {
        if (selectedTest && Number(value) > selectedTest.maxMarks) return;
        setMarksData(prev => ({ ...prev, [studentId]: value }));
    };

    const handleSave = () => {
        console.log("Saving marks for:", filters, marksData);
        alert("Marks Saved Successfully!");
    };

    return (
        <div className="space-y-6">

            {/* 1. Header & Context */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Marks Management</h1>
                    <p className="text-slate-500 text-sm">Enter and update student grades</p>
                </div>
                {isTableVisible && (
                    <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
                        <Award size={18} className="text-indigo-600" />
                        <div>
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Current Test</p>
                            <p className="text-sm font-bold text-indigo-900 leading-none">{selectedTest?.title} (Max: {selectedTest?.maxMarks})</p>
                        </div>
                    </div>
                )}
            </div>

            {/* 2. Filter Toolbar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">

                    {/* Course Select */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Course</label>
                        <select
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            value={filters.course}
                            onChange={(e) => handleFilterChange('course', e.target.value)}
                        >
                            <option value="">Select Course...</option>
                            {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Semester Select */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Semester</label>
                        <select
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            value={filters.semester}
                            onChange={(e) => handleFilterChange('semester', e.target.value)}
                        >
                            <option value="">Select Sem...</option>
                            {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    {/* Subject Select */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Subject</label>
                        <select
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            value={filters.subject}
                            onChange={(e) => handleFilterChange('subject', e.target.value)}
                        >
                            <option value="">Select Subject...</option>
                            {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                        </select>
                    </div>

                    {/* Test Select */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Test / Exam</label>
                        <select
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            value={filters.test}
                            onChange={(e) => handleFilterChange('test', e.target.value)}
                        >
                            <option value="">Select Test...</option>
                            {TESTS.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button
                        onClick={handleLoadStudents}
                        disabled={!filters.course || !filters.semester || !filters.subject || !filters.test}
                        className={!filters.test ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                        Load Student List
                    </Button>
                </div>
            </div>

            {/* 3. Empty State or Table */}
            {!isTableVisible ? (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <Filter className="text-slate-300" size={32} />
                    </div>
                    <h3 className="text-slate-900 font-bold text-lg">No Data Loaded</h3>
                    <p className="text-slate-500 text-sm max-w-xs text-center mt-1">
                        Please select a Course, Semester, Subject, and Test from the filters above to start grading.
                    </p>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Table Header Controls */}
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <Search size={16} className="text-slate-400" />
                            <input
                                placeholder="Search student..."
                                className="bg-transparent text-sm font-medium focus:outline-none text-slate-600 placeholder:text-slate-400"
                            />
                        </div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Total Students: <span className="text-slate-900">{STUDENTS_DATA.length}</span>
                        </div>
                    </div>

                    {/* The Grid Table */}
                    <table className="w-full">
                        <thead className="bg-white border-b border-slate-100 text-left">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-16">#</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Student Details</th>
                                <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider w-48">Marks Obtained</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {STUDENTS_DATA.map((student, index) => (
                                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 text-xs font-bold text-slate-400">{index + 1}</td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-bold text-slate-900 text-sm">{student.name}</div>
                                            <div className="text-xs text-slate-500 font-mono mt-0.5">{student.rollNo}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <input
                                                type="number"
                                                className={`w-24 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-right focus:outline-none focus:ring-2 transition-all text-slate-900 ${marksData[student.id] ? 'border-indigo-300 bg-indigo-50/30 ring-indigo-100' : ''
                                                    }`}
                                                placeholder="-"
                                                min="0"
                                                max={selectedTest?.maxMarks}
                                                value={marksData[student.id] || ''}
                                                onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                            />
                                            <span className="text-xs font-bold text-slate-400 w-8 text-right">/ {selectedTest?.maxMarks}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                        <Button onClick={handleSave} icon={Save} variant="primary">Save All Marks</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarksManager;
