import FSL_start from "@/assets/svgs/FSL_start.svg";
import Authbutton from "@/components/authentication/button";
import { router } from "expo-router";
import { NativeModules } from 'react-native';
import React, { useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import "../../global.css";
import { testRead, testWrite } from "@/test";

export default function getStarted() {
  const { width } = useWindowDimensions();
  const { SignLanguageModule } = NativeModules;
  const svgSize = width < 768 ? 400 : 600;

  // Test SignLanguageModule TFLite model
  useEffect(() => {
    if (SignLanguageModule && SignLanguageModule.predictSign) {
      // Dummy MediaPipe landmarks: 21 points, each [x, y, z]
      const dummyLandmarks = Array(21).fill([0.5, 0.5, 0.0]);

      // Test "letters" model
      SignLanguageModule.predictSign("letters", dummyLandmarks, (prediction: number | string) => {
        if (typeof prediction === "number") {
          console.log("📡 Model predicted letter index:", prediction);
        } else {
          console.error("⚠️ Model error:", prediction);
        }
      });
    } else {
      console.log("⚠️ SignLanguageModule is not linked or predictSign not available!");
    }
  }, []);

  // Existing Firestore test
  useEffect(() => {
    const runTest = async () => {
      await testWrite();
      await testRead();
    };
    runTest();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <FSL_start width={svgSize} height={svgSize} />
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
