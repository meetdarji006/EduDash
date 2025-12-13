import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from "expo-status-bar";
import { useCallback } from 'react';
import { View } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import "../global.css";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav({ fontsLoaded }) {
    const { isLoading } = useAuth();

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded && !isLoading) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, isLoading]);

    if (!fontsLoaded || isLoading) {
        return null; // Keep splash screen visible while loading
    }

    return (
        <View onLayout={onLayoutRootView} style={{ flex: 1, backgroundColor: "#f4f4f4" }}>
            <Stack screenOptions={{ headerShown: false }} />
            <StatusBar style="dark" />
        </View>
    );
}

export default function RootLayout() {

    const [fontsLoaded] = useFonts({
        'Outfit': require("../assets/fonts/outfit/Outfit-Regular.ttf"),
        'Outfit_300': require("../assets/fonts/outfit/Outfit-Light.ttf"),
        'Outfit_500': require("../assets/fonts/outfit/Outfit-Medium.ttf"),
        'Outfit_700': require("../assets/fonts/outfit/Outfit-Bold.ttf"),
    });

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RootLayoutNav fontsLoaded={fontsLoaded} />
            </AuthProvider>
        </QueryClientProvider>
    );
}
