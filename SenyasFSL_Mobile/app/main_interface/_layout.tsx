import React from 'react';
import { Text, View, TouchableOpacity, useWindowDimensions, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Tabs, useRouter } from 'expo-router';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

import Curency from '@/components/curency';
import HeaderRightBtn from '@/components/headerRightBtn';
import HomeIcon from '@/components/homeIcon';
import ProfileIcon from '@/components/profileIcon';
import DictionaryIcon from '@/components/dictionaryIcon';
import TreasureIcon from '@/components/treasureIcon';
import UserStreak from '@/components/userStreak';
import UserInput from '@/components/userInput';
import Authbutton from '@/components/button';

import { BottomSheetProvider, useBottomSheet } from '@/modules/contextProvider';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetProvider>
        <TabsWithBottomSheet />
      </BottomSheetProvider>
    </GestureHandlerRootView>
  );
}

function TabsWithBottomSheet() {
  const { bottomSheetRef, handleSheetChanges, isSheetOpen, sheet } = useBottomSheet();
  const router = useRouter();
  const {width} = useWindowDimensions()
  const titleSize = width < 768 ? 12 : 18
  const getSnapPoints = () => {
  switch (sheet) {
    case 'streak':
      return ['50%']; // shorter content
    case 'editData':
    case 'editPass':
      return ['60%']; // forms take more space
    default:
      return ['1%']; // or a closed value; used when sheet is null
  }
};


 
  return (
    <>
      <Tabs
        initialRouteName="index"
        screenOptions={{
          headerTitle: '',
          tabBarStyle: isSheetOpen ? { display: 'none' } : {},
          headerLeft: () => <Curency number={100} />,
          headerRight: () => (
            <HeaderRightBtn
              achievementCount={0}
              streakCount={0}
              onPressAchievement={() => router.push('./headeroptions/')}
              onPressLeaderboards={() => router.push('../headeroptions/leaderboards')}
            />
          ),
          headerStyle: {
            borderBottomWidth: 0.5,
            borderBottomColor: 'black',
            backgroundColor: '#fff',
          },
          headerShadowVisible: false,
          tabBarActiveTintColor: '#EA0505',
          tabBarInactiveTintColor: '#8B8B8B',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            
            tabBarIcon: ({ focused }) => <HomeIcon focused={focused} />,
            title: 'Home',
            tabBarLabelStyle:{
              fontSize: titleSize,
            },
            tabBarLabelPosition: 'below-icon',
            tabBarIconStyle:{
              marginTop: 4
            },
            
          }}
        />
        <Tabs.Screen
          name="treasure"
          options={{
            
            tabBarIcon: ({ focused }) => <TreasureIcon focused={focused} />,
            title: 'Treasure',
            tabBarLabelStyle:{
              fontSize: titleSize,
            },
            tabBarLabelPosition: 'below-icon',
             tabBarIconStyle:{
              marginTop: 4
            },
          }}
        />
        <Tabs.Screen
          name="dictionary"
          options={{
           
            tabBarIcon: ({ focused }) => <DictionaryIcon focused={focused} />,
            title: 'Dictionary',
            tabBarLabelStyle:{
              fontSize: titleSize,
            },
            tabBarLabelPosition: 'below-icon',
             tabBarIconStyle:{
              marginTop: 4
            },
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
         
            tabBarIcon: ({ focused }) => <ProfileIcon focused={focused} />,
            title: 'Profile',
            tabBarLabelStyle:{
              fontSize: titleSize,
            },
            tabBarLabelPosition: 'below-icon',
             tabBarIconStyle:{
              marginTop: 4
            },
          }}
        />
      </Tabs>

      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
         index={sheet === null ? -1 : 0}
        snapPoints={getSnapPoints()}
        enablePanDownToClose
      >
        <BottomSheetView
          style={styles.container}
        >
          {sheet === 'streak' && (
            <>
               <View className="w-full  relative flex-col justify-center items-center  h-full">
                <UserStreak streakCount={1} protectionCount={1} />
           
              <TouchableOpacity className="w-11/12 p-4 bg-[#FB990F] rounded-xl  absolute bottom-4">
                <Text className="font-PoppinsBold text-2xl text-center text-white">Share your Streak</Text>
              </TouchableOpacity>
               </View>
            </>
          )}

          {sheet === 'editData' && (
            <>
              <UserInput
                title="Edit personal data"
                usernameTitle="Username"
                userEmailTitle="Email"
                userPasswordTitle="Current password"
                passwordTitleDescription="Type in your password to update your email"
              />
              <View className="w-11/12 absolute bottom-1">
                <Authbutton content="Save changes" onPress={() => bottomSheetRef.current?.close()} />
              </View>
            </>
          )}

          {sheet === 'editPass' && (
            <>
              <UserInput
              title="Edit personal data"
                usernameTitle="Username"
                userEmailTitle="Email"
                userPasswordTitle="Current password"
                passwordTitleDescription="Type in your password to update your email"
              />
              <View className="w-11/12 absolute bottom-1">
                <Authbutton content="Update password" onPress={() => bottomSheetRef.current?.close()} />
              </View>
            </>
          )}

  
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    position: 'relative',
    width: '100%',
    height: '100%'
  
  },
  
});
