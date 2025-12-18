import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    TrendingUp,
    Award,
    BookOpen,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import Button from '../Button';

// Mock Data (Replace with actual hooks later)
const MOCK_STUDENT = {
    id: 1,
    name: "Rahul Sharma",
    rollNo: "CS21001",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    course: "B.Tech Computer Science",
    semester: 5,
    dob: "2001-08-15",
    address: "123, Tech Park Road, Bangalore, India",
    avatar: null
};

const MOCK_STATS = {
    attendance: 87,
    avgMarks: 78.5,
    assignmentsPending: 2,
    totalTests: 12
};

const MOCK_ATTENDANCE_HISTORY = [
    { date: '2023-10-05', status: 'LATE' },
    { date: '2023-10-04', status: 'PRESENT' },
    { date: '2023-10-03', status: 'ABSENT' },
    { date: '2023-10-02', status: 'PRESENT' },
    { date: '2023-10-01', status: 'PRESENT' },
    { date: '2023-09-28', status: 'PRESENT' },
    { date: '2023-09-27', status: 'PRESENT' },
    { date: '2023-09-26', status: 'ABSENT' },
    { date: '2023-09-25', status: 'PRESENT' },
    { date: '2023-09-22', status: 'PRESENT' },
];

const MOCK_MARKS = [
    { subject: 'Data Structures', marks: 85, total: 100, grade: 'A' },
    { subject: 'Database Management', marks: 72, total: 100, grade: 'B+' },
    { subject: 'Operating Systems', marks: 68, total: 100, grade: 'B' },
    { subject: 'Software Engineering', marks: 89, total: 100, grade: 'A+' },
];

