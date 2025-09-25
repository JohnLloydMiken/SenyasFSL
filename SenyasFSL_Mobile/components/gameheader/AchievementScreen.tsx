// src/screens/AchievementScreen.tsx
import React, { useMemo, useRef, useCallback, useState } from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";

import Facts from "@/json_files/facts.json";
import Awards from "@/json_files/awards.json";

import AwardSection from "@/components/gameheader/AwardSection";
import FactSection from "@/components/gameheader/FactSection";
import BottomSheetContent from "@/components/gameheader/BottomSheetContent";

// svgs
import Awards_lock from "@/assets/svgs/awards_lock.svg";
import Fact_locked from "@/assets/svgs/fact_lock.svg";
import PFD from "@/assets/svgs/PFD.svg";

import type { Award, Fact, SelectedItem, ItemType, SvgProps } from "@/components/gameheader";

type SvgMap = Record<string, React.FC<SvgProps>>;

const AchievementScreen: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);
  const [itemType, setItemType] = useState<ItemType | null>(null);

  const bottomSheetRef = useRef<BottomSheetModal | null>(null);
  const { width } = useWindowDimensions();

  const factsData = Facts as Fact[];
  const awardsData = Awards as Award[];

  const svgSize = useMemo(() => (width < 768 ? 100 : 120), [width]);
  const snapPoints = useMemo(() => ["60%"], []);

  // map filenames used in JSON to imported SVG components
  const svgMap = useMemo<SvgMap>(() => {
    return {
      "awards_lock.svg": Awards_lock,
      "fact_lock.svg": Fact_locked,
      // any other filename used in your JSON map here...
    };
  }, []);

  const handleItemPress = useCallback((item: Award | Fact, type: ItemType) => {
    setSelectedItem(item);
    setItemType(type);
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setSelectedItem(null);
      setItemType(null);
    }
  }, []);

  const unlockedAwardsCount = useMemo(
    () => awardsData.filter((a) => a.unlocked).length,
    [awardsData]
  );

  const unlockedFactsCount = useMemo(() => factsData.filter((f) => f.unlocked).length, [factsData]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View>
          <AwardSection awards={awardsData} unlockedCount={unlockedAwardsCount} svgSize={svgSize} svgMap={svgMap} onItemPress={handleItemPress} />
        </View>

        <View>
          <FactSection facts={factsData} unlockedCount={unlockedFactsCount} svgSize={svgSize} svgMap={svgMap} defaultUnlockedSvg={PFD} onItemPress={handleItemPress} />
        </View>
      </ScrollView>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: "#ffffff" }}
        handleIndicatorStyle={{ backgroundColor: "#ccc" }}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <BottomSheetContent item={selectedItem} type={itemType} />
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default AchievementScreen;
