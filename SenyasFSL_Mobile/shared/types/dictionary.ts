// shared/types/dictionary.ts

// This defines the structure of a single lesson object inside the 'items' array
export interface DictionaryLesson {
  id: string;
  enLabel: string;
  filLabel: string;
  video: string;
}

// This defines the structure of a full category document
export interface DictionaryCategory {
  id: string;
  label: string;
  subtext: string;
  icon: string;
  items: DictionaryLesson[];
}