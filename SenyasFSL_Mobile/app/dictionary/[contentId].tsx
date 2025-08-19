import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useRef, useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import Alphabets from "@/components/main_interface/Alphabets";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Categories from '@/json_files/Categories.json'
const DictionaryContent = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <RenderWords />
    </GestureHandlerRootView>
  );
};

export const RenderWords = () => {
  const { contentId } = useLocalSearchParams();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedWord, setSelectedWord] = React.useState<string | null>(null);
    const [selectedFilWord, setSelectedFilWord] = React.useState<string | null>(null);
  // Memoize snapPoints (important for performance)
  const snapPoints = useMemo(() => ["60%"], []);

  switch (contentId) {
    case "1":
      return (
       <>
        <Alphabets onPress={(letter, Filletter) => {
          setSelectedWord(letter)
          setSelectedFilWord(Filletter)
          bottomSheetRef.current?.expand()
        }} />
        <BottomSheet 
        ref={bottomSheetRef} 
        snapPoints={snapPoints}
        enablePanDownToClose>
          <BottomSheetView style={styles.contentContainer}>
              {selectedWord ? (
                <>
                  <Text className="font-PoppinsBold text-3xl text-[#8B8B8B]">
                    {selectedWord}
                  </Text>
                  <Text className="font-PoppinsRegular text-xl text-[#8B8B8B]">
                    {`"${selectedFilWord}"`}
                  </Text>
                </>
              ) : (
                <Text>Select a letter</Text>
              )}
          </BottomSheetView>
        </BottomSheet>
       </>
      );
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
    alignItems: "center",
    justifyContent: "center",
  },
  fallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
