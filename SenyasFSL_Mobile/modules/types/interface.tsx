// types/Level.ts
export interface Level {
  id: number;
  section: number;
  isBoss: boolean;
  isUnlocked: boolean;
  difficulty: number;
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
}