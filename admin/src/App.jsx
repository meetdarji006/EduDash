import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import DashboardLayout from "./components/DashboardLayout.jsx";
import StudentManager from "./components/pages/Students.jsx";
import TestManager from "./components/pages/Tests.jsx";
import AssignmentManager from "./components/pages/Assignment.jsx";
import AssignmentSubmissions from "./components/pages/AssignmentSubmissions.jsx";
import AttendanceManager from "./components/pages/Attendance.jsx";
import MarksManager from "./components/pages/Marks.jsx";
import Login from "./components/pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import CourseManager from "./components/pages/Course.jsx";
import StudentDetails from "./components/pages/StudentDetails.jsx";
import { CourseProvider } from "./context/CourseContext";

const queryClient = new QueryClient();

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <CourseProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Public Routes (No Dashboard Layout) */}
                        <Route path="/login" element={<Login />} />

                        {/* Protected Routes (Inside Dashboard Layout) */}
                        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                            <Route path="/" element={<Navigate to="/students" replace />} />
                            <Route path="/students" element={<StudentManager />} />
                            <Route path="/students/:studentId" element={<StudentDetails />} />
                            <Route path="/tests" element={<TestManager />} />
                            <Route path="/courses" element={<CourseManager />} />
                            <Route path="/marks" element={<MarksManager />} />
                            <Route path="/assignments" element={<AssignmentManager />} />
                            <Route path="/assignments/submissions" element={<AssignmentSubmissions />} />
                            <Route path="/attendance" element={<AttendanceManager />} />
                        </Route>
                    </Routes>
                    <Toaster position="bottom-right" />
                </BrowserRouter>
            </CourseProvider>
        </QueryClientProvider>
    );
};

export default App;
