// app/index.tsx
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Splash1 from "../components/authentication/splash1";
import Splash2 from "../components/authentication/splashScreen";
import GetStarted from "@/app/(auth)/index";
import { initDatabase } from "@/services/db/database";
import { router } from "expo-router";
import { useAuthStore } from "@/utils/store/useAuthStore";

type ScreenState = "splash1" | "splash2" | "main";

const OFFLINE_USER_KEY = '@app_offline_user';

export default function Splash() {
  const [screen, setScreen] = useState<ScreenState>("splash1");
  const [offlineUser, setOfflineUser] = useState<any>(null);
  const [offlineChecked, setOfflineChecked] = useState(false);

  const isMountedRef = useRef(true);

  const { user, loading: authLoading } = useAuthStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  // Simple animations
  const fadeIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }).start();
  };
  const slideIn = () => {
    slideAnim.setValue(300);
    Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };

  // Load offline user data on mount
  useEffect(() => {
    (async () => {
      try {
        const userData = await AsyncStorage.getItem(OFFLINE_USER_KEY);
        if (userData) {
          setOfflineUser(JSON.parse(userData));
          console.log("APP START: Loaded offline user data");
        }
      } catch (error) {
        console.error("APP START: Failed to load offline user:", error);
      } finally {
        setOfflineChecked(true);
      }
    })();
  }, []);

  // Run once on mount: init DB and start splash sequence
  useEffect(() => {
    isMountedRef.current = true;

    (async () => {
      try {
        initDatabase();
        console.log("APP START: Database initialized.");
      } catch (e) {
        console.warn("APP START: initDatabase failed:", e);
      }
    })();

    // Splash timing: show splash1 -> splash2 -> determine next screen
    fadeIn();
    const t1 = setTimeout(() => setScreen("splash2"), 1000);

    return () => {
      isMountedRef.current = false;
      clearTimeout(t1);
    };
  }, []);

  // Routing decision: when auth loading is finished and offline check is done
  useEffect(() => {
    if (screen !== "splash2") return; // Only run after splash2
    if (!offlineChecked) return; // Wait for offline check
    if (authLoading) return; // Wait for auth listener

    // Check if user is authenticated (either online via Firebase or offline via cached data)
    const isAuthenticated = user || offlineUser;

    if (isAuthenticated) {
      console.log("APP START: User authenticated, routing to main interface");
      // User is logged in, go directly to main interface
      // The welcome screen will handle sync check if needed
      router.replace("./(main_interface)/");
      return;
    }

    // No user -> show onboarding/auth screen
    console.log("APP START: No user found, showing auth screen");
    setScreen("main");
    slideIn();
  }, [screen, offlineChecked, authLoading, user, offlineUser]);

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
        <Animated.View style={[styles.fullscreen, { transform: [{ translateX: slideAnim }] }]}>
          <GetStarted />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fullscreen: { flex: 1 },
});