import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { BottomSheetProvider, useBottomSheet } from "@/modules/contextProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { getVideoUrl } from "@/services/gameService"; // ✅ Import the URL resolver

interface RecapProps {
  onContinue: () => void;
  lessons: {
    id: string;
    enTitle: string;
    filTitle: string;
    videoUrl: string; // This will be the gs:// path
  }[];
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

function Content({ lessons, onContinue }: RecapProps) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null); // Will hold the gs:// path
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null); // Will hold the final https:// URL
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const { bottomSheetRef, handleSheetChanges } = useBottomSheet();
  const snapPoints = useMemo(() => ["60%"], []);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // ✅ The player is now initialized with the 'resolvedUrl' state
  const player = useVideoPlayer(resolvedUrl, (player) => {
    player.loop = true;
    player.muted = true;
  });

  // ✅ This useEffect hook runs whenever a new video is selected (i.e., when selectedVideo changes)
  useEffect(() => {
    const resolveVideoUrl = async () => {
      if (!selectedVideo || !selectedVideo.startsWith("gs://")) {
        setResolvedUrl(selectedVideo); // It might be a regular URL already
        return;
      }

      setIsLoadingVideo(true);
      try {
        // Convert the gs:// path to a downloadable https:// URL
        const url = await getVideoUrl(selectedVideo);
        setResolvedUrl(url);
      } catch (error) {
        console.error("Error resolving video URL:", error);
        setResolvedUrl(null); // Clear on error
      } finally {
        setIsLoadingVideo(false);
      }
    };

    resolveVideoUrl();
  }, [selectedVideo]);

  // ✅ Play the video only after the URL has been resolved
  useEffect(() => {
    if (resolvedUrl) {
      player.play();
    }
  }, [resolvedUrl, player]);

  const handlePresentModalPress = useCallback(
    (videoUrl: string) => {
      setSelectedVideo(videoUrl); // Set the gs:// path, which triggers the useEffect above
      bottomSheetRef.current?.expand();
    },
    [bottomSheetRef]
  );

  const handleClose = () => {
    setSelectedVideo(null); // Clear the selected video
    setResolvedUrl(null); // Clear the resolved URL

    bottomSheetRef.current?.close();
  };

  return (
    <View style={styles.container}>
      {/* Header and Lesson List (No changes here) */}
      <Text style={styles.header}>Learning Recap</Text>
      <Text style={styles.subHeader}>
        Review the signs from this lesson to enhance your retention.
      </Text>
      {lessons?.length ? (
        <FlatList
          data={lessons}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                handlePresentModalPress(item.videoUrl)
                setIsSheetOpen(true)
              }}
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

      {/* Bottom Sheet for Video Player */}
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={handleClose}
      >
        <BottomSheetView style={{ flex: 1, zIndex: 50 }}>
          <View style={styles.videoContainer}>
            {isLoadingVideo && <ActivityIndicator size="large" />}
            {!isLoadingVideo && resolvedUrl && (
              <VideoView
                player={player}
                style={styles.video}
                nativeControls={false}
              />
            )}
            <TouchableOpacity onPress={()=>{
              handleClose(),
              setIsSheetOpen(false)
            }} style={styles.backButton}>
              <Text style={styles.backText}>Close Video</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>

      {/* Continue Button (No changes here) */}
     {!isSheetOpen&&(
       <View style={styles.bottomBtnContainer}>
        <TouchableOpacity style={styles.noThanksBtn} onPress={onContinue}>
          <Text style={styles.noThanksText}>Continue</Text>
        </TouchableOpacity>
      </View>
     )}
    </View>
  );
}

// ... (styles remain the same)
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
  subHeader: {
    fontStyle: "italic",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
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
    zIndex: 1,
  },
  noThanksBtn: {
    backgroundColor: "#FB990F",
    paddingVertical: 16,
    borderRadius: 12,
    zIndex: 1,
  },
  noThanksText: {
    textAlign: "center",
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default LearningRecap;
