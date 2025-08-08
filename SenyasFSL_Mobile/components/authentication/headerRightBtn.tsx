import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import React from "react";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useBottomSheet } from "@/modules/contextProvider";
import SVG_Achievement from "@/assets/svgs/Achievement.svg";
import SVG_LEaderboard from "@/assets/svgs/Leaderboard.svg";
import SVG_Streak from "@/assets/svgs/Streak.svg";
type headerBtnProps = {
  achievementCount: number;
  streakCount: number;
  onPressAchievement: () => void;
  onPressLeaderboards: () => void;
};
const headerRightBtn: React.FC<headerBtnProps> = ({
  achievementCount,
  streakCount,
  onPressAchievement,
  onPressLeaderboards,
}) => {
  const { openSheet, handleSheetRender } = useBottomSheet();

  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 25 : 35;
  return (
    <View className="flex flex-row justify-center items-center gap-4 mr-4 md:mr-8">
      <TouchableOpacity
        className="flex flex-row justify-center items-center"
        onPress={onPressAchievement}
        id="trophy"
      >
        <SVG_Achievement width={svgSize} height={svgSize} />
        <MaskedView
          maskElement={
            <Text className="font-PoppinsBold text-lg md:text-2xl">
              {achievementCount}
            </Text>
          }
        >
          <LinearGradient
            colors={["#2DE2E2", "#0922A0"]}
            start={{ x: 0, y: -0.1 }}
            end={{ x: 0, y: 0.8 }}
          >
            {/* Invisible text only to preserve size */}
            <Text
              style={{ opacity: 0 }}
              className="font-PoppinsBold text-lg md:text-2xl"
            >
              {achievementCount}
            </Text>
          </LinearGradient>
        </MaskedView>
      </TouchableOpacity>

      <TouchableOpacity id="leader" onPress={onPressLeaderboards}>
        <SVG_LEaderboard width={svgSize} height={svgSize} />
      </TouchableOpacity>

      <TouchableOpacity
        className="flex flex-row justify-center items-center"
        id="streak"
        onPress={() => {
          handleSheetRender("streak");
          openSheet();
        }}
      >
        <SVG_Streak width={svgSize} height={svgSize} />
        <MaskedView
          maskElement={
            <Text className="font-PoppinsBold text-lg md:text-2xl">
              {streakCount}
            </Text>
          }
        >
          <LinearGradient
            colors={["#FB990F", "#EA0505"]}
            start={{ x: 0, y: -0.1 }}
            end={{ x: 0, y: 0.8 }}
          >
            {/* Invisible text only to preserve size */}
            <Text
              style={{ opacity: 0 }}
              className="font-PoppinsBold text-lg md:text-2xl"
            >
              {streakCount}
            </Text>
          </LinearGradient>
        </MaskedView>
      </TouchableOpacity>
    </View>
  );
};
export default headerRightBtn;

const styles = StyleSheet.create({});
