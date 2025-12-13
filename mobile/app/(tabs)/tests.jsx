import { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import SecondaryHeader from '../../components/SecondaryHeader';
import Text from '../../components/ui/Text';
import { theme } from '../../constants/colors';
import CustomTabs from '../../components/CustomTabs';

// ==============================================
// Logic & Data
// ==============================================
const testData = {
    test1: [
        { id: 1, subject: 'Mathematics & Computing', code: 'MAT101', marks: 85, total: 100 },
        { id: 2, subject: 'Physics', code: 'SCI202', marks: 78, total: 100 },
        { id: 3, subject: 'Chemistry', code: 'SCI203', marks: 92, total: 100 },
        { id: 4, subject: 'English Literature', code: 'ENG101', marks: 88, total: 100 },
        { id: 5, subject: 'Computer Science', code: 'CS404', marks: 95, total: 100 },
    ],
    test2: [ /* ... same structure ... */]
};

// --- Config Helpers ---
const CIRCLE_SIZE = 140;
const STROKE_WIDTH = 12;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = RADIUS * 2 * Math.PI;


const getScoreColor = (marks) => {
    if (marks >= 90) return '#10b981'; // Emerald
    if (marks >= 80) return '#6366f1'; // Indigo
    if (marks >= 70) return '#f59e0b'; // Amber
    return '#f43f5e'; // Rose
};

// ==============================================
// Component: Dark Hero Overview (The "Wow" Factor)
// ==============================================
const HeroOverview = () => {
    const dataStr = testData.test1;
    const totalMarks = dataStr.reduce((sum, item) => sum + item.marks, 0);
    const maxPossible = dataStr.length * 100;
    const percentage = (totalMarks / maxPossible) * 100;
    const offset = CIRCUMFERENCE * (1 - percentage / 100);

    return (
        <View className="mb-8">
            {/* Dark Card Container with Indigo Background */}
            <View className="bg-indigo-600 rounded-3xl p-6 shadow-2xl shadow-indigo-500/40 relative overflow-hidden">

                {/* Decorative Background Circles */}
                <View className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <View className="absolute bottom-0 -left-10 w-32 h-32 bg-indigo-900/20 rounded-full blur-xl" />

                {/* Header inside Card */}
                <View className="flex-row justify-between items-start mb-6">
                    <View>
                        <Text style={{ fontWeight: 700 }} className="text-indigo-200 text-xs uppercase  mb-1">
                            Current Performance
                        </Text>
                        <Text style={{ fontWeight: 800 }} className="text-white text-2xl">
                            Overall Score
                        </Text>
                    </View>
                    <View className="bg-white/20 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                        <Text style={{ fontWeight: 700 }} className="text-white text-xs">Test 1</Text>
                    </View>
                </View>

                {/* Main Content: Ring + Stats */}
                <View className="flex-row items-center justify-between">

                    {/* Left: The Circular Chart */}
                    <View className="items-center justify-center mr-4 relative">
                        <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}>
                            {/* Track */}
                            <Circle
                                cx={CIRCLE_SIZE / 2} cy={CIRCLE_SIZE / 2} r={RADIUS}
                                stroke="rgba(255,255,255,0.1)" strokeWidth={STROKE_WIDTH} fill="none"
                            />
                            {/* Progress */}
                            <Circle
                                cx={CIRCLE_SIZE / 2} cy={CIRCLE_SIZE / 2} r={RADIUS}
                                stroke="#ffffff" strokeWidth={STROKE_WIDTH} fill="none"
                                strokeDasharray={CIRCUMFERENCE}
                                strokeDashoffset={offset}
                                strokeLinecap="round"
                                rotation="-90"
                                origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}
                            />
                        </Svg>
                        <View className="absolute items-center">
                            <Text style={{ fontWeight: 800 }} className="text-3xl text-white">{percentage.toFixed(0)}%</Text>
                            <Text style={{ fontWeight: 700 }} className="text-indigo-200 text-[10px] uppercase">Average</Text>
                        </View>
                    </View>

                    {/* Right: Summary Stats */}
                    <View className="flex-1 space-y-3">
                        {/* Stat 1 */}
                        <View className="bg-white/10 p-3 rounded-2xl border border-white/5 mb-2">
                            <Text style={{ fontWeight: 700 }} className="text-indigo-200 text-[10px] uppercase mb-1">Highest</Text>
                            <View className="flex-row justify-between items-center">
                                <Text style={{ fontWeight: 700 }} className="text-white text-lg">Comp. Sci</Text>
                                <Text style={{ fontWeight: 800 }} className="text-emerald-300 text-lg">95</Text>
                            </View>
                        </View>
                        {/* Stat 2 */}
                        <View className="bg-white/10 p-3 rounded-2xl border border-white/5">
                            <Text className="text-indigo-200 text-[10px] uppercase font-bold mb-1">Lowest</Text>
                            <View className="flex-row justify-between items-center">
                                <Text style={{ fontWeight: 700 }} className="text-white text-lg">Physics</Text>
                                <Text style={{ fontWeight: 800 }} className="text-rose-300 text-lg">78</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

// ==============================================
// Component: Modern List Item
// ==============================================
const MarkTile = ({ item }) => {
    const scoreColor = getScoreColor(item.marks);

    return (
        <View className="mb-4 bg-white p-4 rounded-[24px] flex-row items-center shadow-md shadow-slate-200/50 border border-slate-50">

            {/* Middle Content */}
            <View className="flex-1 mr-2">
                <Text style={{ fontWeight: 800 }} className="text-slate-900 text-[15px] mb-1 leading-5">
                    {item.subject}
                </Text>
                <View className="flex-row items-center">
                    <View className="bg-slate-100 px-2 py-0.5 rounded mr-2">
                        <Text style={{ fontWeight: 800 }} className="text-[10px] text-slate-500 uppercase">{item.code}</Text>
                    </View>
                </View>
            </View>

            {/* Score Ring / Badge */}
            <View className="items-end">
                <Text className="text-2xl" style={{ color: scoreColor, fontWeight: 800 }}>
                    {item.marks}
                </Text>
                <Text style={{ fontWeight: 800 }} className="text-[10px] text-slate-300 uppercase">Marks</Text>
            </View>
        </View>
    );
};

// ==============================================
// Main Screen Layout
// ==============================================
const TestsScreen = () => {
    const [activeTab, setActiveTab] = useState('Test 1');

    return (
        <View style={{ backgroundColor: theme.background }} className="flex-1">
            <SecondaryHeader title="Tests Performance" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                className='px-5'
                contentContainerStyle={{ paddingBottom: 30 }}
            >
                <HeroOverview />

                <CustomTabs tabs={['Test 1', 'Test 2']} activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* 3. Section Title */}
                <View className="flex-row justify-between items-end mb-4 px-1">
                    <Text className="text-lg font-extrabold text-slate-900">Detailed Report</Text>
                    <TouchableOpacity>
                        <Text style={{ fontWeight: 800 }} className="text-xs text-indigo-600">Download PDF</Text>
                    </TouchableOpacity>
                </View>

                {/* 4. The List */}
                <View>
                    {testData.test1.map((item) => (
                        <MarkTile key={item.id} item={item} />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default TestsScreen;
