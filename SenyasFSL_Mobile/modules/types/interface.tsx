// types/Level.ts
export interface Level {
  id: number;
  section: number;
  isBoss: boolean;
  isUnlocked: boolean;
}

export interface LevelSection {
  title: string;
  data: Level[];
}

export interface LevelItemProps {
  level: Level;
  index: number;
  onLevelPress: (level: Level) => void;
}

export interface SectionHeaderProps {
  title: string;
  level: number;
  section: number;
}