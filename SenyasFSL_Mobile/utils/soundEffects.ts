// utils/soundEffects.ts (or hooks/usePurchaseSounds.ts if you prefer)
import { useEffect } from "react";
import { useAudioPlayer } from "expo-audio";
import { useAudioStore } from "@/hooks/useAudioStore";

// Load the audio assets
const buySuccessSource = require("@/assets/audio/buy_success.mp3");
const generalErrorSource = require("@/assets/audio/general_error.mp3");

export const usePurchaseSounds = () => {
  // Get volume from the global store
  const { soundEffectsVolume } = useAudioStore();

  // Create players
  const buySuccessPlayer = useAudioPlayer(buySuccessSource);
  const generalErrorPlayer = useAudioPlayer(generalErrorSource);

  // Effect to update volume whenever it changes in the store
  useEffect(() => {
    if (buySuccessPlayer) {
      buySuccessPlayer.volume = soundEffectsVolume;
    }
    if (generalErrorPlayer) {
      generalErrorPlayer.volume = soundEffectsVolume;
    }
  }, [soundEffectsVolume, buySuccessPlayer, generalErrorPlayer]);

  // Functions to play sounds (using seekTo to always start from the beginning)
  const playBuySuccessSound = () => {
    buySuccessPlayer?.seekTo(0);
    buySuccessPlayer?.play();
  };

  const playErrorSound = () => {
    generalErrorPlayer?.seekTo(0);
    generalErrorPlayer?.play();
  };

  return { playBuySuccessSound, playErrorSound };
};