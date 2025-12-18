import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

const fetchAssignments = async () => {
    const { data } = await api.get("/assignments/student");
    return data.data; // The API returns { success, data: [...], ... }
};

export const useAssignments = () => {
    return useQuery({
        queryKey: ["assignments"],
        queryFn: fetchAssignments,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 2,
    });
};
