import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useAuthStore } from "@/utils/store/useAuthStore";
import { useUserStore } from "@/utils/store/useUserStore";
import Toast from 'react-native-toast-message';
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

   const initAuthListener = useAuthStore((s) => s.initAuthListener);
  const user = useAuthStore((s) => s.user);
  const { fetchUserData, clearUserData } = useUserStore();

  useEffect(() => {
    const unsubscribeAuth = initAuthListener();

    return () => {
      if (typeof unsubscribeAuth === "function") unsubscribeAuth(); // ✅ safe check
    };
  }, []);

  useEffect(() => {
    if (user) fetchUserData(user);
    else clearUserData();
  }, [user]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return (
  <>
  <Slot />
  <Toast/>
  </>
  );
}
