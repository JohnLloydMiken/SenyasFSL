// components/LevelItem.tsx
import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Level, LevelItemProps } from "./types/interface";
import Locked from "@/assets/svgs/locked.svg";
import Unlocked from "@/assets/svgs/Unlock.svg";
import Boss from "@/assets/svgs/boss.svg";

const LevelItem: React.FC<LevelItemProps> = ({
  level,
  index,
  onLevelPress,
}) => {
  const isEven = level.id % 2 === 0;

  const getLevelIcon = (): any => {
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
      {/* Empty space for right-aligned levels */}
      {isEven && <View  />}

      <TouchableOpacity disabled={!level.isUnlocked} onPress={handlePress}>
        {getLevelIcon()}
      </TouchableOpacity>

      {/* Empty space for left-aligned levels */}
      {!isEven && <View style={{marginLeft: 100}}   />}
    </View>
  );
};

const styles = StyleSheet.create({
  levelRow: {
    flexDirection: "row",
    width: "100%",
    marginVertical: 20,
    alignItems: "center",
    justifyContent: 'center',
  } as ViewStyle,
  levelContainer: {
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
  } as ViewStyle,
  leftAligned: {
    marginLeft: 20,
  } as ViewStyle,
  rightAligned: {
    marginRight: 20,
  } as ViewStyle,

  levelNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  } as TextStyle,
  starContainer: {
    flexDirection: "row",
    marginTop: 5,
  } as ViewStyle,
  star: {
    fontSize: 12,
    marginHorizontal: 1,
  } as TextStyle,
});

export default LevelItem;
