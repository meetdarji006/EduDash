import { useState, useMemo } from "react";
import Button from "../Button";
import Modal from "../Modal";
import { Plus, Trash2, Calendar, FileText, Clock, Search, BookOpen, AlertCircle, Loader2 } from 'lucide-react'
import InputField from "../InputField";
import SelectField from "../SelectField";
import useTestActions from "../../hooks/useTestActions";
import useTests from "../../hooks/useTests";
import useSubjects from "../../hooks/useSubjects";
import toast from "react-hot-toast";
import { useCourseContext } from "../../context/CourseContext";
import PageHeader from "../common/PageHeader";
import Loading from "../common/Loading";
import EmptyState from "../common/EmptyState";
import SearchBar from "../common/SearchBar";

const TestManager = () => {
    // 1. Global Context
    const { selectedCourseId, selectedSemester } = useCourseContext();

    // Filter States - Local Course/Semester removed
    // const [selectedCourse, setSelectedCourse] = useState('');
    // const [selectedSemester, setSelectedSemester] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', subject: '', maxMarks: '', date: '' });

    // Data Fetching
    // const { data: courses } = useCourses(); // Removed
    const { data: tests, isPending: isTestsLoading } = useTests(selectedCourseId, selectedSemester);
    const { data: subjects } = useSubjects(selectedCourseId, selectedSemester);

    // Actions
    const { addTest, deleteTest } = useTestActions();

    // Filter Logic
    const filteredTests = tests?.filter(test =>
        test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (test.subjectName || test.subject)?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    // Derived States - Semester Options removed
    /*
    const semesterOptions = useMemo(() => {
        if (!selectedCourse || !courses) return [];
        const course = courses.find(c => c.id === selectedCourse);
        return course ? Array.from({ length: course.duration }, (_, i) => ({ id: i + 1, name: `Semester ${i + 1}` })) : [];
    }, [selectedCourse, courses]);
    */

    const handleSave = () => {
        if (!formData.title || !formData.date || !formData.maxMarks || !formData.subject) {
            toast.error("Please fill all fields");
            return;
        }

        addTest.mutate({
            title: formData.title,
            subjectId: formData.subject,
            maxMarks: formData.maxMarks,
            date: formData.date,
        }, {
            onSuccess: () => {
                toast.success("Test scheduled successfully");
                setIsModalOpen(false);
                setFormData({ title: '', subject: '', maxMarks: '', date: '' });
            },
            onError: (e) => toast.error(e.response?.data?.message || "Failed to add test"),
        });
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this test?")) {
            deleteTest.mutate(id, {
                onSuccess: () => toast.success("Test deleted")
            });
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-9rem)] space-y-6">
            {/* 1. Header with Stats placeholder */}
            <div className="shrink-0">
                <PageHeader
                    title="Tests & Exams"
                    description="Schedule and manage examinations for your courses."
                    icon={FileText}
                />
            </div>

            {/* 2. Filter & Action Bar */}
            <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <SearchBar
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    label=""
                    className="w-full md:w-80"
                    placeholder="Search Tests..."
                />

                <div className="flex items-center gap-2 mt-2 md:mt-0">
                    {selectedCourseId && selectedSemester && (
                        <Button
                            icon={Plus}
                            onClick={() => setIsModalOpen(true)}
                            className="bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 rounded-xl px-6"
                        >
                            Schedule Test
                        </Button>
                    )}
                </div>
            </div>

            {/* 3. Tests Grid or Empty State */}
            {!selectedCourseId || !selectedSemester ? (
                <EmptyState
                    title="No Course Selected"
                    description="Please select a Course and Semester from the header above to view or schedule tests."
                />
            ) : isTestsLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loading text="Loading Tests..." size={40} />
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 overflow-hidden flex flex-col min-h-0 animate-in fade-in slide-in-from-bottom-8 duration-700">



                    <div className="flex-1 overflow-auto relative">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[35%]">Test Details</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Schedule</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Max Marks</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredTests.length > 0 ? filteredTests.map((test) => (
                                    <tr key={test.id} className="group hover:bg-slate-50 transition-colors duration-150">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs ring-1 ring-indigo-100">
                                                    <FileText size={16} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{test.title}</span>
                                                    <span className="text-xs text-slate-400 font-mono tracking-wide mt-0.5">{test.subjectName || test.subject}</span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-3 text-center">
                                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors">
                                                <Calendar size={14} className="text-slate-400 group-hover:text-indigo-500" />
                                                <span className="text-sm font-semibold text-slate-600 group-hover:text-indigo-700">{test.date}</span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-3 text-center">
                                            <div className="inline-flex items-center gap-1.5">
                                                <span className="font-semibold text-slate-700 text-sm">{test.maxMarks}</span>
                                                <span className="text-xs text-slate-400 font-medium">marks</span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-3 text-center">
                                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${new Date(test.date) < new Date() ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                                {new Date(test.date) < new Date() ? 'Completed' : 'Upcoming'}
                                            </div>
                                        </td>

                                        <td className="px-6 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    icon={Trash2}
                                                    className="h-8 w-8 !p-0 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors"
                                                    onClick={() => handleDelete(test.id)}
                                                    disabled={deleteTest.isPending}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-20">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <FileText size={48} className="mb-4 opacity-20" />
                                                <p className="font-bold">No tests found.</p>
                                                <p className="text-xs mt-1">Try adjusting your search or schedule a new one.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Schedule Test Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule New Test">
                <div className="space-y-5 p-1">
                    <InputField
                        label="Test Title"
                        placeholder="e.g. Mid-Semester Exam"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        required
                    />

                    <SelectField
                        label="Subject"
                        options={subjects}
                        value={formData.subject}
                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        disabled={!subjects?.length}
                    />

                    {(!subjects || subjects.length === 0) && (
                        <div className="text-xs font-bold text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100 flex items-center gap-2">
                            <AlertCircle size={14} />
                            No subjects found for this semester. Please add subjects first.
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-5">
                        <InputField
                            label="Max Marks"
                            type="number"
                            placeholder="100"
                            value={formData.maxMarks}
                            onChange={e => setFormData({ ...formData, maxMarks: e.target.value })}
                        />
                        <InputField
                            label="Date"
                            type="date"
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                    </div>

                    <div className="mt-8 flex justify-end gap-3 pt-5 border-t border-slate-100">
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="rounded-xl px-5 font-bold">Cancel</Button>
                        <Button onClick={handleSave} className="rounded-xl px-6 font-bold shadow-lg shadow-indigo-500/20 bg-indigo-600">Schedule Test</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default TestManager;
