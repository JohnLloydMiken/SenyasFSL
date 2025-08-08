import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Home from "@/assets/svgs/Home.svg";
import Home_Locked from "@/assets/svgs/Home_locked.svg";
import Profile from "@/assets/svgs/Profile.svg";
import Profile_Locked from "@/assets/svgs/Profile_locked.svg";

type IconProp = {
  focused: boolean;
};

const HomeIcon: React.FC<IconProp> = ({ focused }) => {
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 24 : 50;
  const path = () => {
    if (focused) {
      return <Home width={svgSize} height={svgSize} />;
    } else {
      return <Home_Locked width={svgSize} height={svgSize} />;
    }
  };

  return path();
};

export default HomeIcon;

const styles = StyleSheet.create({});
