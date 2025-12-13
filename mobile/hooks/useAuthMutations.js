import { useMutation } from "@tanstack/react-query";
import api from "../utils/api";

const loginUser = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    return data;
};

export const useLoginMutation = () => {
    return useMutation({
        mutationFn: loginUser,
    });
};
