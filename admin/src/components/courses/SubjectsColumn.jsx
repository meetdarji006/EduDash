import { Library, Plus, Trash2, Search, BookOpen } from 'lucide-react'
import Button from '../Button';
import useSubjectActions from "../../hooks/useSubjectActions";

function SubjectsColumn({
    subjects,
    selectedCourse,
    semester,
    setSubjectModalOpen,
    isSubjectsLoading,
    status
}) {
    const { deleteSubject } = useSubjectActions();

    return (
        <div className="lg:col-span-2 flex flex-col h-[80%] gap-4">
            {/* Header */}
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Library size={18} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">Subjects</h2>
                    {subjects?.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                            {subjects.length}
                        </span>
                    )}
                </div>
                {selectedCourse && (
                    <Button icon={Plus} onClick={() => setSubjectModalOpen(true)} className="h-8 px-3 text-xs shadow-sm hover:shadow-md transition-all">
                        New Subject
                    </Button>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col relative">

                {/* No course selected state */}
                {!selectedCourse && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-4 transform rotate-3">
                            <BookOpen size={32} className="text-indigo-300" />
                        </div>
                        <h3 className="text-slate-900 font-bold mb-1">No Course Selected</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto">
                            Please select a course from the left column to manage its subjects syllabus.
                        </p>
                    </div>
                )}

                {/* Loading state */}
                {selectedCourse && isSubjectsLoading && status !== "idle" && (
                    <div className="absolute inset-0 flex flex-col justify-center items-center bg-white/80 backdrop-blur-sm z-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-3"></div>
                        <p className="text-slate-500 text-sm font-medium animate-pulse">Loading subjects...</p>
                    </div>
                )}

                {/* Empty subjects state */}
                {selectedCourse && !isSubjectsLoading && subjects?.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                            <Search size={28} />
                        </div>
                        <h3 className="text-slate-900 font-bold mb-1">No Subjects Found</h3>
                        <p className="text-slate-500 text-sm mb-6">
                            This course doesn't have any subjects yet.
                        </p>
                        <Button icon={Plus} onClick={() => setSubjectModalOpen(true)} className="text-xs">
                            Add First Subject
                        </Button>
                    </div>
                )}

                {/* Subjects List */}
                {selectedCourse && subjects?.length > 0 && (
                    <div className="overflow-y-auto h-full p-2 space-y-2">
                        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 mb-1">
                            <div className="col-span-2">Code</div>
                            <div className="col-span-5">Subject Name</div>
                            <div className="col-span-3">Details</div>
                            <div className="col-span-2 text-right">Action</div>
                        </div>

                        {subjects.map(subject => (
                            <div key={subject.id} className="group grid grid-cols-12 gap-4 items-center p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-200">
                                <div className="col-span-2">
                                    <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md border border-slate-200 group-hover:border-slate-300 group-hover:bg-white transition-colors">
                                        {subject.code}
                                    </span>
                                </div>
                                <div className="col-span-5">
                                    <div className="font-bold text-slate-800 text-sm group-hover:text-indigo-700 transition-colors">
                                        {subject.name}
                                    </div>
                                </div>
                                <div className="col-span-3">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                            <span className="text-xs font-semibold text-slate-600">
                                                Sem {subject.semester}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-slate-400 pl-3">
                                            {subject.course}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-span-2 flex justify-end">
                                    <button
                                        onClick={() => deleteSubject(subject.id)}
                                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                        title="Delete Subject"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SubjectsColumn;
