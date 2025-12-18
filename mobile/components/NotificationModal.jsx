import { Feather } from "@expo/vector-icons";
import { Modal, Text, TouchableOpacity, View } from "react-native";

const NotificationModal = ({ visible, onClose }) => {
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
                <View className="h-[40%] bg-white rounded-t-[40px] shadow-2xl overflow-hidden">

                    {/* --- Header --- */}
                    <View className="px-6 pt-6 pb-4 border-b border-slate-50 bg-white z-10">
                        {/* Drag Handle */}
                        <View className="items-center mb-4 relative">
                            <View className="w-10 h-1 bg-slate-200 rounded-full" />
                            <TouchableOpacity
                                onPress={onClose}
                                className="absolute right-0 -top-2 p-2 bg-slate-100 rounded-full"
                            >
                                <Feather name="x" size={20} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row justify-between items-end mb-2">
                            <View>
                                <Text style={{ fontWeight: 800 }} className="text-2xl text-slate-900">Notifications</Text>
                            </View>
                        </View>
                    </View>

                    {/* --- Content --- */}
                    <View className="flex-1 items-center justify-center bg-white pb-10">
                        <View className="w-16 h-16 bg-slate-50 rounded-full items-center justify-center mb-4">
                            <Feather name="bell-off" size={28} color="#cbd5e1" />
                        </View>
                        <Text style={{ fontWeight: 800 }} className="text-slate-900 text-lg">No notification available</Text>
                    </View>

                </View>
            </View>
        </Modal>
    );
};

export default NotificationModal;
