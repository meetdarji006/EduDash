import { ActivityIndicator, Image, Text, View } from "react-native";

export default function LoadingScreen() {
    return (
        <View className="flex-1 bg-white justify-center items-center">
            <View className="items-center">
                <Image
                    source={require("../../assets/logo.png")}
                    className="w-32 h-32 mb-6"
                    resizeMode="contain"
                />
                <Text style={{ fontFamily: 'Outfit_700' }} className="text-4xl text-slate-900 mb-8">EduDash</Text>
                <ActivityIndicator size="large" color="#4f46e5" />
            </View>
        </View>
    );
}
