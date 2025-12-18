import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
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
const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
};

const getSubjectIcon = (subjectName) => {
    if (!subjectName) return { name: 'book', color: '#64748b', bg: 'bg-slate-50' };
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
    const { signOut, user: userData, isLoading } = useAuth(); // Renaming 'user' to 'userData' to match existing logic
    const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);

    // No longer need local query, useAuth manages it
    const error = !userData && !isLoading; // Simple error assumption if no user data after loading

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

    if (isLoading) {
        return (
            <View className="flex-1 bg-[#f4f4f4] justify-center items-center">
                <SecondaryHeader title="Profile" />
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    if (error || !userData) {
        return (
            <View className="flex-1 bg-[#f4f4f4]">
                <SecondaryHeader title="Profile" />
                <View className="flex-1 justify-center items-center p-6">
                    <Feather name="alert-circle" size={48} color="#EF4444" />
                    <Text className="text-slate-600 font-bold mt-4 text-center">Failed to load profile</Text>
                    <TouchableOpacity onPress={() => router.replace("/(auth)/login")} className="mt-4 px-6 py-2 bg-indigo-600 rounded-lg">
                        <Text className="text-white font-bold">Details</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const { name, studentDetails, courseName, subjects = [] } = userData;
    const enrollment = studentDetails?.rollNo || "N/A";
    const semester = studentDetails?.semester ? `${studentDetails.semester}${getOrdinal(studentDetails.semester)} Sem` : "N/A";

    // Attempt to split name, fallback to full name or "Guest"
    const nameParts = name ? name.split(' ') : ["Guest", ""];

    // Construct initials properly
    const initials = name ?
        (nameParts[0][0] + (nameParts.length > 1 ? nameParts[1][0] : '')).toUpperCase()
        : "G";

    return (
        <View className="flex-1 bg-[#f4f4f4]">
            <SecondaryHeader title="Profile" />

            <ScrollView className='px-5' showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                {/* --- 1. HEADER & AVATAR --- */}
                <View className="items-center mt-6 mb-8">
                    <View className="relative">
                        <View className="w-28 h-28 bg-white rounded-full p-1 border-2 border-indigo-100 mb-4 shadow-sm">
                            <View className="flex-1 bg-indigo-600 rounded-full items-center justify-center">
                                <Text style={{ fontWeight: 800 }} className="text-3xl text-white">
                                    {initials}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <Text style={{ fontWeight: 800 }} className="text-2xl text-slate-900 mb-1">
                        {name}
                    </Text>
                    <Text style={{ fontWeight: 700 }} className="text-slate-400 text-xs uppercase tracking-wider">{enrollment}</Text>
                </View>

                {/* --- 2. KEY STATS (No Credits) --- */}
                <View className="mb-8 flex-row">
                    <ProfileStat label="Program" value={courseName.toUpperCase() || "N/A"} icon="book-open" />
                    <ProfileStat label="Semester" value={studentDetails?.semester || "-"} icon="calendar" />
                    <ProfileStat label="CGPA" value="-" icon="award" />
                </View>

                {/* --- 3. ENROLLED SUBJECTS --- */}
                <View className="mb-8">
                    <View className="flex-row justify-between items-end mb-4 px-1">
                        <Text style={{ fontWeight: 700 }} className="text-slate-400 text-[10px] uppercase ">
                            Academics
                        </Text>
                        <Text style={{ fontWeight: 700 }} className="text-indigo-600 text-xs">
                            {subjects.length} Subjects
                        </Text>
                    </View>

                    <View>
                        {subjects.length > 0 ? (
                            subjects.map((sub, index) => (
                                <SubjectItem key={sub.id || index} code={sub.code || `SUB-${index + 1}`} name={sub.name} />
                            ))
                        ) : (
                            <View className="bg-white p-4 rounded-2xl border border-slate-100 items-center">
                                <Text className="text-slate-400 text-sm">No subjects enrolled</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* --- 4. PREFERENCES --- */}
                <View className="flex-1">
                    <Text style={{ fontWeight: 700 }} className="text-slate-400 text-[10px] uppercase  mb-3 ml-1">
                        Options
                    </Text>

                    <MenuItem icon="lock" label="Change Password" onPress={() => setPasswordModalVisible(true)} />
                    {/* <MenuItem icon="bell" label="Notifications" onPress={() => { }} /> */}

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
                        <View className="items-center mb-6 relative">
                            <View className="w-12 h-1.5 bg-slate-200 rounded-full" />
                            <TouchableOpacity
                                onPress={() => setPasswordModalVisible(false)}
                                className="absolute right-0 -top-2 p-2 bg-slate-100 rounded-full"
                            >
                                <Feather name="x" size={20} color="#64748b" />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontWeight: 700 }} className="text-xl text-slate-900 mb-6">Update Security</Text>

                        <View className="space-y-4 mb-6">
                            <View className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                                <Text style={{ fontWeight: 700 }} className="text-[10px] text-slate-400 uppercase mb-1">New Password</Text>
                                <TextInput style={{ fontWeight: 700 }} secureTextEntry className="text-slate-900 text-base" placeholder="••••••••" />
                            </View>
                            <View className="mt-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
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
