import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";

import Splash1 from "../components/splash1";
import Splash2 from "../components/splashScreen";
import GetStarted from "@/app/(auth)/index";

export default function splash() {
  const [screen, setScreen] = useState<"splash1" | "splash2" | "main">("splash1");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    fadeAnim.setValue(0); // Reset
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    fadeIn(); // Start first screen animation

    const timer1 = setTimeout(() => {
      setScreen("splash2");

    }, 1000);

    const timer2 = setTimeout(() => {
      setScreen("main");
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <View style={styles.container}>
      {screen === "splash1" && (
        <Animated.View style={[styles.fullscreen]}>
          <Splash1 />
        </Animated.View>
      )}
      {screen === "splash2" && (
        <Animated.View style={[styles.fullscreen, { opacity: fadeAnim }]}>
          <Splash2 />
        </Animated.View>
      )}
      {screen === "main" && (
        <View style={styles.fullscreen}>
          <GetStarted />
        </View>
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
