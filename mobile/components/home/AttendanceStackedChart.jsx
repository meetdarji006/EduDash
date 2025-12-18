import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import Card from '../ui/Card';
import Text from '../ui/Text';

import { useMemo } from 'react';

const AttendanceStackedChart = ({ data }) => {
    if (!data || Object.keys(data).length === 0) {
        return null; // Or a fallback UI
    }
    const { presentDays, halfDays, absentDays } = useMemo(() => {
        let present = 0;
        let half = 0;
        let absent = 0;

        if (data) {
            Object.values(data).forEach(monthData => {
                if (monthData?.stats) {
                    present += Number(monthData.stats.PRESENT || 0);
                    half += Number(monthData.stats.LATE || 0);
                    absent += Number(monthData.stats.ABSENT || 0);
                }
            });
        }
        return { presentDays: present, halfDays: half, absentDays: absent };
    }, [data]);
    const totalDays = presentDays + halfDays + absentDays;

    // Calculate percentages
    const presentPc = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
    const halfPc = totalDays > 0 ? (halfDays / totalDays) * 100 : 0;
    const absentPc = totalDays > 0 ? (absentDays / totalDays) * 100 : 0;

    // Theme Configuration
    const theme = {
        present: { color: '#10B981', bg: 'bg-emerald-500', icon: 'checkmark-circle', tint: 'bg-emerald-50', text: 'text-emerald-600' },
        half: { color: '#F59E0B', bg: 'bg-amber-500', icon: 'time', tint: 'bg-amber-50', text: 'text-amber-600' },
        absent: { color: '#F43F5E', bg: 'bg-rose-500', icon: 'close-circle', tint: 'bg-rose-50', text: 'text-rose-600' },
    };

    // Sub-component for Legend Stats
    const LegendStat = ({ label, value, themeConfig }) => (
        <View className="flex-1 items-center">
            {/* Icon Circle */}
            <View className={`w-10 h-10 rounded-2xl ${themeConfig.tint} items-center justify-center mb-2 border border-white shadow-sm`}>
                <Ionicons name={themeConfig.icon} size={18} color={themeConfig.color} />
            </View>

            {/* Value */}
            <Text style={{ fontWeight: 800 }} className="text-2xl text-slate-900 leading-7">
                {value}
            </Text>

            {/* Label */}
            <Text style={{ fontWeight: 800 }} className="text-[10px] text-slate-400 uppercase ">
                {label}
            </Text>
        </View>
    );

    return (
        <Card>
            {/* --- Header --- */}
            <View className="flex-row items-start justify-between mb-8">
                <View>
                    <Text style={{ fontWeight: 800 }} className="text-slate-400 text-[10px] uppercase leading-none mb-1">
                        This Month
                    </Text>
                    <View className="flex-row items-center">
                        <Text style={{ fontWeight: 800 }} className="text-xl text-slate-900 mr-2">
                            Attendance Share
                        </Text>
                    </View>
                </View>

                {/* Total Badge */}
                <View className="bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                    <Text style={{ fontWeight: 800 }} className="text-slate-600 text-xs">
                        Total: <Text style={{ fontWeight: 800 }} className="text-indigo-600">{totalDays}</Text>
                    </Text>
                </View>
            </View>

            {/* --- Stacked Bar Chart --- */}
            <View className="mb-8">
                {/* The Bar Track */}
                <View className="h-12 w-full flex-row rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">

                    {/* Present Segment */}
                    {presentPc > 0 && (
                        <View
                            style={{ width: `${presentPc}%` }}
                            className={`${theme.present.bg} h-full items-center justify-center`}
                        >
                            {presentPc > 10 && (
                                <Text style={{ fontWeight: 800 }} className="text-white text-xs">
                                    {Math.round(presentPc)}%
                                </Text>
                            )}
                        </View>
                    )}

                    {/* Half Day Segment */}
                    {halfPc > 0 && (
                        <View
                            style={{ width: `${halfPc}%` }}
                            className={`${theme.half.bg} h-full items-center justify-center`}
                        >
                            {halfPc > 10 && (
                                <Text style={{ fontWeight: 800 }} className="text-white text-xs">
                                    {Math.round(halfPc)}%
                                </Text>
                            )}
                        </View>
                    )}

                    {/* Absent Segment */}
                    {absentPc > 0 && (
                        <View
                            style={{ width: `${absentPc}%` }}
                            className={`${theme.absent.bg} h-full items-center justify-center`}
                        >
                            {absentPc > 10 && (
                                <Text style={{ fontWeight: 800 }} className="text-white font-bold text-xs">
                                    {Math.round(absentPc)}%
                                </Text>
                            )}
                        </View>
                    )}
                </View>
            </View>

            {/* --- Legend / Stats Grid --- */}
            <View className="flex-row justify-between items-center bg-slate-50/50 rounded-3xl p-4 border border-slate-50">

                <LegendStat
                    label="Present"
                    value={presentDays}
                    themeConfig={theme.present}
                />

                {/* Vertical Divider */}
                <View className="w-[1px] h-10 bg-slate-200" />

                <LegendStat
                    label="Half Day"
                    value={halfDays}
                    themeConfig={theme.half}
                />

                {/* Vertical Divider */}
                <View className="w-[1px] h-10 bg-slate-200" />

                <LegendStat
                    label="Absent"
                    value={absentDays}
                    themeConfig={theme.absent}
                />

            </View>
        </Card>
    );
};

export default AttendanceStackedChart;
