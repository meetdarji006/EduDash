import { useState, useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Calendar, ClipboardList, FileText, LogOut, Menu, Search, Users, CheckCircle } from "lucide-react";
import SidebarItem from "./SidebarItem.jsx";
import { useCourseContext } from "../context/CourseContext";
import useCourses from "../hooks/useCourses";

const DashboardLayout = () => {
    const navigate = useNavigate();
    // console.log(navigate);
    const location = useLocation();
    // console.log(location);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;
    const { selectedCourseId, setSelectedCourseId, selectedSemester, setSelectedSemester } = useCourseContext();
    const { data: courses } = useCourses();

    const semesterOptions = useMemo(() => {
        const course = courses?.find(c => c.id === selectedCourseId);
        if (!course) return [];
        return Array.from({ length: course.duration }, (_, i) => ({ id: i + 1, name: `Semester ${i + 1}` }));
    }, [courses, selectedCourseId]);

    const handleNav = (path) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900">

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-slate-900/50 z-20 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed md:static inset-y-0 left-0 z-30 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}>
                <div className="h-20 flex items-center px-8 border-b border-slate-100">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-indigo-200">
                        <span className="text-white font-bold text-lg">E</span>
                    </div>
                    <span className="text-xl font-black text-slate-900 tracking-tight">Edu<span className="text-indigo-600">Dash</span></span>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
                    <div className="px-4 mb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Management</p>
                    </div>
                    <SidebarItem icon={Users} label="Students" path="/students" active={isActive('/students')} onClick={handleNav} />
                    <SidebarItem icon={Calendar} label="Attendance" path="/attendance" active={isActive('/attendance')} onClick={handleNav} />
                    <SidebarItem icon={FileText} label="Tests & Exams" path="/tests" active={isActive('/tests')} onClick={handleNav} />
                    <SidebarItem icon={Calendar} label="Marks" path="/marks" active={isActive('/marks')} onClick={handleNav} />
                    <SidebarItem icon={ClipboardList} label="Assignments" path="/assignments" active={isActive('/assignments')} onClick={handleNav} />
                    <SidebarItem icon={CheckCircle} label="Submissions" path="/assignments/submissions" active={isActive('/assignments/submissions')} onClick={handleNav} />
                    {localStorage.getItem('userRole') !== 'TEACHER' && (
                        <SidebarItem icon={Calendar} label="Courses" path="/courses" active={isActive('/courses')} onClick={handleNav} />
                    )}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors font-bold text-sm">
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

                {/* Top Header */}
                <header className="bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-6">
                        <button className="md:hidden text-slate-500" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu size={24} />
                        </button>

                        {/* Global Selectors */}
                        <div className="hidden md:flex items-center gap-3">
                            <select
                                value={selectedCourseId}
                                onChange={(e) => { setSelectedCourseId(e.target.value); setSelectedSemester(''); }}
                                className="bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 min-w-[150px] cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                                <option value="">Select Course</option>
                                {courses?.map((course) => (
                                    <option key={course.id} value={course.id}>{course.name}</option>
                                ))}
                            </select>

                            <select
                                value={selectedSemester}
                                onChange={(e) => setSelectedSemester(e.target.value)}
                                disabled={!selectedCourseId}
                                className="bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 min-w-[150px] cursor-pointer hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="">Semester</option>
                                {semesterOptions.map((option) => (
                                    <option key={option.id} value={option.id}>{option.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                                MD
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-bold text-slate-900 leading-none">Meet Darji</p>
                                <p className="text-xs text-slate-400 font-medium mt-0.5">Administrator</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Child Routes Render Here */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};


export default DashboardLayout;
