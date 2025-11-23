// app/(auth)/welcome.tsx
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { router } from "expo-router";
import DownloadingScreen from "@/components/main_interface/DownloadingScreen";
import { syncData } from "@/services/syncService";
import { db } from "@/services/db/database";

export default function Welcome() {
  const [isChecking, setIsChecking] = useState(true);
  const [needsDownload, setNeedsDownload] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const syncStartedRef = useRef(false);

  // Check if resources are already downloaded
  const checkResourcesDownloaded = (): boolean => {
    try {
      // Check if we have any dictionary entries in local DB
      const result = db.getFirstSync<{ count: number }>(
        "SELECT COUNT(*) as count FROM DictionaryEntries"
      );
      
      const count = result?.count || 0;
      console.log(`WELCOME: Found ${count} dictionary entries in local DB`);
      
      return count > 0;
    } catch (error) {
      console.error("WELCOME: Error checking local resources:", error);
      return false;
    }
  };

  // Initial check on mount
  useEffect(() => {
    const hasResources = checkResourcesDownloaded();
    
    if (hasResources) {
      console.log("WELCOME: Resources already downloaded, going to main interface");
      // Resources exist, go directly to main interface
      router.replace("../(main_interface)/");
    } else {
      console.log("WELCOME: No resources found, need to download");
      // Need to download
      setNeedsDownload(true);
      setIsChecking(false);
      
      // Fade in the downloading screen
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }).start();
    }
  }, []);

  // Start sync when needsDownload is true
  useEffect(() => {
    if (!needsDownload || syncStartedRef.current) return;
    
    syncStartedRef.current = true;
    setIsSyncing(true);

    (async () => {
      try {
        console.log("WELCOME: Starting syncData...");
        await syncData();
        console.log("WELCOME: syncData completed successfully");
        
        // Navigate to main interface after successful sync
        router.replace("../(main_interface)/");
      } catch (error) {
        console.error("WELCOME: syncData failed:", error);
        // Even on error, proceed to main interface
        // User can try syncing again later or you can show an error
        router.replace("../(main_interface)/");
      } finally {
        setIsSyncing(false);
      }
    })();
  }, [needsDownload]);

  // Show nothing while checking (very brief)
  if (isChecking) {
    return <View style={styles.container} />;
  }

  // Show downloading screen if needed
  if (needsDownload) {
    return (
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <DownloadingScreen />
      </Animated.View>
    );
  }

  // Should never reach here, but just in case
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});