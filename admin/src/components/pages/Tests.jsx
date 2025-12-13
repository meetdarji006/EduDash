import { useState, useMemo } from "react";
import Button from "../Button";
import Modal from "../Modal";
import { Plus, Trash2, Calendar, FileText, Clock, Search, BookOpen, AlertCircle, Loader2 } from 'lucide-react'
import InputField from "../InputField";
import SelectField from "../SelectField";
import useTestActions from "../../hooks/useTestActions";
import useTests from "../../hooks/useTests";
import useCourses from "../../hooks/useCourses";
import useSubjects from "../../hooks/useSubjects";
import toast from "react-hot-toast";

const TestManager = () => {
    // Filter States
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', subject: '', maxMarks: '', date: '' });

    // Data Fetching
    const { data: courses } = useCourses();
    const { data: tests, isPending: isTestsLoading } = useTests(selectedCourse, selectedSemester);
    const { data: subjects } = useSubjects(selectedCourse, selectedSemester);

    // Actions
    const { addTest, deleteTest } = useTestActions();

    // Derived States
    const semesterOptions = useMemo(() => {
        if (!selectedCourse || !courses) return [];
        const course = courses.find(c => c.id === selectedCourse);
        return course ? Array.from({ length: course.duration }, (_, i) => ({ id: i + 1, name: `Semester ${i + 1}` })) : [];
    }, [selectedCourse, courses]);

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
        <div className="flex flex-col h-[calc(100vh-4rem)] -m-6 p-6 space-y-6 bg-slate-50/50">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tests & Exams</h1>
                    <p className="text-slate-500 text-sm font-medium">Schedule and manage examinations for your courses.</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="w-48">
                        <select
                            className="w-full text-sm font-medium text-slate-700 bg-transparent border-none focus:ring-0 cursor-pointer"
                            value={selectedCourse}
                            onChange={(e) => { setSelectedCourse(e.target.value); setSelectedSemester(''); }}
                        >
                            <option value="">Select Course</option>
                            {courses?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="w-px h-6 bg-slate-200"></div>
                    <div className="w-32">
                        <select
                            className="w-full text-sm font-medium text-slate-700 bg-transparent border-none focus:ring-0 cursor-pointer disabled:opacity-50"
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                            disabled={!selectedCourse}
                        >
                            <option value="">Semester</option>
                            {semesterOptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col relative">

                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <FileText size={18} className="text-indigo-600" />
                        <span>Scheduled Tests</span>
                        {tests?.length > 0 && <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">{tests.length}</span>}
                    </h3>
                    {selectedCourse && selectedSemester && (
                        <Button icon={Plus} onClick={() => setIsModalOpen(true)} className="h-8 px-3 text-xs shadow-sm hover:shadow-md transition-all">
                            Schedule Test
                        </Button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {/* Empty/Initial States */}
                    {!(selectedCourse && selectedSemester) && (
                        <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 transform -rotate-3">
                                <BookOpen size={32} />
                            </div>
                            <p className="max-w-xs text-sm">Select a course and semester to view or schedule tests.</p>
                        </div>
                    )}

                    {selectedCourse && selectedSemester && isTestsLoading && (
                        <div className="h-full flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
                            <p className="text-slate-500 text-sm animate-pulse">Loading tests...</p>
                        </div>
                    )}

                    {selectedCourse && !isTestsLoading && tests?.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                                <Search size={28} />
                            </div>
                            <h3 className="text-slate-900 font-bold mb-1">No Tests Scheduled</h3>
                            <p className="text-slate-500 text-sm mb-6">There are no exams scheduled for this semester yet.</p>
                            <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Schedule First Test</Button>
                        </div>
                    )}

                    {/* Tests Grid */}
                    {tests?.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {tests.map((test) => (
                                <div key={test.id} className="group relative bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-indigo-200 transition-all duration-300">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-8 rounded-full bg-indigo-500"></span>
                                            <div>
                                                <h4 className="font-bold text-slate-900 line-clamp-1 uppercase">{test.title}</h4>
                                                <p className="text-xs text-slate-500 font-medium">{test.subjectName || test.subject}</p>
                                            </div>
                                        </div>
                                        <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${new Date(test.date) < new Date() ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-600'}`}>
                                            {new Date(test.date) < new Date() ? 'Completed' : 'Upcoming'}
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-xs text-slate-600">
                                            <Calendar size={14} className="text-indigo-400" />
                                            <span className="font-medium">{test.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-600">
                                            <AlertCircle size={14} className="text-rose-400" />
                                            <span className="font-medium">Max Marks: {test.maxMarks}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-50 flex justify-end">
                                        <button
                                            disabled={deleteTest.isPending}
                                            onClick={() => handleDelete(test.id)}
                                            className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                                            title="Delete Test"
                                        >
                                            {deleteTest.isPending && deleteTest.variables === test.id ? (
                                                <Loader2 size={16} className="animate-spin text-rose-500" />
                                            ) : (
                                                <Trash2 size={16} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Schedule Test Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule New Test">
                <div className="space-y-4">
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
                        <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded -mt-2">
                            No subjects found for this semester. Please add subjects first.
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
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

                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Schedule Test</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default TestManager;
