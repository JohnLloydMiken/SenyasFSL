// RenderLevel.tsx

import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  SectionList,
  ViewStyle,
  TouchableOpacity,
  useWindowDimensions,
  SectionListRenderItem,
  Text,
} from "react-native";
import { router } from "expo-router";
import { Level, LevelSection } from "../modules/types/interface";
import LevelItem from "../modules/LevelItem";
import BtnUp from "@/assets/svgs/BtnUp.svg";
import BtnDown from "@/assets/svgs/BtnDown.svg";
import LevelHeader from "@/components/LevelContent/levelHeader";
import FSL_Hi from "@/assets/svgs/FSL_hello.svg";
import { useUserStore } from "@/utils/store/useUserStore";
import { Section } from "@/shared/types"; // Import the Section type from your shared types

const MemoFSLHi = React.memo(FSL_Hi);
const MemoBtnUp = React.memo(BtnUp);
const MemoBtnDown = React.memo(BtnDown);

// ✅ Accept sections as a prop
interface RenderLevelProps {
  sections: Section[];
}

const RenderLevel: React.FC<RenderLevelProps> = ({ sections }) => {
  const { userData, loading: userLoading } = useUserStore();
  const { width } = useWindowDimensions();
  const FSLHiSize = width < 768 ? 160 : 300;
  const BtnSize = width < 768 ? 40 : 80;

  // ✅ Determine highest unlocked level from user progress (this logic is still needed)
  const userProgress = useMemo(() => {
    if (!userData?.progress) return 1; // Default to 1 if no progress
    if (typeof userData.progress === "number") {
      return userData.progress;
    }
    if (Array.isArray(userData.progress) && userData.progress.length > 0) {
      return Math.max(...userData.progress);
    }
    if (typeof userData.progress === "object" && Object.keys(userData.progress).length > 0) {
      return Math.max(...Object.values(userData.progress));
    }
    return 1; // Fallback
  }, [userData?.progress]);

  // ✅ Transform the sections prop from Firestore into the format SectionList needs
  const sectionsData = useMemo(() => {
    if (!sections) return [];

    return sections.map((section, sectionIndex) => {
      // Map over the level IDs and positions in the section document
      const levelData: Level[] = section.levels.map((levelId, levelIndex) => {
        const isLastLevelInSection = levelIndex === section.levels.length - 1;
        return {
          id: levelId,
          section: section.order, // Use the order field for the section number
          isBoss: isLastLevelInSection,
          isUnlocked: levelId <= userProgress , // Unlock current level and the next one
          position: section.positions[levelIndex], // Use position data from Firestore
        };
      });

      return {
        title: section.name, // Use the name from Firestore
        index: section.order,
        currentLevel: levelData[0]?.id || 1, // For display in header
        data: levelData,
      };
    });
  }, [sections, userProgress]);

  // ✅ Compute initial section to display based on user progress
  const initialSectionIndex = useMemo(() => {
    const sectionIdx = sectionsData.findIndex(sec => 
      sec.data.some(level => level.id === userProgress)
    );
    return sectionIdx > -1 ? sectionIdx : 0; // Default to the first section
  }, [sectionsData, userProgress]);
  
  const [currentSection, setCurrentSection] = useState(initialSectionIndex);

  // Loading and error states
  if (userLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading User Data...</Text>
      </View>
    );
  }

  if (!sectionsData || sectionsData.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading Map...</Text>
      </View>
    );
  }

  // ✅ Only show the current section based on state
  const displayedSection = useMemo(
    () => [sectionsData[currentSection]],
    [sectionsData, currentSection]
  );

  // Handlers
  const handleScrollDown = useCallback(() => {
    setCurrentSection((prev) => Math.min(sectionsData.length - 1, prev + 1));
  }, [sectionsData.length]);

  const handleScrollUp = useCallback(() => {
    setCurrentSection((prev) => Math.max(0, prev - 1));
  }, []);

  const handleLevelPress = useCallback((level: Level): void => {
    if (level.isUnlocked) {
      router.push(`/LevelSplashScreen?nextRoute=level&levelId=${level.id}`);
    }
  }, []);

  // Renderers
  const renderLevelItem: SectionListRenderItem<Level, LevelSection> = useCallback(
    ({ item, index }) => (
      <LevelItem level={item} index={index} onLevelPress={handleLevelPress} />
    ),
    [handleLevelPress]
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: LevelSection }) => (
      <LevelHeader
        title={section.title}
        section={section.index}
        level={section.currentLevel}
      />
    ),
    []
  );

  const keyExtractor = useCallback((item: Level) => item.id.toString(), []);

  return (
    <View style={styles.container}>
      <SectionList
        sections={displayedSection}
        renderItem={renderLevelItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        removeClippedSubviews
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />

      {/* Scroll buttons */}
      <View className="flex-col justify-center items-center gap-6 absolute right-4 bottom-4">
        {currentSection > 0 && (
          <TouchableOpacity onPress={handleScrollUp}>
            <MemoBtnUp width={BtnSize} height={BtnSize} />
          </TouchableOpacity>
        )}
        {currentSection < sectionsData.length - 1 && (
          <TouchableOpacity onPress={handleScrollDown}>
            <MemoBtnDown width={BtnSize} height={BtnSize} />
          </TouchableOpacity>
        )}
      </View>

      {/* Static SVG */}
      <View className="absolute right-0 top-1/2">
        <MemoFSLHi width={FSLHiSize} height={FSLHiSize} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    zIndex: 30,
    position: "relative",
  } as ViewStyle,
  contentContainer: {
    paddingVertical: 20,
  } as ViewStyle,
});

export default React.memo(RenderLevel);