import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import SecondaryHeader from "../../components/SecondaryHeader";
import Text from "../../components/ui/Text";

// ==========================================
// Helpers & Config
// ==========================================
const getSubjectIcon = (subjectName) => {
    const lower = subjectName.toLowerCase();
    if (lower.includes('data') || lower.includes('algo')) return { name: 'git-branch', color: '#6366f1', bg: 'bg-indigo-50' };
    if (lower.includes('database') || lower.includes('sql')) return { name: 'server', color: '#0ea5e9', bg: 'bg-sky-50' };
    if (lower.includes('math') || lower.includes('algebra')) return { name: 'trello', color: '#8b5cf6', bg: 'bg-violet-50' }; // using trello as math symbol abstract
    if (lower.includes('skill') || lower.includes('comm')) return { name: 'users', color: '#f59e0b', bg: 'bg-amber-50' };
    if (lower.includes('web')) return { name: 'globe', color: '#ec4899', bg: 'bg-pink-50' };
    return { name: 'book', color: '#64748b', bg: 'bg-slate-50' };
};

// ==========================================
// Sub-Components
// ==========================================

// 1. Stat Box (Clean & Big)
const ProfileStat = ({ label, value, icon }) => (
    <View className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 items-center justify-center shadow-sm shadow-slate-100 mx-1">
        <View className="w-8 h-8 bg-indigo-50 rounded-full items-center justify-center mb-2">
            <Feather name={icon} size={14} color="#4F46E5" />
        </View>
        <Text style={{ fontWeight: 800 }} className="text-lg text-slate-900">{value}</Text>
        <Text style={{ fontWeight: 700 }} className="text-[10px] text-slate-400 uppercase ">{label}</Text>
    </View>
);

// 2. Subject Row (Modern List)
const SubjectItem = ({ code, name }) => {
    const iconData = getSubjectIcon(name);
    return (
        <View className="flex-row items-center bg-white p-3.5 rounded-2xl border border-slate-100 mb-3 shadow-sm shadow-slate-50">
            {/* Smart Icon */}
            <View className={`w-12 h-12 ${iconData.bg} rounded-xl items-center justify-center mr-4 border border-white shadow-sm`}>
                <Feather name={iconData.name} size={18} color={iconData.color} />
            </View>

            {/* Text Details */}
            <View className="flex-1 pr-2">
                <Text style={{ fontWeight: 700 }} className="text-slate-800 text-sm mb-1" numberOfLines={1}>
                    {name}
                </Text>
                <View className="flex-row items-center">
                    <View className="bg-slate-100 px-2 py-0.5 rounded-md">
                        <Text style={{ fontWeight: 700 }} className="text-[10px] text-slate-500 uppercase">{code}</Text>
                    </View>
                </View>
            </View>

            {/* Chevron */}
            <Feather name="chevron-right" size={18} color="#cbd5e1" />
        </View>
    );
};

// 3. Settings Menu Item
const MenuItem = ({ icon, label, onPress, isDestructive }) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className="flex-row items-center bg-white p-4 rounded-2xl mb-2 border border-slate-100 shadow-sm shadow-slate-50"
    >
        <View className={`w-9 h-9 rounded-xl items-center justify-center mr-4 ${isDestructive ? 'bg-rose-50' : 'bg-slate-50'}`}>
            <Feather name={icon} size={16} color={isDestructive ? '#F43F5E' : '#64748B'} />
        </View>
        <Text style={{ fontWeight: 700 }} className={`flex-1 text-sm ${isDestructive ? 'text-rose-600' : 'text-slate-700'}`}>
            {label}
        </Text>
        <Feather name="chevron-right" size={16} color="#e2e8f0" />
    </TouchableOpacity>
);

// ==========================================
// Main Screen
// ==========================================
import { useAuth } from "../../context/AuthContext";

