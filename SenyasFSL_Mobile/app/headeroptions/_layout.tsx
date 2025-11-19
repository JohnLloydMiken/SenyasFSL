import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import BackBTN from "@/components/authentication/headeroptionBackBTN";
import { View } from "react-native";
import { useCallback } from "react";

export default function LeaderboardsLayout() {
  const router = useRouter();

  // Memoized backgrounds - these are fine
  const BlueHeader = useCallback(() => (
    <LinearGradient
      colors={["#2DE2E2", "#0922A0"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: -0.1 }}
      end={{ x: 0, y: 1 }}
    />
  ), []);

  const BlueShadeHeader = useCallback(() => (
    <LinearGradient
      colors={["#FB990F", "#EA0505"]}
      style={{ flex: 1, position: "relative" }}
      start={{ x: 0, y: -0.1 }}
      end={{ x: 0, y: 0.9 }}
    />
  ), []);

  // Fixed: Use useCallback for component functions
  const headerLeft = useCallback(
    () => <BackBTN onPress={() => router.back()} />,
    [router]
  );

  // Fixed: Use useCallback instead of useMemo
  const headerRight = useCallback(
    () => <View style={{ width: 50 }} />,
    []
  );

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Achievement",
          headerBackground: BlueHeader,
          headerLeft,
          headerRight,
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
          headerBackground: BlueShadeHeader,
          headerLeft,
          headerRight,
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