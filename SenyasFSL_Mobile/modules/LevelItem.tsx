import React, { JSX } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { Level, LevelItemProps } from "./types/interface";
import Locked from "@/assets/svgs/locked.svg";
import Unlocked from "@/assets/svgs/Unlock.svg";
import Boss from "@/assets/svgs/boss.svg";

const LevelItem: React.FC<LevelItemProps> = ({ level, onLevelPress }) => {
  const isEven = level.id % 2 === 0;

  const getLevelIcon = (): JSX.Element => {
    if (level.isBoss) return <Boss />;
    if (!level.isUnlocked) return <Locked />;
    return <Unlocked />;
  };

  const handlePress = (): void => {
    if (level.isUnlocked) {
      onLevelPress(level);
    }
  };

  return (
    <View style={styles.levelRow}>
      {/* Left placeholder for even levels */}
      {isEven && <View  />}

      {/* Icon container */}
      <TouchableOpacity
        disabled={!level.isUnlocked}
        onPress={handlePress}
        style={styles.iconWrapper}
      >
        {getLevelIcon()}
      </TouchableOpacity>

      {/* Right placeholder for odd levels */}
      {!isEven && <View  />}
    </View>
  );
};

const styles = StyleSheet.create({
  levelRow: {
    flexDirection: "row",
    width: "70%",
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "space-evenly",
    marginHorizontal: "auto"
  } as ViewStyle,
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: "transparent",
  } as ViewStyle,
  flexSpace: {
    flex: 1, // takes up remaining space to push icon to one side
  } as ViewStyle,
});

export default LevelItem;
