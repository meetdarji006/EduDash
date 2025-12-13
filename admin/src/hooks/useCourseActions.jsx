import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useApi } from '../../utils/api';

function useCourseActions() {
    const api = useApi();
    const queryClient = useQueryClient();

    const addCourse = useMutation({
        mutationFn: (payload) => api.post(`/courses`, payload),
        onSuccess: () => queryClient.invalidateQueries(["courses"]),
    })

    const editCourse = useMutation({
        mutationFn: (payload) => api.put(`/courses/${payload.id}`, payload.data),
        onSuccess: () => queryClient.invalidateQueries(["courses"]),
    })
    const deleteCourse = useMutation({
        mutationFn: (id) => api.delete(`/courses/${id}`),
        onSuccess: () => queryClient.invalidateQueries(["courses"]),
    })

    return { addCourse, editCourse, deleteCourse };
}

export default useCourseActions
