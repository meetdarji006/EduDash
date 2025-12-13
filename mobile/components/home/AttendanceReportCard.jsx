import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { theme } from '../../constants/colors';
import Text from '../ui/Text';

// --- Configuration ---
const SIZE = 160;
const STROKE_WIDTH = 14;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = RADIUS * 2 * Math.PI;

const AttendanceHero = ({ data }) => {
    const dateObj = new Date();
    // const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;

    // const [monthData, setMonthData] = useState(null);

    // useEffect(() => {
    //     if (data) {
    //         setMonthData(data[monthKey]);
    //     }
    // }, [data]);

    const formattedDate = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
    });

    const { totalDays, halfDays, presentDays, absentDays, percentage } = useMemo(() => {
        if (data && Object.keys(data).length > 0) {
            const totalDays = Number(data.TOTAL || 0);
            const presentDays = Number(data.PRESENT || 0);
            const absentDays = Number(data.ABSENT || 0);
            const halfDays = Number(data.LATE || 0);
            // Avoid division by zero
            const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
            return { totalDays, presentDays, absentDays, percentage: percentage.toFixed(0), halfDays };
        }
        return { totalDays: 0, presentDays: 0, absentDays: 0, percentage: 0, halfDays: 0 };
    }, [data])

    const progressOffset = CIRCUMFERENCE * (1 - (Number(percentage) || 0) / 100);

    return (
        <View className="flex-1">
            <View style={styles.heroCard}>
                {/* Decorative Background Blobs for "Modern" feel */}
                <View style={styles.blob1} />
                <View style={styles.blob2} />
                {/* --- Header --- */}
                <View className="flex-row justify-between items-center mb-6 z-10">
                    <View className="flex-row items-center">
                        <View className="bg-white/20 p-2 rounded-xl mr-3 backdrop-blur-md">
                            <Ionicons name="school" size={20} color="#FFFFFF" />
                        </View>
                        <View>
                            <Text style={{ fontWeight: 800, color: theme.lightWhite }} className="text-[10px] uppercase leading-none">
                                Academic Year
                            </Text>
                            <Text className="text-white text-lg" style={{ fontWeight: 800 }}>
                                Attendance
                            </Text>
                        </View>
                    </View>

                    <View className="bg-white/10 px-3 py-1 rounded-full border border-white/10">
                        <Text style={{ fontWeight: 800 }} className="text-white text-xs">{formattedDate}</Text>
                    </View>
                </View>

                {/* --- Main Visual: The Glowing Ring --- */}
                <View className="items-center justify-center mb-8 z-10">
                    <View style={{ width: SIZE, height: SIZE }}>
                        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
                            <Defs>
                                <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                                    <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.4" />
                                    <Stop offset="1" stopColor="#FFFFFF" stopOpacity="1" />
                                </LinearGradient>
                            </Defs>

                            {/* Background Track */}
                            <Circle
                                stroke="rgba(255,255,255,0.1)"
                                fill="none"
                                cx={SIZE / 2}
                                cy={SIZE / 2}
                                r={RADIUS}
                                strokeWidth={STROKE_WIDTH}
                            />

                            {/* Progress Line with Gradient */}
                            <Circle
                                stroke="url(#grad)"
                                fill="none"
                                cx={SIZE / 2}
                                cy={SIZE / 2}
                                r={RADIUS}
                                strokeWidth={STROKE_WIDTH}
                                strokeDasharray={CIRCUMFERENCE}
                                strokeDashoffset={progressOffset}
                                strokeLinecap="round"
                                rotation="-90"
                                origin={`${SIZE / 2}, ${SIZE / 2}`}
                            />
                        </Svg>

                        {/* Center Text */}
                        <View className="absolute inset-0 items-center justify-center">
                            <Text style={{ fontWeight: 800 }} className="text-4xl text-white">
                                {percentage}%
                            </Text>
                            <Text style={{ fontWeight: 800 }} className="text-white/60 text-xs uppercase">
                                Overall
                            </Text>
                        </View>
                    </View>
                </View>

                {/* --- Footer Stats (Glass Effect) --- */}
                <View className="flex-row justify-between bg-black/20 rounded-2xl p-4 border border-white/5 z-10">
                    {/* Total */}
                    <View className="items-center flex-1 border-r border-white/10">
                        <Text style={{ fontWeight: 800 }} className="text-white/50 text-[10px] uppercase mb-1">Total</Text>
                        <Text style={{ fontWeight: 800 }} className="text-white text-lg">{totalDays}</Text>
                    </View>

                    {/* Present */}
                    <View className="items-center flex-1 border-r border-white/10">
                        <Text style={{ fontWeight: 800 }} className="text-emerald-300 text-[10px] uppercase mb-1">Present</Text>
                        <Text style={{ fontWeight: 800 }} className="text-white text-lg">{presentDays}</Text>
                    </View>

                    {/* Half */}
                    <View className="items-center flex-1 border-r border-white/10">
                        <Text style={{ fontWeight: 800 }} className="text-yellow-300 text-[10px] uppercase mb-1">Half</Text>
                        <Text style={{ fontWeight: 800 }} className="text-white text-lg">{halfDays}</Text>
                    </View>

                    {/* Absent */}
                    <View className="items-center flex-1">
                        <Text style={{ fontWeight: 800 }} className="text-rose-300 text-[10px] uppercase mb-1">Absent</Text>
                        <Text style={{ fontWeight: 800 }} className="text-white text-lg">{absentDays}</Text>
                    </View>
                </View>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    heroCard: {
        backgroundColor: '#4F46E5', // Indigo 600
        borderRadius: 32,
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
        // Strong Shadow for Depth
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
    },
    // These create the subtle gradient background effect
    blob1: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#6366F1', // Indigo 500
        opacity: 0.5,
    },
    blob2: {
        position: 'absolute',
        bottom: -60,
        left: -20,
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: '#4338ca', // Indigo 700
        opacity: 0.6,
    }
});

export default AttendanceHero;
