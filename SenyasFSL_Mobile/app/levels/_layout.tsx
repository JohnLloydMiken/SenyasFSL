import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Slow from "@/assets/svgs/Slow_Vid.svg";
import { Stack } from "expo-router";
import BackToLevelsBtn from "@/components/authentication/BackToLevelsBtn";
import { router } from "expo-router";
import React, { useRef, useState, useMemo } from "react"; // 1. IMPORT useMemo
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Authbutton from "@/components/authentication/button";
import Wait from "@/assets/svgs/Wait.svg";
import Nomral from "@/assets/svgs/Slow.svg";
import { videoSpeed } from "@/utils/store/videoSpeed";
import MyIcon from "@/components/main_interface/MyIcon";
import { LevelData } from "@/utils/store/levelData";
// 2. IMPORT THE NEW COMPONENTS
import Toast from "react-native-toast-message";
import ReportBottomSheetContent from "@/components/main_interface/ReportBottomSheetContent"; // (Assuming this path is correct)

export default function _layout() {
  return (
    // 3. Add GestureHandlerRootView and Toast here
    <GestureHandlerRootView style={styles.container}>
      <BottomView />
      <Toast />
    </GestureHandlerRootView>
  );
}

// 4. BottomView will now contain ALL logic, refs, and components
const BottomView = () => {
  const [isPressed, setIsPressed] = useState(false);
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 220 : 300;

  // --- Refs ---
  const exitSheetRef = useRef<BottomSheet>(null); // Renamed from bottomSheetRef
  const reportSheetRef = useRef<BottomSheet>(null); // 5. ADD REF FOR REPORT SHEET

  // --- Snap Points ---
  const reportSnapPoints = useMemo(() => ["75%"], []);

  // --- Zustand State ---
  const playingSpeed = videoSpeed((state) => state.playingSpeed);
  const setSpeed = videoSpeed((state) => state.setSpeed);
  const LevelId = LevelData((state) => state.levelID)
  const LevelStep = LevelData((state) => state.levelStep)
  // --- Handlers ---
  const handleToggleSpeed = () => {
    const newSpeed = playingSpeed === 1 ? 0.5 : 1;
    setSpeed(newSpeed);
  };

  const handleOpenExitSheet = () => {
    setIsPressed(true); // Make sure exit content is visible
    exitSheetRef.current?.expand();
  };

  const handleCloseExitSheet = () => {
    exitSheetRef.current?.close();
    // You might want to set isPressed(false) on close
    // setIsPressed(false);
  };

  const handleOpenReportSheet = () => {
    reportSheetRef.current?.expand();
  };

  const handleCloseReportSheet = () => {
    reportSheetRef.current?.close();
  };

  return (
    <>
      {/* 6. Render the Stack directly, passing the handlers */}
      <Stack
        screenOptions={{
          headerLeft: () => <BackToLevelsBtn onPress={handleOpenExitSheet} />,
          headerRight: () => (
            <View className="flex flex-row justify-between items-center gap-2">
              <TouchableOpacity
                onPress={handleToggleSpeed}
                className="p-1 rounded-xl bg-[#F5F5F5]"
              >
                {playingSpeed === 0.5 ? (
                  <Slow width={25} height={25} />
                ) : (
                  <Nomral width={25} height={25} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                className="p-1 rounded-xl bg-red-600"
                onPress={handleOpenReportSheet} // 7. CONNECTED!
              >
                <MyIcon color="white" size={25} />
              </TouchableOpacity>
            </View>
          ),
          headerTitle: () => (
            <View className="w-11/12 h-6 rounded-full bg-[#FFEEB9] mx-auto" />
          ),
          headerShadowVisible: false,
        }}
      />

      {/* 8. Your Existing "Exit Lesson" Bottom Sheet */}
      <BottomSheet ref={exitSheetRef} snapPoints={["60%"]} index={-1}>
        <BottomSheetView style={styles.contentContainer}>
          {isPressed && ( // This state now correctly controls the content
            <View className="flex-1 w-full h-full justify-center items-center p-4">
              <View>
                <Wait width={svgSize} height={svgSize} />
              </View>
              <View>
                <Text className="text-center text-xl md:text-2xl font-PoppinsBold">
                  Wait, don’t go!
                </Text>
                <Text className="font-NunitoBold text-sm text-center md:text-lg">
                  You’re doing well! If you quit now, you’ll lose your progress
                  for this lesson.
                </Text>
              </View>
              <View className="w-full">
                <Authbutton
                  onPress={handleCloseExitSheet} // Use the close handler
                  content="Keep Learning"
                />
                <TouchableOpacity
                  onPress={() => {
                    router.push("/(main_interface)");
                  }}
                  className="w-full md:p-6 p-4 bg-[#FAF3E0] rounded-md border-[4px]  border-[#FB990F] "
                >
                  <Text className="text-2xl md:text-3xl text-center text-[#FB990F] font-PoppinsBold">
                    Exit Lesson
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </BottomSheetView>
      </BottomSheet>

      {/* 9. ADD THE NEW REPORT BOTTOM SHEET */}
      <BottomSheet
        ref={reportSheetRef}
        index={-1} // Start closed
        snapPoints={reportSnapPoints}
        enablePanDownToClose={true}
        backgroundStyle={styles.reportSheetBackground}
      >
        <ReportBottomSheetContent
          // 🚨 IMPORTANT 🚨
          // You must get these values from your game's state store (like Zustand or Context)
          levelId= {LevelId} // 👈 Replace with actual levelId
          currentStep={LevelStep} // 👈 Replace with actual currentStep
          onClose={handleCloseReportSheet}
        />
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 50,
  },
  contentContainer: {
    flex: 1,
    zIndex: 50,
  },
  reportSheetBackground: {
    backgroundColor: "#FAF3E0", // Match your form style
  },
});