// app/index.tsx
import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import Splash1 from "../components/authentication/splash1";
import Splash2 from "../components/authentication/splashScreen";
import GetStarted from "@/app/(auth)/index";
import { initDatabase } from "@/services/db/database";
import { syncData } from "@/services/syncService";
import DownloadingScreen from "../components/main_interface/DownloadingScreen"; // 👈 Import new screen

export default function Splash() {
  // 1. Updated state to include "downloading"
  const [screen, setScreen] = useState<
    "splash1" | "splash2" | "downloading" | "main"
  >("splash1");
  
  // 2. New state to track sync
  const [isSyncComplete, setIsSyncComplete] = useState(false);

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

  // 3. This effect runs once on app start
  useEffect(() => {
    // This function will run your setup and sync
    const initializeApp = async () => {
      // 1. Create the local tables
      initDatabase();
      console.log("APP START: Database initialized.");

      // 2. Start the sync process
      try {
        console.log("APP START: Kicking off data sync...");
        await syncData();
        console.log("APP START: Sync completed.");
      } catch (error) {
        console.error("APP START: Sync failed.", error);
        // You could add logic here to show a "Retry" button
      } finally {
        // 3. Mark sync as complete, whether it succeeded or failed
        setIsSyncComplete(true);
      }
    };

    // Start the app initialization
    initializeApp();

    // Start the splash screen timers
    fadeIn();
    const timer1 = setTimeout(() => {
      setScreen("splash2");
    }, 1000);

    const timer2 = setTimeout(() => {
      // 4. After 3 seconds, move to the "downloading" step
      setScreen("downloading");
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []); // Empty array ensures this runs only once

  // 5. This new effect watches for the sync to complete
  useEffect(() => {
    // If we are on the 'downloading' screen AND the sync is finished...
    if (screen === "downloading" && isSyncComplete) {
      // ...then, and only then, move to the main app (login)
      setScreen("main");
      slideIn();
    }
  }, [screen, isSyncComplete]); // Runs when 'screen' or 'isSyncComplete' changes

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

      {/* 6. New render logic:
        Show the DownloadingScreen if we are in the 'downloading' state
        AND the sync is NOT yet complete.
      */}
      {screen === "downloading" && !isSyncComplete && (
        <Animated.View style={[styles.fullscreen, { opacity: fadeAnim }]}>
          <DownloadingScreen />
        </Animated.View>
      )}

      {/* This will only render if screen === "main", which can only
        happen after the 'downloading' step is finished.
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