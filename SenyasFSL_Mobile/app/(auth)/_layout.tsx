import { Stack } from "expo-router";
import GoBackBTN from "@/components/authentication/GoBackBTN";
import { View, Text } from "react-native";
import {
  ProgressbarWidth,
  ProgressbarHeight,
  ProgressbarCP,
} from "@/utils/sizes";
import { useAuth ,AuthProvider } from "@/services/auth/AuthProvider";
export default function GetStarted(){
 return(

    <GetStartedLayout>
    </GetStartedLayout>

 )
}


 const GetStartedLayout = () =>{
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
            <GoBackBTN onPress={() => navigation.push("index")} />
          ),
          headerStyle: {
            backgroundColor: "#FAF3E0",
          },
          headerShadowVisible: false,
          gestureEnabled: false,
          animation: "fade",
        })}
      />

      <Stack.Screen
        name="login"
        options={({ navigation }) => ({
          headerTitle: "",
          headerLeft: () => (
            <GoBackBTN onPress={() => navigation.push("index")} />
          ),
          headerStyle: {
            backgroundColor: "#FAF3E0",
          },
          headerShadowVisible: false,
          gestureEnabled: false,
          animation: "fade",
        })}
      />

      <Stack.Screen
        name="register_whyFSL"
        options={({ navigation }) => ({
          headerTitle: () => (
            <View
              style={{
                width: ProgressbarWidth(),
                height: ProgressbarHeight(),
                backgroundColor: "#FFEEB9",
                borderRadius: 20,
              }}
              className="ml-2 md:ml-4"
            >
              <View
                style={{
                  width: ProgressbarCP(),
                  height: ProgressbarHeight(),
                  backgroundColor: "#FB990F",
                  borderRadius: 20,
                }}
              ></View>
            </View>
          ),
          headerLeft: () => (
            <GoBackBTN onPress={() => navigation.push("register")} />
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
          animation: "fade",
        })}
      />
      <Stack.Screen
        name="register_how"
        options={({ navigation }) => ({
          headerTitle: () => (
            <View
              style={{
                width: ProgressbarWidth(),
                height: ProgressbarHeight(),
                backgroundColor: "#FFEEB9",
                borderRadius: 20,
              }}
              className="ml-2 md:ml-4"
            >
              <View
                style={{
                  height: ProgressbarHeight(),
                  width: ProgressbarCP() * 2,
                  backgroundColor: "#FB990F",
                  borderRadius: 20,
                }}
              ></View>
            </View>
          ),
          headerLeft: () => (
            <GoBackBTN onPress={() => navigation.push("register_whyFSL")} />
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
          animation: "fade",
        })}
      />
      <Stack.Screen
        name="register_last"
        options={({ navigation }) => ({
          headerTitle: () => (
            <View
              style={{
                width: ProgressbarWidth(),
                height: ProgressbarHeight(),
                backgroundColor: "#FFEEB9",
                borderRadius: 20,
              }}
              className="ml-2 md:ml-4"
            >
              <View
                style={{
                  height: ProgressbarHeight(),
                  width: ProgressbarCP() * 3,
                  backgroundColor: "#FB990F",
                  borderRadius: 20,
                }}
              ></View>
            </View>
          ),
          headerLeft: () => (
            <GoBackBTN onPress={() => navigation.push("register_how")} />
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
          animation: "fade",
        })}
      />
      <Stack.Screen
        name="sign_up"
        options={({ navigation }) => ({
          headerTitle: () => (
            <View
              style={{
                width: ProgressbarWidth(),
                height: ProgressbarHeight(),
                backgroundColor: "#FFEEB9",
                borderRadius: 20,
              }}
              className="ml-2 md:ml-4"
            >
              <View
                style={{
                  height: ProgressbarHeight(),
                  width: ProgressbarCP() * 4,
                  backgroundColor: "#FB990F",
                  borderRadius: 20,
                }}
              ></View>
            </View>
          ),
          headerLeft: () => (
            <GoBackBTN onPress={() => navigation.push("register_last")} />
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
          animation: "fade",
        })}
      />
      <Stack.Screen
        name="congrast"
        options={{
          headerShown: false,
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="welcome"
        options={{
          headerShown: false,
          animation: "fade",
        }}
      />
    </Stack>
  );
}
