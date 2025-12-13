import React from 'react';
import { Calendar, Save } from 'lucide-react';
import Button from "../../components/Button";
import SelectField from '../SelectField';

const AttendanceHeader = ({
    courses = [],
    courseId,
    setCourseId,
    semesters = [],
    semester,
    setSemester,
    selectedDate,
    setSelectedDate,
    handleSave,
    isSaving,
    isPending,
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
            <div className="flex justify-center items-center gap-3 w-full md:w-auto">
                <div className="flex gap-4">
                    <div className="w-48">
                        <SelectField
                            label="Course"
                            options={courses}
                            value={courseId}
                            onChange={(e) => setCourseId(e.target.value)}
                        />
                    </div>
                    <div className="w-48">
                        <SelectField
                            label="Semester"
                            options={semesters}
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                        />
                    </div>
                </div>
                <div className="relative flex-1 md:flex-none">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
                    />
                </div>
                <Button
                    variant="success"
                    onClick={handleSave}
                    icon={Save}
                    disabled={isSaving || isPending}
                >
                    {isSaving ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </div>
    );
};

export default AttendanceHeader;
