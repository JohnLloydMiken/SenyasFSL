import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import BGComponent from "@/assets/svgs/bg 1.svg";
import TutorialSVG from "@/assets/svgs/Tutorial.svg";
import Settings from "@/components/main_interface/Settings";
import SoundSettings from "@/components/main_interface/SoundSettings";
import Tutorial from "@/components/main_interface/Tutorial";
import RenderLevelBase from "@/modules/RenderLevel";
import { getSectionsData } from "@/services/gameService";
import { Section } from "@/shared/types";
import { useAuthStore } from "@/utils/store/useAuthStore";
import { useUserStore } from "@/utils/store/useUserStore";
import { useAudioPlayer } from "expo-audio";

const audioSource = require("@/assets/audio/bg_music.mp3");

// ✅ Memoized components
const BG = React.memo(BGComponent);
const RenderLevel = React.memo(RenderLevelBase);

export default function Index() {
  const player = useAudioPlayer(audioSource);
  const sectionRefs = useRef<React.RefObject<HTMLElement | null>[]>([]);
  const [isPressed, setIsPressed] = useState(false);
  const [tutorialPressed, setTutorialPressed] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const { user, loading: authLoading } = useAuthStore();
  const { userData, loading: userLoading } = useUserStore();

 

  // ✅ Fetch sections
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const data = await getSectionsData();
        sectionRefs.current = data.map(() => React.createRef());
        setSections(data);
      } catch (error) {
        console.error("Failed to fetch map sections:", error);
      } finally {
        setIsMapLoading(false);
      }
    };
    fetchMapData();
  }, []);

  if (isMapLoading || userLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="bg-white flex-1 items-center">
      {/* Background */}
      <View className="w-full h-full absolute top-0 left-0">
        <BG width={"100%"} height={"100%"} scaleX={1.2} scaleY={1.2} />
      </View>

      {/* Render Level */}
      <RenderLevel sections={sections} />

      {/* Floating Buttons */}
      <View className="flex-col justify-center items-center absolute bottom-2 left-2 gap-2 z-50">
        <TouchableOpacity onPress={() => setTutorialPressed((prev) => !prev)}>
          <TutorialSVG />
        </TouchableOpacity>
        <Settings onPress={() => setIsPressed((prev) => !prev)} />
      </View>

      {/* Overlay */}
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
