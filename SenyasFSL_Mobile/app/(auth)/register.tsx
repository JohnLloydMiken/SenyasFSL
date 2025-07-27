import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import React from "react";
import FSL_Hi from "@/assets/svgs/FSL_Hi.svg";
import Authbutton from "@/components/button";

export default function register() {
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 450 : 600;
  return (
    <View className="flex-1 bg-[#FAF3E0] items-center justify-start flex-col gap-16">
      <FSL_Hi width={svgSize} height={svgSize} />

      <View className="w-11/12 flex justify-center items-center flex-col md:gap-10">
        <Text className="text-3xl font-PoppinsBold md:text-5xl">
          Hi, I’m Senyas!
        </Text>
        <Text className="text-center text-xl md:text-2xl font-PoppinsRegular">
          Nice to meet you! Let’s start your Filipino Sign Language journey.
        </Text>
      </View>

      <View className="w-11/12 absolute bottom-12">
        <Authbutton
          content="Next"
          onPress={() => router.push("./register_whyFSL")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
