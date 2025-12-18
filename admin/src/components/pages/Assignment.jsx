import { useState, useMemo, useEffect } from "react";
import Button from "../Button";
import Modal from "../Modal";
import { Plus, Trash2, Calendar, BookOpen, Loader2, X, FileText, Search } from 'lucide-react'
import InputField from "../InputField";
import SelectField from "../SelectField";
import useAssignments, { useCreateAssignment, useDeleteAssignment, useAddQuestions, useAssignmentQuestions } from "../../hooks/useAssignments";
import useSubjects from "../../hooks/useSubjects";
import toast from "react-hot-toast";
import { useCourseContext } from "../../context/CourseContext";
import PageHeader from "../common/PageHeader";
import SearchBar from "../common/SearchBar";
import Loading from "../common/Loading";
import EmptyState from "../common/EmptyState";

const AssignmentManager = () => {
    // 1. Global Context
    const { selectedCourseId, selectedSemester } = useCourseContext();

    // Modals
    const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [viewingAssignmentId, setViewingAssignmentId] = useState(null);

    // Forms
    const [formData, setFormData] = useState({ title: '', subjectId: '', description: '', dueDate: '' });

    // Question Management State
    const [questionInput, setQuestionInput] = useState('');
    const [addedQuestions, setAddedQuestions] = useState([]);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);

    // Local Filter State
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch Assignments & Subjects
    const { data: assignments = [], isPending } = useAssignments(selectedCourseId, selectedSemester);
    const { data: subjects = [] } = useSubjects(selectedCourseId, selectedSemester);

    const createAssignment = useCreateAssignment();
    const deleteAssignment = useDeleteAssignment();
    const addQuestions = useAddQuestions();

    // Filter Logic
    const filteredAssignments = assignments.filter(assign =>
        assign.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assign.subjectName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Assignment Handlers
    const handleSaveAssignment = () => {
        if (!selectedCourseId || !selectedSemester) {
            toast.error("Please select a course and semester first");
            return;
        }
        if (!formData.subjectId) {
            toast.error("Please select a subject");
            return;
        }

        const payload = {
            ...formData,
            courseId: selectedCourseId,
            semester: selectedSemester,
            subjectId: formData.subjectId
        };

        createAssignment.mutate(payload, {
            onSuccess: () => {
                toast.success("Assignment created successfully");
                setIsAssignmentModalOpen(false);
                setFormData({ title: '', subjectId: '', description: '', dueDate: '' });
            },
            onError: (error) => {
                toast.error(error.response?.data?.message || "Failed to create assignment");
            }
        });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this assignment?")) {
            deleteAssignment.mutate(id, {
                onSuccess: () => toast.success("Assignment deleted"),
                onError: () => toast.error("Failed to delete")
            });
        }
    };

    // Question Handlers
    const openQuestionModal = (assignmentId) => {
        setSelectedAssignmentId(assignmentId);
        setQuestionInput('');
        setAddedQuestions([]); // Reset list
        setIsQuestionModalOpen(true);
    }

    const handleAddToList = () => {
        if (!questionInput.trim()) {
            toast.error("Please enter question text");
            return;
        }
        setAddedQuestions([...addedQuestions, questionInput]);
        setQuestionInput(''); // Clear input
    };

    const handleRemoveFromList = (index) => {
        setAddedQuestions(addedQuestions.filter((_, i) => i !== index));
    };

    const handleSaveQuestions = () => {
        if (addedQuestions.length === 0) return;
        console.log(addedQuestions);
        addQuestions.mutate({
            assignmentId: selectedAssignmentId,
            questions: addedQuestions,
        }, {
            onSuccess: () => {
                toast.success("Questions added successfully");
                setIsQuestionModalOpen(false);
                setAddedQuestions([]);
                setQuestionInput('');
            },
            onError: (error) => {
                toast.error(error.response?.data?.message || "Failed to save questions");
            }
        });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-9rem)] space-y-6">

            {/* 1. Page Header */}
            <div className="shrink-0">
                <PageHeader
                    title="Assignments"
                    description="Create and track class assignments & homework"
                    icon={BookOpen}
                />
            </div>

            {/* 2. Filter & Action Bar */}
            <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <SearchBar
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    label=""
                    className="w-full md:w-80"
                    placeholder="Search Assignments..."
                />

                <div className="flex items-center gap-2 mt-2 md:mt-0">
                    {selectedCourseId && selectedSemester && (
                        <Button
                            icon={Plus}
                            onClick={() => setIsAssignmentModalOpen(true)}
                            className="shadow-lg shadow-indigo-500/20 h-[46px]"
                        >
                            Create Assignment
                        </Button>
                    )}
                </div>
            </div>

            {/* 3. Empty State or Table */}
            {!selectedCourseId || !selectedSemester ? (
                <EmptyState
                    title="No Course Selected"
                    description="Please select a Course and Semester from the header above to view assignments."
                />
            ) : isPending ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loading text="Loading Assignments..." size={40} />
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 overflow-hidden flex flex-col min-h-0 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="flex-1 overflow-auto relative">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[40%]">Assignment Details</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Due Date</th>

                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredAssignments.length > 0 ? filteredAssignments.map((assign) => (
                                    <tr key={assign.id} className="group hover:bg-slate-50 transition-colors duration-150">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs ring-1 ring-indigo-100">
                                                    <FileText size={16} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{assign.title}</span>
                                                    <span className="text-xs text-slate-400 font-mono tracking-wide mt-0.5">{assign.subjectName || assign.subject}</span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-3 text-center">
                                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors">
                                                <Calendar size={14} className="text-slate-400 group-hover:text-indigo-500" />
                                                <span className="text-sm font-semibold text-slate-600 group-hover:text-indigo-700">{new Date(assign.date || assign.dueDate).toLocaleDateString()}</span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    icon={Plus}
                                                    className="h-8 w-8 !p-0 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 flex items-center justify-center transition-colors"
                                                    onClick={() => openQuestionModal(assign.id)}
                                                    title="Add Questions"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    icon={FileText}
                                                    className="h-8 w-8 !p-0 rounded-lg hover:bg-sky-50 text-slate-400 hover:text-sky-600 flex items-center justify-center transition-colors"
                                                    onClick={() => setViewingAssignmentId(assign.id)}
                                                    title="View Details"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    icon={Trash2}
                                                    className="h-8 w-8 !p-0 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors"
                                                    onClick={() => handleDelete(assign.id)}
                                                    disabled={deleteAssignment.isPending}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-20">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <BookOpen size={48} className="mb-4 opacity-20" />
                                                <p className="font-bold">No assignments found.</p>
                                                <p className="text-xs mt-1">Try adjusting your search or create a new one.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create Assignment Modal */}
            <Modal isOpen={isAssignmentModalOpen} onClose={() => setIsAssignmentModalOpen(false)} title="Create New Assignment">
                <div className="space-y-4 pt-2">
                    <InputField
                        label="Title"
                        placeholder="e.g. Data Structures Lab 1"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        required
                    />

                    <SelectField
                        label="Subject"
                        options={subjects}
                        value={formData.subjectId}
                        onChange={e => setFormData({ ...formData, subjectId: e.target.value })}
                        placeholder="Select Subject"
                        disabled={subjects.length === 0}
                    />
                    {subjects.length === 0 && (
                        <p className="text-xs text-amber-500 font-bold mt-1 bg-amber-50 p-2 rounded-lg border border-amber-100 inline-block">No subjects found for this semester.</p>
                    )}

                    <InputField
                        label="Due Date"
                        type="date"
                        value={formData.dueDate}
                        onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                        required
                    />
                    <InputField
                        label="Description"
                        placeholder="Enter detailed instructions..."
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        multiline
                        className="min-h-[100px]"
                    />
                    <div className="mt-8 flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setIsAssignmentModalOpen(false)} className="font-bold text-slate-500">Cancel</Button>
                        <Button onClick={handleSaveAssignment} disabled={createAssignment.isPending} className="font-bold shadow-lg shadow-indigo-500/20">
                            {createAssignment.isPending ? 'Creating...' : 'Create Assignment'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Add Questions Modal */}
            <Modal isOpen={isQuestionModalOpen} onClose={() => setIsQuestionModalOpen(false)} title="Add Questions">
                <div className="space-y-6 pt-2">
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                        <InputField
                            label="Question Text"
                            placeholder="Type your question here..."
                            value={questionInput}
                            onChange={e => setQuestionInput(e.target.value)}
                            multiline
                            className="min-h-[80px]"
                        />
                        <div className="flex justify-end">
                            <Button
                                variant="secondary"
                                onClick={handleAddToList}
                                disabled={!questionInput.trim()}
                                icon={Plus}
                                size="sm"
                                className="font-bold rounded-xl"
                            >
                                Add to List
                            </Button>
                        </div>
                    </div>

                    {/* Added List */}
                    {addedQuestions.length > 0 && (
                        <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Added Questions ({addedQuestions.length})</h4>
                            {addedQuestions.map((q, idx) => (
                                <div key={idx} className="flex justify-between items-start p-4 bg-white border border-slate-100 rounded-xl shadow-sm group hover:border-slate-200 transition-colors">
                                    <div className="flex gap-4 overflow-hidden">
                                        <span className="text-xs font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-lg h-fit">Q{idx + 1}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-slate-800 font-medium break-words leading-relaxed">{q}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveFromList(idx)}
                                        className="text-slate-300 hover:text-rose-500 transition-colors flex-shrink-0 ml-3 p-1 rounded-lg hover:bg-rose-50"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-50">
                    <Button variant="ghost" onClick={() => setIsQuestionModalOpen(false)} className="font-bold text-slate-500">Cancel</Button>
                    <Button
                        onClick={handleSaveQuestions}
                        disabled={addQuestions.isPending || addedQuestions.length === 0}
                        className="font-bold shadow-lg shadow-indigo-500/20"
                    >
                        {addQuestions.isPending ? 'Saving...' : `Save ${addedQuestions.length} Questions`}
                    </Button>
                </div>
            </Modal>

            <AssignmentDetailsModal
                assignmentId={viewingAssignmentId}
                onClose={() => setViewingAssignmentId(null)}
            />
        </div>
    );
};

const AssignmentDetailsModal = ({ assignmentId, onClose }) => {
    const { data, isPending, isError } = useAssignmentQuestions(assignmentId);
    const questions = data?.data || [];

    return (
        <Modal isOpen={!!assignmentId} onClose={onClose} title="Assignment Details">
            {isPending ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="animate-spin text-indigo-600 mb-4" size={32} />
                    <p className="text-slate-500 text-sm font-bold animate-pulse">Loading question details...</p>
                </div>
            ) : isError ? (
                <div className="text-center py-12 text-rose-500">
                    <div className="p-4 bg-rose-50 rounded-full w-fit mx-auto mb-4">
                        <X size={24} />
                    </div>
                    <p className="font-bold">Failed to load assignment details</p>
                </div>
            ) : (
                <div className="space-y-6 pt-2">
                    <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Questions ({questions.length})</h4>
                        {questions.length === 0 ? (
                            <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <p className="text-sm text-slate-500 font-medium">No questions added yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                {questions.map((q, idx) => (
                                    <div key={idx} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex gap-4">
                                            <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 text-sm font-black flex items-center justify-center border border-indigo-100">
                                                {idx + 1}
                                            </span>
                                            <p className="text-slate-800 text-sm font-medium leading-relaxed break-words pt-1">{q.question || q}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className="mt-8 flex justify-end">
                <Button variant="ghost" onClick={onClose} className="font-bold text-slate-500">Close</Button>
            </div>
        </Modal>
    );
};

export default AssignmentManager;
