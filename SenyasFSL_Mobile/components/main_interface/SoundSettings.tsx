import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  LayoutChangeEvent,
} from "react-native";
import React from "react";
import Slider from "@react-native-community/slider";
import Sound from "@/assets/svgs/sound.svg";
import Music from "@/assets/svgs/Music.svg";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAudioStore } from "@/hooks/useAudioStore";

interface SoundSettingsProps {
  onPress: () => void;
}

const SoundSettings: React.FC<SoundSettingsProps> = ({ onPress }) => {
  const [sliderSoundWidth, setSliderSoundWidth] = useState(0);
  const [sliderMusicWidth, setSliderMusicWidth] = useState(0);
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 30 : 50;
  const svgBG = width < 768 ? 60 : 80;

  // Slider track padding (must match marginHorizontal in gradientTrack style)
  const TRACK_PADDING = 16;

  // --- USE GLOBAL STATE ---
  const {
    musicVolume,
    setMusicVolume,
    soundEffectsVolume,
    setSoundEffectsVolume,
  } = useAudioStore();

  // Convert 0.0-1.0 to 0-100 for slider display
  const soundSliderValue = Math.round(soundEffectsVolume * 100);
  const musicSliderValue = Math.round(musicVolume * 100);

  // Calculate icon position with proper track width accounting for padding
  const calculateIconPosition = (sliderWidth: number, value: number) => {
    if (sliderWidth === 0) return 0;
    
    // Available track width (excluding padding on both sides)
    const trackWidth = sliderWidth - (TRACK_PADDING * 2);
    
    // Position as percentage of track width
    const position = (trackWidth * value) / 100;
    
    // Add left padding and center the icon
    return position + TRACK_PADDING - (svgBG / 2);
  };

  const soundIconPosition = calculateIconPosition(sliderSoundWidth, soundSliderValue);
  const musicIconPosition = calculateIconPosition(sliderMusicWidth, musicSliderValue);

  const handleSoundLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setSliderSoundWidth(width);
  };

  const handleMusicLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setSliderMusicWidth(width);
  };

  // --- HANDLERS TO UPDATE STORE (converts 0-100 to 0.0-1.0) ---
  const handleSoundChange = (value: number) => {
    // Round to nearest integer to prevent jumpy behavior
    const roundedValue = Math.round(value);
    // Convert to 0.0-1.0 range and clamp to ensure it stays in bounds
    const normalizedValue = Math.max(0, Math.min(1, roundedValue / 100));
    setSoundEffectsVolume(normalizedValue);
  };

  const handleMusicChange = (value: number) => {
    // Round to nearest integer to prevent jumpy behavior
    const roundedValue = Math.round(value);
    // Convert to 0.0-1.0 range and clamp to ensure it stays in bounds
    const normalizedValue = Math.max(0, Math.min(1, roundedValue / 100));
    setMusicVolume(normalizedValue);
  };
  // --- END HANDLERS ---

  return (
    <LinearGradient
      colors={["#FB990F", "#EA0505"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{
        borderRadius: 16,
        padding: 3,
        width: "90%",
        backgroundColor: "transparent",
        elevation: 5,
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 50,
      }}
    >
      <View className="bg-[#FFFBF1] p-4 rounded-2xl gap-3">
        <View className=" border-b-2 border-b-[#757F7F] w-full flex-row items-center justify-center">
          <MaskedView
            maskElement={
              <Text className="font-PoppinsBold text-2xl md:text-3xl mb-2">
                Audio
              </Text>
            }
          >
            <LinearGradient
              colors={["#FB990F", "#EA0505"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 0.8 }}
            >
              <Text
                style={{ opacity: 0 }}
                className="font-PoppinsBold text-2xl md:text-3xl mb-2"
              >
                {" "}
                Audio
              </Text>
            </LinearGradient>
          </MaskedView>

          <TouchableOpacity
            onPress={onPress}
            className="absolute right-0 -top-2"
          >
            <MaskedView
              maskElement={<Ionicons name="close" size={40} color="black" />}
            >
              <LinearGradient
                colors={["#FB990F", "#EA0505"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ width: 40, height: 40 }}
              />
            </MaskedView>
          </TouchableOpacity>
        </View>

        <View className="gap-6">
          <Text className="text-[#646464] font-PoppinsSemiBold text-2xl md:text-3xl">
            Sound effects
          </Text>
          <View style={styles.container} onLayout={handleSoundLayout}>
            <Text
              className={`text-xl md:text-2xl font-PoppinsSemiBold absolute text-[#646464] z-50 bottom-20 right-0 `}
            >
              {soundSliderValue}%
            </Text>
            <LinearGradient
              colors={["#2DE2E2", "#0922A0"]}
              start={{ x: 0, y: -0.1 }}
              end={{ x: 0, y: 0.9 }}
              style={styles.gradientTrack}
            />
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={soundSliderValue}
              onValueChange={handleSoundChange}
              minimumTrackTintColor="transparent"
              maximumTrackTintColor="transparent"
              thumbTintColor="transparent"
            />
            {sliderSoundWidth > 0 && (
              <LinearGradient
                colors={["#2DE2E2", "#0922A0"]}
                start={{ x: 0, y: -0.1 }}
                end={{ x: 0, y: 0.9 }}
                style={[
                  styles.iconContainer,
                  {
                    width: svgBG,
                    height: svgBG,
                    left: soundIconPosition,
                  },
                ]}
              >
                <Sound width={svgSize} height={svgSize} />
              </LinearGradient>
            )}
          </View>
        </View>

        <View className="gap-6">
          <Text className="text-[#646464] font-PoppinsSemiBold text-2xl md:text-3xl">
            Music
          </Text>
          <View style={styles.container} onLayout={handleMusicLayout}>
            <Text
              className={`text-xl md:text-2xl font-PoppinsSemiBold absolute text-[#646464] z-50 bottom-20 right-0 `}
            >
              {musicSliderValue}%
            </Text>
            <LinearGradient
              colors={["#2DE2E2", "#0922A0"]}
              start={{ x: 0, y: -0.1 }}
              end={{ x: 0, y: 0.9 }}
              style={styles.gradientTrack}
            />
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={musicSliderValue}
              onValueChange={handleMusicChange}
              minimumTrackTintColor="transparent"
              maximumTrackTintColor="transparent"
              thumbTintColor="transparent"
            />
            {sliderMusicWidth > 0 && (
              <LinearGradient
                colors={["#2DE2E2", "#0922A0"]}
                start={{ x: 0, y: -0.1 }}
                end={{ x: 0, y: 0.9 }}
                style={[
                  styles.iconContainer,
                  {
                    width: svgBG,
                    height: svgBG,
                    left: musicIconPosition,
                  },
                ]}
              >
                <Music width={svgSize} height={svgSize} />
              </LinearGradient>
            )}
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default SoundSettings;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    position: "relative",
  },
  gradientTrack: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
    height: 10,
    marginHorizontal: 16,
  },
  slider: {
    width: "100%",
    height: 40,
    position: "absolute",
    top: -15,
  },
  iconContainer: {
    padding: 16,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: -25,
  },
});