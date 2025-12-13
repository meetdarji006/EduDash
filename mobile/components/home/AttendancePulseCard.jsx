import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import Card from '../ui/Card';
import Text from '../ui/Text';

// --- Sub-Component: Modern Progress Bar ---
const PerformanceBar = ({ label, value, color, isMain = false }) => (
    <View className="mb-5">
        {/* Label Row */}
        <View className="flex-row justify-between items-end mb-2">
            <Text style={{ fontWeight: 800 }} className={`text-xs uppercase tracking-wider ${isMain ? 'text-slate-700' : 'text-slate-400'}`}>
                {label}
            </Text>
            <Text style={{ fontWeight: 800 }} className={`text-sm ${isMain ? 'text-slate-800' : 'text-slate-400'}`}>
                {value}%
            </Text>
        </View>

        {/* Bar Track */}
        <View className="h-3 bg-slate-100 rounded-full overflow-hidden w-full">
            {/* Bar Fill */}
            <View
                className="h-full rounded-full"
                style={{
                    width: `${value}%`,
                    backgroundColor: color,
                    opacity: isMain ? 1 : 0.5
                }}
            />
        </View>
    </View>
);

const AttendancePulseCard = ({ thisMonth = 0, lastMonth = 0 }) => {
    const diff = thisMonth - lastMonth;
    const isPositive = diff >= 0;

    return (
        <Card>
            {/* --- Header Section --- */}
            <View className="flex-row justify-between items-start mb-6">
                <View className="flex-row items-center">
                    {/* Icon Box */}
                    <View className="w-10 h-10 bg-indigo-50 rounded-xl items-center justify-center mr-3 border border-indigo-100">
                        <Ionicons name="pulse" size={22} color="#4F46E5" />
                    </View>
                    <View>
                        <Text style={{ fontWeight: 800 }} className="text-slate-900 text-lg">
                            Monthly Pulse
                        </Text>
                        <Text style={{ fontWeight: 500 }} className="text-slate-400 text-xs">
                            Performance Velocity
                        </Text>
                    </View>
                </View>

                {/* Trend Badge */}
                <View className={`px-3 py-1.5 rounded-full flex-row items-center border ${isPositive ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'
                    }`}>
                    <Ionicons
                        name={isPositive ? "trending-up" : "trending-down"}
                        size={14}
                        color={isPositive ? "#10B981" : "#EF4444"}
                        style={{ marginRight: 4 }}
                    />
                    <Text style={{ fontWeight: 800 }} className={`text-xs ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {Math.abs(diff)}%
                    </Text>
                </View>
            </View>

            {/* --- Comparison Area --- */}
            {/* We use a subtle background box to group the data */}
            <View className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-4">

                {/* 1. This Month (Hero) */}
                <PerformanceBar
                    label="Current Month"
                    value={thisMonth}
                    color="#4F46E5" // Indigo 600
                    isMain={true}
                />

                {/* 2. Last Month (Ghost) */}
                <PerformanceBar
                    label="Previous Month"
                    value={lastMonth}
                    color="#94a3b8" // Slate 400
                    isMain={false}
                />
            </View>

            {/* --- Footer Insight --- */}
            <View className="flex-row items-center">
                <Ionicons name="information-circle" size={16} color="#94a3b8" style={{ marginRight: 6 }} />
                <Text style={{ fontWeight: 500 }} className="text-slate-400 text-xs">
                    You are performing <Text className="text-indigo-600 font-bold">better</Text> than last month.
                </Text>
            </View>

        </Card>
    );
};

export default AttendancePulseCard;
