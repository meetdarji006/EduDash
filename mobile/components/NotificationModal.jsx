import { Feather, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";

// ==========================================
// 1. Config & Helpers
// ==========================================
const getNotificationTheme = (type) => {
    switch (type) {
        case 'success':
            return { icon: 'checkmark-circle', color: '#10B981', bg: 'bg-emerald-50' };
        case 'alert':
            return { icon: 'alert-circle', color: '#F43F5E', bg: 'bg-rose-50' };
        case 'info':
        default:
            return { icon: 'notifications', color: '#4F46E5', bg: 'bg-indigo-50' };
    }
};

// ==========================================
// 2. Notification Item Component
// ==========================================
const NotificationItem = ({ item }) => {
    const theme = getNotificationTheme(item.type);
    const isUnread = !item.read;

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            className={`flex-row p-4 mb-3 rounded-2xl border ${isUnread ? 'bg-indigo-50/30 border-indigo-100' : 'bg-white border-slate-50'
                }`}
        >
            {/* Icon Box */}
            <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${theme.bg}`}>
                <Ionicons name={theme.icon} size={18} color={theme.color} />

                {/* Unread Red Dot on Icon (Optional style) */}
                {isUnread && (
                    <View className="absolute top-0 right-0 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white" />
                )}
            </View>

            {/* Content */}
            <View className="flex-1">
                <View className="flex-row justify-between items-start mb-1">
                    <Text className={`text-sm font-bold ${isUnread ? 'text-slate-900' : 'text-slate-600'}`}>
                        {item.title}
                    </Text>
                    <Text className="text-[10px] font-bold text-slate-400 mt-0.5">
                        {item.time}
                    </Text>
                </View>
                <Text className="text-xs text-slate-500 font-medium leading-5" numberOfLines={2}>
                    {item.message}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

// ==========================================
// 3. Main Modal Component
// ==========================================
const NotificationModal = ({ visible, onClose }) => {

    // --- State Management ---
    const [notifications, setNotifications] = useState([
        { id: '1', type: 'alert', title: 'Assignment Missing', message: 'You missed the deadline for Data Structures Lab.', time: '2m ago', read: false },
        { id: '2', type: 'success', title: 'Grade Updated', message: 'Your Linear Algebra score has been updated to 92/100.', time: '1h ago', read: false },
        { id: '3', type: 'info', title: 'Class Rescheduled', message: 'Web Technologies class moved to Hall B-102.', time: '3h ago', read: true },
    ]);

    // --- Actions ---

    const markAllRead = () => {
        const updated = notifications.map(n => ({ ...n, read: true }));
        setNotifications(updated);
    };

    const clearAll = () => {
        setNotifications([]);
    };

    // SIMULATE PUSH: Function to add a new notification
    const pushRandomNotification = () => {
        const types = ['info', 'success', 'alert'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const newNotif = {
            id: Date.now().toString(),
            type: randomType,
            title: 'New Notification',
            message: 'This is a dynamic notification pushed to the list.',
            time: 'Just now',
            read: false,
        };
        setNotifications([newNotif, ...notifications]);
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-slate-900/50 justify-end">
                <TouchableOpacity className="absolute inset-0" onPress={onClose} />

                {/* Bottom Sheet Container */}
                <View className="h-[80%] bg-white rounded-t-[40px] shadow-2xl overflow-hidden">

                    {/* --- Header --- */}
                    <View className="px-6 pt-6 pb-4 border-b border-slate-50 bg-white z-10">
                        {/* Drag Handle */}
                        <View className="items-center mb-4">
                            <View className="w-10 h-1 bg-slate-200 rounded-full" />
                        </View>

                        <View className="flex-row justify-between items-end mb-2">
                            <View>
                                <Text style={{ fontWeight: 800 }} className="text-2xl text-slate-900">Notifications</Text>
                                <Text style={{ fontWeight: 800 }} className="text-slate-400 text-xs mt-1">
                                    You have <Text className="text-indigo-600">{notifications.filter(n => !n.read).length} unread</Text> messages
                                </Text>
                            </View>

                            {/* Clear/Read Actions */}
                            <TouchableOpacity onPress={notifications.length > 0 ? markAllRead : null}>
                                <Text style={{ fontWeight: 800 }} className="text-indigo-600 font-bold text-xs">Mark all read</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* --- List Content --- */}
                    <View className="flex-1 px-6 bg-white">
                        <FlatList
                            data={notifications}
                            keyExtractor={item => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
                            renderItem={({ item }) => <NotificationItem item={item} />}

                            // Empty State
                            ListEmptyComponent={() => (
                                <View className="items-center justify-center py-20 opacity-60">
                                    <View className="w-20 h-20 bg-slate-50 rounded-full items-center justify-center mb-4">
                                        <Feather name="bell-off" size={32} color="#cbd5e1" />
                                    </View>
                                    <Text style={{ fontWeight: 800 }} className="text-slate-900 text-lg">All caught up!</Text>
                                    <Text className="text-slate-400 text-sm text-center px-10 mt-1">
                                        You have no new notifications at this moment.
                                    </Text>
                                </View>
                            )}
                        />
                    </View>

                    {/* --- Demo Footer (For testing push) --- */}
                    <View className="p-4 border-t border-slate-100 bg-slate-50 flex-row justify-between items-center">
                        <TouchableOpacity
                            onPress={clearAll}
                            className="px-4 py-3"
                        >
                            <Text style={{ fontWeight: 800 }} className="text-slate-400 text-xs">Clear All</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={pushRandomNotification}
                            className="bg-slate-900 px-5 py-3 rounded-xl flex-row items-center shadow-lg shadow-slate-300"
                        >
                            <Feather name="plus" size={16} color="white" style={{ marginRight: 6 }} />
                            <Text style={{ fontWeight: 800 }} className="text-white text-xs">Simulate Push</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
};

export default NotificationModal;
