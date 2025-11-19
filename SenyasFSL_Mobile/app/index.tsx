// app/index.tsx
// --- MODIFIED FILE ---

import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import Splash1 from "../components/authentication/splash1";
import Splash2 from "../components/authentication/splashScreen";
import GetStarted from "@/app/(auth)/index";
import { initDatabase } from "@/services/db/database";
import { syncData } from "@/services/syncService";
import DownloadingScreen from "../components/main_interface/DownloadingScreen";

// --- MODIFICATION: Import router and auth store ---
import { router } from "expo-router";
import { useAuthStore } from "@/utils/store/useAuthStore";
// --- END MODIFICATION ---

export default function Splash() {
  const [screen, setScreen] = useState<
    "splash1" | "splash2" | "downloading" | "main"
  >("splash1");
  
  const [isSyncComplete, setIsSyncComplete] = useState(false);
  
  // --- MODIFICATION: Get auth state ---
  const { user, loading: authLoading } = useAuthStore();
  // --- END MODIFICATION ---

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(500)).current; // Off-screen right

  const fadeIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  };

  const slideIn = () => {
    slideAnim.setValue(300); // Start off-screen right
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // This effect runs once on app start (no changes here)
  useEffect(() => {
    const initializeApp = async () => {
      initDatabase();
      console.log("APP START: Database initialized.");

      try {
        console.log("APP START: Kicking off data sync...");
        await syncData();
        console.log("APP START: Sync completed.");
      } catch (error) {
        console.error("APP START: Sync failed.", error);
      } finally {
        setIsSyncComplete(true);
      }
    };

    initializeApp();

    fadeIn();
    const timer1 = setTimeout(() => {
      setScreen("splash2");
    }, 1000);

    const timer2 = setTimeout(() => {
      setScreen("downloading");
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // --- MODIFICATION: This effect now handles the routing logic ---
  useEffect(() => {
    // We wait until 3 things are true:
    // 1. We are on the 'downloading' screen step
    // 2. The data sync is finished
    // 3. The auth listener has finished checking for a user
    if (screen === "downloading" && isSyncComplete && !authLoading) {
      
      // Now, we check if a user was found
      if (user) {
        // USER IS LOGGED IN: Go directly to the main app
        // We use 'replace' to clear the navigation stack
        router.replace("./(main_interface)/");
      } else {
        // NO USER: Show the login/register screen
        setScreen("main");
        slideIn();
      }
    }
  // We must add all the variables we check to the dependency array
  }, [screen, isSyncComplete, authLoading, user, router]); 
  // --- END MODIFICATION ---

  return (
    <View style={styles.container}>
      {screen === "splash1" && (
        <Animated.View style={styles.fullscreen}>
          <Splash1 />
        </Animated.View>
      )}
      {screen === "splash2" && (
        <Animated.View style={[styles.fullscreen, { opacity: fadeAnim }]}>
          <Splash2 />
        </Animated.View>
      )}

      {/* This logic is still correct. It will show the downloading screen
        while 'isSyncComplete' is false. Once it becomes true, the
        useEffect above will trigger and either redirect or set screen to 'main'.
      */}
      {screen === "downloading" && !isSyncComplete && (
        <Animated.View style={[styles.fullscreen, { opacity: fadeAnim }]}>
          <DownloadingScreen />
        </Animated.View>
      )}

      {/* This will now ONLY render if the useEffect decides there is
        no user and sets screen to 'main'.
      */}
      {screen === "main" && (
        <Animated.View
          style={[
            styles.fullscreen,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <GetStarted />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullscreen: {
    flex: 1,
  },
});