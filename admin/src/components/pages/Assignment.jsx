import { useState } from "react";
import Button from "../Button";
import Modal from "../Modal";
import { Plus, Trash2, } from 'lucide-react'
import InputField from "../InputField";
import SelectField from "../SelectField";

const MOCK_SUBJECTS = [
  { id: 's1', name: 'Data Structures', code: 'CS-301' },
  { id: 's2', name: 'Database Management', code: 'CS-302' },
  { id: 's3', name: 'Linear Algebra', code: 'MA-201' },
];

const INITIAL_ASSIGNMENTS = [
    { id: '1', title: 'Linked List Implementation', subject: 'Data Structures', dueDate: '2025-10-30', description: 'Implement a doubly linked list in C++.' },
    { id: '2', title: 'Matrix Operations', subject: 'Linear Algebra', dueDate: '2025-11-05', description: 'Solve the provided matrix problems.' },
];


const AssignmentManager = () => {
    const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', subject: '', description: '', dueDate: '' });

    const handleSave = () => {
        if (!formData.title) return;
        setAssignments([{ id: Date.now(), ...formData }, ...assignments]);
        setIsModalOpen(false);
        setFormData({ title: '', subject: '', description: '', dueDate: '' });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Assignments</h1>
                    <p className="text-slate-500 text-sm">Create and track class assignments</p>
                </div>
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Create Assignment</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignments.map((assign) => (
                    <div key={assign.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex justify-between items-start mb-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 uppercase tracking-wide">
                                {assign.subject}
                            </span>
                            <button onClick={() => setAssignments(assignments.filter(a => a.id !== assign.id))} className="text-slate-300 hover:text-rose-500 transition-colors">
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg mb-1">{assign.title}</h3>
                        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{assign.description}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <div className="text-xs">
                                <span className="text-slate-400 font-semibold block uppercase text-[10px]">Due Date</span>
                                <span className="font-bold text-slate-700">{assign.dueDate}</span>
                            </div>
                            <Button variant="secondary" className="text-xs px-3 py-1.5 h-auto">View Subs</Button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Assignment">
                <InputField label="Title" placeholder="e.g. Lab Report 1" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                <SelectField label="Subject" options={MOCK_SUBJECTS} value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} />
                <InputField label="Due Date" type="date" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} required />
                <InputField label="Description" placeholder="Instructions for students..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} multiline />
                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Create</Button>
                </div>
            </Modal>
        </div>
    );
};


export default AssignmentManager;
