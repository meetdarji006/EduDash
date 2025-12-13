import { useState } from "react";
import Button from "../Button";
import Modal from "../Modal";
import TableHeader from "../TabHeader";
import InputField from "../InputField";
import SelectField from "../SelectField";
import { Plus, Edit2, Trash2 } from "lucide-react";

const MOCK_COURSES = [
    { id: 'c1', name: 'B.Tech CSE' },
    { id: 'c2', name: 'B.Tech ME' },
    { id: 'c3', name: 'B.Com' },
];
const INITIAL_STUDENTS = [
    { id: '1', name: 'Rahul Sharma', rollNo: '2021-CS-045', course: 'B.Tech CSE', semester: 6, phone: '9876543210' },
    { id: '2', name: 'Priya Verma', rollNo: '2022-EC-012', course: 'B.Tech ME', semester: 4, phone: '8765432109' },
    { id: '3', name: 'Amit Patel', rollNo: '2023-CS-102', course: 'B.Tech CSE', semester: 2, phone: '9988776655' },
    { id: '4', name: 'Sneha Gupta', rollNo: '2021-CS-050', course: 'B.Tech CSE', semester: 6, phone: '8877665544' },
    { id: '5', name: 'Vikram Singh', rollNo: '2021-ME-001', course: 'B.Tech ME', semester: 6, phone: '7766554433' },
    { id: '6', name: 'Anjali Rao', rollNo: '2023-EC-005', course: 'B.Tech ECE', semester: 2, phone: '6655443322' },
    { id: '7', name: 'Rohit Kumar', rollNo: '2022-CS-088', course: 'B.Tech CSE', semester: 4, phone: '5544332211' },
    { id: '8', name: 'Kavita Mishra', rollNo: '2021-CS-099', course: 'B.Tech CSE', semester: 6, phone: '4433221100' },
];

const StudentManager = () => {
    const [students, setStudents] = useState(INITIAL_STUDENTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', rollNo: '', course: '', semester: '', phone: '' });

    const handleSave = () => {
        if (!formData.name || !formData.rollNo) return;
        const newStudent = { id: Date.now(), ...formData };
        setStudents([newStudent, ...students]);
        setIsModalOpen(false);
        setFormData({ name: '', rollNo: '', course: '', semester: '', phone: '' });
    };

    const handleDelete = (id) => {
        setStudents(students.filter(s => s.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Students</h1>
                    <p className="text-slate-500 text-sm">Manage student enrollments and details</p>
                </div>
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Add New Student</Button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <TableHeader cols={['Name', 'Roll No', 'Course', 'Semester', 'Phone']} />
                        <tbody className="divide-y divide-slate-50">
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-900">{student.name}</td>
                                    <td className="px-6 py-4 font-mono text-slate-600 text-xs bg-slate-50 w-fit rounded-lg">{student.rollNo}</td>
                                    <td className="px-6 py-4 text-slate-600 font-medium text-sm">{student.course}</td>
                                    <td className="px-6 py-4 text-slate-600 font-medium text-sm">{student.semester}th</td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">{student.phone}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Button variant="ghost" icon={Edit2} onClick={() => { }} />
                                            <Button variant="ghost" icon={Trash2} className="text-rose-400 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(student.id)} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Student">
                <InputField label="Full Name" placeholder="e.g. John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                <InputField label="Roll Number" placeholder="e.g. 2023-CS-001" value={formData.rollNo} onChange={e => setFormData({ ...formData, rollNo: e.target.value })} required />
                <div className="grid grid-cols-2 gap-4">
                    <SelectField label="Course" options={MOCK_COURSES} value={formData.course} onChange={e => setFormData({ ...formData, course: e.target.value })} />
                    <InputField label="Semester" type="number" placeholder="1-8" value={formData.semester} onChange={e => setFormData({ ...formData, semester: e.target.value })} />
                </div>
                <InputField label="Phone Number" placeholder="10-digit mobile number" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Student</Button>
                </div>
            </Modal>
        </div>
    );
};


export default StudentManager;
