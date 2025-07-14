import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Button } from 'react-native'
import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'
import UserStreak from '@/modules/userStreak'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useBottomSheet } from '@/modules/contextProvider';

export default function Profile() {
  const [editUserData, setEditUserData] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const {handleSheetRender, openSheet} = useBottomSheet();
 

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setEditUserData(false); // Close sheet when swiped down
    }
  }, []);

  // Automatically expand when sheet is mounted
  useEffect(() => {
    if (editUserData) {
      setTimeout(() => {
        bottomSheetRef.current?.expand();
      }, 100);
    }
  }, [editUserData]);

  return (
    <>
      <ScrollView contentContainerStyle={{display: 'flex',   alignItems: 'center', backgroundColor: '#FFFBF1', height:'100%'}}>
        {/* Profile Info */}
        <View>
          <Text>115XP</Text>
          <MaskedView maskElement={<Text className="text-3xl font-PoppinsBold">Username</Text>}>
            <LinearGradient colors={['#FB990F', '#EA0505']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.8 }}>
              <Text style={{ opacity: 0 }} className="text-3xl font-PoppinsBold">Username</Text>
            </LinearGradient>
          </MaskedView>
          <Text>Email</Text>
        </View>

        <UserStreak streakCount={1} protectionCount={1} />

        {/* Account Section */}
        <View className='w-11/12'>
          <Text className='font-PoppinsBold text-[#3C3C3C] text-xl'>Account</Text>

          <TouchableOpacity onPress={()=> {
            handleSheetRender('editData')
            openSheet(); //
          }} className='w-full p-4 flex flex-row items-center justify-start gap-4 bg-white rounded-xl border-[#F7D674] border-[1px]'>
            <Image source={require('../../assets/images/user.png')} />
            <Text className='text-[#242424] text-lg font-PoppinsSemiBold'>Edit personal data</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setEditPassword(!editPassword)} className='w-full p-4 flex flex-row items-center justify-start gap-4 bg-white rounded-xl border-[#F7D674] border-[1px]'>
            <Image source={require('../../assets/images/lock.png')} />
            <Text className='text-[#242424] text-lg font-PoppinsSemiBold'>Change password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      
    </>
  )
}




const styles = StyleSheet.create({
 container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFBF1',
  },
  contentContainer: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#FAF3E0'
  },
})

/**
{editUserData && (
        <BottomSheet
          ref={bottomSheetRef}
          onChange={handleSheetChanges}
          snapPoints={['60%']}
          detached
          enablePanDownToClose
 
        >
          <BottomSheetView style={styles.contentContainer}>
              <UserInput  
                title='Edit personal data'
                usernameTitle='Username'
                userEmailTitle='Email'
                userPasswordTitle='Current password'
                passwordTitleDescription='Type in your password to update your email'
              />
              <View className='w-11/12  absolute bottom-1'>
              <Authbutton content='Save changes' onPress={()=>    bottomSheetRef.current?.close()}></Authbutton>
               </View>
          </BottomSheetView>
        </BottomSheet>
      )} 

 */