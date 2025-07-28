import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import React from "react";
import { useState, useRef, useEffect } from "react";
import FSL_splash from "@/assets/svgs/FSL_loading_screen.svg";
import { LinearGradient } from "expo-linear-gradient";
import FSL from "@/assets/svgs/FSL.svg";
import { Animated } from "react-native";

export default function levelOne() {
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 130 : 160;

  return (
    <View className="bg-[#FB990F] flex-1 items-center justify-center">
      <FSL_splash />
      <View className={`absolute bottom-12 w-full h-max flex-col justify-center items-center gap-3`}>
        <LinearGradient
          colors={["#FFC87A", "#EA0505"]} // orange to red
          start={{ x: 0, y: -0.1 }}
          end={{ x: 0, y: 0.9 }}
          style={{
            paddingHorizontal: 80, // This controls the thickness of the border
            width: "100%",
            backgroundColor: "white",
            elevation: 8,
            shadowColor: "black",
            marginHorizontal: "auto",
          }}
        >
          <View className="flex-row justify-center items-center  ">
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
        <ProgressBar />
      </View>
    </View>
  );
}

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const animatedValue = React.useRef(new Animated.Value(progress)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 100,
      duration: 4000,
      useNativeDriver: false,
    }).start();
  }, []);

  const widthInterpolated = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View className="w-11/12 flex-col justify-center items-center">
      <Text className="font-LilyScriptOneRegular text-xl md:text-2xl text-center text-white my-2">
        Loading...
      </Text>
      <View className="w-full h-6 bg-white rounded-full p-1">
        <Animated.View
          style={{
            width: widthInterpolated,
            height: "100%",
          }}
        >
          <LinearGradient
            colors={["#ED0404", "#FDB249", "#480AF2"]} // red to yellow
            start={[0, 0]}
            end={[1, 0]}
            style={{ flex: 1, borderRadius: 50 }}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
