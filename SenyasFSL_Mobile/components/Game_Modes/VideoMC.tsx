import { View, Text } from "react-native";
import React, { useState, useMemo, useEffect } from "react";
import WrongBG from "@/assets/svgs/WrongBG.svg";
import Incorrect from "@/assets/svgs/Incorrect.svg";
import CorrectIcon from "@/assets/svgs/CorrectIcon.svg";
import LevelBg from "@/assets/svgs/LevelBG.svg";
import CorrectBG from "@/assets/svgs/CorrectBG.svg";
import LevelContentBtn from "./GameBtns/LevelContentBtn";
import VideoMCBTN from "./GameBtns/VideoMCBTN";
import Inventory from "@/components/main_interface/Inventory";
import { getVideoUrl } from "@/services/gameService";

// --- Interfaces ---
export interface VideoQuestionOption {
  id: string;
  incorrect: boolean;
  labelEn: string;
  labelFil: string;
  videoSrc: string; // Can be "gs://" or full HTTPS URL
}

interface ViewMCProps {
  enPrompt: string;
  filPrompt: string;
  options: VideoQuestionOption[];
  onPress: () => void;
}

const ViewMC: React.FC<ViewMCProps> = ({ enPrompt, filPrompt, options, onPress }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [choice, setChoice] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [opacity, setOpacity] = useState(100);
  const [resolvedVideos, setResolvedVideos] = useState<Record<string, string>>({}); // Stores resolved video URLs
  const [loading, setLoading] = useState(true);

  // ✅ Determine the correct answer from options
  const correctAnswer = useMemo(() => {
    const correctOption = options.find((opt) => opt.incorrect === false);
    return correctOption ? correctOption.labelEn : "";
  }, [options]);

  // ✅ Fetch video URLs (Firebase "gs://" → HTTPS)
  useEffect(() => {
    const fetchVideoUrls = async () => {
      try {
        setLoading(true);
        const results: Record<string, string> = {};

        for (const option of options) {
          let finalUrl = option.videoSrc;

          if (option.videoSrc.startsWith("gs://")) {
            console.log(`🔄 Fetching URL for: ${option.labelEn}`);
            try {
              finalUrl = await getVideoUrl(option.videoSrc);
            } catch (err) {
              console.error(`❌ Failed to fetch URL for ${option.labelEn}:`, err);
            }
          }

          results[option.id] = finalUrl;
        }

        setResolvedVideos(results);
      } catch (err) {
        console.error("❌ Error fetching video URLs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoUrls();
  }, [options]);

  const handleBG = () => {
    if (choice) {
      setIsCorrect(choice === correctAnswer);
      setHasChecked(true);
      setOpacity(0);
    }
  };

  // ✅ Render options once all video URLs are loaded
  const renderOptions = useMemo(() => {
    if (loading) {
      return (
        <Text className="text-center text-gray-400 mt-8">
          Loading videos...
        </Text>
      );
    }

    return options.map((option) => (
      <VideoMCBTN
        key={option.id}
        labeFil={option.labelFil}
        labelEn={option.labelEn}
        isCorrect={option.labelEn === correctAnswer}
        hasChecked={hasChecked}
        clicked={hasChecked}
        isSelected={choice === option.labelEn}
        onPress={() => {
          if (!hasChecked) setChoice(option.labelEn);
        }}
        videoSource={resolvedVideos[option.id] || option.videoSrc}
      />
    ));
  }, [options, choice, hasChecked, loading, resolvedVideos]);

  return (
    <View className="flex-1 relative items-center bg-white">
      {/* PROMPTS */}
      <Text className="text-center font-PoppinsBold my-2 text-xl md:text-3xl">
        {enPrompt}
      </Text>
      <Text className="text-center font-PoppinsLightItalic my-2 text-lg md:text-3xl">
        {filPrompt}
      </Text>

      {/* VIDEO CHOICES */}
      <View className="w-2/3">{renderOptions}</View>

      {/* INVENTORY BUTTON */}
      <View
        className={`w-full p-4 mx-auto absolute bottom-28 z-50 opacity-${opacity}`}
      >
        <Inventory
          onPress={() => setIsClicked((prev) => !prev)}
          isPressed={isClicked}
          onClose={() => setIsClicked(false)}
        />
      </View>

      {/* FEEDBACK & BUTTONS */}
      <View className="absolute bottom-16 w-56 md:w-64 left-1/2 -translate-x-1/2 z-50 gap-2">
        {isCorrect === true && (
          <View className="flex-row mx-auto justify-center items-center gap-2">
            <CorrectIcon />
            <Text className="font-PoppinsBold text-lg md:text-xl text-white">
              Correct!
            </Text>
          </View>
        )}

        {isCorrect === false && (
          <View className="flex-row mx-auto justify-center items-center gap-2">
            <Incorrect />
            <Text className="font-PoppinsBold text-lg md:text-xl text-white">
              Incorrect!
            </Text>
          </View>
        )}

        {choice && !hasChecked ? (
          <LevelContentBtn text="Check" onPress={handleBG} />
        ) : (
          hasChecked && <LevelContentBtn text="Next" onPress={onPress} />
        )}
      </View>

      {/* BACKGROUND */}
      <View className="absolute w-full bottom-0 z-10">
        {isCorrect === true ? (
          <CorrectBG />
        ) : isCorrect === false ? (
          <WrongBG />
        ) : (
          <LevelBg />
        )}
      </View>
    </View>
  );
};

export default React.memo(ViewMC);
