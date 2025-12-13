import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../../utils/api";

function useAttendance(selectedCourse, semester, date) {
    const api = useApi();

    const { data, isPending, error, isError, status } = useQuery({
        queryKey: ["attendance", selectedCourse, semester, date],
        queryFn: () => api.get(`/attendance`, {
            params: {
                courseId: selectedCourse,
                semester: semester,
                date: date
            }
        }),
        refetchOnWindowFocus: false,
        // 2. Ensure we don't fire requests with null/undefined values
        enabled: !!selectedCourse && !!semester && !!date,
    });

    return {
        data: data?.data,
        isPending,
        status,
        error,
        isError
    };
}

export default useAttendance;

export const useSaveAttendance = () => {
    const api = useApi();

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload) => api.post("/attendance", payload),
        onSuccess: () => {
            queryClient.invalidateQueries(["attendance"])
        },
    });
};
