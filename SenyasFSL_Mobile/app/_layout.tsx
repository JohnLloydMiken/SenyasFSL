// app/_layout.tsx
// --- MODIFIED FILE ---

import { useAuthStore } from "@/utils/store/useAuthStore";
// 🚫 import { useUserStore } from "@/utils/store/useUserStore"; // No longer needed
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "LilyScriptOne-Regular": require("../assets/fonts/LilyScriptOne-Regular.ttf"),
    "Nunito-Bold": require("../assets/fonts/Nunito-Bold.ttf"),
    "Poppins-LightItalic": require("../assets/fonts/Poppins-LightItalic.ttf"),
  });
  const queryClient = new QueryClient();
  const initAuthListener = useAuthStore((s) => s.initAuthListener);
  // 🚫 const user = useAuthStore((s) => s.user); // No longer needed here
  // 🚫 const { fetchUserData, clearUserData } = useUserStore(); // No longer needed

  useEffect(() => {
    const unsubscribeAuth = initAuthListener();

    return () => {
      if (typeof unsubscribeAuth === "function") unsubscribeAuth(); // ✅ safe check
    };
  }, []);

  // 🚫 This useEffect was causing the double load.
  // We remove it because components inside the app (like welcome.tsx
  // and (main_interface)/_layout.tsx) will now use useQuery
  // to fetch data when they need it, enabled by the 'user' auth state.
  /*
  useEffect(() => {
    if (user) fetchUserData(user);
    else clearUserData();
  }, [user]);
  */

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Slot />
        <Toast />
      </QueryClientProvider>
    </>
  );
}