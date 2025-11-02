import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import UserStreak from "@/components/main_interface/userStreak";
import { useAuthStore } from "@/utils/store/useAuthStore";
import { useUserStore } from "@/utils/store/useUserStore";
import { shareStreak } from "@/utils/shareUtils"; // (adjust path if needed)
interface CurrentStreakProps {
  onContinue: () => void;
  onShare: () => void;
}

const CurrentStreak: React.FC<CurrentStreakProps> = ({
  onContinue,
  onShare,
}) => {
  const { user, loading: authLoading } = useAuthStore();
  const { userData, loading: userLoading } = useUserStore();
  if (userLoading) {
    return (
      <View className="flex-1 bg-[#FAF3E0] justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View className="flex-1 bg-[#FAF3E0] justify-center items-center">
        <Text>Could not load user profile. Please try again later.</Text>
      </View>
    );
  }
  return (
    <View className="bg-white flex-1 justify-center items-center">
       <UserStreak 
                  streakFreezes={userData.streakFreezes} 
                  currentStreak={userData.currentStreak} 
                  activityDays={userData.activityDays} 
                />
      <Text className="font-PoppinsSemiBold text-sm md:text-lg text-center w-11/12 mt-4">
        Congratulation on your daily streak! Practice every day so it
        won’t reset!
      </Text>
      <View className="w-11/12 gap-2 absolute bottom-8">
        <TouchableOpacity
          className="w-full bg-[#FB990F] p-4 rounded-lg"
          onPress={onContinue}
        >
          <Text className="text-center font-PoppinsBold text-2xl md:text-3xl text-white">
            Continue
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-full border-4 p-4 rounded-lg border-[#FB990F]"
           onPress={() => shareStreak(userData.currentStreak)}
        >
          <Text className="text-center font-PoppinsBold text-2xl md:text-3xl text-[#FB990F]">
            Share your streak
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CurrentStreak;
