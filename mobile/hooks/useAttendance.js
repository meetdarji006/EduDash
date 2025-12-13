import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

const fetchAttendance = async (studentId) => {
    const { data } = await api.get(`/attendance/${studentId}/history`);
    return data.data.data;
};

export const useAttendanceQuery = (studentId) => {
    return useQuery({
        queryKey: ["attendance", studentId],
        queryFn: () => fetchAttendance(studentId),
        enabled: !!studentId,
    });
};
