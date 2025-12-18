import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../Button";
import Modal from "../Modal";
import InputField from "../InputField";
import Pagination from "../Pagination";
import { Plus, Edit2, Trash2, Search, GraduationCap, User, Users, Eye, User2 } from "lucide-react";
import useCourses from '../../hooks/useCourses';
import useStudents from '../../hooks/useStudents';
import useStudentActions from "../../hooks/useStudentActions";
import { useCourseContext } from "../../context/CourseContext";
import SearchBar from "../common/SearchBar";
import PageHeader from "../common/PageHeader";
import Loading from "../common/Loading";
import EmptyState from "../common/EmptyState";

// Static Data
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

const StudentManager = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Context State
    const { selectedCourseId: course, selectedSemester: semester } = useCourseContext();

    // State via URL Params (Search & Pagination only)
    const searchTerm = searchParams.get('search') || '';
    const currentPage = Number(searchParams.get('page')) || 1;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', rollNo: '', courseId: '', semester: '', phone: '', password: '', address: '' });
    const itemsPerPage = 50;

    // Hooks
    const { data: courses = [] } = useCourses();
    const { data: students = [], isPending: isStudentsLoading } = useStudents(course, semester);
    const { addStudent, deleteStudent } = useStudentActions();

    // Helpers to update URL params
    const updateParams = (updates) => {
        const newParams = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === '' || value === undefined) {
                newParams.delete(key);
            } else {
                newParams.set(key, value);
            }
        });
        setSearchParams(newParams);
    };

    // Filtered Students (Search + Hook Data)
    const filteredStudents = students.filter(student =>
        student?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        student?.rollNo?.toString()?.includes(searchTerm)
    );

    // Pagination Logic
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

    const handleSave = () => {
        if (!formData.name || !formData.rollNo || !formData.courseId || !formData.semester || !formData.password) {
            alert("Please fill in all required fields.");
            return;
        }

        addStudent.mutate(formData, {
            onSuccess: () => {
                setIsModalOpen(false);
                setFormData({ name: '', rollNo: '', courseId: '', semester: '', phone: '', password: '', address: '' });
            }
        });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            deleteStudent.mutate(id);
        }
    };

    // Helper to generate initials for avatar
    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || '?';
    };

    return (
        <div className="flex flex-col h-[calc(100vh-7rem)] md:h-[calc(100vh-9rem)] space-y-6">
            {/* 1. Page Header with Stats placeholder */}
            <div className="shrink-0">
                <PageHeader
                    title="Students Directory"
                    description="Manage student enrollments and academic details"
                    icon={User2}
                />
            </div>

            {/* 2. Filter & Search Bar */}
            <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search Input */}
                <SearchBar
                    value={searchTerm}
                    onChange={(e) => updateParams({ search: e.target.value, page: 1 })}
                    label=""
                    className="w-full md:w-80"
                    placeholder="Search Students..."
                />

                <div className="flex items-center gap-2 mt-2 md:mt-0">
                    {localStorage.getItem('userRole') !== 'TEACHER' && course && semester && (
                        <Button
                            icon={Plus}
                            onClick={() => setIsModalOpen(true)}
                            className="shadow-lg shadow-indigo-500/20 h-[46px]"
                        >
                            Add New Student
                        </Button>
                    )}
                </div>
            </div>

            {/* 3. Empty State or Table */}
            {!course || !semester ? (
                <EmptyState
                    title="No Course Selected"
                    description="Please select a Course and Semester from the header above to view the student directory."
                />
            ) : isStudentsLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loading text="Fetching Students..." size={40} />
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 overflow-hidden flex flex-col min-h-0 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="flex-1 overflow-auto relative">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[60%]">Student Profile</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {currentStudents.length > 0 ? currentStudents.map((student) => (
                                    <tr key={student.id} className="group hover:bg-slate-50 transition-colors duration-150">
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
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" icon={Eye} onClick={() => navigate(`/students/${student.id}`)} className="h-8 w-8 !p-0 rounded-lg hover:bg-sky-50 text-slate-400 hover:text-sky-600 flex items-center justify-center transition-colors" />
                                                <Button variant="ghost" icon={Edit2} onClick={() => { }} className="h-8 w-8 !p-0 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-colors" />
                                                <Button variant="ghost" icon={Trash2} className="h-8 w-8 !p-0 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors" onClick={() => handleDelete(student.id)} />
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="2" className="text-center py-20">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <Users size={48} className="mb-4 opacity-20" />
                                                <p className="font-bold">No students found.</p>
                                                <p className="text-xs mt-1">Try adjusting your search.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {filteredStudents.length > 0 && (
                        <div className="shrink-0 border-t border-slate-100 p-2">
                            <Pagination
                                totalItems={filteredStudents.length}
                                itemsPerPage={itemsPerPage}
                                currentPage={currentPage}
                                onPageChange={(page) => updateParams({ page })}
                                startIndex={startIndex}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Existing Modal Logic (kept largely same but styled content can vary) */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Student">
                <div className="space-y-4">
                    <InputField label="Full Name" placeholder="e.g. John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    <InputField label="Roll Number" placeholder="e.g. 2023-CS-001" value={formData.rollNo} onChange={e => setFormData({ ...formData, rollNo: e.target.value })} required />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="mb-0">
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Course</label>
                            <select
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-slate-900 text-sm"
                                value={formData.courseId}
                                onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                                required
                            >
                                <option value="">Select Course</option>
                                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <InputField label="Semester" type="number" placeholder="1-8" value={formData.semester} onChange={e => setFormData({ ...formData, semester: e.target.value })} required />
                    </div>
                    <InputField label="Password" type="password" placeholder="Set a temporary password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                    <InputField label="Address" placeholder="Student's address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                    <InputField label="Phone Number" placeholder="10-digit mobile number" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Save Student</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default StudentManager;
