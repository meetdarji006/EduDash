import React, { useState } from 'react';
import { Save } from 'lucide-react';
import Modal from './Modal'; // Importing from shared UI file
import Button from './Button'; // Importing from shared UI file

const MarksEntryModal = ({ isOpen, onClose, test, students }) => {
    const [marksData, setMarksData] = useState({});

    // Guard clause if no test is selected
    if (!test) return null;

    const handleMarkChange = (studentId, value) => {
        // Prevent entering marks higher than maxMarks
        if (Number(value) > test.maxMarks) return;
        setMarksData(prev => ({ ...prev, [studentId]: value }));
    };

    const handleSave = () => {
        console.log("Saving Marks for Test ID:", test.id, marksData);
        // TODO: Add API call logic here
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Enter Marks: ${test.title}`}>

            {/* 1. Test Summary Header */}
            <div className="mb-6 bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex justify-between items-center shadow-sm">
                <div>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5">Subject</p>
                    <p className="font-bold text-indigo-900">{test.subject}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5">Max Marks</p>
                    <p className="font-black text-indigo-900 text-lg">{test.maxMarks}</p>
                </div>
            </div>

            {/* 2. Students List Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden mb-6 shadow-sm">
                <div className="max-h-80 overflow-y-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Student Details</th>
                                <th className="px-4 py-3 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider w-32">Marks Obtd.</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {students.map(student => (
                                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <p className="text-sm font-bold text-slate-900">{student.name}</p>
                                        <p className="text-xs text-slate-500 font-mono mt-0.5">{student.rollNo}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <input
                                            type="number"
                                            className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-right focus:outline-none focus:ring-2 transition-all text-slate-900 ${marksData[student.id] ? 'border-indigo-200 bg-indigo-50/30' : ''
                                                }`}
                                            placeholder="0"
                                            min="0"
                                            max={test.maxMarks}
                                            value={marksData[student.id] || ''}
                                            onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 3. Action Footer */}
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-50">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} icon={Save}>Save Marks</Button>
            </div>
        </Modal>
    );
};

export default MarksEntryModal;
