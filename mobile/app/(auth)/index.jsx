// import { View, Text } from 'react-native'
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AuthScreen = () => {
    const router = useRouter();
    return (
        <SafeAreaView className="flex-1 bg-white px-6 items-center justify-center">
            <View className="w-full h-96">
                <Image
                    source={require("../../assets/intro1.png")}
                    className="w-full h-full mb-16"
                    resizeMode="contain"
                />
            </View>

            <Text style={{ fontWeight: 700 }} className="text-3xl font-bold text-gray-900 text-center">
                Welcome to EduDash
            </Text>
            <Text className="textgrayy-500 text-center mt-2 mb-10">
                Manage attendance, assignments & performance in one place.
            </Text>

            <TouchableOpacity
                onPress={() => router.push("(auth)/login")}
                className="bg-blue-600 py-3 px-8 rounded-2xl w-full"
            >
                <Text style={{ fontWeight: 700 }} className="text-white text-center font-semibold text-lg">
                    Get Started
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
export default AuthScreen
