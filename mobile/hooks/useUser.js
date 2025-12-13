
import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

const fetchUser = async () => {
    const { data } = await api.get("/auth/me"); // Assuming /auth/me or similar endpoint
    return data;
};

export const useUserQuery = (enabled) => {
    return useQuery({
        queryKey: ["user"],
        queryFn: fetchUser,
        enabled: enabled,
        retry: 1, // Don't retry indefinitely if token is bad
    });
};