export default function ProfileScreen() {
    const router = useRouter();
    const { signOut } = useAuth();
    const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);

    const handleSignOut = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", onPress: signOut, style: "destructive" }
            ]
        );
    };

    const user = {
        firstName: "Meet",
        lastName: "Darji",
        id: "2021-CS-045",
        course: "B.Tech CSE",
        semester: "6th Sem",
        email: "rahul.sharma@college.edu",
        subjects: [
            { code: "CS-301", name: "Data Structures & Algorithms" },
            { code: "CS-302", name: "Database Management Systems" },
            { code: "MA-201", name: "Linear Algebra" },
            { code: "CS-310", name: "Web Technologies Lab" }
        ]
    };

    return (
        <View className="flex-1 mx-5 bg-[#f4f4f4]">
            <SecondaryHeader title="Profile" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                {/* --- 1. HEADER & AVATAR --- */}
                <View className="items-center mt-6 mb-8">
                    <View className="relative">
                        <View className="w-28 h-28 bg-white rounded-full p-1 border-2 border-indigo-100 mb-4 shadow-sm">
                            <View className="flex-1 bg-indigo-600 rounded-full items-center justify-center">
                                <Text style={{ fontWeight: 800 }} className="text-3xl text-white">
                                    {user.firstName[0]}{user.lastName[0]}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <Text style={{ fontWeight: 800 }} className="text-2xl text-slate-900 mb-1">
                        {user.firstName} {user.lastName}
                    </Text>
                    <Text style={{ fontWeight: 700 }} className="text-slate-400 text-xs uppercase tracking-wider">{user.id}</Text>
                </View>

                {/* --- 2. KEY STATS (No Credits) --- */}
                <View className="mb-8 flex-row">
                    <ProfileStat label="Program" value="B.Tech" icon="book-open" />
                    <ProfileStat label="Semester" value="6th" icon="calendar" />
                    <ProfileStat label="CGPA" value="9.2" icon="award" />
                </View>

                {/* --- 3. ENROLLED SUBJECTS --- */}
                <View className="mb-8">
                    <View className="flex-row justify-between items-end mb-4 px-1">
                        <Text style={{ fontWeight: 700 }} className="text-slate-400 text-[10px] uppercase ">
                            Academics
                        </Text>
                        <Text style={{ fontWeight: 700 }} className="text-indigo-600 text-xs">
                            {user.subjects.length} Subjects
                        </Text>
                    </View>

                    <View>
                        {user.subjects.map((sub, index) => (
                            <SubjectItem key={index} code={sub.code} name={sub.name} />
                        ))}
                    </View>
                </View>

                {/* --- 4. PREFERENCES --- */}
                <View className="flex-1">
                    <Text style={{ fontWeight: 700 }} className="text-slate-400 text-[10px] uppercase  mb-3 ml-1">
                        Options
                    </Text>

                    <MenuItem icon="lock" label="Change Password" onPress={() => setPasswordModalVisible(true)} />
                    <MenuItem icon="bell" label="Notifications" onPress={() => { }} />

                    <View className="mt-2">
                        <MenuItem icon="log-out" label="Sign Out" isDestructive onPress={handleSignOut} />
                    </View>
                </View>

            </ScrollView>

            {/* Change Password Modal */}
            <Modal visible={isPasswordModalVisible} transparent animationType="slide" onRequestClose={() => setPasswordModalVisible(false)}>
                <View className="flex-1 bg-slate-900/40 justify-end">
                    <TouchableOpacity className="absolute inset-0" onPress={() => setPasswordModalVisible(false)} />
                    <View className="bg-white rounded-t-[32px] p-6 pb-10">
                        <View className="items-center mb-6">
                            <View className="w-12 h-1.5 bg-slate-200 rounded-full" />
                        </View>
                        <Text style={{ fontWeight: 700 }} className="text-xl text-slate-900 mb-6">Update Security</Text>

                        <View className="space-y-4 mb-6">
                            <View className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                                <Text style={{ fontWeight: 700 }} className="text-[10px] text-slate-400 uppercase mb-1">New Password</Text>
                                <TextInput style={{ fontWeight: 700 }} secureTextEntry className="text-slate-900 text-base" placeholder="••••••••" />
                            </View>
                            <View className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                                <Text style={{ fontWeight: 700 }} className="text-[10px] text-slate-400 mt-2 uppercase mb-1">Confirm Password</Text>
                                <TextInput style={{ fontWeight: 700 }} secureTextEntry className="text-slate-900 font-bold text-base" placeholder="••••••••" />
                            </View>
                        </View>

                        <TouchableOpacity className="bg-indigo-600 h-14 rounded-2xl items-center justify-center">
                            <Text style={{ fontWeight: 700 }} className="text-white text-base">Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal >

        </View >
    );
}
