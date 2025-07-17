import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Profile from "@/assets/svgs/Profile.svg";
import Profile_Locked from "@/assets/svgs/Profile_locked.svg";
type IconProp = {
  focused: boolean;
};

const ProfileIcon: React.FC<IconProp> = ({ focused }) => {
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 24 : 50;
  const path = () => {
    if (focused) {
      return <Profile width={svgSize} height={svgSize} />;
    } else {
      return <Profile_Locked width={svgSize} height={svgSize} />;
    }
  };

  return path();
};

export default ProfileIcon;

const styles = StyleSheet.create({});
