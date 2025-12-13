import { GraduationCap, Loader2, Plus, Trash2, ChevronRight, BookOpen } from "lucide-react"
import Button from "../Button"
import useCourseActions from "../../hooks/useCourseActions";

function CoursesColumn({ setCourseModalOpen, courses, setSelectedCourse, selectedCourse }) {
    const { deleteCourse } = useCourseActions();

    return (
        <div className="lg:col-span-1 flex flex-col h-full gap-4">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <GraduationCap size={18} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">Courses</h2>
                </div>
                <Button icon={Plus} onClick={() => setCourseModalOpen(true)} className="h-8 px-3 text-xs shadow-sm hover:shadow-md transition-all">New</Button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-3 pb-4">
                {courses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-2xl border-dashed text-slate-400 gap-3 min-h-[200px]">
                        <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300">
                            <BookOpen size={24} />
                        </div>
                        <p className="text-sm font-medium">No courses added yet.</p>
                        <Button variant="outline" onClick={() => setCourseModalOpen(true)} className="text-xs">Create First Course</Button>
                    </div>
                ) : (
                    courses.map(course => {
                        const isActive = selectedCourse === course.id;
                        return (
                            <div
                                key={course.id}
                                onClick={() => setSelectedCourse(course.id)}
                                className={`group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden
                                    ${isActive
                                        ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 border-indigo-600 text-white shadow-lg shadow-indigo-200 ring-2 ring-indigo-100 ring-offset-2'
                                        : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5'
                                    }`}
                            >
                                {/* Decorative circle for active state */}
                                {isActive && (
                                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                                )}

                                <div className="flex justify-between items-start relative z-10">
                                    <div className="flex-1 min-w-0 mr-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className={`font-black text-sm uppercase tracking-wide truncate ${isActive ? 'text-white' : 'text-slate-800'}`}>
                                                {course.name}
                                            </h3>
                                        </div>
                                        <div className={`flex items-center gap-2 text-xs font-medium ${isActive ? 'text-indigo-100' : 'text-slate-500'}`}>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-white/20' : 'bg-slate-100 text-slate-600'}`}>
                                                {course.duration} Semesters
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            disabled={deleteCourse.isPending}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Add delete logic here
                                            }}
                                            className={`p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100
                                                ${isActive
                                                    ? 'text-indigo-200 hover:text-white hover:bg-white/20'
                                                    : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                                                }`}
                                        >
                                            {deleteCourse.isPending ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                                        </button>
                                        <div className={`transition-transform duration-300 ${isActive ? 'translate-x-1 opacity-100' : 'opacity-0 -translate-x-2'}`}>
                                            {isActive && <ChevronRight size={18} className="text-indigo-200" />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    )
}

export default CoursesColumn
