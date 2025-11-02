import {create} from 'zustand';

interface AudioState {
  // Store volume as 0.0 to 1.0 for expo-audio
  musicVolume: number;
  soundEffectsVolume: number;
  setMusicVolume: (volume: number) => void;
  setSoundEffectsVolume: (volume: number) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  musicVolume: 1.0, // Default to full volume
  soundEffectsVolume: 1.0,
  setMusicVolume: (volume) => set({ musicVolume: volume }),
  setSoundEffectsVolume: (volume) => set({ soundEffectsVolume: volume }),
}));