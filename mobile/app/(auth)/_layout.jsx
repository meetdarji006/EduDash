import { Redirect, Stack } from 'expo-router'
import { useAuth } from '../../context/AuthContext';

const AuthLayout = () => {
    const { userToken } = useAuth();

    if (userToken) {
        return <Redirect href="(tabs)" />
    }

    return <Stack screenOptions={{ headerShown: false }} />
}

export default AuthLayout
