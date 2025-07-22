import {
  View,
  useWindowDimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import Setting from "@/assets/svgs/Settings.svg";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import Slider from "@react-native-community/slider";
interface SettingsProps {
    toggled: boolean;
    onPress : ()=> void;
}

const Settings: React.FC<SettingsProps> = ({toggled, onPress}) => {
  const [isPressed, setIsPressed] = useState(false);
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 44 : 55;
  return (
    <>
      <TouchableOpacity onPress={onPress}>
        <Setting width={svgSize} height={svgSize} />
      </TouchableOpacity>

      
      {toggled && (
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
            position: 'absolute',
            left: '50%',
            top: '-200%',
            transform: 'translate(50%, 50%)',
            zIndex: 50
            
          }}
        >
            <View className="bg-[#FFFBF1] p-4 rounded-2xl ">

            </View>
        </LinearGradient>
      )}
    </>
  );
};

export default Settings;
