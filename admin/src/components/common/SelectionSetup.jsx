import react from 'react'

export default function SelectionSetup() {
    return (
        <div className="w-48 px-2">
            <select
                className="w-full text-sm font-bold text-slate-700 bg-transparent border-none focus:ring-0 cursor-pointer py-1"
                value={selectedCourse}
                onChange={(e) => { setSelectedCourse(e.target.value); setSelectedSemester(''); }}
            >
                <option value="">Select Course</option>
                {courses?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
        </div>
    )
}
