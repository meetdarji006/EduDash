import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import CustomTabs from '../../components/CustomTabs';
import SecondaryHeader from '../../components/SecondaryHeader';
import Card from '../../components/ui/Card';
import Text from '../../components/ui/Text';
import { theme } from '../../constants/colors';

// ==========================================
// Mock Data
// ==========================================

const assignmentData = {
    'Assignment 1': [
        {
            id: 1, subject: 'Mathematics & Computing', type: 'Math', status: 'submitted', date: 'Oct 24',
            questions: [
                { id: 'q1', text: 'Solve the quadratic equation: 2x² - 4x + 2 = 0' },
                { id: 'q2', text: 'Calculate the derivative of f(x) = 3x³ + 2x²' },
                { id: 'q3', text: 'Find the limit as x approaches 0 of sin(x)/x' }
            ]
        },
        {
            id: 2, subject: 'Intro to React Native', type: 'Code', status: 'missing', date: 'Oct 22',
            questions: [
                { id: 'q1', text: 'Create a simple Hello World component' },
                { id: 'q2', text: 'Explain the difference between State and Props' }
            ]
        },
        {
            id: 3, subject: 'Physics Lab Report', type: 'Science', status: 'submitted', date: 'Oct 20',
            questions: [
                { id: 'q1', text: 'Document the pendulum experiment results' },
                { id: 'q2', text: 'Calculate the error percentage in gravity measurement' }
            ]
        },
        {
            id: 4, subject: 'English Essay', type: 'Literature', status: 'pending', date: 'Oct 26',
            questions: [
                { id: 'q1', text: 'Write a 500-word essay on "The Great Gatsby"' },
                { id: 'q2', text: 'Analyze the character arc of Jay Gatsby' }
            ]
        },
        {
            id: 5, subject: 'Database Design', type: 'Code', status: 'submitted', date: 'Oct 18',
            questions: [
                { id: 'q1', text: 'Design a schema for a library management system' },
                { id: 'q2', text: 'Write SQL queries for book retrieval' }
            ]
        },
    ],
    'Assignment 2': [
        {
            id: 6, subject: 'Data Structures Basics', type: 'Code', status: 'submitted', date: 'Nov 02',
            questions: [
                { id: 'q1', text: 'Implement a linked list in C++' },
                { id: 'q2', text: 'Compare Array vs Linked List performance' }
            ]
        },
        {
            id: 7, subject: 'Algorithms Advanced', type: 'Code', status: 'pending', date: 'Nov 05',
            questions: [
                { id: 'q1', text: 'Explain Dijkstra algorithm' },
                { id: 'q2', text: 'Solve the Traveling Salesman problem using dynamic programming' }
            ]
        },
        {
            id: 8, subject: 'Chemistry Project', type: 'Science', status: 'submitted', date: 'Nov 01',
            questions: [
                { id: 'q1', text: 'Balance the chemical equation for Photosynthesis' },
                { id: 'q2', text: 'List the properties of Noble Gases' }
            ]
        },
    ],
};

// ==========================================
// Helpers & Config
// ==========================================

