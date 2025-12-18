import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../../utils/api";

function useAssignmentSubmissions(assignmentId) {
    const api = useApi();

    const { data, isPending, error, isError } = useQuery({
        queryKey: ["assignmentSubmissions", assignmentId],
        queryFn: () => api.get(`/assignments/${assignmentId}/submissions`),
        refetchOnWindowFocus: false,
        enabled: !!assignmentId,
    });

    return {
        data: data?.data, // Return undefined if not ready, handle default in consumer stably
        isPending,
        error,
        isError,
    };
}

export default useAssignmentSubmissions;

export const useUpdateAssignmentSubmissions = () => {
    const api = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ assignmentId, subjectId, submissionDetails }) =>
            api.put(`/assignments/${assignmentId}/submissions`, { subjectId, submissionDetails }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries(["assignmentSubmissions", variables.assignmentId]);
        },
    });
};
