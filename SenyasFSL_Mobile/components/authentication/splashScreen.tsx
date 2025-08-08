import {
  StyleSheet,
  SafeAreaView,
  View,
  useWindowDimensions,
} from "react-native";
import React from "react";
import FSL_loading_screen from "@/assets/svgs/FSL_loading_screen.svg";
export default function splashScreen() {
  const { width } = useWindowDimensions();

  const svgWidth = width < 768 ? 400 : 700;
  const svgHeight = width < 768 ? 400 : 600;

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <FSL_loading_screen
          width={svgWidth}
          height={svgHeight}
          style={{ marginRight: 20 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FB990F",
    justifyContent: "center",
    alignItems: "center",
  },
});
