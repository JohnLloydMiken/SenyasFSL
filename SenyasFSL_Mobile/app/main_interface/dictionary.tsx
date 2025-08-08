// screens/LevelsScreen.tsx
import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  SectionList,
  ViewStyle,
  ListRenderItem,
  SectionListRenderItem,
} from "react-native";
import { Level, LevelSection } from "../../modules/types/interface";
import {
  generateLevelData,
  LEVELS_PER_SECTION,
} from "../../modules/levelsmetadata";
import LevelItem from "../../modules/LevelItem";

import LevelHeader from "@/components/LevelContent/levelHeader";

const LevelsScreen: React.FC = () => {
  const [levels, setLevels] = useState<Level[]>(generateLevelData(50));
  const [currentSection, setCurrentSection] = useState(0);

  // Group levels into sections of 5
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


  const handleLevelPress = useCallback((level: Level): void => {
    console.log("Level pressed:", level.id);
    // Navigate to level or start game logic here
    // navigation.navigate('GameScreen', { level });
  }, []);

  const renderLevelItem: SectionListRenderItem<Level, LevelSection> = ({
    item,
    index,
  }) => (
    <LevelItem level={item} index={index} onLevelPress={handleLevelPress} />
  );

  const renderSectionHeader = ({ section }: { section: LevelSection } ) => (
    <LevelHeader title={section.title} section={section.index} level={section.currentLevel}   />
  );

  const keyExtractor = (item: Level): string => item.id.toString();

  return (
    <View style={styles.container}>
      <SectionList
        sections={[sectionsData[currentSection]]}
        renderItem={renderLevelItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
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
]
export default LevelsScreen;
