import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import { useUserQuery } from "../hooks/useUser";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [isTokenLoaded, setIsTokenLoaded] = useState(false);

    // Fetch user data if token exists
    const { data: userResponse, isLoading: isUserLoading, refetch } = useUserQuery(!!userToken);

    useEffect(() => {
        const isUserLoggedIn = async () => {
            try {
                const token = await SecureStore.getItemAsync("userToken");
                if (token) {
                    setUserToken(token);
                }
            } catch (e) {
                console.error("Failed to restore token", e);
            } finally {
                setIsTokenLoaded(true);
            }
        };

        isUserLoggedIn();
    }, []);

    const signIn = async (token) => {
        try {
            await SecureStore.setItemAsync("userToken", token);
            setUserToken(token);
            // Optionally refetch user data immediately?
            // The `enabled` prop on query depends on userToken, so it should trigger auto-fetch.
        } catch (e) {
            console.error("Failed to save token", e);
        }
    };

    const signOut = async () => {
        try {
            await SecureStore.deleteItemAsync("userToken");
            setUserToken(null);
            // QueryClient will need reset, or just rely on enabled=false
        } catch (e) {
            console.error("Failed to remove token", e);
        }
    };

    // Global loading state: waiting for token check OR (token exists AND waiting for user data)
    const isLoading = !isTokenLoaded || (!!userToken && isUserLoading);

    const user = userResponse?.data;

    return (
        <AuthContext.Provider value={{ userToken, userResponse, user, isLoading, signIn, signOut, refetchUser: refetch }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
