import { Feather } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';
import { theme } from '../../constants/colors';
import { useNotification } from '../../context/NotificationContext';
import Text from "../ui/Text";

const HomeHeader = ({ userName = "", setScheduleModelopen }) => {
    const { openNotifications } = useNotification();
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' });
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

    return (
        <View className="px-6 py-4">
            {/* Top Row: Date Pill & Notification */}
            <View className="flex-row justify-between items-center mb-4">
                <View className="py-1.5 rounded-full flex-row items-center">
                    <Feather name="calendar" size={14} color="#6B7280" style={{ marginRight: 6 }} />
                    <Text style={{ fontWeight: 700 }} className="text-[#6B7280] text-xs uppercase">{today}</Text>
                </View>

                <TouchableOpacity onPress={openNotifications} className="relative p-2">
                    <Feather name="bell" size={24} color="#6B7280" />
                    {/* <View
                        className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" /> */}
                </TouchableOpacity>
            </View>

            {/* Bottom Row: Big Greeting & Schedule Action */}
            <View className="flex-row justify-between items-end mb-4">
                <View className='flex-1'>
                    <Text style={{ color: theme.gray }} className="text-lg">{greeting},</Text>
                    <Text style={{ fontWeight: 700, color: theme.text }} className="text-3xl">{userName} 👋</Text>
                </View>

                {/* Main Action Button (Schedule) */}
                <TouchableOpacity
                    className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200"
                    onPress={() => setScheduleModelopen(true)}
                >
                    <Feather name="calendar" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default HomeHeader;
