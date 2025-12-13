import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import Text from '../ui/Text';

const GridItem = ({ iconName, iconColor, bgColor, value, label }) => (
    <View className="w-[48%] mb-4 p-4 rounded-2xl justify-between" style={{ backgroundColor: bgColor }}>
        <View className="flex-row justify-between items-start mb-2">
            <View className="p-2 rounded-full bg-white/60">
                <Ionicons name={iconName} size={20} color={iconColor} />
            </View>
        </View>
        <View>
            <Text className="text-2xl mb-1" style={{ color: '#1F2937', fontWeight: 800 }}>{value}</Text>
            <Text style={{ fontWeight: 500 }} className="text-xs text-gray-500 uppercase tracking-wider">{label}</Text>
        </View>
    </View>
);

const AttendanceDetailsCard = ({
    totalDays = 35,
    presentDays = 12,
    halfDays = 8,
    absentDays = 4,
}) => {
    // Calculate a rough attendance percentage for the progress bar
    // Assuming half day counts as 0.5
    const percentage = Math.round(((presentDays + (halfDays * 0.5)) / totalDays) * 100) || 0;

    return (
        <View className="mb-6">
            <View className="bg-white p-5 rounded-3xl shadow-sm" style={styles.card}>

                {/* Header Section with Progress */}
                <View className="mb-6">
                    <View className="flex-row justify-between items-end mb-2">
                        <View className="flex-row items-center">
                            <View className="bg-indigo-100 p-2 rounded-xl mr-3">
                                <Ionicons name="stats-chart" size={20} color="#4F46E5" />
                            </View>
                            <View>
                                <Text style={{ fontWeight: 800 }} className="text-gray-900 text-lg">Overview</Text>
                                <Text className="text-gray-400 text-xs">Academic Performance</Text>
                            </View>
                        </View>
                        <View className="items-end">
                            <Text style={{ fontWeight: 800 }} className="text-2xl text-indigo-600">{percentage}%</Text>
                        </View>
                    </View>

                    {/* Custom Progress Bar */}
                    <View className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <View
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                        />
                    </View>
                </View>

                {/* The Bento Grid */}
                <View className="flex-row flex-wrap justify-between">
                    {/* Total Days */}
                    <GridItem
                        iconName="calendar-number"
                        iconColor="#6366F1" // Indigo
                        bgColor="#EEF2FF"
                        value={totalDays}
                        label="Total Days"
                    />

                    {/* Present */}
                    <GridItem
                        iconName="checkmark-circle"
                        iconColor="#10B981" // Emerald
                        bgColor="#ECFDF5"
                        value={presentDays}
                        label="Present"
                    />

                    {/* Half Days */}
                    <GridItem
                        iconName="hourglass"
                        iconColor="#F59E0B" // Amber
                        bgColor="#FFFBEB"
                        value={halfDays}
                        label="Half Day"
                    />

                    {/* Absent */}
                    <GridItem
                        iconName="alert-circle"
                        iconColor="#EF4444" // Red
                        bgColor="#FEF2F2"
                        value={absentDays}
                        label="Absent"
                    />
                </View>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        shadowColor: '#64748B', // Blue-ish shadow for modern feel
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08, // Much softer opacity
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F3F4F6', // Very subtle border
    },
});

export default AttendanceDetailsCard;
