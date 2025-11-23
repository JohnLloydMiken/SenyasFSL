// app/index.tsx
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import Splash1 from "../components/authentication/splash1";
import Splash2 from "../components/authentication/splashScreen";
import GetStarted from "@/app/(auth)/index";
import { initDatabase } from "@/services/db/database";
import { syncData } from "@/services/syncService";
import DownloadingScreen from "../components/main_interface/DownloadingScreen";
import { router } from "expo-router";
import { useAuthStore } from "@/utils/store/useAuthStore";

type ScreenState = "splash1" | "splash2" | "downloading" | "main";

export default function Splash() {
  const [screen, setScreen] = useState<ScreenState>("splash1");
  const [isSyncComplete, setIsSyncComplete] = useState(false);
  const [syncError, setSyncError] = useState<Error | null>(null);

  const syncStartedRef = useRef(false);
  const isMountedRef = useRef(true);

  const { user, loading: authLoading } = useAuthStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  // simple animations
  const fadeIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }).start();
  };
  const slideIn = () => {
    slideAnim.setValue(300);
    Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };

  // run once on mount: init DB and start splash sequence
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

    // splash timing: show splash1 -> splash2 -> downloading
    fadeIn();
    const t1 = setTimeout(() => setScreen("splash2"), 1000);
    const t2 = setTimeout(() => setScreen("downloading"), 1800);

    return () => {
      isMountedRef.current = false;
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // When we actually enter the 'downloading' screen, start sync (if not started)
  useEffect(() => {
    if (screen !== "downloading") return;

    // start animations for downloading UI
    fadeIn();

    if (syncStartedRef.current) return;
    syncStartedRef.current = true;

    let cancelled = false;

    (async () => {
      try {
        console.log("APP START: Beginning syncData()...");
        await syncData();
        if (cancelled) return;
        console.log("APP START: syncData completed.");
        if (isMountedRef.current) setIsSyncComplete(true);
      } catch (err) {
        console.error("APP START: syncData failed:", err);
        if (!cancelled && isMountedRef.current) {
          setSyncError(err as Error);
          setIsSyncComplete(true); // allow flow to continue even on error
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [screen]);

  // Routing decision: only when sync is done and auth loading finished
  useEffect(() => {
    if (!isSyncComplete) return; // wait for sync to finish
    if (authLoading) return; // wait for auth listener

    // If user is present -> go to main interface
    if (user) {
      console.log("APP START: user present, routing to main interface");
      // replace so splash isn't on the back stack
      router.replace("./(main_interface)/");
      return;
    }

    // No user -> show onboarding/auth screen
    setScreen("main");
    slideIn();
  }, [isSyncComplete, authLoading, user]);

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

      {screen === "downloading" && (
        <Animated.View style={[styles.fullscreen, { opacity: fadeAnim }]}>
          {/* Show DownloadingScreen while sync is in progress. The screen can itself reflect progress if your syncService provides callbacks. */}
          <DownloadingScreen/>
        </Animated.View>
      )}

      {screen === "main" && (
        <Animated.View style={[styles.fullscreen, { transform: [{ translateX: slideAnim }] }] }>
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
