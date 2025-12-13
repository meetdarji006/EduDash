import React, { useState, useMemo } from 'react'
import Modal from "../Modal";
import InputField from "../InputField";
import Button from "../Button";
import SelectField from '../SelectField';
import useSubjectActions from '../../hooks/useSubjectActions';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

function AddSubjectModal({ courses, isSubjectModalOpen, setSubjectModalOpen }) {
    const [subjectForm, setSubjectForm] = useState({ name: '', code: '', courseId: '', semester: '' });

    const { addSubject } = useSubjectActions();

    const handleFieldChange = (e) => {
        setSubjectForm({ ...subjectForm, [e.target.name]: e.target.value });
    }

    // Derived state for semester options
    const semesterOptions = useMemo(() => {
        if (!subjectForm.courseId) return [];
        const selectedCourseData = courses?.find(c => c.id === subjectForm.courseId);
        if (!selectedCourseData?.duration) return [];

        return Array.from({ length: selectedCourseData.duration }, (_, i) => ({
            id: i + 1,
            name: `Semester ${i + 1}`
        }));
    }, [subjectForm.courseId, courses]);

    const handleAddSubject = () => {
        if (!subjectForm.name || !subjectForm.code || !subjectForm.courseId || !subjectForm.semester) {
            toast.error("Please fill all fields");
            return;
        }

        addSubject.mutate(subjectForm, {
            onSuccess: () => {
                toast.success("Subject added successfully");
                setSubjectForm({ name: '', code: '', courseId: '', semester: '' });
                setSubjectModalOpen(false);
            },
            onError: () => {
                toast.error("Error while adding subject");
            }
        });
    }

    return (
        <Modal isOpen={isSubjectModalOpen} onClose={() => setSubjectModalOpen(false)} title="Add New Subject">
            <div className="space-y-4">
                <InputField
                    name="name"
                    label="Subject Name"
                    placeholder="e.g. Data Structures"
                    value={subjectForm.name}
                    onChange={handleFieldChange}
                    required
                />

                <InputField
                    name="code"
                    label="Subject Code"
                    placeholder="e.g. CS-301"
                    value={subjectForm.code}
                    onChange={handleFieldChange}
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <SelectField
                        label="Course"
                        options={courses}
                        value={subjectForm.courseId}
                        onChange={e => setSubjectForm({ ...subjectForm, courseId: e.target.value, semester: '' })} // Reset semester on course change
                    />

                    <SelectField
                        label="Semester"
                        options={semesterOptions}
                        value={subjectForm.semester}
                        onChange={e => setSubjectForm({ ...subjectForm, semester: e.target.value })}
                        disabled={!subjectForm.courseId}
                    />
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button variant="secondary" onClick={() => setSubjectModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddSubject} disabled={addSubject.isPending}>
                        {addSubject.isPending ? (
                            <div className="flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin" />
                                <span>Adding...</span>
                            </div>
                        ) : "Add Subject"}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default AddSubjectModal
