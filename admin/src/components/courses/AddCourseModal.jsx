import { useState } from 'react';
import Modal from '../Modal';
import InputField from '../InputField';
import Button from '../Button';
import useCourseActions from '../../hooks/useCourseActions';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

function AddCourseModal({ isCourseModalOpen, setCourseModalOpen }) {
    const [courseForm, setCourseForm] = useState({ name: '', code: '', duration: '' });

    const handleFieldChange = (e) => {
        console.log(e.target.name, e.target.value);
        setCourseForm({ ...courseForm, [e.target.name]: e.target.value });
    }

    const { addCourse } = useCourseActions();

    const handleAddCourse = () => {
        addCourse.mutate(courseForm, {
            onSuccess: () => {
                toast.success("Course added successfully");
                setCourseModalOpen(false);
                setCourseForm({ name: '', code: '', duration: '' });
            },
            onError: () => {
                toast.error("Error while adding course");
            }
        });
    }

    return (
        <Modal isOpen={isCourseModalOpen} onClose={() => setCourseModalOpen(false)} title="Add New Course">
            <InputField
                name="name"
                label="Course Name"
                placeholder="e.g. B.Tech Computer Science"
                value={courseForm.name}
                onChange={handleFieldChange}
                required
            />

            <InputField
                name="duration"
                label="Duration"
                placeholder="e.g. 6 Semesters"
                value={courseForm.duration}
                onChange={handleFieldChange}
            />

            <div className="mt-6 flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setCourseModalOpen(false)}>Cancel</Button>
                <Button
                    disabled={addCourse.isPending}
                    onClick={handleAddCourse}
                >
                    {addCourse.isPending ?
                        <Loader2
                            size={16}
                            className="animate-spin text-slate-600"
                        />
                        : "Add Course"}
                </Button>
            </div>
        </Modal>
    )
}

export default AddCourseModal
