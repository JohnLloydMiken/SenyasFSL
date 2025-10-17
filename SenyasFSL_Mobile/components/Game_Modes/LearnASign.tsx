import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import LevelContentBtn from "./GameBtns/LevelContentBtn";
import LearnAsignBTN from "./GameBtns/LearnAsignBTN";
import LevelBg from "@/assets/svgs/LevelBG.svg";
import { getVideoUrl } from "@/services/gameService";

interface LearnASignProps {
  videoURL: string;
  title: string;
  EnglishText: string;
  FilipinoText: string;
  onPress: () => void;
}

const LearnASign: React.FC<LearnASignProps> = ({
  videoURL,
  title,
  EnglishText,
  FilipinoText,
  onPress,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Create player hook ONCE
  const player = useVideoPlayer(null, (p) => {
    p.loop = true;
    p.muted = true;
  });

  // ✅ Fetch video URL
  useEffect(() => {
    const loadVideo = async () => {
      console.log("🎬 LearnASign mounted!");
      console.log("📦 Received videoURL prop:", videoURL);

      try {
        let finalUrl = videoURL;

        if (videoURL.startsWith("gs://")) {
          console.log("🔄 Fetching download URL from Firebase Storage...");
          finalUrl = await getVideoUrl(videoURL);
          console.log("✅ Fetched download URL:", finalUrl);
        } else {
          console.log("✅ Using direct https URL:", finalUrl);
        }

        setResolvedUrl(finalUrl);
        player.replace(finalUrl); // ✅ Correct way to update video source
        player.play();
      } catch (error) {
        console.error("❌ Error loading video:", error);
      } finally {
        console.log("🟣 Finished loading video");
        setLoading(false);
      }
    };

    loadVideo();
  }, [videoURL]);

  if (loading || !resolvedUrl) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
        <Text className="mt-2 text-lg">Loading video...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 relative bg-white">
      {/* TITLE */}
      <Text className="text-center text-2xl md:text-3xl font-PoppinsBold my-2">
        {title}
      </Text>

      {/* VIDEO */}
      <View className="w-full h-[30%] relative -top-1">
        <VideoView
          style={{ width: "100%", height: "100%" }}
          player={player}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          nativeControls={false}
        />
      </View>

      {/* BUTTON */}
      <View className="w-11/12 mx-auto">
        <LearnAsignBTN
          EnglishText={EnglishText}
          FilipinoText={`"${FilipinoText}"`}
          onPress={() => {
            setIsClicked(!isClicked);
            if (isClicked) player.pause();
            else player.play();
          }}
          clicked={isClicked}
        />
      </View>

      {/* NEXT BUTTON */}
      <View className="absolute bottom-16 w-56 md:w-64 left-1/2 -translate-x-1/2 z-50">
        <LevelContentBtn text="Next" onPress={onPress} />
      </View>

      {/* BACKGROUND */}
      <View className="absolute w-full bottom-0 z-10">
        <LevelBg />
      </View>
    </View>
  );
};

export default LearnASign;
