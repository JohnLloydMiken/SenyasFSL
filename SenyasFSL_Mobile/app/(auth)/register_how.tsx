import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import React from "react";
import Authbutton from "@/components/button";
import { router } from "expo-router";
import Bride from "@/assets/svgs/bridge.svg";
import Dumbell from "@/assets/svgs/dumbell.svg";
import Mountain from "@/assets/svgs/mountain.svg";
export default function register_how() {
  const { width } = useWindowDimensions();

  const svgSize = width < 768 ? 50 : 80;
  return (
    <View className="flex-1 bg-[#FAF3E0] items-center justify-start flex-col gap-8">
      <Text className="text-2xl font-PoppinsBold md:text-3xl">
        Here’s how you benefit
      </Text>
      <View className="w-11/12 bg-white rounded-lg md:rounded-2xl p-4 gap-8 overflow-hidden">
        <View className="flex justify-between items-center flex-row w-full ">
          <Bride width={svgSize} height={svgSize} />
          <View className="md:w-10/12 ">
            <Text className="font-PoppinsBold text-xl md:text-2xl">
              Build bridges
            </Text>
            <Text className="text-lg md:text-xl font-PoppinsRegular w-72 md:w-full text-justify">
              1.5 billion people live with hearing loss. Through FSL, you bridge
              language barriers with the Deaf Community.
            </Text>
          </View>
        </View>
        <View className="flex justify-between items-center flex-row w-full ">
          <Dumbell width={svgSize} height={svgSize} />
          <View className="md:w-10/12 ">
            <Text className="font-PoppinsBold text-xl md:text-2xl">
              Excellent brain exercise
            </Text>
            <Text className="text-lg md:text-xl font-PoppinsRegular w-72 md:w-full text-justify">
              Learning FSL is a great way to exercise your brain, boost your
              memory, and stay sharp as you age.
            </Text>
          </View>
        </View>
        <View className="flex justify-between items-center flex-row w-full ">
          <Mountain width={svgSize} height={svgSize} />
          <View className="md:w-10/12 ">
            <Text className="font-PoppinsBold text-xl md:text-2xl">
              Challenge yourself
            </Text>
            <Text className="text-lg md:text-xl font-PoppinsRegular w-72 md:w-full text-justify">
              Challenging yourself to learn FSL can give you a big sense of
              accomplishment. Best of all, it’s fun and easy to learn!{" "}
            </Text>
          </View>
        </View>
      </View>
      <View className="w-11/12 absolute bottom-12">
        <Authbutton
          content="Next"
          onPress={() => router.push("/register_last")}
        ></Authbutton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
