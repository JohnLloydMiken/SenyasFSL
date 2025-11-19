// src/screens/AchievementScreen.tsx
import React, { useMemo, useRef, useCallback, useState, useEffect } from "react";
import { ScrollView, View, useWindowDimensions, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";

// --- Imports for dynamic data ---
import { useAchievementStore } from "@/hooks/useAchievementStore";
import { useUserStore } from "@/utils/store/useUserStore";
import { ContentAchievement } from "@/shared/types";

// --- Component Imports ---
import AwardSection from "@/components/gameheader/AwardSection";
import FactSection from "@/components/gameheader/FactSection";
import BottomSheetContent from "@/components/gameheader/BottomSheetContent";

// --- SVGs for locked state ---
import Awards_lock from "@/assets/svgs/awards_lock.svg";
import Fact_locked from "@/assets/svgs/fact_lock.svg";

import type { SvgProps } from "@/components/gameheader";

export type ProcessedAchievement = ContentAchievement & { unlocked: boolean };

// FIXED: Create a stable empty array outside the component
const EMPTY_ACHIEVEMENTS: string[] = [];

const AchievementScreen: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<ProcessedAchievement | null>(null);

  const bottomSheetRef = useRef<BottomSheetModal | null>(null);
  const { width } = useWindowDimensions();

  const svgSize = useMemo(() => (width < 768 ? 100 : 120), [width]);
  const snapPoints = useMemo(() => ["60%"], []);

  // 1. Get state and fetch function from the new store
  const { allAchievements, isLoading: isLoadingAchievements, fetchAchievements } =
    useAchievementStore();

  // 2. Trigger the fetch on component mount
  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  // 3. FIXED: Get user's unlocked achievement IDs with stable fallback
  const userAchievementIds = useUserStore(
    useCallback(
      (state) => state.userData?.achievements ?? EMPTY_ACHIEVEMENTS,
      []
    )
  );

  // Use a Set for efficient O(1) lookups
  const userAchievementIdSet = useMemo(
    () => new Set(userAchievementIds),
    [userAchievementIds]
  );

  // 4. Combine master list with user's unlocked status
  const processedAchievements = useMemo<ProcessedAchievement[]>(() => {
    if (!allAchievements) return [];
    return allAchievements.map((ach) => ({
      ...ach,
      unlocked: userAchievementIdSet.has(ach.id),
    }));
  }, [allAchievements, userAchievementIdSet]);

  // 5. Separate into Awards and Facts
  const awardsData = useMemo(
    () => processedAchievements.filter((ach) => ach.type === "award"),
    [processedAchievements]
  );

  const factsData = useMemo(
    () => processedAchievements.filter((ach) => ach.type === "other"),
    [processedAchievements]
  );

  // 6. Update handlers
  const handleItemPress = useCallback((item: ProcessedAchievement) => {
    setSelectedItem(item);
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setSelectedItem(null);
    }
  }, []);

  // 7. Update counts
  const unlockedAwardsCount = useMemo(
    () => awardsData.filter((a) => a.unlocked).length,
    [awardsData]
  );

  const unlockedFactsCount = useMemo(
    () => factsData.filter((f) => f.unlocked).length,
    [factsData]
  );

  // Show a loading spinner while fetching
  if (isLoadingAchievements) {
    return (
      <GestureHandlerRootView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 , paddingVertical:16}}>
      <ScrollView style={{ flex: 1, }}>
        <View>
          <AwardSection
            awards={awardsData}
            unlockedCount={unlockedAwardsCount}
            svgSize={svgSize}
            lockedIcon={Awards_lock}
            onItemPress={handleItemPress}
          />
        </View>

        <View>
          <FactSection
            facts={factsData}
            unlockedCount={unlockedFactsCount}
            svgSize={svgSize}
            lockedIcon={Fact_locked}
            onItemPress={handleItemPress}
          />
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
            <BottomSheetContent item={selectedItem} />
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

export default AchievementScreen;