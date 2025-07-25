// screens/LevelsScreen.tsx
import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  SectionList,
  ViewStyle,
  ListRenderItem,
  SectionListRenderItem,
  TouchableOpacity,
  useWindowDimensions
} from "react-native";
import { Level, LevelSection } from "../modules/types/interface";
import {
  generateLevelData,
  LEVELS_PER_SECTION,
} from "../modules/levelsmetadata";
import LevelItem from "../modules/LevelItem";
import BtnUp from "@/assets/svgs/BtnUp.svg";
import BtnDown from "@/assets/svgs/BtnDown.svg";
import LevelHeader from "@/components/levelHeader";
import FSL_Hi from '@/assets/svgs/FSL_hello.svg'
const RenderLevel: React.FC = () => {
  const [levels, setLevels] = useState<Level[]>(generateLevelData(50));
  const [currentSection, setCurrentSection] = useState(0);
    const {width} =useWindowDimensions()
    const FSLHiSize = width < 768 ? 200 : 200;
    const BtnSize = width < 768 ? 40 : 80;
  const handleScrollDown = () =>{
    setCurrentSection( (prev) =>  Math.min(sectionsData.length - 1, prev + 1))
  }
  const handleScrollUp = () =>{
     setCurrentSection( (prev) =>  Math.max(0, prev - 1))
  }
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

  const renderSectionHeader = ({ section }: { section: LevelSection }) => (
    <LevelHeader
      title={section.title}
      section={section.index}
      level={section.currentLevel}
    />
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

      <View className="flex-col justify-center items-center gap-6 absolute right-4 bottom-4">
        {currentSection === 0 ? null : (
          <TouchableOpacity onPress={() => handleScrollUp()}>
            <BtnUp width={BtnSize} height={BtnSize} />
          </TouchableOpacity>
        )}
        {currentSection === 9 ? null : (
          <TouchableOpacity onPress={() =>handleScrollDown()}>
            <BtnDown width={BtnSize} height={BtnSize} />
          </TouchableOpacity>
        )}
      </View>
      <View className="absolute right-0 top-1/2 ">
        <FSL_Hi width={FSLHiSize} height={FSLHiSize}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    zIndex: 50,
    position: 'relative',
  
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
export default RenderLevel;
