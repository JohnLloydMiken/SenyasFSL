// modules/RenderLevel.tsx

import React, { useState, useCallback, useMemo, useEffect } from "react";
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
import { Section } from "@/shared/types"; //
import { useSectionStore } from "@/utils/store/useSectionStore";

const MemoFSLHi = React.memo(FSL_Hi);
const MemoBtnUp = React.memo(BtnUp);
const MemoBtnDown = React.memo(BtnDown);

interface RenderLevelProps {
  sections: Section[];
}

const RenderLevel: React.FC<RenderLevelProps> = ({ sections }) => {
  const { userData, loading: userLoading } = useUserStore(); 
  const { width } = useWindowDimensions();
  const FSLHiSize = width < 768 ? 160 : 300;
  const BtnSize = width < 768 ? 40 : 80;
  const { setSectionOrder } = useSectionStore();
  // ✅ REMOVED the old global `userProgress` useMemo.
  // We will now calculate progress inside `sectionsData`.

  const sectionsData = useMemo(() => {
    // Wait for all data to be ready
    if (!sections || sections.length === 0 || !userData) return [];

    // Get the user's progress object, e.g., { 'section-1': 1, 'section-2': 0 }
    const progressMap = userData.progress || {};

    // Sort sections by order just to be safe
    const sortedSections = [...sections].sort((a, b) => a.order - b.order);

    return sortedSections.map((section, sectionIndex) => {
      // --- This logic is now copied from your web/home/Home.tsx ---

      // 1. Get progress for *this specific section*
      const highestLevelCompleted = progressMap[section.id] || 0;

      // 2. Check if the *previous* section is fully completed
      const prevSection = sortedSections[sectionIndex - 1];
      let prevSectionCompleted = true; // Section 1 is always unlocked

      if (prevSection) {
        const prevSectionProgress = progressMap[prevSection.id] || 0;
        prevSectionCompleted = prevSectionProgress >= prevSection.levels.length;
      }

      // 3. Determine if this section is unlocked
      const isSectionUnlocked = sectionIndex === 0 || prevSectionCompleted;

      // 4. Find the highest level ID the user can *access* in this section
      // This is the corrected logic
      const highestAccessibleLevelId = isSectionUnlocked
        ? Math.min(highestLevelCompleted + 1, section.levels.length)
        : 0; // If section is locked, no levels are accessible

      // --- End of web logic ---

      // Map the levels for the SectionList
      const levelData: Level[] = section.levels.map((levelId, levelIndex) => {
        const isLastLevelInSection = levelIndex === section.levels.length - 1;
        return {
          id: levelId,
          section: section.order, //
          isBoss: isLastLevelInSection,
          // ✅ NEW UNLOCK LOGIC:
          // A level is unlocked if its ID is less than or equal to
          // the highest *accessible* level for *this section*.
          isUnlocked: levelId <= highestAccessibleLevelId,
          position: section.positions[levelIndex], //
        };
      });

      return {  
        title: section.name, //
        index: section.order,
        currentLevel: levelData[0]?.id || 1,
        data: levelData,
      };
    });
  }, [sections, userData]); // ✅ Now depends on both sections and userData

  // ✅ Compute initial section to display based on user progress
  const initialSectionIndex = useMemo(() => {
    if (!userData || !sectionsData.length) return 0;

    const progressMap = userData.progress || {};

    // Find the *last* section the user has made progress in
    for (let i = sectionsData.length - 1; i >= 0; i--) {
      // We use the original `sections` array's order as it maps to `sectionsData`
      const sectionId = sections[i]?.id;
      if (
        sectionId &&
        progressMap[sectionId] !== undefined &&
        progressMap[sectionId] > 0
      ) {
        // If they have progress and it's not finished, show this section
        if (progressMap[sectionId] < sections[i].levels.length) {
          return i;
        }
        // If they finished it, show the *next* section (if it exists)
        return Math.min(i + 1, sectionsData.length - 1);
      }
    }

    return 0; // Default to the first section
  }, [sectionsData, userData, sections]);

  const [currentSection, setCurrentSection] = useState(0);

  // ✅ Add effect to set the initial section once data is loaded
  useEffect(() => {
    setCurrentSection(initialSectionIndex);
  }, [initialSectionIndex]);

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
    () => [sectionsData[currentSection]].filter(Boolean), // Filter Boolean handles case where sectionsData[currentSection] is undefined
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
    // Find the section this level belongs to
    const section = sections.find((s) => s.order === level.section);
    if (section) {
      setSectionOrder(section.order); // ✅ store the current section ID
    }

    router.push(`/LevelSplashScreen?nextRoute=level&levelId=${level.id}`);
  }
}, [sections]);

  // Renderers
  const renderLevelItem: SectionListRenderItem<Level, LevelSection> =
    useCallback(
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
      {/* Ensure displayedSection is not empty before rendering SectionList */}
      {displayedSection.length > 0 && (
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
      )}

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
