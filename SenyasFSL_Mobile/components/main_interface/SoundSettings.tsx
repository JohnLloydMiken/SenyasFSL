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

interface SoundSettingsProps{
    onPress: ()=> void;
}

const SoundSettings: React.FC<SoundSettingsProps> = ({onPress}) => {
  const [sliderSoundWidth, setSliderSoundWidth] = useState(0);
  const [sliderMusicWidth, setSliderMusicWidth] = useState(0);
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 30 : 50;
  const svgBG = width < 768 ? 60 : 80;
  const [Soundvalue, setSoundValue] = useState(100);
  const [Musicvalue, setMusicValue] = useState(100);
  const SoundIconPosition = (sliderSoundWidth * Soundvalue) / 115 - svgSize / 2;
  const MusicIconPosition = (sliderMusicWidth * Musicvalue) / 115 - svgSize / 2;

  const handleSoundLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setSliderSoundWidth(width);
  };
  const handleMusicLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setSliderMusicWidth(width);
  };

  return (
    <LinearGradient
      colors={["#FB990F", "#EA0505"]} // orange to red
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{
        borderRadius: 16,
        padding: 3, // This controls the thickness of the border
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
              {/* Invisible text only to preserve size */}
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
                style={{ width: 40, height: 40 }} // same size as the icon
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
              {Soundvalue.toFixed()}%
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
              value={Soundvalue}
              onValueChange={setSoundValue}
              minimumTrackTintColor="transparent"
              maximumTrackTintColor="transparent"
              thumbTintColor="transparent"
            />
            {sliderSoundWidth > 0 && (
              <>
                <LinearGradient
                  colors={["#2DE2E2", "#0922A0"]}
                  start={{ x: 0, y: -0.1 }}
                  end={{ x: 0, y: 0.9 }}
                  style={{
                    padding: 16,
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                    width: svgBG,
                    height: svgBG,
                    left: SoundIconPosition,
                    top: -15,
                  }}
                >
                  <Sound width={svgSize} height={svgSize} />
                </LinearGradient>
              </>
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
              {Musicvalue.toFixed()}%
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
              value={Musicvalue}
              onValueChange={setMusicValue}
              minimumTrackTintColor="transparent"
              maximumTrackTintColor="transparent"
              thumbTintColor="transparent"
            />
            {sliderMusicWidth > 0 && (
              <>
                <LinearGradient
                  colors={["#2DE2E2", "#0922A0"]}
                  start={{ x: 0, y: -0.1 }}
                  end={{ x: 0, y: 0.9 }}
                  style={{
                    padding: 16,
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                    width: svgBG,
                    height: svgBG,
                    left: MusicIconPosition,
                    top: -15,
                  }}
                >
                  <Music width={svgSize} height={svgSize} />
                </LinearGradient>
              </>
            )}
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
export default SoundSettings
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
});
