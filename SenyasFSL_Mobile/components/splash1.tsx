import { View, StyleSheet, useWindowDimensions, SafeAreaView } from "react-native";
import FSL_sign from "@/assets/svgs/FSL_sign.svg";

export default function Index() {

  const {width} = useWindowDimensions()
  const svgSize = width < 768 ? 300 : 500;
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <FSL_sign width={svgSize} height={svgSize} />
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
