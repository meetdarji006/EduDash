import { useQuery } from "@tanstack/react-query";
import { useApi } from "../../utils/api";

function useTests(selectedCourse, semester) {
    const api = useApi();

    const { data, isPending, error, isError, status } = useQuery({
        queryKey: ["tests", selectedCourse, semester],
        queryFn: () => api.get(`/tests?courseId=${selectedCourse}&semester=${semester}`),
        refetchOnWindowFocus: false,
        enabled: !!selectedCourse && !!semester,
    });

    return { data: data?.data, isPending, status, error, isError };
}

export default useTests;
