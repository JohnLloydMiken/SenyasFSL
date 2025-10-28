import { View, Text } from "react-native";
import React, { useState, useMemo, useEffect } from "react";
import WrongBG from "@/assets/svgs/WrongBG.svg";
import Incorrect from "@/assets/svgs/Incorrect.svg";
import CorrectIcon from "@/assets/svgs/CorrectIcon.svg";
import LevelBg from "@/assets/svgs/LevelBG.svg";
import CorrectBG from "@/assets/svgs/CorrectBG.svg";
import LevelContentBtn from "@/components/Game_Modes/GameBtns/LevelContentBtn";
import VideoMCBTN from "@/components/Game_Modes/GameBtns/VideoMCBTN";
import Inventory from "@/components/main_interface/treasure/Inventory";
import { getVideoUrl } from "@/services/gameService";
import { useUserPoints } from "@/utils/store/userGameEval";
import FSL_Fight from "@/assets/svgs/FSL_Fight.svg";
import FSL_Wrong from "@/assets/svgs/FSL_wrong.svg";
import { videoSpeed } from "@/utils/store/videoSpeed";
// --- Interfaces ---
export interface VideoQuestionOption {
  id: string;
  isCorrect: boolean;
  labelEn: string;
  labelFil: string;
  videoSrc: string; // Can be "gs://" or full HTTPS URL
}

interface ViewMCProps {
  enPrompt: string;
  filPrompt: string;
  options: VideoQuestionOption[];
  onPress: () => void;
  onAnswer: (isCorrect: boolean) => void;
  hearts: number;
}

const BossViewMC: React.FC<ViewMCProps> = ({
  enPrompt,
  filPrompt,
  options,
  onPress,
  onAnswer,
  hearts,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [choice, setChoice] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [opacity, setOpacity] = useState(100);
  const incrementScore = useUserPoints((state) => state.incrementScore);
    const speed = videoSpeed((state) => state.playingSpeed);
  const [resolvedVideos, setResolvedVideos] = useState<Record<string, string>>(
    {}
  ); // Stores resolved video URLs
  const [loading, setLoading] = useState(true);
  const [showWrongIcon, setShowWrongIcon] = useState(false);
  // ✅ Determine the correct answer from options
  const correctAnswer = useMemo(() => {
    // ✅ This now correctly looks for the option where `isCorrect` is true
    const correctOption = options.find((opt) => opt.isCorrect);
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
              console.error(
                `❌ Failed to fetch URL for ${option.labelEn}:`,
                err
              );
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

  useEffect(() => {
    // Only run this logic if an answer has been checked and it was wrong
    if (hasChecked && isCorrect === false) {
      // Set a timer to switch the icon back to the default "fight" icon
      const timer = setTimeout(() => {
        setShowWrongIcon(false);
      }, 1500); // 1.5-second delay before hiding the wrong icon

      // Clean up the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [hasChecked, isCorrect]);

  const handleBG = () => {
    if (choice) {
      setIsCorrect(choice === correctAnswer);
      setHasChecked(true);
      setOpacity(0);
      onAnswer(choice === correctAnswer);
    }
    if (choice === correctAnswer) {
      incrementScore();
    }else{
       setShowWrongIcon(true);
    }
  };

  // ✅ Render options once all video URLs are loaded
  const renderOptions = useMemo(() => {
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

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-center text-gray-400 mt-8">
          Loading videos...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 relative items-center bg-white">
     <View className=" flex-row justify-center items-center ">
        {Array.from({ length: hearts }).map((_, idx) => (
          <Text key={idx} style={{ fontSize: 24, color: "red" }}>
            ❤️
          </Text>
        ))}
        {/* ✅ 3. Conditionally render the correct SVG */}
        {showWrongIcon ? (
          <FSL_Wrong height={50} width={50} />
        ) : (
          <FSL_Fight height={50} width={50} />
        )}
      </View>
      {/* PROMPTS */}
      <Text className="text-center font-PoppinsBold  text-xl md:text-3xl">
        {enPrompt}
      </Text>
      <Text className="text-center font-PoppinsLightItalic text-lg md:text-3xl">
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

export default React.memo(BossViewMC);
