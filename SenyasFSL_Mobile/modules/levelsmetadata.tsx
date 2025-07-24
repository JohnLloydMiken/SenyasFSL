// config/levelConfig.ts
import { Level } from './types/interface';

export const LEVELS_PER_SECTION = 5;
export const BOSS_LEVEL_POSITION = 5;

export const generateLevelData = (totalLevels: number = 50): Level[] => {
  return Array.from({ length: totalLevels }, (_, index): Level => {
    const levelNumber = index + 1;
    const sectionNumber = Math.ceil(levelNumber / LEVELS_PER_SECTION);
    const isBossLevel = levelNumber % LEVELS_PER_SECTION === 0;
    
    return {
      id: levelNumber,
      section: sectionNumber,
      isBoss: isBossLevel,
      isUnlocked: levelNumber === 3,
     
    };
  });
};