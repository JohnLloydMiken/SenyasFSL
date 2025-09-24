import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import BackBTN from "@/components/authentication/headeroptionBackBTN";
import { View } from "react-native";
export default function LeaderboardsLayout() {
  const router = useRouter();
  const BlueHeader = () => (
    <LinearGradient
      colors={["#2DE2E2", "#0922A0"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: -0.1 }}
      end={{ x: 0, y: 1 }}
    />
  );

  const BlueShadeHeader = () => (
    <LinearGradient
      colors={["#FB990F", "#EA0505"]} // blue shades top to bottom
      style={{ flex: 1, position: "relative" }}
      start={{ x: 0, y: -0.1 }}
      end={{ x: 0, y: 0.9 }}
    />
  );
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Achievement",
          headerBackground: () => <BlueHeader />,
          headerLeft: () => <BackBTN onPress={() => router.back()} />,
          headerRight: () => <View style={{ width: 50 }} />,
          headerTitleStyle: {
            fontFamily: "Poppins-Bold",
            color: "white",
          },
        }}
      />
      <Stack.Screen
        name="leaderboards"
        options={{
          headerTitle: "Leaderboards",
          headerBackground: () => <BlueShadeHeader />,
          headerLeft: () => <BackBTN onPress={() => router.back()} />,
          headerRight: () => <View style={{ width: 50 }} />,
          headerTitleStyle: {
            fontFamily: "Poppins-Bold",
            color: "white",
          },
          headerShadowVisible: true,
        }}
      />
      <Stack.Screen name="streak" />
    </Stack>
  );
}
