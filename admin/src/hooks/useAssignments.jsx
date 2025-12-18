import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../../utils/api";

function useAssignments(selectedCourse, semester) {
    const api = useApi();

    const { data, isPending, error, isError, status } = useQuery({
        queryKey: ["assignments", selectedCourse, semester],
        queryFn: () => api.get(`/assignments`, {
            params: {
                courseId: selectedCourse,
                semester: semester
            }
        }),
        refetchOnWindowFocus: false,
        enabled: !!selectedCourse && !!semester,
    });

    return {
        data: data?.data,
        isPending,
        status,
        error,
        isError
    };
}

export default useAssignments;

export const useCreateAssignment = () => {
    const api = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) => api.post("/assignments", payload),
        onSuccess: () => {
            queryClient.invalidateQueries(["assignments"]);
        },
    });
};

export const useDeleteAssignment = () => {
    const api = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => api.delete(`/assignments/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(["assignments"]);
        },
    });
};

export const useAddQuestions = () => {
    const api = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ assignmentId, questions }) => api.post(`/assignments/${assignmentId}/questions`, { questions }),
        onSuccess: () => {
            queryClient.invalidateQueries(["assignments"]);
        },
    });
}

export const useAssignmentQuestions = (assignmentId) => {
    const api = useApi();

    return useQuery({
        queryKey: ["assignmentQuestions", assignmentId],
        queryFn: () => api.get(`/assignments/${assignmentId}/questions`),
        enabled: !!assignmentId,
        refetchOnWindowFocus: false,
    });
};
