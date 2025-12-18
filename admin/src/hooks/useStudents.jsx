import { useQuery } from "@tanstack/react-query";
import { useApi } from "../../utils/api";

function useStudents(selectedCourse, semester) {
    const api = useApi();

    const { data, isPending, error, isError, status } = useQuery({
        queryKey: ["students", selectedCourse, semester],
        queryFn: () => api.get(`/users/students`, {
            params: {
                courseId: selectedCourse,
                semester: semester
            }
        }),
        refetchOnWindowFocus: false,
        enabled: !!selectedCourse && !!semester,
    });

    return { data: data?.data, isPending, status, error, isError };
}

export default useStudents;
