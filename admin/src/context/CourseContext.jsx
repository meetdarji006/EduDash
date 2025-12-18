import { createContext, useContext, useState, useEffect } from "react";

const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
    const [selectedCourseId, setSelectedCourseId] = useState(() => localStorage.getItem("global_courseId") || "");
    const [selectedSemester, setSelectedSemester] = useState(() => localStorage.getItem("global_semester") || "");

    useEffect(() => {
        if (selectedCourseId) localStorage.setItem("global_courseId", selectedCourseId);
        else localStorage.removeItem("global_courseId");
    }, [selectedCourseId]);

    useEffect(() => {
        if (selectedSemester) localStorage.setItem("global_semester", selectedSemester);
        else localStorage.removeItem("global_semester");
    }, [selectedSemester]);

    // Reset semester if course changes (optional preference, usually good UX)
    // However, if we want persistence, we might simply let the user change it.
    // Keeping it simple: If course changes, we might want to ensure semester is valid,
    // but for now let's just allow independent setting or handle validity in Layout.

    return (
        <CourseContext.Provider value={{ selectedCourseId, setSelectedCourseId, selectedSemester, setSelectedSemester }}>
            {children}
        </CourseContext.Provider>
    );
};

export const useCourseContext = () => {
    const context = useContext(CourseContext);
    if (!context) {
        throw new Error("useCourseContext must be used within a CourseProvider");
    }
    return context;
};
