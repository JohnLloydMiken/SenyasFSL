import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useRef, useMemo, useState, useEffect } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import Alphabets from "@/components/main_interface/Alphabets";
import Numbers from "@/components/main_interface/Numbers";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Categories from "@/json_files/Categories.json";
import { videoMap } from "@/modules/LevelContentConfig";
import { useVideoPlayer, VideoView } from "expo-video";

const DictionaryContent = () => {
  const { contentId } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen
        options={{
          title: Categories[Number(contentId) - 1]?.title ?? "Dictionary",
        }}
      />
      <GestureHandlerRootView style={styles.container}>
        <RenderWords />
      </GestureHandlerRootView>
    </>
  );
};

export const RenderWords = () => {
  const { contentId } = useLocalSearchParams();

  switch (contentId) {
    case "1":
      return <FSL_Alphabets />;
    case "2":
      return <FSL_Numbers />;
    default:
      return (
        <View style={styles.fallback}>
          <Text>No content found for ID: {contentId}</Text>
        </View>
      );
  }
};

export default DictionaryContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

const useSharedPlayer = () => {
  // Create a single player instance (no source yet)
  const player = useVideoPlayer(null, (player) => {
    player.loop = true;
    player.muted = true;
  });

  const setSource = (source: string | null) => {
    if (source) {
      player.replace(videoMap[source]); // Fast source swap
      player.play();
    }
  };

  return { player, setSource };
};

export const FSL_Alphabets = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedFilWord, setSelectedFilWord] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { player, setSource } = useSharedPlayer();
  const snapPoints = useMemo(() => ["50%"], []);

  const handleSelect = (letter: string, Filletter: string, letterSource: string) => {
    setSelectedWord(letter);
    setSelectedFilWord(Filletter);
    setLoading(true);
    setSource(letterSource);
    bottomSheetRef.current?.expand();

    // Give the player a moment to swap
    setTimeout(() => setLoading(false), 300);
  };

  return (
    <>
      <Alphabets onPress={handleSelect} />
      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} index={-1} enablePanDownToClose>
        <BottomSheetView style={styles.contentContainer}>
          {selectedWord ? (
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
                {selectedWord}
              </Text>
              <Text className="font-PoppinsRegular text-2xl md:text-3xl ">
                {`"${selectedFilWord}"`}
              </Text>
            </View>
          ) : (
            <Text>Select a letter</Text>
          )}
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

export const FSL_Numbers = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedFilWord, setSelectedFilWord] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { player, setSource } = useSharedPlayer();
  const snapPoints = useMemo(() => ["50%"], []);

  const handleSelect = (number: string, numberFil: string, numberSource: string) => {
    setSelectedWord(number);
    setSelectedFilWord(numberFil);
    setLoading(true);
    setSource(numberSource);
    bottomSheetRef.current?.expand();
    setTimeout(() => setLoading(false), 300);
  };

  return (
    <>
      <Numbers onPress={handleSelect} />
      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} index={-1} enablePanDownToClose>
        <BottomSheetView style={styles.contentContainer}>
          {selectedWord ? (
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
                {selectedWord}
              </Text>
              <Text className="font-PoppinsRegular text-2xl md:text-3xl ">
                {`"${selectedFilWord}"`}
              </Text>
            </View>
          ) : (
            <Text>Select a number</Text>
          )}
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};
