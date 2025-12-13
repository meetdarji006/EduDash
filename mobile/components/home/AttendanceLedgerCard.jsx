import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import Card from '../ui/Card';
import Text from '../ui/Text';


const getStatusTheme = (status) => {
    switch (status) {
        case 'PRESENT': return { color: '#059669', bg: '#ECFDF5', icon: 'checkmark-circle' };
        case 'ABSENT': return { color: '#DC2626', bg: '#FEF2F2', icon: 'close-circle' };
        case 'HALF_DAY': return { color: '#D97706', bg: '#FFFBEB', icon: 'time' };
        case 'HOLIDAY': return { color: '#4F46E5', bg: '#EEF2FF', icon: 'calendar' };
        default: return { color: '#6B7280', bg: '#F3F4F6', icon: 'ellipse' };
    }
};

const LedgerRow = ({ item, isLast }) => {
    console.log(item)
    const theme = getStatusTheme(item.status);

    return (
        <View className={`flex-row items-center py-4 ${!isLast ? 'border-b border-slate-50' : ''}`}>
            {/* Date Box */}
            <View className="mr-4 items-center justify-center w-12 h-12 bg-slate-50 rounded-2xl border border-slate-100">
                <Text style={{ fontWeight: 800 }} className="text-lg text-slate-800 leading-5">
                    {item.date}
                </Text>
                <Text style={{ fontWeight: 800 }} className="text-[9px] text-slate-400 uppercase tracking-wide">
                    {item.month}
                </Text>
            </View>

            {/* Context */}
            <View className="flex-1 mr-2">
                <Text style={{ fontWeight: 800 }} className="text-sm text-slate-700 mb-0.5">
                    {item.day}
                </Text>
                <Text style={{ fontWeight: 500 }} className="text-[10px] text-slate-400">
                    09:00 AM - 05:00 PM
                </Text>
            </View>

            {/* Status Chip */}
            <View
                className="flex-row items-center px-3 py-1.5 rounded-full border border-transparent"
                style={{ backgroundColor: theme.bg }}
            >
                <Ionicons name={theme.icon} size={14} color={theme.color} style={{ marginRight: 6 }} />
                <Text className="text-[10px] uppercase tracking-wide" style={{ color: theme.color, fontWeight: 800 }}>
                    {item.status}
                </Text>
            </View>
        </View>
    );
};

const getMonthName = (month, type) => {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return type === 'short' ? monthNames[month - 1].slice(0, 3) : monthNames[month - 1];
}

const getDayName = (day, type) => {
    const dayNames = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    return type === 'short' ? dayNames[day].slice(0, 3) : dayNames[day];
}

const AttendanceLedgerCard = ({ data }) => {
    if (!data || !data.records) {
        return (
            <Card>
                <Text style={{ fontWeight: 800 }} className="text-slate-900 text-lg mb-2">
                    Attendance History
                </Text>
                <View className="py-4 items-center">
                    <Text className="text-slate-400">No attendance records found</Text>
                </View>
            </Card>
        );
    }
    const { records } = data;

    const ledgerData = records.map((record) => {
        const dateObj = new Date(record.date);

        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();

        return {
            id: record.id,
            date: day,
            month: getMonthName(month, 'short'),
            day: getDayName(dateObj.getDay()),
            status: record.status,
        }
    });

    ledgerData.sort((a, b) => b.date - a.date);
    return (
        <Card>
            <View className="flex-row justify-between items-center">
                <View className="flex-1">
                    <Text style={{ fontWeight: 800 }} className="text-slate-400 text-[10px] uppercase mb-1 leading-none">
                        Recent Logs
                    </Text>
                    {/* Added 'leading-tight' or 'py-1' can help if 'y' is cut off at bottom */}
                    <Text style={{ fontWeight: 800 }} className="text-slate-900 text-lg leading-tight">
                        Attendance History
                    </Text>
                </View>

                <View className="w-10 h-10 bg-indigo-50 rounded-full items-center justify-center border border-indigo-100">
                    <Ionicons name="list" size={20} color="#4F46E5" />
                </View>
            </View>

            <View className="h-[1px] bg-slate-50 mt-4 mb-2" />

            <View className="flex-1">
                {ledgerData.map((item, index) => (
                    <LedgerRow
                        key={item.id}
                        item={item}
                        isLast={index === ledgerData.length - 1}
                    />
                ))}
            </View>

            <View className="p-2 mt-2">
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => router.push("(tabs)/attendance")}
                    className="w-full bg-slate-50 py-3 rounded-2xl flex-row items-center justify-center border border-slate-100"
                >
                    <Text style={{ fontWeight: 800 }} className="text-xs text-indigo-600 mr-2">
                        View Full History
                    </Text>
                    <Ionicons name="arrow-forward" size={14} color="#4F46E5" />
                </TouchableOpacity>
            </View>

        </Card>
    );
};

export default AttendanceLedgerCard;