const StudentDetails = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    // In a real app, fetch student details based on studentId here
    const student = { ...MOCK_STUDENT, id: studentId }; // Simulating fetch

    // const {studentMutation} = UNSAFE_RemixErrorBoundary

    // const data = studentMutation.data.toString();

    // const visibleStudentIds = data.split(" ")[0];


    console.log(MOCK_STATS);
    return (
        <div className="space-y-6">
            {/* Header / Navigation */}
            <div className="flex items-center gap-4">
                <Button
                    variant="secondary"
                    icon={ArrowLeft}
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 !p-0 rounded-full border-slate-200 shadow-sm flex items-center justify-center shrink-0"
                />
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Profile</h1>
                    <p className="text-slate-500 text-sm">View and manage student specific data</p>
                </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-bold border-4 border-indigo-50">
                        {student.name.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left space-y-4 w-full">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{student.name}</h2>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wide">
                                    {student.rollNo}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wide">
                                    {student.course} • Sem {student.semester}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                            <div className="flex items-center gap-2 text-slate-600 text-sm">
                                <Mail size={16} className="text-slate-400" />
                                <span>{student.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 text-sm">
                                <Phone size={16} className="text-slate-400" />
                                <span>{student.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 text-sm">
                                <Calendar size={16} className="text-slate-400" />
                                <span>DOB: {student.dob}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 text-sm">
                                <MapPin size={16} className="text-slate-400" />
                                <span className="truncate">{student.address}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 w-fit">
                {['overview', 'attendance', 'marks'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab
                            ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Tabs */}
            <div className="space-y-6">

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <>
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${MOCK_STATS.attendance >= 75 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    <CheckCircle size={24} />
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs font-bold uppercase">Attendance</p>
                                    <p className="text-2xl font-black text-slate-900">{MOCK_STATS.attendance}%</p>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs font-bold uppercase">Avg. Marks</p>
                                    <p className="text-2xl font-black text-slate-900">{MOCK_STATS.avgMarks}%</p>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                                    <BookOpen size={24} />
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs font-bold uppercase">Pending Assignments</p>
                                    <p className="text-2xl font-black text-slate-900">{MOCK_STATS.assignmentsPending}</p>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                                    <TrendingUp size={24} />
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs font-bold uppercase">Total Tests</p>
                                    <p className="text-2xl font-black text-slate-900">{MOCK_STATS.totalTests}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Attendance */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-900">Recent Attendance</h3>
                                    <Button variant="ghost" className="text-xs" onClick={() => setActiveTab('attendance')}>View All</Button>
                                </div>
                                <div className="divide-y divide-slate-50">
                                    {MOCK_ATTENDANCE_HISTORY.slice(0, 5).map((record, index) => (
                                        <div key={index} className="px-6 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <Calendar size={16} className="text-slate-400" />
                                                <span className="text-sm font-medium text-slate-700">
                                                    {new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${record.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-600' :
                                                record.status === 'ABSENT' ? 'bg-rose-50 text-rose-600' :
                                                    'bg-amber-50 text-amber-600'
                                                }`}>
                                                {record.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Performance / Marks */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-900">Recent Performance</h3>
                                    <Button variant="ghost" className="text-xs" onClick={() => setActiveTab('marks')}>View All</Button>
                                </div>
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50/50">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase">Subject</th>
                                            <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase text-right">Marks</th>
                                            <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase text-right">Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {MOCK_MARKS.slice(0, 5).map((record, index) => (
                                            <tr key={index} className="hover:bg-slate-50/50">
                                                <td className="px-6 py-3 text-sm font-medium text-slate-900">{record.subject}</td>
                                                <td className="px-6 py-3 text-sm text-slate-600 text-right">
                                                    <span className="font-bold text-slate-900">{record.marks}</span>
                                                    <span className="text-xs text-slate-400">/{record.total}</span>
                                                </td>
                                                <td className="px-6 py-3 text-sm text-right">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${record.grade.startsWith('A') ? 'bg-emerald-50 text-emerald-600' :
                                                        record.grade.startsWith('B') ? 'bg-blue-50 text-blue-600' :
                                                            'bg-amber-50 text-amber-600'
                                                        }`}>
                                                        {record.grade}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* ATTENDANCE TAB */}
                {activeTab === 'attendance' && (
                    <AttendanceTab history={MOCK_ATTENDANCE_HISTORY} />
                )}

                {/* MARKS TAB */}
                {activeTab === 'marks' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h3 className="font-bold text-slate-900">Academic Performance History</h3>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Subject / Exam</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Marks Obtained</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Grade</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {MOCK_MARKS.map((record, index) => (
                                    <tr key={index} className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900">{record.subject}</div>
                                            <div className="text-xs text-slate-500">Mid-Term Evaluation</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-600">
                                            Oct 15, 2023
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <span className="text-lg font-black text-slate-900">{record.marks}</span>
                                                <span className="text-xs font-bold text-slate-400 mt-1">/{record.total}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${record.grade.startsWith('A') ? 'bg-emerald-100 text-emerald-700' :
                                                record.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                {record.grade}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDetails;

const AttendanceTab = ({ history }) => {
    const [expandedMonths, setExpandedMonths] = useState({});

    const toggleMonth = (month) => {
        setExpandedMonths(prev => ({ ...prev, [month]: !prev[month] }));
    };

    // Group by Month Year
    const groupedData = useMemo(() => {
        return history.reduce((acc, record) => {
            const date = new Date(record.date);
            const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });

            if (!acc[monthYear]) {
                acc[monthYear] = {
                    records: [],
                    stats: { total: 0, present: 0, absent: 0, late: 0 }
                };
            }

            acc[monthYear].records.push(record);
            acc[monthYear].stats.total++;
            acc[monthYear].stats[record.status.toLowerCase()]++;

            return acc;
        }, {});
    }, [history]);

    const months = Object.keys(groupedData).sort((a, b) => new Date(b) - new Date(a)); // Sort desc

    return (
        <div className="space-y-4">
            {months.map(month => {
                const { records, stats } = groupedData[month];
                const isExpanded = expandedMonths[month];
                const attendancePercentage = Math.round(((stats.present + stats.late) / stats.total) * 100);

                return (
                    <div key={month} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
                        {/* Month Header */}
                        <div
                            onClick={() => toggleMonth(month)}
                            className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${isExpanded ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">{month}</h3>
                                    <p className="text-xs text-slate-500 font-medium mt-1">
                                        {stats.total} Days • <span className={attendancePercentage >= 75 ? "text-emerald-600" : "text-rose-600"}>{attendancePercentage}% Attendance</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex gap-2 text-xs font-bold uppercase">
                                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded">{stats.present} P</span>
                                    <span className="px-2 py-1 bg-rose-50 text-rose-600 rounded">{stats.absent} A</span>
                                    <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded">{stats.late} L</span>
                                </div>
                                {isExpanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                            </div>
                        </div>

                        {/* Dropdown Content */}
                        {isExpanded && (
                            <div className="border-t border-slate-100 bg-slate-50/30">
                                <div className="divide-y divide-slate-100">
                                    {records.map((record, idx) => (
                                        <div key={idx} className="px-6 py-3 flex items-center justify-between hover:bg-white transition-colors pl-16">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-bold text-slate-700 w-8">
                                                    {new Date(record.date).getDate()}
                                                </span>
                                                <span className="text-sm font-medium text-slate-500">
                                                    {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}
                                                </span>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase w-20 text-center ${record.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-700' :
                                                record.status === 'ABSENT' ? 'bg-rose-100 text-rose-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                {record.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
