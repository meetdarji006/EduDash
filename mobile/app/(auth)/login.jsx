import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Alert, Image, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "../../components/ui/Text";
import { useAuth } from "../../context/AuthContext";
import { useLoginMutation } from "../../hooks/useAuthMutations";


export default function LoginScreen() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const insets = useSafeAreaInsets();
    const { mutate: login, isPending } = useLoginMutation();
    const { signIn } = useAuth();

    const handleLogin = () => {
        if (!username || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        login({ username, password }, {
            onSuccess: ({ data }) => {
                // Assuming the API returns a token in data.token
                // Adjust based on actual API response structure
                console.log(data);
                const token = data.token;
                if (token) {
                    signIn(token);
                    router.replace("/(tabs)"); // Navigate to home/dashboard
                } else {
                    Alert.alert("Error", "Login failed: No token received");
                }
            },
            onError: (error) => {
                Alert.alert("Login Failed", error.response?.data?.message || error.message);
            }
        });
    }

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            extraHeight={40}
            extraScrollHeight={120}
        >
            <View className="flex-1 bg-blue-600 justify-end" style={{ paddingTop: insets.top + 5 }}>
                <StatusBar style="light" />
                <TouchableOpacity className='flex-row items-center p-4' onPress={() => router.back()}>
                    <Ionicons name='chevron-back-outline' color="#fff" size={24} />
                    {/* <Text className='text-white'>Back</Text> */}
                </TouchableOpacity>
                <View className="flex-1">
                    <Image
                        source={require("../../assets/login-show.png")}
                        className="h-[300px] w-full"
                        resizeMode="contain"
                    />
                </View>

                <View className="bg-white pb-14 w-full pt-6 px-8 rounded-s-3xl">
                    <View className="flex-row gap-2 mb-8">
                        <Ionicons name="school-outline" size={24} color="#2563eb" />
                        <Text style={{ fontWeight: 700 }} className="text-blue-600 font-bold text-2xl">EduDash</Text>
                    </View>
                    <Text style={{ fontWeight: 700 }} className="text-3xl font-bold text-gray-900 mb-1">
                        Welcome Back,
                    </Text>
                    <Text className="text-gray-500 text-lg mb-8">Good to see you again</Text>

                    <Text className="text-gray-600 mb-1">Email</Text>
                    <TextInput
                        placeholder="Enter your email"
                        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
                        // keyboardType="email-address"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />

                    <Text className="text-gray-600 mb-1">Password</Text>
                    <View className="border border-gray-300 rounded-xl flex-row items-center px-4">
                        <TextInput
                            placeholder="Enter password"
                            className="flex-1 py-3"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? "eye-off" : "eye"}
                                size={22}
                                color="gray"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        className={`mt-8 bg-blue-600 py-3 rounded-2xl ${isPending ? 'opacity-70' : ''}`}
                        onPress={handleLogin}
                        disabled={isPending}
                    >
                        <Text style={{ fontWeight: 700 }} className="text-white text-center font-semibold text-lg">
                            {isPending ? "Logging in..." : "Login"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}
