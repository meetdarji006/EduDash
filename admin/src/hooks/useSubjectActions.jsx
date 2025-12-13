import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useApi } from '../../utils/api';

function useSubjectActions() {
    const api = useApi();
    const queryClient = useQueryClient();

    const addSubject = useMutation({
        mutationFn: (payload) => api.post(`/subjects`, payload),
        onSuccess: () => queryClient.invalidateQueries(["subjects"]),
    })

    const editSubject = useMutation({
        mutationFn: (payload) => api.put(`/subjects/${payload.id}`, payload.data),
        onSuccess: () => queryClient.invalidateQueries(["subjects"]),
    })
    const deleteSubject = useMutation({
        mutationFn: (id) => api.delete(`/subjects/${id}`),
        onSuccess: () => queryClient.invalidateQueries(["subjects"]),
    })

    return { addSubject, editSubject, deleteSubject };
}

export default useSubjectActions
