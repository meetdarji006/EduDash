import { Feather } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';

const TabLayout = () => {
    const { userToken } = useAuth();

    if (!userToken) {
        return <Redirect href="(auth)" />
    }

    const insets = useSafeAreaInsets();
    return (
        <View className='flex-1 bg-[#f4f4f4]' style={{ paddingTop: insets.top + 5 }}>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: "#6366F1",
                    tabBarInactiveTintColor: "#657786",
                    tabBarStyle: {
                        backgroundColor: "#f4f4f4",
                        borderTopWidth: 1,
                        borderTopColor: "#E1E8ED",
                        height: 65 + insets.bottom,
                        paddingTop: 8,
                    },
                    headerShown: false,
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "",
                        tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="attendance"
                    options={{
                        title: "",
                        tabBarIcon: ({ color, size }) => <Feather name="bar-chart-2" size={size} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="tests"
                    options={{
                        title: "",
                        tabBarIcon: ({ color, size }) => <Feather name="file-text" size={size} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="assignments"
                    options={{
                        title: "",
                        tabBarIcon: ({ color, size }) => <Feather name="book" size={size} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: "",
                        tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
                    }}
                />
            </Tabs>
        </View>
    )
}

export default TabLayout
