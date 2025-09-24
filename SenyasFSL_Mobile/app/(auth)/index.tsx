import FSL_start from "@/assets/svgs/FSL_start.svg";
import Authbutton from "@/components/authentication/button";
import { router } from "expo-router";
import { fslIconSize } from "@/utils/sizes";
import React, { useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import "../../global.css";

export default function GetStarted() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <FSL_start width={fslIconSize()} height={fslIconSize()} />
      </View>

      <View className="w-11/12">
        <Text className="text-center font-PoppinsRegular text-2xl md:text-3xl">
          Start Learning
        </Text>
        <Text className="font-PoppinsBold text-center text-3xl md:text-4xl p-2">
          Filipino Sign Language
        </Text>
      </View>

      <View className="w-11/12 absolute bottom-12">
        <Authbutton
          content="Get Started"
          onPress={() => router.replace("./register")}
        />
        <TouchableOpacity
          onPress={() => router.replace("./login")}
          className="w-full md:p-6 p-4 bg-[#FAF3E0] rounded-md border-[4px] border-[#FB990F]"
        >
          <Text className="text-2xl md:text-3xl text-center text-[#FB990F] font-PoppinsBold">
            I already have an account
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
