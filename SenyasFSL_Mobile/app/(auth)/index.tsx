import FSL_start from "@/assets/svgs/FSL_start.svg";
import Authbutton from "@/components/authentication/button";
import { router } from "expo-router";
import { NativeModules, Platform } from "react-native";
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

// ✅ TypeScript interface for SignLanguage module
interface SignLanguageModule {
  loadModel(): Promise<string>;
  predict(landmarks: number[]): Promise<{
    prediction: number;
    confidence: number;
    probabilities: number[];
  }>;
}

// ✅ Type the NativeModules
interface NativeModulesType {
  SignLanguage: SignLanguageModule;
}

const { SignLanguage } = NativeModules as NativeModulesType;

export default function GetStarted() {
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 400 : 600;

  // ✅ Existing Firestore test
  useEffect(() => {
    const runTest = async () => {
      try {
        await testWrite();
        await testRead();
      } catch (err) {
        console.error("❌ Firestore test failed:", err);
      }
    };
    runTest();
  }, []);

  // ✅ Fixed model testing
  useEffect(() => {
    async function testModel() {
      try {
        // Check if SignLanguage module is available
        if (!SignLanguage) {
          console.error("❌ SignLanguage module not found");
          if (Platform.OS === 'ios') {
            console.log("📱 Note: Make sure iOS native module is properly linked");
          } else if (Platform.OS === 'android') {
            console.log("📱 Note: Make sure Android native module is properly registered");
          }
          return;
        }

        // Load the model
        console.log("🔄 Loading model...");
        const msg = await SignLanguage.loadModel();
        console.log("✅ Model load:", msg);

        // ✅ Create proper test data: 30 frames × 63 features = 1890 values
        const SEQUENCE_LENGTH = 30;
        const FEATURES_PER_FRAME = 63;
        const totalFeatures = SEQUENCE_LENGTH * FEATURES_PER_FRAME;
        
        console.log(`🧪 Creating test landmarks: ${totalFeatures} values`);
        const dummyLandmarks: number[] = Array.from(
          { length: totalFeatures }, 
          () => Math.random() * 2 - 1 // Random values between -1 and 1
        );

        // Make prediction
        console.log("🔄 Running prediction...");
        const result = await SignLanguage.predict(dummyLandmarks);
        
        // ✅ Better logging with class names
        const classNames = [
          "A", "B", "C", "D", "E", "F", "G", "H", "I",
          "K", "L", "M", "N", "O", "P", "Q", "R", "S", 
          "T", "U", "V", "W", "X", "Y", "J", "Ñ", "NG", "Z"
        ];
        
        const predictedClass = classNames[result.prediction] || "Unknown";
        
        console.log("✅ Prediction successful!");
        console.log(`📊 Results:`);
        console.log(`   Predicted class: ${predictedClass} (index: ${result.prediction})`);
        console.log(`   Confidence: ${(result.confidence * 100).toFixed(2)}%`);
        console.log(`   Input size: ${dummyLandmarks.length} features`);
        
        // Show top 3 predictions
        const topPredictions = result.probabilities
          .map((prob, index) => ({ class: classNames[index], probability: prob, index }))
          .sort((a, b) => b.probability - a.probability)
          .slice(0, 3);
        
        console.log(`🔝 Top 3 predictions:`);
        topPredictions.forEach((pred, i) => {
          console.log(`   ${i + 1}. ${pred.class}: ${(pred.probability * 100).toFixed(2)}%`);
        });

      } catch (err: any) {
        console.error("❌ Error running model:", err);
        
        // ✅ More helpful error messages
        if (err?.code === 'LOAD_ERROR') {
          console.error("💡 Model loading failed. Check if FSL_letter_module.tflite is in assets folder");
        } else if (err?.code === 'INPUT_ERROR') {
          console.error("💡 Input size mismatch. Expected 1890 values (30 × 63)");
        } else if (err?.code === 'PREDICT_ERROR') {
          console.error("💡 Prediction failed. Model might not be loaded properly");
        }
        
        // Log full error details
        console.error("📋 Error details:", {
          message: err?.message,
          code: err?.code,
          stack: err?.stack
        });
      }
    }

    // ✅ Add delay to ensure app is fully loaded
    const timer = setTimeout(testModel, 1000);
    
    return () => clearTimeout(timer);
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