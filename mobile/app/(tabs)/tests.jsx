import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import CustomTabs from '../../components/CustomTabs';
import SecondaryHeader from '../../components/SecondaryHeader';
import Text from '../../components/ui/Text';
import { theme } from '../../constants/colors';

// --- Config Helpers ---
const CIRCLE_SIZE = 140;
const STROKE_WIDTH = 12;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = RADIUS * 2 * Math.PI;


const getScoreColor = (marks, total) => {
    const per = total > 0 ? (marks / total) * 100 : 0;
    if (per >= 90) return '#10b981'; // Emerald
    if (per >= 80) return '#6366f1'; // Indigo
    if (per >= 70) return '#f59e0b'; // Amber
    return '#f43f5e';
};

const HeroOverview = ({ data, testName }) => {
    const dataStr = data || [];
    const totalMarks = dataStr.reduce((sum, item) => sum + (Number(item.marks) || 0), 0);
    const maxPossible = dataStr.length * 100; // Assuming 100 is max per subject? Or verify item.total
    // If item.total exists, better use that
    // const maxPossible = dataStr.reduce((sum, item) => sum + (Number(item.total) || 100), 0);
    // But keeping strictly to previous logic but safer:

    const percentage = maxPossible > 0 ? (totalMarks / maxPossible) * 100 : 0;
    const safePercentage = isNaN(percentage) ? 0 : percentage;
    const offset = CIRCUMFERENCE * (1 - safePercentage / 100);

    const highest = dataStr.length > 0 ? dataStr.reduce((max, item) => {
        const itemPer = item.total ? item.marks / item.total : 0;
        const maxPer = max.total ? max.marks / max.total : 0;
        return itemPer > maxPer ? item : max;
    }, dataStr[0]) : null;

    const lowest = dataStr.length > 0 ? dataStr.reduce((min, item) => {
        const itemPer = item.total ? item.marks / item.total : 0;
        const minPer = min.total ? min.marks / min.total : 0;
        return itemPer < minPer ? item : min;
    }, dataStr[0]) : null;

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
                        <Text style={{ fontWeight: 700 }} className="text-white text-xs">{testName}</Text>
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
                                strokeDashoffset={isNaN(offset) ? CIRCUMFERENCE : offset}
                                strokeLinecap="round"
                                rotation="-90"
                                origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}
                            />
                        </Svg>
                        <View className="absolute items-center">
                            <Text style={{ fontWeight: 800 }} className="text-3xl text-white">{safePercentage.toFixed(0)}%</Text>
                            <Text style={{ fontWeight: 700 }} className="text-indigo-200 text-[10px] uppercase">Average</Text>
                        </View>
                    </View>

                    {/* Right: Summary Stats */}
                    <View className="flex-1 space-y-3">
                        {/* Stat 1 */}
                        <View className="bg-white/10 p-3 rounded-2xl border border-white/5 mb-2">
                            <Text style={{ fontWeight: 700 }} className="text-indigo-200 text-[10px] uppercase mb-1">Highest</Text>
                            <View className="flex-row justify-between items-center">
                                <Text style={{ fontWeight: 700 }} className="text-white text-lg">{highest?.subject || '-'}</Text>
                                <Text style={{ fontWeight: 800 }} className="text-emerald-300 text-lg">{highest?.marks || '-'}</Text>
                            </View>
                        </View>
                        {/* Stat 2 */}
                        <View className="bg-white/10 p-3 rounded-2xl border border-white/5">
                            <Text className="text-indigo-200 text-[10px] uppercase font-bold mb-1">Lowest</Text>
                            <View className="flex-row justify-between items-center">
                                <Text style={{ fontWeight: 700 }} className="text-white text-lg">{lowest?.subject || '-'}</Text>
                                <Text style={{ fontWeight: 800 }} className="text-rose-300 text-lg">{lowest?.marks || '-'}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const MarkTile = ({ item }) => {
    const scoreColor = getScoreColor(item.marks, item.total);

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

const TestsScreen = () => {
    // const { data: testsData, isLoading, error, refetch } = useTests();
    const testsData = [];
    const isLoading = false;
    const error = null;
    const refetch = () => { };

    const [activeTab, setActiveTab] = useState(null);
    // Effect to set initial tab when data loads
    useEffect(() => {
        if (!activeTab && testsData) {
            const keys = Object.keys(testsData);
            if (keys.length > 0) {
                setActiveTab(keys[0]);
            }
        }
    }, [testsData, activeTab]);

    const testKeys = testsData ? Object.keys(testsData) : [];

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
                <Text className="text-red-500 mb-4 font-bold">Error loading tests</Text>
                <Text className="text-gray-500 mb-4">{error.message}</Text>
                <TouchableOpacity
                    onPress={() => refetch()}
                    className="bg-indigo-600 px-6 py-3 rounded-xl"
                >
                    <Text className="text-white font-bold">Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const currentTestData = testsData?.[activeTab] || [];

    return (
        <View style={{ backgroundColor: theme.background }} className="flex-1">
            <SecondaryHeader title="Tests Performance" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                className='px-5'
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}
            >

                {currentTestData.length > 0 ? (
                    <>
                        <HeroOverview data={currentTestData} testName={activeTab} />
                        <CustomTabs tabs={testKeys.length > 0 ? testKeys : ['No Tests']} activeTab={activeTab} setActiveTab={setActiveTab} />

                        {/* 3. Section Title */}
                        <View className="flex-row justify-between items-end mb-4 px-1">
                            <Text className="text-lg font-extrabold text-slate-900">Detailed Report</Text>
                            {/* <TouchableOpacity>
                                <Text style={{ fontWeight: 800 }} className="text-xs text-indigo-600">Download PDF</Text>
                            </TouchableOpacity> */}
                        </View>

                        {/* 4. The List */}
                        <View>
                            {currentTestData.map((item) => (
                                <MarkTile key={item.id} item={item} />
                            ))}
                        </View>
                    </>
                ) : (
                    <View className="items-center justify-center flex-1">
                        {testKeys.length > 0 ? (
                            <CustomTabs tabs={testKeys} activeTab={activeTab} setActiveTab={setActiveTab} />
                        ) : null}
                        <Text className="text-gray-400 font-bold text-lg mt-10">No records found</Text>
                        <Text className="text-gray-400 text-sm">No test data available</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default TestsScreen;