const getStatusTheme = (status) => {
    switch (status) {
        case 'submitted':
            return { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700', icon: 'checkmark-circle', color: '#059669' };
        case 'missing':
            return { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-700', icon: 'alert-circle', color: '#be123c' };
        case 'pending':
            return { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700', icon: 'time', color: '#b45309' };
        default:
            return { bg: 'bg-slate-50', border: 'border-slate-100', text: 'text-slate-500', icon: 'help-circle', color: '#64748b' };
    }
};

const getSubjectIcon = (type) => {
    switch (type) {
        case 'Math': return 'calculator';
        case 'Code': return 'code-slash';
        case 'Science': return 'flask';
        case 'Literature': return 'book';
        default: return 'document-text';
    }
};

// ==========================================
// Sub-Component: Status Badge
// ==========================================

const StatusBadge = ({ status }) => {
    const theme = getStatusTheme(status);

    return (
        <View className={`flex-row items-center px-2.5 py-1 rounded-full border ${theme.bg} ${theme.border}`}>
            <Ionicons name={theme.icon} size={12} color={theme.color} style={{ marginRight: 4 }} />
            <Text style={{ fontWeight: 800 }} className={`text-[10px] uppercase tracking-wide ${theme.text}`}>
                {status}
            </Text>
        </View>
    );
};

// ==========================================
// Main Component
// ==========================================

const ModernAssignments = () => {
    const [activeTab, setActiveTab] = useState('Assignment 1');
    const currentList = assignmentData[activeTab] || [];
    const [expandedId, setExpandedId] = useState(null);

    const toggleExpand = (id) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    return (
        <View style={{ backgroundColor: theme.background }} className="flex-1">
            <View>
                <SecondaryHeader title="Assignment" />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    className='px-5'
                    contentContainerStyle={{ paddingBottom: 30 }}
                >
                    {/* --- Main Card Wrapper --- */}
                    <Card style={{ marginTop: 10, flex: "auto" }}>
                        <View className="flex-row items-center justify-between mb-8">
                            <View>
                                <Text style={{ fontWeight: 800 }} className="text-slate-400 text-[10px] uppercase  mb-1">
                                    Coursework
                                </Text>
                                <View className="flex-row items-center">
                                    <Text style={{ fontWeight: 800 }} className="text-xl text-slate-900 mr-2">
                                        Assignments
                                    </Text>
                                    <View className="bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                                        <Text style={{ fontWeight: 800 }} className="text-[10px] text-indigo-600">{currentList.length} Tasks</Text>
                                    </View>
                                </View>
                            </View>
                            <View className="w-10 h-10 bg-indigo-50 rounded-2xl items-center justify-center border border-indigo-100">
                                <Ionicons name="calendar" size={20} color="#4F46E5" />
                            </View>
                        </View>

                        <CustomTabs tabs={['Assignment 1', 'Assignment 2']} activeTab={activeTab} setActiveTab={setActiveTab} />

                        {/* --- List Items --- */}
                        <View className="space-y-3">
                            {currentList.map((item, index) => {
                                const iconName = getSubjectIcon(item.type);
                                const isExpanded = expandedId === item.id;

                                return (
                                    <View key={item.id} className="mb-3">
                                        <TouchableOpacity
                                            activeOpacity={0.9}
                                            onPress={() => toggleExpand(item.id)}
                                            className={`flex-row items-center bg-white p-3 rounded-2xl border ${isExpanded ? 'border-indigo-100 bg-indigo-50/30' : 'border-slate-100'} shadow-sm shadow-slate-50 z-10`}
                                        >
                                            {/* 2. Content */}
                                            <View className="flex-1 mr-2">
                                                <Text
                                                    style={{ fontWeight: 700 }}
                                                    className="text-slate-800 text-sm leading-5 mb-1"
                                                    numberOfLines={1}
                                                >
                                                    {item.subject}
                                                </Text>
                                                <View className="flex-row items-center">
                                                    <View className="flex-row items-center">
                                                        <View className="bg-slate-100 px-2 py-0.5 rounded mr-2">
                                                            <Text style={{ fontWeight: 700 }} className="text-[10px] text-slate-500 uppercase">
                                                                {/* {item.code} */}
                                                                CS301
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>

                                            {/* 3. Status Badge */}
                                            <View className="flex-row items-center">
                                                <StatusBadge status={item.status} />
                                                <Ionicons
                                                    name={isExpanded ? "chevron-up" : "chevron-down"}
                                                    size={16}
                                                    color="#94a3b8"
                                                    style={{ marginLeft: 8 }}
                                                />
                                            </View>
                                        </TouchableOpacity>

                                        {/* Questions Dropdown */}
                                        {isExpanded && (
                                            <View className="bg-slate-50 mx-2 p-3 pt-6 -mt-4 rounded-b-xl border border-slate-100">
                                                <Text style={{ fontWeight: 800 }} className="text-[10px] uppercase text-slate-400 mb-2 pl-1">
                                                    Questions:
                                                </Text>
                                                {item.questions && item.questions.map((q, i) => (
                                                    <View key={q.id} className="flex-row items-start mb-2 last:mb-0">
                                                        <Text className="text-xs text-indigo-500 font-bold mr-2 mt-0.5">{i + 1}.</Text>
                                                        <Text className="text-xs text-slate-600 flex-1 leading-5 font-medium">
                                                            {q.text}
                                                        </Text>
                                                    </View>
                                                ))}
                                                {(!item.questions || item.questions.length === 0) && (
                                                    <Text className="text-xs text-slate-400 italic pl-1">No questions pending.</Text>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </View>

                        {/* --- Empty State Handling (Optional Polish) --- */}
                        {currentList.length === 0 && (
                            <View className="items-center justify-center py-8 opacity-50">
                                <Ionicons name="documents-outline" size={40} color="#94a3b8" />
                                <Text style={{ fontWeight: 700 }} className="text-slate-400 text-xs mt-2">No Assignments Found</Text>
                            </View>
                        )}
                    </Card>
                </ScrollView>
            </View>
        </View >
    );
};

export default ModernAssignments;
