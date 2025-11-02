import { View, Text, useWindowDimensions } from "react-native";
import React from "react";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import Streak from "@/assets/svgs/Streak.svg";
import Protection from "@/assets/svgs/Protection.svg";

// --- Helper Functions for Date Logic ---

/**
 * Gets the 7 days of the current week, starting from Sunday.
 * Returns an array of objects: { date: Date, name: string, dayIndex: number }
 */
const getWeekDays = () => {
  const days = [];
  const today = new Date();
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  
  // Get the date for the previous Sunday (dayIndex = 0)
  const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

  for (let i = 0; i < 7; i++) {
    const date = new Date(firstDayOfWeek);
    date.setDate(date.getDate() + i);
    days.push({
      date: date,
      name: dayNames[i],
      dayIndex: i, // 0 for Sunday, 1 for Monday, etc.
    });
  }
  return days;
};

/**
 * Checks if a specific date is the current day.
 */
const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * NEW: Checks if a day's index is in the activityDays array.
 */
const isDayActive = (dayIndex: number, activityDays: number[]) => {
  // Check if the array [5, 6] includes the current day's index (e.g., 1 for Monday)
  return activityDays.includes(dayIndex);
};

// --- Component ---

interface streakProps {
  currentStreak: number;
  streakFreezes: number;
  activityDays: number[]; // e.g., [5, 6]
}

const UserStreak: React.FC<streakProps> = ({
  currentStreak = 0,
  streakFreezes = 0,
  activityDays = [],
}) => {
  const { width } = useWindowDimensions();
  const svgStreak = width < 768 ? 150 : 200;
  const svgProtection = width < 768 ? 35 : 50;
  
  const weekDays = getWeekDays();

  return (
    <View className="w-11/12 p-2 bg-[#FAF3E0] rounded-2xl">
      {/* (Streak Count and Protection Count... no changes here) */}
      <View className=" w-1/2 absolute -top-2/3 left-[31%]">
        <View>
          <Streak width={svgStreak} height={svgStreak} />
        </View>
        <MaskedView
          style={{ zIndex: 50, position: "absolute", left: "43%", top: "70%" }}
          maskElement={
            <Text className="text-2xl font-PoppinsBold ">{currentStreak}</Text>
          }
        >
          <LinearGradient
            colors={["#FB990F", "#EA0505"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.8 }}
          >
            <Text
              style={{ opacity: 0 }}
              className="text-2xl font-PoppinsBold  "
            >
              {currentStreak}
            </Text>
          </LinearGradient>
        </MaskedView>
      </View>
      
      <View className="flex-row justify-center items-center absolute right-3 top-3">
        <View>
          <Protection width={svgProtection} height={svgProtection} />
        </View>
        <MaskedView
          maskElement={
            <Text className="text-2xl font-PoppinsBold ">
              {streakFreezes}
            </Text>
          }
        >
          <LinearGradient
            colors={["#2DE2E2", "#0922A0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.8 }}
          >
            <Text
              style={{ opacity: 0 }}
              className="text-2xl font-PoppinsBold  "
            >
              {streakFreezes}
            </Text>
          </LinearGradient>
        </MaskedView>
      </View>

      <View className="mb-4 mt-10">
        <Text className="text-center font-PoppinsBold text-2xl md:text-3xl my-3">
          {currentStreak} day streak!
        </Text>
        
        {/*Calendar Container */}
        <View className=" flex-row w-11/12 justify-between items-center mx-auto">
          
          {weekDays.map((day) => {
            // UPDATED LOGIC:
            const isActive = isDayActive(day.dayIndex, activityDays);
            const isCurrentDay = isToday(day.date);

            return (
              <View
                key={day.name}
                className="flex-col justify-center items-center"
              >
                <View
                  className={`w-10 h-10 rounded-full border-2 bg-white ${
                    isCurrentDay ? "border-blue-500" : "border-[#FFC38B]"
                  }`}
                >
                  <View className="absolute -top-3 -left-3">
                    {isActive ? <Streak width={50} height={50} /> : null}
                  </View>
                </View>
                
                {isActive ? (
                  <MaskedView
                    maskElement={
                      <Text className="text-center text-xl font-PoppinsSemiBold">
                        {day.name}
                      </Text>
                    }
                  >
                    <LinearGradient
                      colors={["#FB990F", "#EA0505"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 0.8 }}
                    >
                      <Text
                        className="text-center text-xl font-PoppinsSemiBold"
                        style={{ opacity: 0 }}
                      >
                        {day.name}
                      </Text>
                    </LinearGradient>
                  </MaskedView>
                ) : (
                  <Text className="text-center text-xl font-PoppinsSemiBold text-[#888888]">
                    {day.name}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default UserStreak;