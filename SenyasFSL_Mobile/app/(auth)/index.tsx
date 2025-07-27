import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { useFonts } from "expo-font";
import React from "react";
import "../../global.css";
import Authbutton from "@/components/button";
import FSL_start from "@/assets/svgs/FSL_start.svg";

export default function getStarted() {
  const { width } = useWindowDimensions();

  const svgSize = width < 768 ? 450 : 600;

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <FSL_start width={svgSize} height={svgSize} />
      </View>
      <View className="w-11/12 ">
        <Text className=" text-center font-PoppinsRegular text-2xl md:text-3xl">
          Start Learning
        </Text>
        <Text className="font-PoppinsBold text-center text-3xl md:text-4xl p-2">
          Filipino Sign Language
        </Text>
      </View>

      <View className=" w-11/12 absolute bottom-12">
        <Authbutton
          content="Get Started"
          onPress={() => router.push("./register")}
        />
        <TouchableOpacity
          onPress={() => router.push("./login")}
          className="w-full md:p-6 p-4 bg-[#FAF3E0] rounded-md border-[4px]  border-[#FB990F] "
        >
          <Text className="text-2xl md:text-3xl text-center text-[#FB990F] font-PoppinsBold">
            I have already an account
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF3E0",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: 10,
  },
});
