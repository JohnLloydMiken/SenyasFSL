// screens/LevelsScreen.tsx
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
  const { user, loading: authLoading } = useAuthStore();
  const { userData, loading: userLoading } = useUserStore();
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

  const userProgress = 5;

  const [levels] = useState<Level[]>(() => generateLevelData(50, userProgress));

  const [currentSection, setCurrentSection] = useState(0);
  const { width } = useWindowDimensions();

  const FSLHiSize = width < 768 ? 160 : 300;
  const BtnSize = width < 768 ? 40 : 80;

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
      console.log("Level pressed:", level.id);
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
  "Learn the occupations and relationships",
  "Learn the Food",
  "Learn the Home Vocabulary",
  "Learn the Socializing",
  "Learn the Days",
];

export default React.memo(RenderLevel);
