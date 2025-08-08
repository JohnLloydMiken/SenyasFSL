import {
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import BurgerBtn from "@/assets/svgs/ThreeLines.svg";

interface BtnProps {
  onPress: () => void;
}
const BackToLevelsBtn: React.FC<BtnProps> = ({ onPress }) => {
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 25 : 40;
  return (
    <TouchableOpacity onPress={onPress}>
      <BurgerBtn width={svgSize} height={svgSize} />
    </TouchableOpacity>
  );
};

export default BackToLevelsBtn;
const styles = StyleSheet.create({});
