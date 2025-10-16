import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Image,
  ImageSourcePropType,
} from "react-native";
import React, { useEffect, useState } from "react";
import Leaderboards from "@/json_files/leaderboards.json";

// Type for one leaderboard entry
interface LeaderboardItem {
  rank: number;
  name: string;
  score: number;
}
type LeaderboardData = {
  daily?: any[];
  weekly?: any[];
  monthly?: any[];
};

export default function AchievementComponent() {
  const [selected, setSelected] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );
const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null);

  // Type-cast the imported JSON
  const leaderboardData = Leaderboards as LeaderboardItem[];

  const topThree = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);
  const { width } = useWindowDimensions();
  const svgSize = width < 768 ? 20 : 30;




  if (!leaderboard) return <Text>Loading...</Text>;

  return (
    <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 20, backgroundColor: '#FAF3E0' }}>
      {/* Tabs */}
      <View
        className="w-11/12 flex-row mx-auto items-center justify-center my-4"
        style={{ backgroundColor: "white", elevation: 5 }}
      >
        {(["daily", "weekly", "monthly"] as const).map((key) => (
          <TouchableOpacity
            key={key}
            className={`w-1/3 p-2 border border-black/5 ${
              selected === key ? "bg-[#EFDDAF]" : "bg-[#FFFBF1]"
            }`}
            onPress={() => setSelected(key)}
          >
            <Text className="text-center font-PoppinsRegular text-lg md:text-2xl capitalize">
              {key}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Top 3 Podium */}
      {topThree.length === 3 && (
        <View className="w-11/12 my-4">
          <View className="flex-row items-end justify-center gap-2">
            {/* 2nd place */}
            <Podium
              medal={require("@/assets/images/SilverMedal.png")}
              name={topThree[1].name}
              score={topThree[1].score}
              rank={topThree[1].rank}
              height={160}
              color="#B5B5B5"
            />
            {/* 1st place */}
            <Podium
              medal={require("@/assets/images/GoldMedal.png")}
              name={topThree[0].name}
              score={topThree[0].score}
              rank={topThree[0].rank}
              height={200}
              color="#FFC600"
            />
            {/* 3rd place */}
            <Podium
              medal={require("@/assets/images/BronzeMedal.png")}
              name={topThree[2].name}
              score={topThree[2].score}
              rank={topThree[2].rank}
              height={120}
              color="#A35E24"
            />
          </View>
        </View>
      )}

      {/* Rest of Leaderboard */}
      {rest.map((item) => (
        <View
          key={item.rank}
          className="w-11/12 mx-auto p-4 flex-row justify-between items-center my-3 bg-white rounded-md"
        >
          <Text className="font-PoppinsBold">{item.rank}</Text>
          <Text className="font-PoppinsBold text-xl md:text-2xl">{item.name}</Text>
          <Text className="text-[#B5B5B5] font-PoppinsRegular">
            {item.score} points
          </Text>
        </View>
      ))}

      {/* Bottom bar */}
      <View className="w-full h-10 bg-red-400 my-4" />
    </ScrollView>
  );
}

// Props type for Podium
interface PodiumProps {
  medal: ImageSourcePropType;
  name: string;
  score: number;
  rank: number;
  height: number;
  color: string;
}

function Podium({ medal, name, score, rank, height, color }: PodiumProps) {
  return (
    <View className="w-1/3">
      <View className="flex-col items-center justify-center w-10/12 mx-auto gap-2">
        <Image
          source={medal}
          style={{ width: 30, height: 30, resizeMode: "contain" }}
        />
        <Text className="font-PoppinsRegular text-lg md:text-xl text-black">
          {name}
        </Text>
        <Text className="text-lg md:text-xl font-PoppinsRegular" style={{ color }}>
          {score}
        </Text>
      </View>
      <View
        className="w-full rounded-t-md flex items-center justify-center"
        style={{ backgroundColor: color, height }}
      >
        <Text className="font-PoppinsBold text-xl md:text-2xl">{rank}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
