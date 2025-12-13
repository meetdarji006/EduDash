import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Calendar, ClipboardList, FileText, LogOut, Menu, Search, Users } from "lucide-react";
import SidebarItem from "./SidebarItem.jsx";

const DashboardLayout = () => {
    const navigate = useNavigate();
    // console.log(navigate);
    const location = useLocation();
    // console.log(location);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

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
                        <span className="text-white font-bold text-lg">A</span>
                    </div>
                    <span className="text-xl font-black text-slate-900 tracking-tight">Admin<span className="text-indigo-600">Portal</span></span>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
                    <div className="px-4 mb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Management</p>
                    </div>
                    <SidebarItem icon={Users} label="Students" path="/students" active={isActive('/students')} onClick={handleNav} />
                    <SidebarItem icon={FileText} label="Tests & Exams" path="/tests" active={isActive('/tests')} onClick={handleNav} />
                    <SidebarItem icon={ClipboardList} label="Assignments" path="/assignments" active={isActive('/assignments')} onClick={handleNav} />
                    <SidebarItem icon={Calendar} label="Attendance" path="/attendance" active={isActive('/attendance')} onClick={handleNav} />
                    <SidebarItem icon={Calendar} label="Marks" path="/marks" active={isActive('/marks')} onClick={handleNav} />
                    <SidebarItem icon={Calendar} label="Courses" path="/courses" active={isActive('/courses')} onClick={handleNav} />
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
                    <div className="flex items-center">
                        <button className="md:hidden mr-4 text-slate-500" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu size={24} />
                        </button>
                        <div className="relative w-96 hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search database..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                                AD
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-bold text-slate-900 leading-none">Admin User</p>
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
