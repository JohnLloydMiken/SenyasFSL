import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import SignLangRecogWebView from "./SignLangRecogWebView";
import LevelContentBtn from "../GameBtns/LevelContentBtn";
import LevelBg from "@/assets/svgs/LevelBG.svg";
import { usePredictionStore } from "@/utils/store/store";
import { useVideoPlayer, VideoView } from "expo-video";
import { getVideoUrl } from "@/services/gameService";
import { LevelData } from "@/utils/store/levelData";
import { useGameStore } from "@/hooks/useGameStore";
import { useGameProgressStore } from "@/hooks/useGameProgressStore";
import { useAnswerSounds } from "@/hooks/useAnswerSounds";
import Toast from "react-native-toast-message";
import LottieView from "lottie-react-native";

const PREDICTION_THRESHOLD = 0.5;
const ADVANCEMENT_DELAY = 1500;
const SKIP_COOLDOWN = 1000;

interface SignLangRecogProps {
  levelData: any;
  flowContent: Map<string, any>;
  onPress: () => void;
  modelName: string;
  hands: 1 | 2;
}

const SignLangRecog: React.FC<SignLangRecogProps> = ({
  levelData,
  flowContent,
  onPress,
  modelName,
  hands,
}) => {
  // --- State ---
  const [count, setCount] = useState(0);
  const [isCorrectlySigned, setIsCorrectlySigned] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState<string | null>(null);
  
  const setTotalSteps = LevelData((state) => state.setTotalSteps);
  const setLevelStep = LevelData((state) => state.setLevelStep);
  
  // Prediction store
  const prediction = usePredictionStore((state) => state.prediction);
  const confidence = usePredictionStore((state) => state.confidence);
  const cameraStatus = usePredictionStore((state) => state.cameraStatus);
  const resetPrediction = usePredictionStore((state) => state.reset);

  const phaseFromStore = useGameStore((s) => s.phase);
  const progress = useGameProgressStore();
  const fullLevelId = levelData?.id;

  // Audio
  const { playCorrectSound, playSkippedSound } = useAnswerSounds();

  // Refs for timeout management
  const advancementTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const skipCooldownRef = useRef<NodeJS.Timeout | null>(null);

  const signsToPractice = useMemo(() => {
    return Array.from(flowContent.values());
  }, [flowContent]);

  // --- Dynamic Content ---
  const currentSign = signsToPractice.length > count ? signsToPractice[count] : null;
  const correctSignLetter = (currentSign?.enTitle.split(" ").pop() || "").toUpperCase();
  const enTitle = currentSign?.enTitle;
  const filTitle = currentSign?.filTitle;

  const model = modelName || "letters";
  const handMode = hands === 1 ? "one" : "two";

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
          const restoredStep = typeof saved.currentStep === "number" ? saved.currentStep : 0;
          setCount(restoredStep);
          setLevelStep(restoredStep);
        } else {
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

  // --- Video Loading ---
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

  // --- Reset state when sign changes ---
  useEffect(() => {
    console.log("[SignLangRecog] Sign changed, resetting state");
    setIsCorrectlySigned(false);
    setCurrentPrediction(null);
    resetPrediction();
    
    if (advancementTimeoutRef.current) {
      clearTimeout(advancementTimeoutRef.current);
      advancementTimeoutRef.current = null;
    }
  }, [count, resetPrediction]);

  // --- Update current prediction based on confidence threshold ---
  useEffect(() => {
    if (isCorrectlySigned) {
      return;
    }

    if (confidence >= PREDICTION_THRESHOLD) {
      setCurrentPrediction(prediction);
    } else {
      setCurrentPrediction(null);
    }
  }, [prediction, confidence, isCorrectlySigned]);

  // --- Advance to next sign ---
  const advanceSign = useCallback((skipped = false) => {
    if (advancementTimeoutRef.current) {
      console.log(`[SignLangRecog] ${skipped ? "Skip:" : "Auto-advance:"} Clearing pending timeout.`);
      clearTimeout(advancementTimeoutRef.current);
      advancementTimeoutRef.current = null;
    }

    console.log(`[SignLangRecog] ${skipped ? "Skip:" : "Correct:"} Advancing from step ${count}`);
    setCount((prev) => prev + 1);
    setIsCorrectlySigned(false);
    setCurrentPrediction(null);
    resetPrediction();
  }, [count, resetPrediction]);

  // --- Check for correct sign ---
  useEffect(() => {
    // Only check predictions if not already marked as correct
    if (isCorrectlySigned) {
      return;
    }

    if (currentPrediction && correctSignLetter) {
      const predictionMatches = currentPrediction.toUpperCase() === correctSignLetter;
      
      if (predictionMatches) {
        playCorrectSound();
        console.log(`[SignLangRecog] Correct sign DETECTED: ${correctSignLetter}`);
        setIsCorrectlySigned(true);
        
        if (advancementTimeoutRef.current) {
          clearTimeout(advancementTimeoutRef.current);
        }
        
        console.log(`[SignLangRecog] Auto-advancing in ${ADVANCEMENT_DELAY}ms...`);
        advancementTimeoutRef.current = setTimeout(() => {
          console.log("[SignLangRecog] >>> Auto-advancement timeout FIRED! <<<");
          advancementTimeoutRef.current = null;
          advanceSign(false);
        }, ADVANCEMENT_DELAY);
      }
    }
  }, [currentPrediction, correctSignLetter, isCorrectlySigned, advanceSign, playCorrectSound]);

  // --- Handle Skip ---
  const handleSkip = useCallback(() => {
    if (isSkipping || isCorrectlySigned) {
      console.log("[SignLangRecog] Skip blocked: Currently in transition.");
      return;
    }

    setIsSkipping(true);
    console.log("[SignLangRecog] Skip button clicked.");
    playSkippedSound();
    
    Toast.show({
      type: "info",
      text1: "Skipped!",
      position: "top",
      visibilityTime: 1000,
    });

    advanceSign(true);

    if (skipCooldownRef.current) {
      clearTimeout(skipCooldownRef.current);
    }
    
    skipCooldownRef.current = setTimeout(() => {
      setIsSkipping(false);
      skipCooldownRef.current = null;
    }, SKIP_COOLDOWN);
  }, [isCorrectlySigned, isSkipping, playSkippedSound, advanceSign]);

  // --- Auto-save whenever count changes ---
  useEffect(() => {
    if (!fullLevelId) return;

    const stateToSave = {
      currentStep: count,
      visibleChoices: null,
      phase: phaseFromStore ?? "playing",
      isXpDoubled: false,
      is2xTryActive: false,
      lives: 0,
      tempScore: { xp: 0, senyasCoins: 0 },
    };

    try {
      progress.save(fullLevelId, stateToSave);
    } catch (err) {
      console.warn("[SignLangRecog] progress.save failed:", err);
    }
  }, [fullLevelId, count, phaseFromStore, progress]);

  // --- Cleanup on unmount ---
  useEffect(() => {
    return () => {
      console.log("[SignLangRecog] Component unmounting. Final cleanup.");
      if (advancementTimeoutRef.current) {
        clearTimeout(advancementTimeoutRef.current);
        advancementTimeoutRef.current = null;
      }
      if (skipCooldownRef.current) {
        clearTimeout(skipCooldownRef.current);
        skipCooldownRef.current = null;
      }
      progress.cancelPendingSaves?.();
      resetPrediction();
    };
  }, [progress, resetPrediction]);

  // --- Enhanced onPress handler ---
  const handleContinue = useCallback(async () => {
    if (fullLevelId) {
      try {
        const stateToSave = {
          currentStep: count,
          visibleChoices: null,
          phase: "completed",
          isXpDoubled: false,
          is2xTryActive: false,
          lives: 0,
          tempScore: { xp: 0, senyasCoins: 0 },
        };
        await progress.flushSave(fullLevelId, stateToSave);
        await progress.remove(fullLevelId);
      } catch (err) {
        console.warn("[SignLangRecog] Error flushing/removing save on finish:", err);
      }
    }
    onPress();
  }, [fullLevelId, count, progress, onPress]);

  // --- Status Text ---
  const statusText = useMemo(() => {
    if (isCorrectlySigned) {
      return "Correct!";
    }
    if (cameraStatus === "Show Hand" || cameraStatus === "Show Hands") {
      return "Show Hand";
    }
    if (cameraStatus === "Processing...") {
      return "Identifying...";
    }
    return cameraStatus;
  }, [isCorrectlySigned, cameraStatus]);

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
            <SignLangRecogWebView modelName={model} handMode={handMode} />
          </View>

          {/* === Status & Prediction Display === */}
          <View style={styles.predictionContainer}>
            <Text style={styles.statusText}>{statusText}</Text>
            
            <View style={styles.predictionDisplay}>
              {isCorrectlySigned ? (
                <Text style={[styles.predictionText, styles.correctText]}>
                  {correctSignLetter}
                </Text>
              ) : currentPrediction ? (
                <Text style={[styles.predictionText, styles.predictingText]}>
                  {currentPrediction}
                </Text>
              ) : (
                <LottieView
                  source={require("@/assets/lottie/HandWaiting.json")}
                  autoPlay
                  loop
                  style={styles.lottieAnimation}
                />
              )}
            </View>
          </View>
        </View>
      ) : (
        // --- DONE STATE ---
        <View style={styles.contentArea}>
          <Text className="font-PoppinsSemiBold text-3xl text-green-600">
            All signs practiced!
          </Text>
        </View>
      )}

      {/* Buttons/Text (absolute) */}
      <View style={styles.buttonContainer}>
        {count < signsToPractice.length ? (
          isCorrectlySigned ? (
            // Show "Correct!" text instead of button
            <View style={styles.correctTextContainer}>
              <Text style={styles.correctButtonText}>Correct!</Text>
            </View>
          ) : (
            // Show Skip button
            <LevelContentBtn
              text="Skip"
              onPress={handleSkip}
           
            />
          )
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
    height: "40%",
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
    height: "40%",
    width: "90%",
    marginTop: 10,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  predictionContainer: {
    width: "90%",
    marginTop: 8,
    alignItems: "center",
  },
  statusText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  predictionDisplay: {
    minHeight: 100,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  predictionText: {
    fontSize: 52,
    fontWeight: "bold",
    textAlign: "center",
  },
  correctText: {
    color: "#22c55e",
  },
  predictingText: {
    color: "#2563eb",
  },
  lottieAnimation: {
    width: 80,
    height: 80,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 24,
    width: 224,
    left: "50%",
    marginLeft: -112,
    zIndex: 50,
  },
  correctTextContainer: {
    backgroundColor: "#22c55e",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    opacity:0
  },
  correctButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  backgroundContainer: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    zIndex: 10,
  },
});

export default SignLangRecog;