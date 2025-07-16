import { Stack } from "expo-router";
import GoBackBTN from "@/components/GoBackBTN";
import { View, Text, useWindowDimensions } from "react-native";
export default function GetStartedLayout() {
  const { width } = useWindowDimensions();
  const progressbarWidth = width < 768 ? 280 : 600;
  const progressbarHeight = width < 768 ? 20 : 30;

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="register"
        options={({ navigation }) => ({
          headerTitle: "",
          headerLeft: () => (
            <GoBackBTN onPress={() => navigation.replace("index")} />
          ),
          headerStyle: {
            backgroundColor: "#FAF3E0",
          },
          headerShadowVisible: false,
          gestureEnabled: false,
        })}
      />

      <Stack.Screen
        name="login"
        options={({ navigation }) => ({
          headerTitle: "",
          headerLeft: () => (
            <GoBackBTN onPress={() => navigation.replace("index")} />
          ),
          headerStyle: {
            backgroundColor: "#FAF3E0",
          },
          headerShadowVisible: false,
          gestureEnabled: false,
        })}
      />

      <Stack.Screen
        name="register_whyFSL"
        options={({ navigation }) => ({
          headerTitle: () => (
            <View
              style={{
                width: progressbarWidth,
                height: progressbarHeight,
                backgroundColor: "#FFEEB9",
                borderRadius: 20,
              }}
              className="ml-2 md:ml-4"
            >
              <View
                style={{
                  height: progressbarHeight,
                  width: 150,
                  backgroundColor: "#FB990F",
                  borderRadius: 20,
                }}
              ></View>
            </View>
          ),
          headerLeft: () => (
            <GoBackBTN onPress={() => navigation.replace("register")} />
          ),

          headerRight: () => (
            <Text className="text-sm font-PoppinsRegular md:text-xl md:mr-10">
              1/4
            </Text>
          ),
          headerStyle: {
            backgroundColor: "#FAF3E0",
          },
          headerShadowVisible: false,
          gestureEnabled: false,
        })}
      />
      <Stack.Screen
        name="register_how"
        options={({ navigation }) => ({
          headerTitle: () => (
            <View
              style={{
                width: progressbarWidth,
                height: progressbarHeight,
                backgroundColor: "#FFEEB9",
                borderRadius: 20,
              }}
              className="ml-2 md:ml-4"
            >
              <View
                style={{
                  height: progressbarHeight,
                  width: 300,
                  backgroundColor: "#FB990F",
                  borderRadius: 20,
                }}
              ></View>
            </View>
          ),
          headerLeft: () => (
            <GoBackBTN onPress={() => navigation.replace("register_whyFSL")} />
          ),

          headerRight: () => (
            <Text className="text-sm font-PoppinsRegular md:text-xl md:mr-7">
              2/4
            </Text>
          ),
          headerStyle: {
            backgroundColor: "#FAF3E0",
          },
          headerShadowVisible: false,
          gestureEnabled: false,
        })}
      />
      <Stack.Screen
        name="register_last"
        options={({ navigation }) => ({
          headerTitle: () => (
            <View
              style={{
                width: progressbarWidth,
                height: progressbarHeight,
                backgroundColor: "#FFEEB9",
                borderRadius: 20,
              }}
              className="ml-2 md:ml-4"
            >
              <View
                style={{
                  height: progressbarHeight,
                  width: 450,
                  backgroundColor: "#FB990F",
                  borderRadius: 20,
                }}
              ></View>
            </View>
          ),
          headerLeft: () => (
            <GoBackBTN onPress={() => navigation.replace("register_how")} />
          ),

          headerRight: () => (
            <Text className="text-sm font-PoppinsRegular md:text-xl md:mr-7">
              3/4
            </Text>
          ),
          headerStyle: {
            backgroundColor: "#FAF3E0",
          },
          headerShadowVisible: false,
          gestureEnabled: false,
        })}
      />
      <Stack.Screen
        name="sign_up"
        options={({ navigation }) => ({
          headerTitle: () => (
            <View
              style={{
                width: progressbarWidth,
                height: progressbarHeight,
                backgroundColor: "#FFEEB9",
                borderRadius: 20,
              }}
              className="ml-2 md:ml-4"
            >
              <View
                style={{
                  height: progressbarHeight,
                  width: 600,
                  backgroundColor: "#FB990F",
                  borderRadius: 20,
                }}
              ></View>
            </View>
          ),
          headerLeft: () => (
            <GoBackBTN onPress={() => navigation.replace("register_last")} />
          ),

          headerRight: () => (
            <Text className="text-sm font-PoppinsRegular md:text-xl md:mr-7">
              4/4
            </Text>
          ),
          headerStyle: {
            backgroundColor: "#FAF3E0",
          },
          headerShadowVisible: false,
          gestureEnabled: false,
        })}
      />
      <Stack.Screen
        name="congrast"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="welcome"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
