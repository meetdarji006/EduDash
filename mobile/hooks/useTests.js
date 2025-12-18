import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

const fetchTests = async () => {
    const { data } = await api.get("/tests/student");
    return data.data;
};

export const useTests = () => {
    return useQuery({
        queryKey: ["tests"],
        queryFn: fetchTests,
        
    });
};
