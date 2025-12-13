import { Feather, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import CustomTabs from "../CustomTabs";

// ==========================================
// Config & Theme
// ==========================================

const TYPE_THEME = {
    Lecture: {
        color: '#4F46E5',
        bg: 'bg-indigo-50',
        border: 'border-indigo-100',
        icon: 'book',
        lightText: 'text-indigo-600',
        badge: 'bg-indigo-100'
    },
    Lab: {
        color: '#F59E0B',
        bg: 'bg-amber-50',
        border: 'border-amber-100',
        icon: 'flask',
        lightText: 'text-amber-600',
        badge: 'bg-amber-100'
    }
};

// ==========================================
// Sub-Component: Timeline Class Card
// ==========================================
const TimelineCard = ({ item, isLast }) => {
    const theme = TYPE_THEME[item.type] || TYPE_THEME.Lecture;

    // Parse time for display (Assuming string like "09:00 AM - 10:30 AM")
    const startTime = item.time.split(' - ')[0];
    const duration = item.time.split(' - ')[1];

    return (
        <View className="flex-row items-start mb-2">

            {/* 1. Left Column: Time */}
            <View className="w-16 pt-3 items-end pr-3">
                <Text style={{ fontWeight: 800 }} className="text-slate-900 text-xs">{startTime}</Text>
                <Text style={{ fontWeight: 800 }} className="text-slate-400 text-[10px] mt-0.5">Start</Text>
            </View>

            {/* 2. Middle Column: Timeline Line & Dot */}
            <View className="items-center mr-3 pt-3">
                {/* The Dot */}
                <View className={`w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 ${item.type === 'Lab' ? 'bg-amber-500' : 'bg-indigo-500'}`} />
                {/* The Line (Only if not last) */}
                {!isLast && (
                    <View className="w-[2px] h-full bg-slate-100 absolute top-3 -z-0" />
                )}
            </View>

            {/* 3. Right Column: The Card */}
            <View className="flex-1 pb-6">
                <View className={`bg-white rounded-2xl p-4 border border-slate-100 shadow-sm shadow-slate-200/50 ${theme.bg}`}>

                    {/* Header: Badge & Icon */}
                    <View className="flex-row justify-between items-start mb-3">
                        <View className={`px-2 py-1 rounded-md ${theme.badge}`}>
                            <Text style={{ fontWeight: 800 }} className={`text-[10px] uppercase ${theme.lightText}`}>
                                {item.type}
                            </Text>
                        </View>
                        <Ionicons name="ellipsis-horizontal" size={16} color="#94a3b8" />
                    </View>

                    {/* Content */}
                    <Text style={{ fontWeight: 800 }} className="text-slate-900 text-base leading-5 mb-1">
                        {item.subject}
                    </Text>

                    <View className="flex-row items-center mb-3">
                        <Text style={{ fontWeight: 800 }} className="text-slate-500 text-xs mr-2">{item.code}</Text>
                        <View className="w-1 h-1 bg-slate-300 rounded-full mr-2" />
                        <Text style={{ fontWeight: 500 }} className="text-slate-400 text-xs">Until {duration}</Text>
                    </View>

                    {/* Footer: Location */}
                    <View className="flex-row items-center bg-white/60 p-2 rounded-xl self-start border border-white/50">
                        <Ionicons name="location-outline" size={14} color={theme.color} style={{ marginRight: 4 }} />
                        <Text style={{ fontWeight: 800 }} className="text-slate-600 text-xs">{item.location}</Text>
                    </View>

                </View>
            </View>
        </View>
    );
};

// ==========================================
// Main Modal Component
// ==========================================
const ScheduleModal = ({ visible, onClose }) => {
    const [activeTab, setActiveTab] = useState('Today');

    const SCHEDULE = {
        Today: [
            { id: 1, code: 'CS301', subject: 'Data Structures', type: 'Lecture', time: '09:00 AM - 10:30 AM', location: 'Hall A-203' },
            { id: 2, code: 'CS302', subject: 'Database Mgmt Systems', type: 'Lab', time: '11:00 AM - 01:00 PM', location: 'Lab Complex B' },
            { id: 3, code: 'MA201', subject: 'Linear Algebra', type: 'Lecture', time: '02:30 PM - 03:30 PM', location: 'Room 405' },
        ],
        Tomorrow: [
            { id: 4, code: 'CS305', subject: 'Operating Systems', type: 'Lecture', time: '10:00 AM - 11:30 AM', location: 'Hall C-101' },
            { id: 5, code: 'EN101', subject: 'Communication Skills', type: 'Lecture', time: '01:00 PM - 02:00 PM', location: 'Auditorium' },
        ]
    };

    const currentSchedule = SCHEDULE[activeTab] ?? [];

    return (
        <Modal
            animationType="slide"
            visible={visible}
            transparent
            statusBarTranslucent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end bg-slate-900/60">
                <TouchableOpacity className="absolute inset-0" onPress={onClose} />

                {/* Bottom Sheet */}
                <View className="h-[85%] bg-white rounded-t-[40px] overflow-hidden shadow-2xl">

                    {/* --- Header Area --- */}
                    <View className="px-6 pt-4 pb-2 bg-white z-10 border-b border-slate-50">

                        {/* Drag Handle */}
                        <View className="items-center mb-6 pt-2">
                            <View className="w-12 h-1.5 bg-slate-200 rounded-full" />
                        </View>

                        {/* Title Row */}
                        <View className="flex-row justify-between items-center mb-6">
                            <View>
                                <Text style={{ fontWeight: 800 }} className="text-slate-400 text-[10px] uppercase  mb-1">
                                    Academic Planner
                                </Text>
                                <Text style={{ fontWeight: 800 }} className="text-2xl text-slate-900">
                                    My Schedule
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={onClose}
                                className="w-10 h-10 bg-slate-50 rounded-full items-center justify-center border border-slate-100"
                            >
                                <Feather name="x" size={20} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        {/* Modern Segmented Control */}
                        <CustomTabs tabs={['Today', 'Tomorrow']} activeTab={activeTab} setActiveTab={setActiveTab} />
                    </View>

                    {/* --- Timeline Content --- */}
                    <ScrollView
                        className="flex-1 bg-white px-4 pt-6"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 40 }}
                    >
                        {currentSchedule.length > 0 ? (
                            <>
                                {/* Date Indicator */}
                                <View className="items-center mb-6">
                                    <View className="bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                        <Text style={{ fontWeight: 800 }} className="text-xs text-slate-500">
                                            {activeTab === 'today' ? 'Monday, Oct 24' : 'Tuesday, Oct 25'}
                                        </Text>
                                    </View>
                                </View>

                                {currentSchedule.map((item, index) => (
                                    <TimelineCard
                                        key={item.id}
                                        item={item}
                                        isLast={index === currentSchedule.length - 1}
                                    />
                                ))}
                            </>
                        ) : (
                            <View className="items-center justify-center py-20 opacity-60">
                                <View className="w-20 h-20 bg-slate-50 rounded-full items-center justify-center mb-4">
                                    <Feather name="calendar" size={32} color="#cbd5e1" />
                                </View>
                                <Text style={{ fontWeight: 800 }} className="text-slate-400 text-sm">No classes scheduled</Text>
                            </View>
                        )}
                    </ScrollView>

                    {/* --- Summary Footer --- */}
                    <View className="bg-slate-50/80 px-6 py-4 border-t border-slate-100 flex-row justify-between items-center">
                        <View className="flex-row items-center">
                            <View className="w-2 h-2 rounded-full bg-indigo-500 mr-2" />
                            <Text style={{ fontWeight: 800 }} className="text-xs text-slate-500 mr-4">Lecture</Text>

                            <View className="w-2 h-2 rounded-full bg-amber-500 mr-2" />
                            <Text style={{ fontWeight: 800 }} className="text-xs text-slate-500">Lab</Text>
                        </View>
                        <Text style={{ fontWeight: 800 }} className="text-xs text-slate-400">
                            {currentSchedule.length} Sessions
                        </Text>
                    </View>

                </View>
            </View>
        </Modal>
    );
};

export default ScheduleModal;
