import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useApi } from '../../utils/api';

function useTestActions() {
    const api = useApi();
    const queryClient = useQueryClient();

    const addTest = useMutation({
        mutationFn: (payload) => api.post(`/tests`, payload),
        onSuccess: () => queryClient.invalidateQueries(["tests"]),
    })

    const editTest = useMutation({
        mutationFn: (payload) => api.put(`/tests/${payload.id}`, payload.data),
        onSuccess: () => queryClient.invalidateQueries(["tests"]),
    })
    const deleteTest = useMutation({
        mutationFn: (id) => api.delete(`/tests/${id}`),
        onSuccess: () => queryClient.invalidateQueries(["tests"]),
    })
    const updateTestMarks = useMutation({
        mutationFn: (payload) => api.put(`/tests/${payload.id}`, payload.data),
        onSuccess: () => queryClient.invalidateQueries(["tests"]),
    })
    return { addTest, editTest, deleteTest, updateTestMarks };
}

export default useTestActions
