import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import CustomTabs from '../../components/CustomTabs';
import SecondaryHeader from '../../components/SecondaryHeader';
import Card from '../../components/ui/Card';
import Text from '../../components/ui/Text';
import { theme } from '../../constants/colors';
import { useAssignments } from '../../hooks/useAssignments';

// ==========================================
// Helpers & Config
// ==========================================

const getStatusTheme = (status) => {
    // Normalize status to lowercase for comparison
    const s = status ? status.toLowerCase() : 'pending';
    switch (s) {
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

const getSubjectIcon = (subjectName) => {
    if (!subjectName) return 'document-text';
    const lower = subjectName.toLowerCase();
    if (lower.includes('math')) return 'calculator';
    if (lower.includes('code') || lower.includes('program') || lower.includes('data') || lower.includes('algo')) return 'code-slash';
    if (lower.includes('science') || lower.includes('physics') || lower.includes('chem')) return 'flask';
    if (lower.includes('lit') || lower.includes('english')) return 'book';
    return 'document-text';
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const StatusBadge = ({ status }) => {
    const theme = getStatusTheme(status);

    return (
        <View className={`flex-row items-center px-2.5 py-1 rounded-full border ${theme.bg} ${theme.border}`}>
            <Ionicons name={theme.icon} size={12} color={theme.color} style={{ marginRight: 4 }} />
            <Text style={{ fontWeight: 800 }} className={`text-[10px] uppercase tracking-wide ${theme.text}`}>
                {status || 'PENDING'}
            </Text>
        </View>
    );
};

// ==========================================
// Main Component
// ==========================================

const ModernAssignments = () => {
    const { data: assignments, isLoading, error, refetch } = useAssignments();
    const [activeTab, setActiveTab] = useState('Pending'); // Default to Pending
    const [expandedId, setExpandedId] = useState(null);

    // Deduplicate assignments: If multiple records exist for same ID, prefer 'submitted' status
    const uniqueAssignments = useMemo(() => {
        if (!assignments) return [];
        const map = new Map();
        assignments.forEach(item => {
            const existing = map.get(item.id);
            if (!existing) {
                map.set(item.id, item);
            } else {
                const existingStatus = existing.status ? existing.status.toLowerCase() : 'pending';
                const newStatus = item.status ? item.status.toLowerCase() : 'pending';
                if (newStatus === 'submitted' && existingStatus !== 'submitted') {
                    map.set(item.id, item);
                }
            }
        });
        return Array.from(map.values());
    }, [assignments]);

    // Filter assignments based on active tab
    const filteredAssignments = uniqueAssignments.filter(item => {
        const status = item.status ? item.status.toLowerCase() : 'pending';
        if (activeTab === 'Pending') {
            return status === 'pending' || status === 'missing';
        } else if (activeTab === 'Submitted') {
            return status === 'submitted';
        }
        return true;
    });


    const toggleExpand = (id) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    if (isLoading) {
        return (
            <View style={{ backgroundColor: theme.background }} className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ backgroundColor: theme.background }} className="flex-1 items-center justify-center p-5">
                <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
                <Text className="text-slate-500 mt-2 text-center">Failed to load assignments</Text>
                <TouchableOpacity onPress={() => refetch()} className="mt-4 bg-indigo-500 px-4 py-2 rounded-lg">
                    <Text className="text-white font-bold">Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={{ backgroundColor: theme.background }} className="flex-1">
            <View>
                <SecondaryHeader title="Assignment" />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    className='px-5'
                    contentContainerStyle={{ paddingBottom: 30 }}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
                    }
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
                                        <Text style={{ fontWeight: 800 }} className="text-[10px] text-indigo-600">{uniqueAssignments.length} Total</Text>
                                    </View>
                                </View>
                            </View>
                            <View className="w-10 h-10 bg-indigo-50 rounded-2xl items-center justify-center border border-indigo-100">
                                <Ionicons name="calendar" size={20} color="#4F46E5" />
                            </View>
                        </View>

                        <CustomTabs tabs={['Pending', 'Submitted']} activeTab={activeTab} setActiveTab={setActiveTab} />

                        {/* --- List Items --- */}
                        <View className="space-y-3">
                            {filteredAssignments.map((item, index) => {
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
                                                    {item.subjectName}
                                                </Text>
                                                <View className="flex-row items-center">
                                                    <View className="flex-row items-center">
                                                        <View className="bg-slate-100 px-2 py-0.5 rounded mr-2">
                                                            <Text style={{ fontWeight: 700 }} className="text-[10px] text-slate-500 uppercase">
                                                                {item.subjectCode}
                                                            </Text>
                                                        </View>
                                                        {/* <Text className="text-[10px] text-slate-400 font-medium">
                                                            Due: {formatDate(item.dueDate)}
                                                        </Text> */}
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
                                                    Title: <Text className="text-slate-600">{item.title}</Text>
                                                </Text>
                                                <Text style={{ fontWeight: 800 }} className="text-[10px] uppercase text-slate-400 mb-2 pl-1">
                                                    Questions:
                                                </Text>
                                                {item.questions && item.questions.map((q, i) => (
                                                    <View key={q.id} className="flex-row items-start mb-2 last:mb-0">
                                                        <Text className="text-xs text-indigo-500 font-bold mr-2 mt-0.5">{i + 1}.</Text>
                                                        <Text className="text-xs text-slate-600 flex-1 leading-5 font-medium">
                                                            {q.questionText || q.text || q.question}
                                                        </Text>
                                                    </View>
                                                ))}
                                                {(!item.questions || item.questions.length === 0) && (
                                                    <Text className="text-xs text-slate-400 italic pl-1">No questions available.</Text>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </View>

                        {/* --- Empty State Handling --- */}
                        {filteredAssignments.length === 0 && (
                            <View className="items-center justify-center py-8 opacity-50">
                                <Ionicons name="documents-outline" size={40} color="#94a3b8" />
                                <Text style={{ fontWeight: 700 }} className="text-slate-400 text-xs mt-2">No {activeTab} Assignments</Text>
                            </View>
                        )}
                    </Card>
                </ScrollView>
            </View>
        </View >
    );
};

export default ModernAssignments;
