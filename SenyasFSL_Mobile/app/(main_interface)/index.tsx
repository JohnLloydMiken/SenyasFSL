import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import BGComponent from "@/assets/svgs/bg 1.svg";
import TutorialSVG from "@/assets/svgs/Tutorial.svg";
import Settings from "@/components/main_interface/Settings";
import SoundSettings from "@/components/main_interface/SoundSettings";
import Tutorial from "@/components/main_interface/Tutorial";
import RenderLevelBase from "@/modules/RenderLevel";

// ✅ Memoize heavy components ONCE
const BG = React.memo(BGComponent);
const RenderLevel = React.memo(RenderLevelBase);

export default function Index() {
  const [isPressed, setIsPressed] = useState(false);
  const [tutorialPressed, setTutorialPressed] = useState(false);

  return (
    <View className="bg-white flex-1 items-center">
      {/* ✅ Background is now memoized */}
      <View className="w-full h-full absolute top-0 left-0">
        <BG width={"100%"} height={"100%"} scaleX={1.2} scaleY={1.2} />
      </View>

      {/* ✅ Heavy component is now memoized */}
      <RenderLevel />

      {/* Floating Buttons */}
      <View className="flex-col justify-center items-center absolute bottom-2 left-2 gap-2 z-50">
        <TouchableOpacity onPress={() => setTutorialPressed((prev) => !prev)}>
          <TutorialSVG />
        </TouchableOpacity>
        <Settings onPress={() => setIsPressed((prev) => !prev)} />
      </View>

      {/* ✅ Correct overlay condition */}
      {(isPressed || tutorialPressed) && (
        <View className="absolute w-full h-full left-0 top-0 bg-black/60 z-40" />
      )}

      {/* Modals */}
      {isPressed && <SoundSettings onPress={() => setIsPressed(false)} />}
      {tutorialPressed && <Tutorial onPress={() => setTutorialPressed(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    position: "relative",
  },
  gradientTrack: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
    height: 10,
    marginHorizontal: 16,
  },
  slider: {
    width: "100%",
    height: 40,
    position: "absolute",
    top: -15,
  },
});
