// (main_interface)/index.tsx
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { useSignOfTheDay } from "@/hooks/useSignOfTheDay";
import SignOfTheDayModal from "@/components/main_interface/SignOfTheDayModal";
import { useAudioStore } from "@/hooks/useAudioStore";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "@/services/userService";
import SignOfTheDayIcon from "@/assets/svgs/SingOfTheDay.svg";

const audioSource = require("@/assets/audio/bg_music.mp3");

const BG = React.memo(BGComponent);
const RenderLevel = React.memo(RenderLevelBase);

// Helper function to get today's date string
const getTodayString = () => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};

export default function Index() {
  const player = useAudioPlayer(audioSource);
  const { musicVolume } = useAudioStore();

  const sectionRefs = useRef<React.RefObject<HTMLElement | null>[]>([]);
  const [isPressed, setIsPressed] = useState(false);
  const [tutorialPressed, setTutorialPressed] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const { user, loading: authLoading } = useAuthStore();

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["user", user?.uid],
    queryFn: () => fetchUserProfile(user!.uid),
    enabled: !!user,
  });

  const [showSignOfTheDay, setShowSignOfTheDay] = useState(false);
  const { signOfTheDay, isLoading: isSignLoading } = useSignOfTheDay();

  // Fetch sections
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

  // Check if we should show Sign of the Day on mount
  useEffect(() => {
    const checkAndShowSignOfTheDay = async () => {
      if (isMapLoading || userLoading || isSignLoading || !signOfTheDay) {
        return;
      }

      try {
        const lastShownDate = await AsyncStorage.getItem("lastSignOfTheDayShown");
        const todayString = getTodayString();

        // Only show if we haven't shown it today
        if (lastShownDate !== todayString) {
          setShowSignOfTheDay(true);
          // Mark as shown for today
          await AsyncStorage.setItem("lastSignOfTheDayShown", todayString);
        }
      } catch (error) {
        console.error("Error checking Sign of the Day status:", error);
      }
    };

    checkAndShowSignOfTheDay();
  }, [isMapLoading, userLoading, isSignLoading, signOfTheDay]);

  // Music effects
  useEffect(() => {
    if (player) {
      player.play();
      player.loop = true;
    }
  }, [player]);

  useEffect(() => {
    if (player) {
      player.volume = musicVolume;
    }
  }, [player, musicVolume]);

  if (isMapLoading || userLoading || authLoading || isSignLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-2xl text-orange-500 font-PoppinsBold">
          Loading Learning Map...
        </Text>
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
        {/* Manual button to show Sign of the Day */}
        <TouchableOpacity onPress={() => setShowSignOfTheDay(true)}>
          <SignOfTheDayIcon />
        </TouchableOpacity>

      

        <Settings onPress={() => setIsPressed((prev) => !prev)} />
      </View>

      {/* Overlay */}
      {(isPressed || tutorialPressed) && (
        <View className="absolute w-full h-full left-0 top-0 bg-black/60 z-40" />
      )}

      {/* Modals */}
      {isPressed && <SoundSettings onPress={() => setIsPressed(false)} />}
    

      {/* Sign of the Day Modal */}
      {showSignOfTheDay && signOfTheDay && (
        <SignOfTheDayModal
          sign={signOfTheDay}
          onClose={() => setShowSignOfTheDay(false)}
        />
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
  signOfTheDayButton: {
    width: 50,
    height: 50,
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
});