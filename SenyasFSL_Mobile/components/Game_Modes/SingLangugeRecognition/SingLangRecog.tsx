import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import SignLangRecogWebView from "./SignLangRecogWebView";
import LevelContentBtn from "../GameBtns/LevelContentBtn";
import LevelBg from "@/assets/svgs/LevelBG.svg";
import { usePredictionStore } from "@/utils/store/store";
import { useVideoPlayer, VideoView } from "expo-video";
import { getVideoUrl } from "@/services/gameService";
import { LevelData } from "@/utils/store/levelData";
import { useGameStore } from "@/hooks/useGameStore";
import { useGameProgressStore } from "@/hooks/useGameProgressStore";

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
  const setTotalSteps = LevelData((state) => state.setTotalSteps);
  const setLevelStep = LevelData((state) => state.setLevelStep);
  const prediction = usePredictionStore(
    (state: { prediction: any }) => state.prediction
  );
  const setPrediction = usePredictionStore(
    (state: { setPrediction: (value: string) => void }) => state.setPrediction
  );

  // Accessors for values we will save/restore
  const isXpDoubledFromStore = useGameStore((s) => s.isXpDoubled);
  const is2xTryActiveFromStore = useGameStore((s) => s.is2xTryActive);
  const visibleChoicesFromStore = useGameStore((s) => s.visibleChoices);
  const phaseFromStore = useGameStore((s) => s.phase);

  const progress = useGameProgressStore();
  const fullLevelId = levelData?.id;

  const signsToPractice = useMemo(() => {
    return Array.from(flowContent.values());
  }, [flowContent]);

  // --- Dynamic Content ---
  const currentSign =
    signsToPractice.length > count ? signsToPractice[count] : null;
  const correctSignLetter = (
    currentSign?.enTitle.split(" ").pop() || ""
  ).toUpperCase();
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

  // --- Load saved progress on mount ---
  useEffect(() => {
    let mounted = true;
    async function loadProgress() {
      if (!fullLevelId) return;

      try {
        const saved = await progress.load(fullLevelId);
        if (!mounted) return;

        if (saved) {
          console.log("[SignLangRecog] Loaded saved progress:", saved);

          // Restore count (currentStep)
          const restoredStep =
            typeof saved.currentStep === "number" ? saved.currentStep : 0;
          setCount(restoredStep);
          setLevelStep(restoredStep);

          // Restore visible choices (if included)
          if (saved.visibleChoices !== undefined) {
            useGameStore.setState({ visibleChoices: saved.visibleChoices });
          }

          // Restore phase (if included)
          if (saved.phase !== undefined) {
            useGameStore.setState({ phase: saved.phase });
          }

          // Restore xp/item effects if included
          const toRestore: Partial<any> = {};
          if (saved.isXpDoubled !== undefined)
            toRestore.isXpDoubled = saved.isXpDoubled;
          if (saved.is2xTryActive !== undefined)
            toRestore.is2xTryActive = saved.is2xTryActive;
          if (Object.keys(toRestore).length > 0) {
            (useGameStore as any).setState(toRestore);
          }
        } else {
          // No saved state – ensure starting defaults
          setCount(0);
          setLevelStep(0);
        }
      } catch (err) {
        console.warn("[SignLangRecog] Failed to load progress:", err);
      }
    }

    loadProgress();

    return () => {
      mounted = false;
    };
  }, [fullLevelId, progress, setLevelStep]);

  useEffect(() => {
    setTotalSteps(signsToPractice.length);
  }, [signsToPractice.length, setTotalSteps]);

  useEffect(() => {
    setLevelStep(count);
  }, [count, setLevelStep]);

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
    if (
      prediction &&
      correctSignLetter &&
      prediction.toUpperCase() === correctSignLetter
    ) {
      setPrediction("");
      setCount((prev) => prev + 1);
    }
  }, [prediction, correctSignLetter, setPrediction]);

  // --- Auto-save whenever count changes ---
  useEffect(() => {
    if (!fullLevelId) return;

    const stateToSave = {
      currentStep: count,
      visibleChoices: visibleChoicesFromStore ?? null,
      phase: phaseFromStore ?? "playing",
      isXpDoubled: isXpDoubledFromStore ?? false,
      is2xTryActive: is2xTryActiveFromStore ?? false,
      lives: 0,
      tempScore: { xp: 0, senyasCoins: 0 },
    };

    try {
      progress.save(fullLevelId, stateToSave);
    } catch (err) {
      console.warn("[SignLangRecog] progress.save failed:", err);
    }
  }, [
    fullLevelId,
    count,
    visibleChoicesFromStore,
    phaseFromStore,
    isXpDoubledFromStore,
    is2xTryActiveFromStore,
    progress,
  ]);

  // Cancel pending saves when unmounting
  useEffect(() => {
    return () => {
      progress.cancelPendingSaves?.();
    };
  }, [progress]);

  // Enhanced onPress handler to flush and remove saved state on completion
  const handleContinue = useCallback(async () => {
    if (fullLevelId) {
      try {
        const stateToSave = {
          currentStep: count,
          visibleChoices: visibleChoicesFromStore ?? null,
          phase: "completed",
          isXpDoubled: isXpDoubledFromStore ?? false,
          is2xTryActive: is2xTryActiveFromStore ?? false,
          lives: 0,
          tempScore: { xp: 0, senyasCoins: 0 },
        };
        await progress.flushSave(fullLevelId, stateToSave);
        await progress.remove(fullLevelId);
      } catch (err) {
        console.warn(
          "[SignLangRecog] Error flushing/removing save on finish:",
          err
        );
      }
    }
    onPress();
  }, [
    fullLevelId,
    count,
    visibleChoicesFromStore,
    isXpDoubledFromStore,
    is2xTryActiveFromStore,
    progress,
    onPress,
  ]);

  // --- Render ---
  return (
    <View style={styles.container}>
      <Text className="font-PoppinsBold text-[1.75rem] md:text-4xl text-center text-orange-500">
        Practice Signing:
      </Text>
      <Text className="font-PoppinsSemiBold text-3xl md:text-3xl text-center text-orange-400">
        {enTitle}
      </Text>
      <Text className="font-PoppinsLightItalic text-lg md:text-3xl text-center mb-2 text-orange-400">
        "{filTitle}"
      </Text>
      {/* Content Area */}
      {count < signsToPractice.length && currentSign ? (
        <View style={styles.contentArea}>
          {/* === Video Area === */}
          <View style={styles.videoContainer}>
            <View style={styles.videoPlayerWrapper}>
              {loading || !resolvedUrl ? (
                <View style={styles.loadingIndicator}>
                  <ActivityIndicator size="large" color="#ffffff" />
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
            <SignLangRecogWebView modelName={modelName} handMode={handMode} />
          </View>

          <Text className="text-center text-gray-500 text-xl mt-1">
            Prediction: {prediction || "..."}
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
          <LevelContentBtn text="Continue" onPress={handleContinue} />
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
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 100,
    zIndex: 20,
  },
  videoContainer: {
    height: "45%",
    width: "90%",
    justifyContent: "center",
    marginTop: 10,
  },
  videoPlayerWrapper: {
    flex: 1,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  loadingIndicator: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  videoPlayer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
  },
  webviewContainer: {
    height: "45%",
    width: "90%",
    marginTop: 10,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 24,
    width: 224,
    left: "50%",
    marginLeft: -112,
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
