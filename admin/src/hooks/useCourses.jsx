import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react'
import { useApi } from '../../utils/api';

function useCourses() {
    const api = useApi();

    const { data, isPending, error } = useQuery({
        queryKey: ["courses"],
        queryFn: () => api.get(`/courses`),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false
    })

    return { data: data?.data || [], error, isPending };
}

export default useCourses
