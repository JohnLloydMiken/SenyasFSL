import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useRef, useMemo, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import Alphabets from "@/components/main_interface/Alphabets";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Categories from "@/json_files/Categories.json";
import { videoMap } from "@/modules/LevelContentConfig";
import { useVideoPlayer, VideoView } from "expo-video";
import Numbers from "@/components/main_interface/Numbers";
const DictionaryContent = () => {
  const { contentId } = useLocalSearchParams();
  return (
    <>
      <Stack.Screen
        options={{
          title: Categories[Number(contentId) - 1].title,
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
    case "1": return <FSL_Alphabets />;
    case "2": return <FSL_Numbers/>
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

export const FSL_Alphabets = () => {
    const { contentId } = useLocalSearchParams();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedWord, setSelectedWord] = React.useState<string | null>(null);
  const [selectedFilWord, setSelectedFilWord] = React.useState<string | null>(
    null
  );
  const [selectedVidSource, setSelectedVidSource] = useState("");
  // Memoize snapPoints (important for performance)
  const snapPoints = useMemo(() => ["50%"], []);

  const videoSource = videoMap[selectedVidSource];

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.muted = true; // Optional: mute the video
    player.play();
  });
  return (
    <>
      <Alphabets
        onPress={(letter, Filletter, letterSource) => {
          setSelectedWord(letter);
          setSelectedFilWord(Filletter);
          setSelectedVidSource(letterSource);
          bottomSheetRef.current?.expand();
        }}
      />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose
      >
        <BottomSheetView style={styles.contentContainer}>
          {selectedWord ? (
            <View className="w-full h-full flex-col items-center justify-start">
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
    const { contentId } = useLocalSearchParams();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedWord, setSelectedWord] = React.useState<string | null>(null);
  const [selectedFilWord, setSelectedFilWord] = React.useState<string | null>(
    null
  );
  const [selectedVidSource, setSelectedVidSource] = useState("");
  // Memoize snapPoints (important for performance)
  const snapPoints = useMemo(() => ["50%"], []);

  const videoSource = videoMap[selectedVidSource];

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.muted = true; // Optional: mute the video
    player.play();
  });
  return (
    <>
      <Numbers
        onPress={(number, numberFil, numberSource) => {
          setSelectedWord(number);
          setSelectedFilWord(numberFil);
          setSelectedVidSource(numberSource);
          bottomSheetRef.current?.expand();
        }}
      />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose
      >
        <BottomSheetView style={styles.contentContainer}>
          {selectedWord ? (
            <View className="w-full h-full flex-col items-center justify-start">
              {!videoSource ? (
                <Text>No Video</Text>
              ): (
                <VideoView style={{
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
