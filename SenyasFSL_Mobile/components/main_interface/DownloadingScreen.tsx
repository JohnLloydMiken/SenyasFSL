// components/DownloadingScreen.tsx
import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
// We can reuse the splash SVG from your LevelSplashScreen
import FSL_splash from "@/assets/svgs/FSL_loading_screen.svg";

export default function DownloadingScreen() {
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 375 : 400;

  return (
    <View style={styles.container}>
      {/* Reusing your loading screen SVG for brand consistency */}
      <FSL_splash width={svgSize} height={svgSize} />

      <ActivityIndicator size="large" color="#FAF3E0" style={styles.spinner} />

      <Text style={styles.title}>Downloading Resources</Text>
      <Text style={styles.subtitle}>
        This may take a few minutes...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FB990F", // Your app's main background color
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  spinner: {
    marginVertical: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: "Poppins-Bold", // Using your loaded font
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Poppins-Regular", // Using your loaded font
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
});