import { useQuery } from "@tanstack/react-query";
import { useApi } from "../../utils/api";

function useSubjects(selectedCourse, semester) {
    const api = useApi();

    const { data, isPending, error, isError, status} = useQuery({
        queryKey: ["subjects", selectedCourse, semester],
        queryFn: () => api.get(`/subjects?courseId=${selectedCourse}&semester=${semester}`),
        refetchOnWindowFocus: false,
        enabled: !!selectedCourse,
    });

    return { data: data?.data, isPending, status, error, isError };
}

export default useSubjects;
