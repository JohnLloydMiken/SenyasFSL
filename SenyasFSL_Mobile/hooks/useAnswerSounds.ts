// hooks/useAnswerSounds.ts
import { useEffect } from "react";
import { useAudioPlayer } from "expo-audio";
import { useAudioStore } from "@/hooks/useAudioStore"; // Adjust path if your store is elsewhere

// Load the audio assets
const correctSoundSource = require("@/assets/audio/correct.mp3");
const incorrectSoundSource = require("@/assets/audio/incorrect.mp3");

export const useAnswerSounds = () => {
  // Get volume from the global store
  const { soundEffectsVolume } = useAudioStore();

  // Create players
  const correctPlayer = useAudioPlayer(correctSoundSource);
  const incorrectPlayer = useAudioPlayer(incorrectSoundSource);

  // Effect to update volume whenever it changes in the store
  useEffect(() => {
    if (correctPlayer) {
      correctPlayer.volume = soundEffectsVolume;
    }
    if (incorrectPlayer) {
      incorrectPlayer.volume = soundEffectsVolume;
    }
  }, [soundEffectsVolume, correctPlayer, incorrectPlayer]);

  // Functions to play sounds (using replay to always start from the beginning)
  const playCorrectSound = () => {
    correctPlayer?.seekTo(0);
    correctPlayer.play();
  };

  const playIncorrectSound = () => {
    incorrectPlayer?.seekTo(0);
    incorrectPlayer.play();
  };

  return { playCorrectSound, playIncorrectSound };
};
