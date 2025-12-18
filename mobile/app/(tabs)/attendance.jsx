import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import AttendanceDashboard from '../../components/attendance/AttendanceChartCard'
import MonthlyCalendar from '../../components/attendance/MonthlyCalender'
import SecondaryHeader from '../../components/SecondaryHeader'
import { theme } from '../../constants/colors'
import { useAuth } from '../../context/AuthContext'
import { useAttendanceQuery } from '../../hooks/useAttendance'

const AttendanceScreen = () => {
    const { user } = useAuth();
    const studentId = user?.studentDetails?.id;
    const { data: attendanceData = [], isLoading, error } = useAttendanceQuery(studentId);

    if (isLoading) {
        return (
            <View style={{ backgroundColor: theme.background }} className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    if (error || !attendanceData || (Array.isArray(attendanceData) && attendanceData.length === 0) || (typeof attendanceData === 'object' && Object.keys(attendanceData).length === 0)) {
        return (
            <View style={{ backgroundColor: theme.background }} className="flex-1 justify-center items-center p-5">
                <Text className="text-slate-500 text-lg font-bold text-center">Something Wrong Happens</Text>
                <Text className="text-slate-400 text-center mt-2">try again later</Text>
            </View>
        );
    }

    return (
        <View style={{ backgroundColor: theme.background }} className="flex-1">
            <SecondaryHeader title="Attendance" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                className='px-5'
                contentContainerStyle={{ paddingBottom: 30 }}
            >
                <MonthlyCalendar data={attendanceData} />
                <AttendanceDashboard data={attendanceData} />
            </ScrollView>
        </View>
    )
}

export default AttendanceScreen
