import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from "expo-status-bar";
import * as Updates from 'expo-updates';
import { useEffect } from 'react';
import { View } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';
import "../global.css";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 1000 * 60,
            refetchOnWindowFocus: false
        }
    }
});

import LoadingScreen from '../components/ui/LoadingScreen';

function RootLayoutNav({ fontsLoaded }) {
    const { isLoading } = useAuth();

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded || isLoading) {
        return <LoadingScreen />;
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#f4f4f4" }}>
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

    useEffect(() => {
        async function checkUpdate() {
            try {
                const update = await Updates.checkForUpdateAsync();
                if (update.isAvailable) {
                    await Updates.fetchUpdateAsync();
                    await Updates.reloadAsync();
                }
            } catch (err) {
                console.log('Update check failed:', err);
            }
        }

        checkUpdate();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <NotificationProvider>
                    <RootLayoutNav fontsLoaded={fontsLoaded} />
                </NotificationProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
