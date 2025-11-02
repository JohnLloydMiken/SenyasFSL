// src/utils/shareUtils.ts
// (React Native version)

import { Share, Alert } from "react-native";

/**
 * Opens the native device Share menu to share the user's streak.
 */
export const shareStreak = async (streakCount: number) => {
  // 1. Define the message and URL
  const shareText = `🔥 I'm on a ${streakCount}-day learning streak on SenyasFSL! Come learn Filipino Sign Language with me!`;
  const shareUrl = "https://iron-gizmo-471110-d0.web.app";
  const message = `${shareText} ${shareUrl}`;

  // 2. Use the React Native Share API
  try {
    const result = await Share.share({
      message: message,
      title: "My SenyasFSL Streak!", // This is the title on the Android share dialog
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // Shared with an app
        console.log("Shared with:", result.activityType);
      } else {
        // Shared
        console.log("Streak shared successfully!");
      }
    } else if (result.action === Share.dismissedAction) {
      // User cancelled
      console.log("Share cancelled by user.");
    }
  } catch (error: any) {
    // 3. Use Alert for errors (instead of toast)
    console.error("Error sharing streak:", error);
    Alert.alert("Error", "Could not share streak.");
  }
};