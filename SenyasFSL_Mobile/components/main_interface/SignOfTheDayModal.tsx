// components/main_interface/SignOfTheDayModal.tsx

import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
// Import the hook and the view from expo-video
import { VideoView, useVideoPlayer } from "expo-video";
import { SignOfTheDayLesson } from "@/hooks/useSignOfTheDay";
import { usePlayableUrl } from "@/hooks/usePlayableUrl";

interface SignOfTheDayProps {
  sign: SignOfTheDayLesson;
  onClose: () => void;
}

// Assuming you have this image
const bgImage = require("@/assets/images/phBG.png");

const SignOfTheDayModal: React.FC<SignOfTheDayProps> = ({ sign, onClose }) => {
  const [isSlow, setIsSlow] = useState(false);
  const playableUrl = usePlayableUrl(sign?.video);
  const isLoading = playableUrl === undefined;

  // Create a player instance using the hook
  const player = useVideoPlayer(playableUrl || null, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  // Function to toggle speed
  const toggleSpeed = () => {
    const newSpeed = !isSlow;
    // Set playback rate directly on the player
    player.playbackRate = newSpeed ? 0.5 : 1.0;
    setIsSlow(newSpeed);
  };

  // Ensure player source is updated when playableUrl changes
  useEffect(() => {
    if (playableUrl) {
      player.replace(playableUrl);
    }
  }, [playableUrl, player]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ImageBackground
            source={bgImage}
            style={styles.content}
            imageStyle={{ borderRadius: 16 }}
          >
            {/* "Daily Senyas" header pill */}
            <View style={styles.headerPill}>
              <Text style={styles.headerPillText}>Daily Senyas</Text>
            </View>

            {/* Close Button */}
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            {/* Category pill */}
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>
                {sign.categoryLabel}
              </Text>
            </View>

            {/* Video + toggle */}
            <View style={styles.videoContainer}>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#FFFFFF" />
                  <Text style={styles.loadingText}>Loading Video...</Text>
                </View>
              ) : (
                <VideoView // Use VideoView
                  player={player} // Pass the player instance
                  contentFit="contain"
                  style={styles.video}
                />
              )}
            </View>

            {!isLoading && (
              <TouchableOpacity
                onPress={toggleSpeed}
                style={styles.turtleButton}
              >
                <Text style={styles.turtleButtonText}>
                  {isSlow ? "🐢" : "🐇"}
                </Text>
              </TouchableOpacity>
            )}

            {/* Description */}
            <View style={styles.descriptionBox}>
              <Text style={styles.enLabel}>{sign.enLabel}</Text>
              <Text style={styles.filLabel}>"{sign.filLabel}"</Text>
            </View>
          </ImageBackground>
        </View>
      </View>
    </Modal>
  );
};

// Add styles
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
  },
  content: {
    backgroundColor: "#FFD08F", // Fallback color
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 48, // Make space for header pill
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  headerPill: {
    position: "absolute",
    alignSelf: "center",
    top: -20,
    backgroundColor: "#EA0505", // Simplified gradient
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  headerPillText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 999,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  categoryPill: {
    alignSelf: "flex-start",
    backgroundColor: "#FAF3E0",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 8,
  },
  categoryPillText: {
    color: "#FB990F",
    fontWeight: "bold",
    fontSize: 14,
  },
  videoContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 8,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden", // Ensures video respects border radius
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    marginTop: 8,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  turtleButton: {
    position: "absolute",
    top: 60, // Adjusted to not overlap close button
    right: 8,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 8,
    borderRadius: 999,
  },
  turtleButtonText: {
    fontSize: 24,
  },
  descriptionBox: {
    marginTop: 20,
    backgroundColor: "#FAF3E0",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  enLabel: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  filLabel: {
    marginTop: 4,
    fontSize: 16,
    fontStyle: "italic",
    fontWeight: "600",
    color: "#555",
  },
});

export default SignOfTheDayModal;