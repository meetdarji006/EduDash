import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../../utils/api';
import { toast } from 'react-hot-toast';

function useStudentActions() {
    const api = useApi();
    const queryClient = useQueryClient();

    const addStudent = useMutation({
        mutationFn: (payload) => api.post(`/users/student`, payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries(["students"]);
            toast.success(data?.message || "Student added successfully");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to add student");
        }
    });

    const deleteStudent = useMutation({
        mutationFn: (id) => api.delete(`/users/student/${id}`),
        onSuccess: (data) => {
            queryClient.invalidateQueries(["students"]);
            toast.success(data?.message || "Student deleted successfully");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to delete student");
        }
    });

    return { addStudent, deleteStudent };
}

export default useStudentActions;
