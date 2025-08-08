import {
  View,
  useWindowDimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import Setting from "@/assets/svgs/Settings.svg";
import React from "react";


interface SettingsProps {

    onPress : ()=> void;
}

const Settings: React.FC<SettingsProps> = ({ onPress}) => {
  const [isPressed, setIsPressed] = useState(false);
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 44 : 55;
  return (
 
      <TouchableOpacity onPress={onPress}>
        <Setting width={svgSize} height={svgSize} />
      </TouchableOpacity>
  );
};

export default Settings;
