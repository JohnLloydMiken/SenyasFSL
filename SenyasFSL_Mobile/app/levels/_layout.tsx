import React, { useRef, useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Stack, router } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Toast from "react-native-toast-message";

import BackToLevelsBtn from "@/components/authentication/BackToLevelsBtn";
import Authbutton from "@/components/authentication/button";
import Slow from "@/assets/svgs/Slow_Vid.svg";
import Nomral from "@/assets/svgs/Slow.svg";
import Wait from "@/assets/svgs/Wait.svg";
import MyIcon from "@/components/main_interface/MyIcon";
import ReportBottomSheetContent from "@/components/main_interface/ReportBottomSheetContent";
import { videoSpeed } from "@/utils/store/videoSpeed";
import { LevelData } from "@/utils/store/levelData";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MainLayout />
      <Toast />
    </GestureHandlerRootView>
  );
}

const MainLayout = () => {
  const [isExitVisible, setIsExitVisible] = useState(false);
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 220 : 300;

  // --- Bottom sheet refs ---
  const exitSheetRef = useRef<BottomSheet>(null);
  const reportSheetRef = useRef<BottomSheet>(null);

  // --- Snap points ---
  const exitSnapPoints = useMemo(() => ["60%"], []);
  const reportSnapPoints = useMemo(() => ["75%"], []);

  // --- Zustand state ---
  const playingSpeed = videoSpeed((state) => state.playingSpeed);
  const setSpeed = videoSpeed((state) => state.setSpeed);
  const LevelId = LevelData((state) => state.levelID);
  const LevelStep = LevelData((state) => state.levelStep);

  // --- Handlers ---
  const handleToggleSpeed = () => {
    const newSpeed = playingSpeed === 1 ? 0.5 : 1;
    setSpeed(newSpeed);
  };

  const handleOpenExitSheet = () => {
    setIsExitVisible(true);
    exitSheetRef.current?.expand();
  };

  const handleCloseExitSheet = () => {
    exitSheetRef.current?.close();
    setIsExitVisible(false);
  };

  const handleOpenReportSheet = () => {
    console.log("Opening report sheet...");
    reportSheetRef.current?.expand();
  };

  const handleCloseReportSheet = () => {
    reportSheetRef.current?.close();
  };

  return (
    <>
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

              {/* ✅ Report button now correctly triggers the sheet */}
              <TouchableOpacity
                className="p-1 rounded-xl bg-red-600"
                onPress={handleOpenReportSheet}
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

      {/* ✅ Exit Lesson Bottom Sheet */}
      <BottomSheet
        ref={exitSheetRef}
        index={-1}
        snapPoints={exitSnapPoints}
        enablePanDownToClose
        backgroundStyle={styles.sheetBackground}
        style={{ zIndex: 50 }}
      >
        <BottomSheetView style={styles.contentContainer}>
          {isExitVisible && (
            <View className="flex-1 w-full justify-center items-center p-4">
              <Wait width={svgSize} height={svgSize} />
              <View>
                <Text className="text-center text-xl md:text-2xl font-PoppinsBold">
                  Wait, don’t go!
                </Text>
                <Text className="font-NunitoBold text-sm text-center md:text-lg">
                  You’re doing well! If you quit now, you’ll lose your progress
                  for this lesson.
                </Text>
              </View>

              <View className="w-full mt-4">
                <Authbutton onPress={handleCloseExitSheet} content="Keep Learning" />

                <TouchableOpacity
                  onPress={() => router.push("/(main_interface)")}
                  className="w-full p-4 bg-[#FAF3E0] rounded-md border-[4px] border-[#FB990F] mt-3"
                >
                  <Text className="text-2xl text-center text-[#FB990F] font-PoppinsBold">
                    Exit Lesson
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </BottomSheetView>
      </BottomSheet>

      {/* ✅ Report Bottom Sheet */}
      <BottomSheet
        ref={reportSheetRef}
        index={-1}
        snapPoints={reportSnapPoints}
        enablePanDownToClose
        backgroundStyle={styles.reportSheetBackground}
        style={{ zIndex: 999 }}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <ReportBottomSheetContent
            levelId={LevelId || "unknown"}
            currentStep={LevelStep ?? 0}
            onClose={handleCloseReportSheet}
          />
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: "#FFF",
  },
  reportSheetBackground: {
    backgroundColor: "#FAF3E0",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
});
