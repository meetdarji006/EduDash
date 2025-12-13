import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout.jsx";
import StudentManager from "./components/pages/Students.jsx";
import TestManager from "./components/pages/Tests.jsx";
import AssignmentManager from "./components/pages/Assignment.jsx";
import AttendanceManager from "./components/pages/Attendance.jsx";
import MarksManager from "./components/pages/Marks.jsx";
import Login from "./components/pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import CourseManager from "./components/pages/Course.jsx";
const App = () => {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public Routes (No Dashboard Layout) */}
                <Route path="/login" element={<Login />} />

                {/* Protected Routes (Inside Dashboard Layout) */}
                <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                    <Route path="/" element={<Navigate to="/students" replace />} />
                    <Route path="/students" element={<StudentManager />} />
                    <Route path="/tests" element={<TestManager />} />
                    <Route path="/courses" element={<CourseManager />} />
                    <Route path="/marks" element={<MarksManager />} />
                    <Route path="/assignments" element={<AssignmentManager />} />
                    <Route path="/attendance" element={<AttendanceManager />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
};

export default App;
