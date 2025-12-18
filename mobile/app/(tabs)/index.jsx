import { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import AttendanceLedgerCard from "../../components/home/AttendanceLedgerCard";
import AttendancePulseCard from "../../components/home/AttendancePulseCard";
import AttendanceReportCard from "../../components/home/AttendanceReportCard";
import AttendanceStackedChart from "../../components/home/AttendanceStackedChart";
import HomeHeader from "../../components/home/HomeHeader";
import ScheduleModel from "../../components/home/ScheduleModel";
import { theme } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
import { useAttendanceQuery } from "../../hooks/useAttendance";

export default function Index() {
    const [scheduleModalOpen, setScheduleModelopen] = useState(false)

    const { user } = useAuth();
    const studentId = user?.studentDetails?.id;
    const { data: attendanceData = [], isLoading, error } = useAttendanceQuery(studentId);

    const dateObj = new Date();
    const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;

    const { monthData, previousMonthPercentage, currentMonthPercentage } = useMemo(() => {
        if (!attendanceData) return { monthData: null, previousMonthPercentage: 0, currentMonthPercentage: 0 };

        const currentData = attendanceData[monthKey];

        // proper date manipulation to get previous month
        const prevDate = new Date(dateObj.getFullYear(), dateObj.getMonth() - 1, 1);
        const previousMonthKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;
        const previousData = attendanceData[previousMonthKey];

        let prevPercentage = 0;
        if (previousData?.stats) {
            const total = Number(previousData.stats.TOTAL || 0);
            const present = Number(previousData.stats.PRESENT || 0);
            prevPercentage = total > 0 ? (present / total) * 100 : 0;
        }

        let currPercentage = 0;
        if (currentData?.stats) {
            const total = Number(currentData.stats.TOTAL || 0);
            const present = Number(currentData.stats.PRESENT || 0);
            currPercentage = total > 0 ? (present / total) * 100 : 0;
        }

        return {
            monthData: currentData,
            previousMonthPercentage: prevPercentage.toFixed(0),
            currentMonthPercentage: currPercentage.toFixed(0)
        };
    }, [attendanceData, monthKey]);

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            className='px-5'
            contentContainerStyle={{ paddingBottom: 30 }}
        >
            <ScheduleModel visible={scheduleModalOpen} onClose={() => setScheduleModelopen(false)} />
            <View style={{ backgroundColor: theme.background }} className="flex-1">
                <HomeHeader userName={user?.name || "Student"} setScheduleModelopen={setScheduleModelopen} />

                {isLoading ? (
                    <View className="h-40 justify-center items-center">
                        <ActivityIndicator size="large" color="#2563eb" />
                    </View>
                ) : (error || !attendanceData || (Array.isArray(attendanceData) && attendanceData.length === 0) || (typeof attendanceData === 'object' && Object.keys(attendanceData).length === 0)) ? (
                    <View className="h-80 justify-center items-center">
                        <Text className="text-slate-500 text-lg font-bold">Something Wrong Happens</Text>
                        <Text className="text-slate-400 text-sm">try again later</Text>
                    </View>
                ) : (
                    <>
                        <AttendanceReportCard data={attendanceData} />
                        <AttendancePulseCard thisMonth={currentMonthPercentage} lastMonth={previousMonthPercentage} />
                        <AttendanceLedgerCard data={monthData ? { ...monthData, records: monthData.records?.slice(0, 6) } : monthData} />
                        <AttendanceStackedChart data={attendanceData && monthKey ? { [monthKey]: attendanceData[monthKey] } : {}} />
                    </>
                )}

            </View >
        </ScrollView>
    );
}
