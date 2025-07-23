// screens/LevelsScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  SectionList,
  ViewStyle,
  ListRenderItem,
  SectionListRenderItem,
} from 'react-native';
import { Level, LevelSection } from '../../modules/types/interface';
import { generateLevelData, LEVELS_PER_SECTION } from '../../modules/levelsmetadata';
import LevelItem from '../../modules/LevelItem';
import SectionHeader from '../../modules/header';

const LevelsScreen: React.FC = () => {
  const [levels, setLevels] = useState<Level[]>(generateLevelData(50));
  
  // Group levels into sections of 5
  const sectionsData: LevelSection[] = levels.reduce((sections: LevelSection[], level: Level) => {
    const sectionIndex = Math.floor((level.id - 1) / LEVELS_PER_SECTION);
    if (!sections[sectionIndex]) {
      sections[sectionIndex] = {
        title: `Section ${sectionIndex + 1}`,
        data: []
      };
    }
    sections[sectionIndex].data.push(level);
    return sections;
  }, []);

  const handleLevelPress = useCallback((level: Level): void => {
    console.log('Level pressed:', level.id);
    // Navigate to level or start game logic here
    // navigation.navigate('GameScreen', { level });
  }, []);

  const renderLevelItem: SectionListRenderItem<Level, LevelSection> = ({ item, index }) => (
    <LevelItem 
      level={item} 
      index={index}
      onLevelPress={handleLevelPress}
    />
  );

  const renderSectionHeader = ({ section }: { section: LevelSection }) => (
    <SectionHeader title={section.title} />
  );

  const keyExtractor = (item: Level): string => item.id.toString();

  return (
    <View style={styles.container}>
      <SectionList
        sections={sectionsData}
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
    backgroundColor: '#F5F5F5',
  } as ViewStyle,
  contentContainer: {
    paddingVertical: 20,
  } as ViewStyle,
});

export default LevelsScreen;