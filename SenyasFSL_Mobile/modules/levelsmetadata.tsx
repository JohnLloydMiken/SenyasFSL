import { Level } from './types/interface';

export const LEVELS_PER_SECTION = 5;
export const BOSS_LEVEL_POSITION = 5;

/**
 * Generate all levels with unlock state based on user progress.
 * @param totalLevels - total number of levels available
 * @param highestUnlockedLevel - the highest level user has reached
 */
export const generateLevelData = (
  totalLevels: number = 50,
  highestUnlockedLevel: number = 1
): Level[] => {
  return Array.from({ length: totalLevels }, (_, index): Level => {
    const levelNumber = index + 1;
    const sectionNumber = Math.ceil(levelNumber / LEVELS_PER_SECTION);
    const isBossLevel = levelNumber % LEVELS_PER_SECTION === 0;

    return {
      id: levelNumber,
      section: sectionNumber,
      isBoss: isBossLevel,
      // ✅ Unlock all levels up to user's progress
      isUnlocked: levelNumber <= highestUnlockedLevel,
    };
  });
};
