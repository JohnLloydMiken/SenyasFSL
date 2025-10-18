import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { BottomSheetProvider, useBottomSheet } from "@/modules/contextProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

interface RecapProps {
  onContinue: () => void;
  lessons: any[];
}

const LearningRecap: React.FC<RecapProps> = ({ lessons, onContinue }) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetProvider>
        <Content lessons={lessons} onContinue={onContinue} />
      </BottomSheetProvider>
    </GestureHandlerRootView>
  );
};

function Content({
  lessons,
  onContinue,
}: {
  lessons: any[];
  onContinue: () => void;
}) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const { bottomSheetRef, handleSheetChanges } = useBottomSheet();

  const snapPoints = useMemo(() => ["60%"], []);

  const player = useMemo(() => {
    if (!selectedVideo) return null;
    const p = useVideoPlayer(selectedVideo, (pl) => {
      pl.loop = false;
    });
    p.play();
    return p;
  }, [selectedVideo]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Learning Recap</Text>
      <Text
        style={{
          fontStyle: "italic",
          fontSize: 16,
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        Review the signs from this lesson to enhance your retention.
      </Text>

      {lessons?.length ? (
        <FlatList
          data={lessons}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedVideo(item.videoUrl)}
              style={styles.lessonItem}
            >
              <Text style={styles.lessonTitle}>{item.enTitle}</Text>
              <Text style={styles.lessonSubtitle}>{item.filTitle}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text>No lessons found for this level.</Text>
        </View>
      )}

      {selectedVideo && player && (
        <BottomSheet
          ref={bottomSheetRef}
          onChange={handleSheetChanges}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose
          onClose={() => setSelectedVideo(null)}
        >
          <BottomSheetView style={{ flex: 1, height: 350 }}>
            <View style={styles.videoContainer}>
              <VideoView
                player={player}
                style={styles.video}
                allowsFullscreen={false}
                allowsPictureInPicture={false}
                nativeControls={false}
              />
              <TouchableOpacity
                onPress={() => setSelectedVideo(null)}
                style={styles.backButton}
              >
                <Text style={styles.backText}>Close Video</Text>
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheet>
      )}

      <View style={styles.bottomBtnContainer}>
        <TouchableOpacity style={styles.noThanksBtn} onPress={onContinue}>
          <Text style={styles.noThanksText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default LearningRecap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: "white",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  lessonItem: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#F7D674",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  lessonSubtitle: {
    color: "#555",
    marginTop: 4,
    textAlign: "center",
  },
  videoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  video: {
    width: "95%",
    height: 260,
    borderRadius: 10,
  },
  backButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#1E90FF",
    borderRadius: 10,
  },
  backText: {
    color: "#fff",
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomBtnContainer: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    width: "90%",
  },
  noThanksBtn: {
   
   backgroundColor: "#FB990F",
    paddingVertical: 16,
    borderRadius: 12,
  },
  noThanksText: {
    textAlign: "center",
        color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
