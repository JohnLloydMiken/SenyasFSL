// (main_interface)/index.tsx
// --- MODIFIED FILE ---

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

// --- NEW IMPORTS ---
import { useSignOfTheDay } from "@/hooks/useSignOfTheDay"; 
import SignOfTheDayModal from "@/components/main_interface/SignOfTheDayModal";
// --- IMPORT AUDIO STORE ---
import { useAudioStore } from "@/hooks/useAudioStore";
// --- END NEW IMPORTS ---

const audioSource = require("@/assets/audio/bg_music.mp3");

// ✅ Memoized components
const BG = React.memo(BGComponent);
const RenderLevel = React.memo(RenderLevelBase);

export default function Index() {
  const player = useAudioPlayer(audioSource);
  // --- GET VOLUME FROM STORE ---
  const { musicVolume } = useAudioStore();
  
  const sectionRefs = useRef<React.RefObject<HTMLElement | null>[]>([]);
  const [isPressed, setIsPressed] = useState(false);
  const [tutorialPressed, setTutorialPressed] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const { user, loading: authLoading } = useAuthStore();
  const { userData, loading: userLoading } = useUserStore();


  // --- NEW STATE FOR SIGN OF THE DAY ---
  const [showSignOfTheDay, setShowSignOfTheDay] = useState(false);
  const [hasShownSignModal, setHasShownSignModal] = useState(false);
  const { signOfTheDay, isLoading: isSignLoading } = useSignOfTheDay();
  // --- END NEW STATE ---

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

  // --- NEW EFFECT to show modal on load ---
  useEffect(() => {
    if (
      !isMapLoading &&
      !userLoading &&
      !isSignLoading && 
      signOfTheDay &&
      !hasShownSignModal
    ) {
      setShowSignOfTheDay(true);
      setHasShownSignModal(true);
    }
  }, [isMapLoading, userLoading, isSignLoading, signOfTheDay, hasShownSignModal]);
  // --- END NEW EFFECT ---

  // --- NEW EFFECT TO PLAY AND CONTROL MUSIC ---
  useEffect(() => {
    if (player) {
      player.play();
      player.loop = true;
    }
    // Cleanup function to stop music when component unmounts
   
  }, [player]);

  // This effect updates the volume whenever it changes in the store
  useEffect(() => {
    if (player) {
      player.volume = musicVolume;
    }
  }, [player, musicVolume]);
  // --- END MUSIC EFFECTS ---


  if (isMapLoading || userLoading || (isSignLoading && !hasShownSignModal)) {
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
        {/* --- MODIFIED BUTTON LOGIC --- */}
        {hasShownSignModal ? (
          <TouchableOpacity
            onPress={() => setShowSignOfTheDay(true)}
            style={styles.signOfTheDayButton} 
          >
            <Text style={styles.signOfTheDayButtonText}>🌟</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setTutorialPressed((prev) => !prev)}>
            <TutorialSVG />
          </TouchableOpacity>
        )}
        {/* --- END MODIFIED LOGIC --- */}

        <Settings onPress={() => setIsPressed((prev) => !prev)} />
      </View>

      {/* Overlay */}
      {(isPressed || tutorialPressed) && (
        <View className="absolute w-full h-full left-0 top-0 bg-black/60 z-40" />
      )}

      {/* Modals */}
      {/* SoundSettings now needs no props for volume */}
      {isPressed && <SoundSettings onPress={() => setIsPressed(false)} />}
      {tutorialPressed && <Tutorial onPress={() => setTutorialPressed(false)} />}

      {/* --- RENDER SIGN OF THE DAY MODAL --- */}
      {showSignOfTheDay && signOfTheDay && (
        <SignOfTheDayModal
          sign={signOfTheDay}
          onClose={() => setShowSignOfTheDay(false)}
        />
      )}
      {/* --- END SOTD MODAL --- */}
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
  // --- NEW STYLES FOR SOTD BUTTON ---
  signOfTheDayButton: {
    width: 50, // Adjust size to match your TutorialSVG
    height: 50, // Adjust size to match your TutorialSVG
    borderRadius: 999,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signOfTheDayButtonText: {
    fontSize: 24,
  },
  // --- END NEW STYLES ---
});