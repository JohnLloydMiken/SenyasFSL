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
import { Stack, useLocalSearchParams } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useVideoPlayer, VideoView } from "expo-video";
import { db } from "@/services/db/database"; // Import our SQLite DB

// --- Types ---
// Type for a single word/video entry from our DB
interface DictionaryEntry {
  id: string;
  categoryId: string;
  enLabel: string;
  filLabel: string;
  remoteVideoUrl: string; // We don't use this, but it's in the DB
  localVideoUri: string; // This is what we need!
}

// Type for a category from our DB
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
        // Fetch the category title from our *local* DB
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
          // Set title from the DB result
          title: category?.title ?? "Loading...",
        }}
      />
      <GestureHandlerRootView style={styles.container}>
        {/* Pass the contentId to our list component */}
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
// This hook is great! No changes needed here.
const useSharedPlayer = () => {
  const player = useVideoPlayer(null, (player) => {
    player.loop = true;
    player.muted = true;
  });

  // We change this to accept a direct URI, not a videoMap key
  const setSource = (uri: string | null) => {
    if (uri) {
      // player.replace() can take a file URI directly!
      player.replace(uri);
      player.play();
    }
  };

  return { player, setSource };
};

// --- Reusable Content List Component ---
// This component replaces FSL_Alphabets and FSL_Numbers
export const DictionaryList = ({ contentId }: { contentId: string }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  
  // State for the *selected* item in the bottom sheet
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null);

  const { player, setSource } = useSharedPlayer();
  const snapPoints = useMemo(() => ["50%"], []);

  // Fetch all dictionary entries for this category from the local DB
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

  // This function is called when a user taps on a word
  const handleSelect = (entry: DictionaryEntry) => {
    setSelectedEntry(entry);
    setLoading(true);
    
    // Set the source directly to the local file URI
    setSource(entry.localVideoUri); 
    
    bottomSheetRef.current?.expand();
    setTimeout(() => setLoading(false), 300); // Keep your loading logic
  };

  return (
    <>
      {/* ScrollView that lists all the words */}
      <ScrollView contentContainerStyle={styles.listContainer}>
        {entries.map((entry) => (
          <TouchableOpacity
            key={entry.id}
            style={styles.wordButton}
            onPress={() => handleSelect(entry)}
          >
            <Text style={styles.wordButtonText}>{entry.enLabel}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Sheet for the Video Player */}
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
    borderRadius: 12,
    elevation: 3,
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