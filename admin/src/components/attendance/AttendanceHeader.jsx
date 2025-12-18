import React from 'react';
import { Calendar, Save } from 'lucide-react';
import Button from "../../components/Button";
import SelectField from '../SelectField';

const AttendanceHeader = ({
    handleSave,
    isSaving,
    isPending,
    selectedDate, // Still needed for the title date display
    dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
}) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className=''>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Attendance Manager</h1>
                <p className="text-slate-500 text-sm mt-1">
                    Marking for {new Date(selectedDate).toLocaleDateString('en-US', dateOptions)}
                </p>
            </div>
            <div className="flex items-center gap-3">
                <Button
                    icon={Save}
                    onClick={handleSave}
                    disabled={isSaving || isPending}
                    className="shadow-lg shadow-indigo-500/20"
                >
                    {isSaving ? 'Saving...' : 'Save Attendance'}
                </Button>
            </div>
        </div>
    );
};

export default AttendanceHeader;
