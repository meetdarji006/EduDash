import { useEffect, useState } from "react";
import useCourses from "../../hooks/useCourses";
import useSubjects from "../../hooks/useSubjects";

import CoursesColumn from "../courses/CoursesColumn";
import SubjectsColumn from "../courses/SubjectsColumn";
import AddSubjectModal from "../courses/AddSubjectModal";
import AddCourseModal from "../courses/AddCourseModal";
import { useNavigate } from "react-router-dom";

const CourseManager = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        console.log(role);
        if (role !== 'ADMIN') {
            navigate('/');
        }
    }, [navigate])

    const [selectedCourse, setSelectedCourse] = useState('');
    const [semester, setSemester] = useState(1);

    const { data: courses, error, isPending } = useCourses();
    const { data: subjects, isPending: isSubjectPending, status: subjectQueryStatus } = useSubjects(selectedCourse, semester);

    // Modal States
    const [isCourseModalOpen, setCourseModalOpen] = useState(false);
    const [isSubjectModalOpen, setSubjectModalOpen] = useState(false);


    if (isPending) {
        return <div className="w-full h-[calc(100vh-4rem)] flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
        </div>;
    }

    if (error) {
        return <div className="w-full h-[calc(100vh-4rem)] flex justify-center items-center">
            <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 font-medium">
                Error: {error}
            </div>
        </div>;
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] -m-6 p-6 space-y-6 bg-slate-50/50">
            {/* Header Section */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Curriculum Manager</h1>
                <p className="text-slate-500 text-sm font-medium">Manage your educational programs, courses, and subject syllabi.</p>
            </div>

            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* === LEFT COLUMN: COURSES === */}
                <CoursesColumn
                    setCourseModalOpen={setCourseModalOpen}
                    courses={courses}
                    selectedCourse={selectedCourse}
                    setSelectedCourse={setSelectedCourse}
                />

                {/* === RIGHT COLUMN: SUBJECTS === */}
                <SubjectsColumn
                    subjects={subjects}
                    selectedCourse={selectedCourse}
                    semester={semester}
                    setSubjectModalOpen={setSubjectModalOpen}
                    isSubjectsLoading={isSubjectPending}
                    status={subjectQueryStatus}
                />
            </div>

            {/* --- MODALS --- */}
            <AddCourseModal
                isCourseModalOpen={isCourseModalOpen}
                setCourseModalOpen={setCourseModalOpen}
            />

            <AddSubjectModal
                courses={courses}
                isSubjectModalOpen={isSubjectModalOpen}
                setSubjectModalOpen={setSubjectModalOpen}
                selectedCourse={selectedCourse}
                semester={semester}
            />

        </div>
    );
};

export default CourseManager;
