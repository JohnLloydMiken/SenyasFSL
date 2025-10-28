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
import { getFunctions, httpsCallable } from "firebase/functions"; 

interface LeaderboardItem {
  rank: number;
  name: string;
  score: number;
}

type LeaderboardData = {
  daily: LeaderboardItem[];
  weekly: LeaderboardItem[];
  monthly: LeaderboardItem[];
};

interface CurrentUserInfo {
  rank: number;
  name: string;
  score: number;
}

interface LeaderboardPayload {
  leaderboardData: LeaderboardData;
  currentUserInfo: CurrentUserInfo;
}

export default function AchievementComponent() {
  const [selected, setSelected] = useState<"daily" | "weekly" | "monthly">("daily");
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const functionsInstance = getFunctions();
        const getLeaderboard = httpsCallable<void, LeaderboardPayload>(
          functionsInstance,
          "getLeaderboard"
        );
        const result = await getLeaderboard();
        setLeaderboard(result.data.leaderboardData);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (isLoading) return <Text style={styles.loadingText}>Loading...</Text>;
  if (error) return <Text style={styles.errorText}>{error}</Text>;
  if (!leaderboard) return <Text style={styles.errorText}>No leaderboard data found.</Text>;

  const currentLeaderboardData = leaderboard[selected] || [];
  const topThree = currentLeaderboardData.slice(0, 3);
  const rest = currentLeaderboardData.slice(3);

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: "center",
        paddingBottom: 40,
        backgroundColor: "#FAF3E0",
        flexGrow: 1,
      }}
    >
      {/* Header */}
      <Text className="font-PoppinsBold text-3xl md:text-4xl mt-8 text-[#333]">
        🏆 Leaderboard
      </Text>

      {/* Tabs */}
      <View
        className="w-11/12 flex-row mx-auto items-center justify-center mt-6 rounded-xl overflow-hidden border border-[#E5E0C9]"
        style={{ backgroundColor: "#FFF8E6", elevation: 3 }}
      >
        {(["daily", "weekly", "monthly"] as const).map((key) => (
          <TouchableOpacity
            key={key}
            className={`flex-1 p-3 ${
              selected === key ? "bg-[#EFDDAF]" : "bg-[#FFF8E6]"
            }`}
            onPress={() => setSelected(key)}
          >
            <Text
              className={`text-center font-PoppinsSemiBold text-lg md:text-xl capitalize ${
                selected === key ? "text-black" : "text-gray-600"
              }`}
            >
              {key}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Top 3 Podium */}
      {topThree.length === 3 && (
        <View className="w-11/12 my-6">
          <View className="flex-row items-end justify-center gap-3">
            <Podium
              medal={require("@/assets/images/SilverMedal.png")}
              name={topThree[1].name}
              score={topThree[1].score}
              rank={topThree[1].rank}
              height={160}
              color="#C0C0C0"
            />
            <Podium
              medal={require("@/assets/images/GoldMedal.png")}
              name={topThree[0].name}
              score={topThree[0].score}
              rank={topThree[0].rank}
              height={210}
              color="#FFD700"
            />
            <Podium
              medal={require("@/assets/images/BronzeMedal.png")}
              name={topThree[2].name}
              score={topThree[2].score}
              rank={topThree[2].rank}
              height={130}
              color="#CD7F32"
            />
          </View>
        </View>
      )}

      {/* Rest of Leaderboard */}
      <View className="w-11/12 mt-2">
        {rest.length > 0 ? (
          rest.map((item) => (
            <View
              key={`${item.rank}-${item.name}`}
              className="w-full p-4 flex-row justify-between items-center my-2 bg-white rounded-xl shadow-sm border border-[#E9E9E9]"
            >
              <Text className="font-PoppinsBold text-lg text-[#333]">{item.rank}</Text>
              <Text
                className="font-PoppinsSemiBold text-lg md:text-xl text-[#2D2D2D]"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ flex: 1, textAlign: "center" }}
              >
                {item.name}
              </Text>
              <Text className="text-[#B5B5B5] font-PoppinsRegular text-base">
                {item.score} pts
              </Text>
            </View>
          ))
        ) : (
          // No data state
          <View className="w-full bg-white rounded-2xl p-8 mt-6 shadow-sm">
            <Text className="text-center text-gray-500 font-PoppinsRegular text-lg">
              No leaders yet for the {selected} board.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// Podium Component
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
    <View className="w-1/3 items-center">
      <Image
        source={medal}
        style={{ width: 40, height: 40, resizeMode: "contain", marginBottom: 4 }}
      />
      <Text
        className="font-PoppinsSemiBold text-lg md:text-xl text-black"
        numberOfLines={1}
      >
        {name}
      </Text>
      <Text className="text-base font-PoppinsRegular text-gray-600">{score} pts</Text>
      <View
        className="w-10/12 mt-2 rounded-t-xl flex items-center justify-center shadow-md"
        style={{ backgroundColor: color, height }}
      >
        <Text className="font-PoppinsBold text-2xl text-white">{rank}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 18,
    color: "#444",
  },
  errorText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 18,
    color: "red",
  },
});
