import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Card from "../ui/Card";
import Text from "../ui/Text";

const STATUS_THEME = {
    PRESENT: { bg: "#d1fae5", text: "text-emerald-700", iconColor: "#047857", icon: "checkmark-circle" }, // bg-emerald-100
    ABSENT: { bg: "#ffe4e6", text: "text-rose-700", iconColor: "#be123c", icon: "close-circle" }, // bg-rose-100
    HALF_DAY: { bg: "#fef3c7", text: "text-amber-700", iconColor: "#b45309", icon: "time" }, // bg-amber-100
    HOLIDAY: { bg: "#e0e7ff", text: "text-indigo-700", iconColor: "#4338ca", icon: "calendar" }, // bg-indigo-100
    DEFAULT: { bg: "#E5E7EB", text: "text-slate-700", iconColor: "", icon: "" },
};

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const StatItem = ({ label, count, type }) => {
    const theme = STATUS_THEME[type] || STATUS_THEME.DEFAULT;
    return (
        <View className="flex-1 bg-slate-50 rounded-2xl p-3 flex-row items-center mb-2 mx-1 border border-slate-100">
            <View className={`w-8 h-8 rounded-full items-center justify-center mr-3`} style={{ backgroundColor: theme.bg }}>
                <Ionicons name={theme.icon} size={14} color={theme.iconColor} />
            </View>
            <View>
                <Text className="text-lg font-black text-slate-800 leading-5">{count}</Text>
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</Text>
            </View>
        </View>
    );
};

