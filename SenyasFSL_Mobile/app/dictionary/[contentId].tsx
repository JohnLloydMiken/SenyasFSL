import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useRef, useMemo, useState, useEffect } from "react";
// --- 1. Import router ---
import { Stack, useLocalSearchParams, router } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useVideoPlayer, VideoView } from "expo-video";
import { db } from "@/services/db/database"; // Import our SQLite DB
import PlayBtn from "@/assets/svgs/PlayBtn.svg";
// --- Types ---
interface DictionaryEntry {
  id: string;
  categoryId: string;
  enLabel: string;
  filLabel: string;
  remoteVideoUrl: string;
  localVideoUri: string;
}

interface Category {
  id: string;
  title: string;
  fil: string;
  icon: string | null;
}

// --- Main Screen Component ---
const DictionaryContent = () => {
  const { contentId } = useLocalSearchParams<{ contentId: string }>();
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (contentId) {
      try {
        const result = db.getFirstSync<Category>(
          "SELECT * FROM Categories WHERE id = ?",
          contentId
        );
        setCategory(result);
      } catch (e) {
        console.error("Failed to fetch category title", e);
      }
    }
  }, [contentId]);

  return (
    <>
      <Stack.Screen
        options={{
          title: category?.title ?? "Loading...",

          // --- 2. THIS IS THE FIX ---
          // Add the custom headerLeft button you wanted
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ paddingRight: 10 }} // Added padding for easier tapping
            >
              <Text style={{ color: "#007AFF", fontSize: 16 }}>Back</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <GestureHandlerRootView style={styles.container}>
        {contentId ? (
          <DictionaryList contentId={contentId} />
        ) : (
          <View style={styles.fallback}>
            <Text>No content ID found.</Text>
          </View>
        )}
      </GestureHandlerRootView>
    </>
  );
};

export default DictionaryContent;

// --- Reusable Video Player Hook ---
const useSharedPlayer = () => {
  const player = useVideoPlayer(null, (player) => {
    player.loop = true;
    player.muted = true;
  });

  const setSource = (uri: string | null) => {
    if (uri) {
      player.replace(uri);
      player.play();
    }
  };

  return { player, setSource };
};

// --- Reusable Content List Component ---
export const DictionaryList = ({ contentId }: { contentId: string }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(
    null
  );
  const { player, setSource } = useSharedPlayer();
  const snapPoints = useMemo(() => ["50%"], []);

  useEffect(() => {
    try {
      const results = db.getAllSync<DictionaryEntry>(
        "SELECT * FROM DictionaryEntries WHERE categoryId = ?",
        contentId
      );
      setEntries(results);
    } catch (e) {
      console.error("Failed to fetch dictionary entries", e);
    }
  }, [contentId]);

  const handleSelect = (entry: DictionaryEntry) => {
    setSelectedEntry(entry);
    setLoading(true);
    setSource(entry.localVideoUri);
    bottomSheetRef.current?.expand();
    setTimeout(() => setLoading(false), 300);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.listContainer}>
        {entries.map((entry) => (
          <TouchableOpacity
            key={entry.id}
            style={styles.wordButton}
            onPress={() => handleSelect(entry)}
          >
            <PlayBtn width={50} height={50} />
            <View >
              <Text className="font-PoppinsBold text-2xl md:text-3xl">{entry.enLabel}</Text>
              <Text className="font-PoppinsLightItallic text-xl md:text-2xl">"{entry.filLabel}"</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose
      >
        <BottomSheetView style={styles.contentContainer}>
          {selectedEntry ? (
            <View className="w-full h-full flex-col items-center justify-start">
              {loading ? (
                <ActivityIndicator size="large" color="#000" />
              ) : (
                <VideoView
                  style={{
                    width: 357,
                    height: 200,
                    elevation: 5,
                    backgroundColor: "white",
                  }}
                  player={player}
                  allowsFullscreen={false}
                  allowsPictureInPicture={false}
                  nativeControls={false}
                />
              )}
              <Text className="font-PoppinsBold text-4xl md:text-5xl mt-10">
                {selectedEntry.enLabel}
              </Text>
              <Text className="font-PoppinsRegular text-2xl md:text-3xl ">
                {`"${selectedEntry.filLabel}"`}
              </Text>
            </View>
          ) : (
            <Text>Select an item</Text>
          )}
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  wordButton: {
    backgroundColor: "white",
    padding: 20,
    marginVertical: 8,
    borderRadius: 50,
    elevation: 3,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderColor: "#F7D674",
    borderWidth: 2
  },
  wordButtonText: {
    fontSize: 18,
    fontFamily: "PoppinsRegular", // Make sure this font is loaded
  },
  contentContainer: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },
  fallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
