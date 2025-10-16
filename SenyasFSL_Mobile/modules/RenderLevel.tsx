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
import {
  generateLevelData,
  LEVELS_PER_SECTION,
} from "../modules/levelsmetadata";
import LevelItem from "../modules/LevelItem";
import BtnUp from "@/assets/svgs/BtnUp.svg";
import BtnDown from "@/assets/svgs/BtnDown.svg";
import LevelHeader from "@/components/LevelContent/levelHeader";
import FSL_Hi from "@/assets/svgs/FSL_hello.svg";
import { useAuthStore } from "@/utils/store/useAuthStore";
import { useUserStore } from "@/utils/store/useUserStore";

const MemoFSLHi = React.memo(FSL_Hi);
const MemoBtnUp = React.memo(BtnUp);
const MemoBtnDown = React.memo(BtnDown);

const RenderLevel: React.FC = () => {
  const { user } = useAuthStore();
  const { userData, loading: userLoading } = useUserStore();

  const { width } = useWindowDimensions();
  const FSLHiSize = width < 768 ? 160 : 300;
  const BtnSize = width < 768 ? 40 : 80;

  // ✅ Loading state
  if (userLoading) {
    return (
      <View className="flex-1 bg-[#FAF3E0] justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View className="flex-1 bg-[#FAF3E0] justify-center items-center">
        <Text>Could not load user profile. Please try again later.</Text>
      </View>
    );
  }

  // ✅ Determine highest unlocked level from user progress
  const userProgress = useMemo(() => {
    if (typeof userData.progress === "number") {
      return userData.progress; // e.g., if backend directly gives a number
    } else if (Array.isArray(userData.progress)) {
      // e.g., [2, 5, 10]
      return Math.max(...userData.progress);
    } else if (typeof userData.progress === "object") {
      // e.g., { section1: 5, section2: 2 }
      return Math.max(...Object.values(userData.progress));
    }
    return 1; // default fallback
  }, [userData.progress]);

  // ✅ Generate level data based on user's progress
  const [levels, setLevels] = useState<Level[]>(() =>
    generateLevelData(50, userProgress)
  );

  // ✅ Compute initial section based on progress
  const initialSection = useMemo(
    () => Math.floor((userProgress - 1) / LEVELS_PER_SECTION),
    [userProgress]
  );

  const [currentSection, setCurrentSection] = useState(initialSection);

  // ✅ Recompute levels when user progress updates
  useEffect(() => {
    setLevels(generateLevelData(50, userProgress));
    setCurrentSection(initialSection);
  }, [userProgress, initialSection]);

  // ✅ Sections
  const sectionsData = useMemo(() => {
    return levels.reduce((sections: LevelSection[], level: Level) => {
      const sectionIndex = Math.floor((level.id - 1) / LEVELS_PER_SECTION);
      if (!sections[sectionIndex]) {
        sections[sectionIndex] = {
          title: titles[sectionIndex],
          index: sectionIndex + 1,
          currentLevel: level.id,
          data: [],
        };
      }
      sections[sectionIndex].data.push(level);
      return sections;
    }, []);
  }, [levels]);

  // ✅ Only show current section
  const displayedSection = useMemo(
    () => [sectionsData[currentSection]],
    [sectionsData, currentSection]
  );

  // ✅ Handlers
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

  // ✅ Renderers
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

  const keyExtractor = useCallback(
    (item: Level): string => item.id.toString(),
    []
  );

  // ✅ Render
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

const titles = [
  "Learn the Alphabets",
  "Learn the Numbers",
  "Learn the Labels",
  "Learn the Calendar and Time Units",
  "Learn the Family and Colors",
  "Learn the Occupations and Relationships",
  "Learn the Food",
  "Learn the Home Vocabulary",
  "Learn the Socializing",
  "Learn the Days",
];

export default React.memo(RenderLevel);
