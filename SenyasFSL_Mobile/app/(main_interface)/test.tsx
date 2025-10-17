import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";

export default function SimpleVideoTest() {
  const videoUrl =
    "https://firebasestorage.googleapis.com/v0/b/iron-gizmo-471110-d0.firebasestorage.app/o/lessons%2Fletters%2FA.mp4?alt=media&token=53157bf4-8de1-4da3-98b3-cfbde014aff8";

  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = true;
    player.play();
  });

  if (!player)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading video...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎬 Simple Firebase Video</Text>
      <VideoView
        style={styles.video}
        player={player}
        nativeControls
        allowsFullscreen
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#111" },
  title: { color: "white", fontSize: 18, marginBottom: 16 },
  video: { width: 320, height: 240, backgroundColor: "black", borderRadius: 12 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