const MonthlyCalendar = ({ data }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const { days, stats, monthLabel, yearLabel } = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth(); // 0-indexed

        const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
        const monthData = data ? data[monthKey] : null;
        const records = monthData?.records || [];

        // Create a map of date -> status for quick lookup
        const statusMap = {};
        records.forEach(record => {
            const dateObj = new Date(record.date);
            const day = dateObj.getDate();
            statusMap[day] = record.status;
        });

        // Generate Calendar Grid
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Days from previous month for padding
        const prevMonthDays = new Date(year, month, 0).getDate();
        const generatedDays = [];

        // Add padding days
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            // Padding days are strictly DEFAULT now, but flagged as padding
            generatedDays.push({ day: prevMonthDays - i, status: 'DEFAULT', isPadding: true });
        }

        // Add actual days
        for (let i = 1; i <= daysInMonth; i++) {
            const status = statusMap[i] || 'DEFAULT';
            generatedDays.push({ day: i, status });
        }

        const dateLabel = new Date(year, month);
        const mLabel = dateLabel.toLocaleString('default', { month: 'long' });
        const yLabel = dateLabel.getFullYear();

        // Calculate Stats
        const currentStats = {
            present: Number(monthData?.stats?.PRESENT || 0),
            absent: Number(monthData?.stats?.ABSENT || 0),
            halfDay: Number(monthData?.stats?.LATE || 0) + Number(monthData?.stats?.HALF_DAY || 0),
            holiday: Number(monthData?.stats?.HOLIDAY || 0),
        };

        return { days: generatedDays, stats: currentStats, monthLabel: mLabel, yearLabel: yLabel };

    }, [currentDate, data]);

    const checkDataAvailability = (increment) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + increment);
        const year = newDate.getFullYear();
        const month = newDate.getMonth();
        const key = `${year}-${String(month + 1).padStart(2, '0')}`;
        return data && data[key] !== undefined;
    };

    const hasPrevData = checkDataAvailability(-1);
    const hasNextData = checkDataAvailability(1);

    const changeMonth = (increment) => {
        if (!checkDataAvailability(increment)) return;
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + increment);
            return newDate;
        });
    };

    return (
        <Card style={{ marginTop: 10 }}>
            {/* --- Header --- */}
            <View className="flex-row items-center justify-between mb-8">
                <View>
                    <Text style={{ fontWeight: 800 }} className="text-slate-400 text-[10px] uppercase  mb-1">
                        Attendance Log
                    </Text>
                    <View className="flex-row items-center">
                        <Text style={{ fontWeight: 800 }} className="text-2xl text-[#4F46E5] mr-2">{monthLabel}</Text>
                        <Text style={{ fontWeight: 500 }} className="text-2xl text-slate-400">{yearLabel}</Text>
                    </View>
                </View>

                {/* Navigation Buttons */}
                <View className="flex-row gap-2">
                    <TouchableOpacity
                        onPress={() => changeMonth(-1)}
                        disabled={!hasPrevData}
                        className={`w-10 h-10 rounded-xl border items-center justify-center ${hasPrevData ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100 opacity-50'}`}
                    >
                        <Ionicons name="chevron-back" size={20} color={hasPrevData ? "#4F46E5" : "#94a3b8"} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => changeMonth(1)}
                        disabled={!hasNextData}
                        className={`w-10 h-10 rounded-xl border items-center justify-center ${hasNextData ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100 opacity-50'}`}
                    >
                        <Ionicons name="chevron-forward" size={20} color={hasNextData ? "#4F46E5" : "#94a3b8"} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* --- Days Header --- */}
            <View className="flex-row mb-2">
                {WEEK_DAYS.map((day, index) => (
                    <View key={index} style={{ width: '14.28%' }} className="items-center">
                        <Text style={{ fontWeight: 800 }} className="text-[10px] text-slate-400 uppercase tracking-wider">
                            {day}
                        </Text>
                    </View>
                ))}
            </View>

            {/* --- Calendar Grid --- */}
            <View className="flex-row flex-wrap mb-6">
                {days.map((item, index) => {
                    // Robust status lookup
                    const statusKey = Object.keys(STATUS_THEME).find(key => key.toUpperCase() === (item.status || '').toUpperCase()) || 'DEFAULT';
                    const theme = STATUS_THEME[statusKey];
                    const isDefault = statusKey === 'DEFAULT';

                    // Logic to hide future dates styling
                    const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), item.day);
                    const now = new Date();
                    now.setHours(0, 0, 0, 0);
                    cellDate.setHours(0, 0, 0, 0);

                    // Allow styling for today and past dates. Hide ONLY for strictly future dates.
                    const isFuture = cellDate.getTime() > now.getTime();

                    // Simplify logic: show style if it's NOT default/padding/future
                    // For padding days, we want transparent bg and distinct text color
                    const showStyle = !isDefault && !isFuture && !item.isPadding;

                    // Text color override for padding days
                    const textColor = item.isPadding ? 'text-slate-400' : theme.text;
                    const bgColor = item.isPadding ? 'transparent' : (!isFuture && theme.bg);

                    return (
                        <View key={index} style={{ width: '14.28%' }} className="aspect-square p-1">
                            <View
                                style={{
                                    borderRadius: 12,
                                    backgroundColor: bgColor,
                                    width: '100%',
                                    height: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden'
                                }}
                            >
                                <Text
                                    style={{ fontWeight: 800 }}
                                    className={`text-xs ${textColor}`}
                                >
                                    {item.day}
                                </Text>

                                {/* Optional: Tiny dot indicator for active statuses to add detail */}
                                {showStyle && (
                                    <View className="absolute bottom-1 w-1 h-1 rounded-full" style={{ backgroundColor: theme.iconColor }} />
                                )}
                            </View>
                        </View>
                    );
                })}
            </View>

            {/* --- Divider --- */}
            <View className="h-[1px] bg-slate-100 w-full mb-6" />

            {/* --- Stats Summary --- */}
            <View>
                <View className="flex-row mb-2">
                    <StatItem label="Present" count={stats.present} type="PRESENT" />
                    <StatItem label="Absent" count={stats.absent} type="ABSENT" />
                </View>
                <View className="flex-row">
                    <StatItem label="Half Day" count={stats.halfDay} type="HALF_DAY" />
                    <StatItem label="Holiday" count={stats.holiday} type="HOLIDAY" />
                </View>
            </View>
        </Card>
    );
};

export default MonthlyCalendar;
