import React, { JSX, useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useVideoPlayer, VideoView } from "expo-video";

import ViDSelected from "@/assets/svgs/VidSelected.svg";
import ViDCorrect from "@/assets/svgs/VidCorrect.svg";
import VidWrong from "@/assets/svgs/VidWrong.svg";

interface VideoMCBTNProps {
  labeFil:string,
  labelEn: string;
  videoSource: string; // must be a remote HTTPS URL
  hasChecked: boolean;
  isCorrect: boolean;
  clicked: boolean;
  onPress: () => void;
  isSelected: boolean;
}

const gradients = {
  default: ["#7B7B7B", "#7B7B7B"] as const,
  selected: ["#FB990F", "#EA0505"] as const,
  correct: ["#31F705", "#007D00"] as const,
  incorrect: ["#FF6A6C", "#A20000"] as const,
};

const VideoMCBTN: React.FC<VideoMCBTNProps> = ({
  labeFil,
  labelEn,
  isCorrect,
  hasChecked,
  onPress,
  videoSource,
  isSelected,
}) => {
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 34 : 50;
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // ✅ Init remote video
  const player = useVideoPlayer({ uri: videoSource }, (p) => {
    p.loop = true;
    p.muted = true;
    p.play()
  });

  useEffect(() => {
    const loadVideo = async () => {
      try {
        setIsLoading(true);
        await player.play();
        setIsLoading(false);
      } catch (error) {
        setIsError(true);
        setIsLoading(false);
        console.error("🎥 Video failed to load:", error);
      }
    };
    loadVideo();
  }, [videoSource]);

  // 🎨 Pick gradient
  let gradientColors: readonly [string, string] = gradients.default;
  if (hasChecked) {
    gradientColors = isCorrect ? gradients.correct : gradients.incorrect;
  } else if (isSelected) {
    gradientColors = gradients.selected;
  }

  // 🎯 Pick icon
  let icon: JSX.Element | null = null;
  if (hasChecked) {
    icon = isCorrect ? (
      <ViDCorrect width={svgSize} height={svgSize} />
    ) : (
      <VidWrong width={svgSize} height={svgSize} />
    );
  } else if (isSelected) {
    icon = <ViDSelected width={svgSize} height={svgSize} />;
  }

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.8 }}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.touchable}
        activeOpacity={0.9}
        onPress={onPress}
      >
        {/* 🎥 Remote video */}
        {isError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>Video not available</Text>
          </View>
        ) : isLoading ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color="#EA0505" />
          </View>
        ) : (
          <VideoView
            style={styles.video}
            player={player}
            allowsFullscreen={false}
            allowsPictureInPicture={false}
            nativeControls={false}
          />
        )}

        {/* 📝 Answer text (revealed after checking) */}
        <View
          style={[
            styles.answerBox,
            { opacity: hasChecked ? 1 : 0 },
          ]}
        >
          <Text style={styles.answerText}>{labelEn}</Text>
          <Text style={styles.answerText}>{`"${labeFil}"`}</Text>
        </View>

        {/* 🧩 Status Icon */}
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.8 }}
          style={styles.iconWrapper}
        >
          <View style={styles.iconInner}>{icon}</View>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 150,
    borderRadius: 16,
    backgroundColor: "transparent",
    elevation: 5,
    padding: 1,
    marginVertical: 10,
  },
  touchable: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  video: {
    width: "98%",
    height: "100%",
    borderRadius: 16,
  },
  loaderBox: {
    width: "98%",
    height: "100%",
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  errorBox: {
    width: "98%",
    height: "100%",
    borderRadius: 16,
    backgroundColor: "rgba(255,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#A20000",
    fontFamily: "Poppins-Bold",
    fontSize: 16,
  },
  answerBox: {
    backgroundColor: "rgba(255,255,255,0.6)",
    width: "98%",
    position: "absolute",
    bottom: 4,
    borderRadius: 12,
  },
  answerText: {
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
  iconWrapper: {
    width: 45,
    height: 45,
    borderRadius: 6,
    backgroundColor: "transparent",
    padding: 3,
    position: "absolute",
    right: 12,
    top: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  iconInner: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default VideoMCBTN;
