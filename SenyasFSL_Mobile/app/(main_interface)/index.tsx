import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import BG from "@/assets/svgs/bg 1.svg";
import TutorialSVG from "@/assets/svgs/Tutorial.svg";
import Settings from "@/components/Settings";
import { useState } from "react";

import SoundSettings from "@/components/SoundSettings";
import Tutorial from "@/components/Tutorial";
import RenderLevel from "@/modules/RenderLevel";
export default function index() {
  const [isPressed, setIsPressed] = useState(false);
  const [tutorialPressed, setTutorialPressed] = useState(false);

  return (
    <View className="bg-white flex-1 items-center ">
      <View className="w-full h-full absolute top-0 left-0 ">
        <BG width={"100%"} height={"100%"} scaleX={1.2} scaleY={1.2} />
      </View>
      <RenderLevel/>
      <View className="flex-col justify-center items-center absolute bottom-2 left-2 gap-2">
        <TouchableOpacity onPress={() => setTutorialPressed(!tutorialPressed)}>
          <TutorialSVG />
        </TouchableOpacity>

        <Settings onPress={() => setIsPressed(!isPressed)} />
      </View>

      {isPressed ||
        (tutorialPressed && (
          <View className="absolute w-full h-full left-0 top-0 bottom-0 right-0 bg-black/60 z-40"></View>
        ))}
      {isPressed && <SoundSettings onPress={() => setIsPressed(!isPressed)} />}

      {tutorialPressed && (
        <Tutorial onPress={() => setTutorialPressed(!tutorialPressed)} />
      )}
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
