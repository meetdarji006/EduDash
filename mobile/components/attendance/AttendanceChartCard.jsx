import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react'; // Added useEffect
import { TouchableOpacity, View } from 'react-native';
import Card from '../ui/Card';
import Text from '../ui/Text';

const AttendanceChart = ({ data: attendanceData }) => {
    const [selectedIndex, setSelectedIndex] = useState(null);

    // Process Attendance Data
    const { chartData, highest, lowest, yearLabel } = useMemo(() => {
        if (!attendanceData) return { chartData: [], highest: null, lowest: null, yearLabel: '2025' };

        const processed = Object.entries(attendanceData)
            .map(([monthKey, monthData]) => {
                const total = Number(monthData?.stats?.TOTAL || 0);
                const present = Number(monthData?.stats?.PRESENT || 0);
                const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

                const date = new Date(`${monthKey}-01`);
                return {
                    fullDate: date,
                    month: date.toLocaleString('default', { month: 'short' }),
                    value: percentage,
                    key: monthKey
                };
            })
            .sort((a, b) => a.fullDate - b.fullDate)
            .slice(-6); // Take last 6 months

        // Calculate Stats
        let maxVal = -1;
        let minVal = 101; // Initialized above 100 to ensure any valid percentage is lower
        let highestItem = null;
        let lowestItem = null;

        processed.forEach(item => {
            if (item.value > maxVal) {
                maxVal = item.value;
                highestItem = item;
            }
            if (item.value < minVal) {
                minVal = item.value;
                lowestItem = item;
            }
        });

        const currentYear = new Date().getFullYear();

        return {
            chartData: processed,
            highest: highestItem,
            lowest: lowestItem,
            yearLabel: currentYear
        };
    }, [attendanceData]);

    // --- AUTOMATIC DESELECT LOGIC ---
    useEffect(() => {
        if (selectedIndex !== null) {
            const timer = setTimeout(() => {
                setSelectedIndex(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [selectedIndex]);

    // Constants
    const CHART_HEIGHT = 180;
    const MAX_VALUE = 100;

    return (
        <Card>

            {/* Header */}
            <View className="flex-row justify-between items-start mb-8">
                <View>
                    <View className="flex-row items-center mb-1">
                        <View className="bg-indigo-50 p-1.5 rounded-lg mr-2">
                            <Ionicons name="bar-chart" size={16} color="#4F46E5" />
                        </View>
                        <Text style={{ fontWeight: 800 }} className="text-slate-900 text-lg tracking-tight">
                            Attendance Graph
                        </Text>
                    </View>
                    <Text style={{ fontWeight: 500 }} className="text-slate-400 text-xs ml-1">
                        Monthly Overview
                    </Text>
                </View>
                <View className="bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                    <Text style={{ fontWeight: 700 }} className="text-indigo-700 text-xs">{yearLabel}</Text>
                </View>
            </View>

            {/* Chart Container */}
            <View className="relative mb-8" style={{ height: CHART_HEIGHT }}>

                {/* Background Grid Lines */}
                <View className="absolute inset-0 justify-between z-0">
                    {[100, 75, 50, 25, 0].map((lineVal) => (
                        <View key={lineVal} className="flex-row items-center w-full">
                            <Text style={{ fontWeight: 500 }} className="text-slate-300 text-[10px] w-6 text-right mr-3">
                                {lineVal}
                            </Text>
                            <View className="flex-1 h-[1px] border-b border-dashed border-slate-100" />
                        </View>
                    ))}
                </View>

                {/* Bars Container */}
                <View className="flex-1 flex-row items-end justify-between pl-10 pr-2 z-10">
                    {chartData.map((item, index) => {
                        const isActive = selectedIndex === index;
                        const barHeight = (item.value / MAX_VALUE) * CHART_HEIGHT;

                        return (
                            <TouchableOpacity
                                key={item.key}
                                activeOpacity={0.9}
                                onPress={() => setSelectedIndex(isActive ? null : index)}
                                className="items-center justify-end h-full w-10"
                            >
                                {/* Tooltip */}
                                {isActive && (
                                    <View className="absolute -top-12 items-center z-20">
                                        <View className="bg-slate-800 px-2.5 py-1.5 rounded-xl shadow-lg shadow-slate-400/50">
                                            <Text style={{ fontWeight: 800 }} className="text-white text-[10px]">
                                                {item.value}%
                                            </Text>
                                        </View>
                                        <View className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-800 mt-[-1px]" />
                                    </View>
                                )}

                                {/* The Bar */}
                                <View
                                    style={{ height: barHeight }}
                                    className={`w-5 rounded-t-full ${isActive
                                        ? 'bg-indigo-600 shadow-md shadow-indigo-300'
                                        : 'bg-slate-200'
                                        }`}
                                />

                                {/* Month Label */}
                                <Text style={{ fontWeight: 800 }} className={`mt-3 text-[10px] uppercase tracking-wider ${isActive ? 'text-indigo-600' : 'text-slate-400'
                                    }`}>
                                    {item.month}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* Footer Stats Divider */}
            <View className="h-[1px] bg-slate-100 w-full mb-6" />

            {/* Footer Stats */}
            <View className="flex-row justify-between">
                <View className="flex-1 flex-row items-center">
                    <View className="w-10 h-10 rounded-2xl bg-emerald-50 items-center justify-center mr-3 border border-emerald-100">
                        <Ionicons name='arrow-up' size={18} color="#10B981" />
                    </View>
                    <View>
                        <Text className="text-[9px] uppercase text-slate-400 font-bold  mb-0.5">Highest</Text>
                        <View className="flex-row items-baseline">
                            <Text style={{ fontWeight: 800 }} className="text-lg text-slate-800">{highest ? highest.value : 0}</Text>
                            <Text style={{ fontWeight: 800 }} className="text-xs text-slate-400">%</Text>
                        </View>
                        <Text style={{ fontWeight: 500 }} className="text-[10px] text-emerald-600">{highest?.fullDate ? highest.fullDate.toLocaleString('default', { month: 'long' }) : '-'}</Text>
                    </View>
                </View>

                <View className="w-[1px] h-10 bg-slate-100 mx-4" />

                <View className="flex-1 flex-row items-center pl-2">
                    <View className="w-10 h-10 rounded-2xl bg-rose-50 items-center justify-center mr-3 border border-rose-100">
                        <Ionicons name='arrow-down' size={18} color="#F43F5E" />
                    </View>
                    <View>
                        <Text style={{ fontWeight: 700 }} className="text-[9px] uppercase text-slate-400  mb-0.5">Lowest</Text>
                        <View className="flex-row items-baseline">
                            <Text style={{ fontWeight: 800 }} className="text-lg text-slate-800">{lowest ? lowest.value : 0}</Text>
                            <Text style={{ fontWeight: 800 }} className="text-xs text-slate-400">%</Text>
                        </View>
                        <Text style={{ fontWeight: 500 }} className="text-[10px] text-rose-500">{lowest?.fullDate ? lowest.fullDate.toLocaleString('default', { month: 'long' }) : '-'}</Text>
                    </View>
                </View>
            </View>
        </Card>
    );
};

export default AttendanceChart;
