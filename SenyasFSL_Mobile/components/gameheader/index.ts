// src/types/index.ts
export interface Fact {
  id: number;
  Fact_title: string;
  image: string; // filename used in svgMap
  unlocked: boolean;
  content?: string;
  funFact?: string;
}

export interface Award {
  id: number;
  award_title: string;
  AwardImage: string; // filename used in svgMap
  unlocked?: boolean;
  description?: string;
  requirements?: string;
  dateEarned?: string;
}

export type ItemType = "award" | "fact";
export type SelectedItem = Award | Fact | null;

export interface SvgProps {
  width?: number;
  height?: number;
}
