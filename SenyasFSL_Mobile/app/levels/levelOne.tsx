import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import React from "react";
import FSL_splash from "@/assets/svgs/FSL_loading_screen.svg";
import { LinearGradient } from "expo-linear-gradient";
import FSL from "@/assets/svgs/FSL.svg";
export default function levelOne() {
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 130 : 160;
  return (
    <View className="bg-[#FB990F] flex-1 items-center justify-center">
      <FSL_splash />
      <LinearGradient
        colors={["#FFC87A", "#EA0505"]} // orange to red
        start={{ x: 0, y: -0.1 }}
        end={{ x: 0, y: 0.9 }}
        style={{
          paddingHorizontal: 80, // This controls the thickness of the border
          width: "100%",
          height: "15%",
          backgroundColor: "white",
          elevation: 15,
          shadowColor: "black",
          marginHorizontal: "auto",
        }}
      >
        <View className="flex-row justify-center items-center ">
          <View>
            <Text className=" text-xl md:text-2xl text-white font-LilyScriptOneRegular text-center">
              Did you know?
            </Text>
            <Text className="font-NunitoBold text-sm md:text-lg text-white text-center">
              FSL is a distinct language on its own that has similarities and
              differences from other sign languages.
            </Text>
          </View>
          <View>
            <FSL width={svgSize} height={svgSize} />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({});
