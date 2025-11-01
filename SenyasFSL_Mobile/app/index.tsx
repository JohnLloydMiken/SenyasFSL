import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import Splash1 from "../components/authentication/splash1";
import Splash2 from "../components/authentication/splashScreen";
import GetStarted from "@/app/(auth)/index";
import { SafeAreaView } from "react-native-safe-area-context";
import { initDatabase } from '@/services/db/database'; // Adjust path
import { syncData } from '@/services/syncService';
export default function Splash() {
  const [screen, setScreen] = useState<"splash1" | "splash2" | "main">("splash1");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(500)).current; // Off-screen right

  useEffect(() => {
    // 1. Create the local tables
    initDatabase(); 

    // 2. Start the sync process
    // This will fetch from Firestore and save to SQLite
    console.log("APP START: Kicking off data sync...");
    syncData().then(() => {
      console.log("APP START: Sync completed.");
      // You could add a state 'isSyncComplete'
      // to only show the app after this is done.
    });

  }, []);

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

  useEffect(() => {
    fadeIn(); // Start splash1

    const timer1 = setTimeout(() => {
      setScreen("splash2");
    }, 1000);

    const timer2 = setTimeout(() => {
      setScreen("main");
      slideIn(); // Trigger slide in animation for main screen
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

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
