import React from "react";
import { View, Text, ActivityIndicator, StyleSheet, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import FSL_Hi from "@/assets/svgs/FSL_Hi.svg"
import { fslIconSize } from "@/utils/sizes";
// Make sure this path is correct for your logo


const GlobalLoadingScreen = ({ message = "Loading..." }: { message?: string }) => {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1 // Infinite repeat
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Background with slight opacity if needed, or just solid color */}
      <View style={styles.content}>
        {/* Use your app logo or a fun character image here */}
        <FSL_Hi width={fslIconSize()} height={fslIconSize()}/>
        
        {/* Custom animated spinner border around logo could go here if desired */}
        <ActivityIndicator size="large" color="#FB990F" style={styles.spinner} />

        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF3E0", // Matches your app's background theme
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999, // Ensure it's on top
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  spinner: {
    marginBottom: 20,
    transform: [{ scale: 1.5 }], // Make default spinner a bit bigger
  },
  text: {
    fontFamily: "PoppinsBold",
    fontSize: 18,
    color: "#555",
  },
});

export default GlobalLoadingScreen;