import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../../utils/api";

export function useMarks(testId) {
    const api = useApi();

    const { data, isPending, error, isError, status } = useQuery({
        queryKey: ["marks", testId],
        queryFn: () => api.get(`/tests/marks`, {
            params: { testId }
        }),
        refetchOnWindowFocus: false,
        enabled: !!testId,
    });

    return { data: data?.data, isPending, status, error, isError };
}

export function useSaveMarks() {
    const api = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) => api.put("/tests/marks", payload),
        onSuccess: (_, variables) => {
            // Invalidate marks for the specific test
            queryClient.invalidateQueries(["marks", variables.testId]);
        },
    });
}
