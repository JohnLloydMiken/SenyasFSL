import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import React from "react";
import Authbutton from "@/components/authentication/button";
import { router } from "expo-router";
import Last from "@/assets/svgs/FSL_last.svg";
export default function register_last() {
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 450 : 600;
  return (
    <View className="flex-1 bg-[#FAF3E0] items-center justify-start flex-col">
      <Last width={svgSize} height={svgSize} />
      <View className="w-11/12">
        <Text className="text-3xl md:text-4xl font-PoppinsBold text-center mb-2">
          Last step!
        </Text>
        <Text className="text-center text-xl font-PoppinsRegular md:text-2xl">
          Get ready to join learning a Filipino Sign Language with SenyasFSL.
        </Text>
      </View>

      <View className="w-11/12 absolute bottom-12">
        <Authbutton
          content="Commit to my goal"
          onPress={() => router.push("/sign_up")}
        ></Authbutton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
