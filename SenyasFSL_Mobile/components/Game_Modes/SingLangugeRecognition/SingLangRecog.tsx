// Game_Modes/SingLangugeRecognition/SingLangRecog.tsx

import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import SignLangRecogWebView from "./SignLangRecogWebView";
import LevelContentBtn from "../GameBtns/LevelContentBtn";
import LevelBg from "@/assets/svgs/LevelBG.svg";
import { usePredictionStore } from "@/utils/store/store";
import { useVideoPlayer, VideoView } from "expo-video";
import { getVideoUrl } from "@/services/gameService";

interface SingLangRecogProps {
  levelData: any;
  flowContent: Map<string, any>;
  onPress: () => void;
}

const SingLangRecog: React.FC<SingLangRecogProps> = ({
  levelData,
  flowContent,
  onPress,
}) => {
  // --- State ---
  const [count, setCount] = useState(0);
  const prediction = usePredictionStore((state: { prediction: any }) => state.prediction);
  const setPrediction = usePredictionStore((state: { setPrediction: (value: string) => void }) => state.setPrediction);

  const signsToPractice = useMemo(() => {
    return Array.from(flowContent.values());
  }, [flowContent]);

  // --- Dynamic Content ---
  const currentSign = signsToPractice.length > count ? signsToPractice[count] : null;
  const correctSignLetter = (currentSign?.enTitle.split(" ").pop() || "").toUpperCase();
  const enTitle = currentSign?.enTitle;
  const filTitle = currentSign?.filTitle;

  const modelName = levelData.modelName || "letters";
  const handMode = levelData.handMode || "one";

  // --- Video Player Logic ---
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const player = useVideoPlayer(null, (player) => {
    player.loop = true;
    player.muted = true;
  });

  useEffect(() => {
    const loadVideo = async () => {
      if (!currentSign?.videoUrl) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        let finalUrl = currentSign.videoUrl;
        if (finalUrl.startsWith("gs://")) {
          finalUrl = await getVideoUrl(finalUrl);
        }
        setResolvedUrl(finalUrl);
        player.replace(finalUrl);
        player.play();
      } catch (error) {
        console.error("Failed to load video:", error);
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [currentSign, player]);

  // --- Prediction Logic ---
  useEffect(() => {
    if (prediction && correctSignLetter && prediction.toUpperCase() === correctSignLetter) {
      setPrediction(""); 
      setCount((prev) => prev + 1);
    }
  }, [prediction, correctSignLetter, setPrediction]);

  // --- Render ---
  return (
    <View style={styles.container}>
      {/* ✅ Removed the duplicate hardcoded title */}
      <Text className="font-PoppinsBold text-[1.75rem] md:text-4xl text-center pt-2">
        Sign To Practice {/* Dynamic title from DB */}
      </Text>

      {/* Content Area */}
      {count < signsToPractice.length && currentSign ? (
        <View style={styles.contentArea}>
          {/* === Video Area === */}
          <View style={styles.videoContainer}>
            <Text className="font-PoppinsSemiBold text-2xl md:text-3xl text-center">
              {enTitle}
            </Text>
            <Text className="font-PoppinsLightItalic text-xl md:text-3xl text-center mb-2">
              “{filTitle}”
            </Text>

            <View style={styles.videoPlayerWrapper}>
              {loading || !resolvedUrl ? (
                <View style={styles.loadingIndicator}>
                  <ActivityIndicator size="large" />
                </View>
              ) : (
                <VideoView
                  style={styles.videoPlayer}
                  player={player}
                  allowsFullscreen={false}
                  contentFit="contain"
                  nativeControls={false}
                />
              )}
            </View>
          </View>

          {/* === WebView Area === */}
          <View style={styles.webviewContainer}>
            <SignLangRecogWebView
              modelName={modelName}
              handMode={handMode}
            />
          </View>
          
          <Text className="text-center text-gray-500">
            Prediction: {prediction}
          </Text>
        </View>
      ) : (
        // --- DONE STATE ---
        <View style={styles.contentArea}>
          <Text className="font-PoppinsSemiBold text-3xl text-green-600">
            All signs practiced!
          </Text>
        </View>
      )}

      {/* Buttons (absolute) */}
      <View style={styles.buttonContainer}>
        {count < signsToPractice.length ? (
          <LevelContentBtn
            text="Skip"
            onPress={() => setCount((prev) => prev + 1)}
          />
        ) : (
          <LevelContentBtn text="Continue" onPress={onPress} />
        )}
      </View>

      {/* Background (absolute) */}
      <View style={styles.backgroundContainer}>
        <LevelBg />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentArea: {
    flex: 1, 
    justifyContent: "center",
    alignItems: "center",
    // ✅ FIX: Add padding at the bottom to avoid overlap
    // with your absolute-positioned buttons
    paddingBottom: 100, // Adjust this value as needed
  },
  videoContainer: {
    // ✅ FIX: Removed 'flex' and gave a fixed height
    height: "35%", // 35% of the content area
    width: "90%",
    justifyContent: "center",
  },
  videoPlayerWrapper: {
    flex: 1, // This is correct, it fills its parent (videoContainer)
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  loadingIndicator: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  videoPlayer: {
    width: "100%",
    height: "100%",
  },
  webviewContainer: {
    // ✅ FIX: Removed 'flex' and 'height: 100'
    // Replaced with a percentage height
    height: "45%", // 45% of the content area
    width: "90%", 
    marginTop: 10,
    borderRadius: 12,
    overflow: "hidden", 
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 16,
    width: 224, // w-56
    left: "50%",
    marginLeft: -112, // -translate-x-1/2
    zIndex: 50,
  },
  backgroundContainer: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    zIndex: 10,
  },
});

export default SingLangRecog;