import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import Text from "./ui/Text";


const SecondaryHeader = ({ title }) => {
    const router = useRouter();

    return (
        <View className="flex-row items-center justify-between py-4 px-5">

            {/* LEFT: Back Button */}
            <TouchableOpacity
                onPress={() => router.back()}
                className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm shadow-gray-200"
            >
                <Ionicons name="chevron-back" size={24} color="#1F2937" />
            </TouchableOpacity>

            {/* CENTER: Title */}
            <Text style={{ fontWeight: 800 }} className="text-xl text-gray-800 tracking-wide">
                {title}
            </Text>

            {/* RIGHT: Action Button */}
            <TouchableOpacity className="relative w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm shadow-gray-200">
                <Feather name="bell" size={24} color="#1F2937" />

                <View className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </TouchableOpacity>
        </View>
    );
};

export default SecondaryHeader;
