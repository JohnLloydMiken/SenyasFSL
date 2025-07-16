import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import { router } from 'expo-router';
import { useFonts } from 'expo-font';
import React from 'react'
import '../../global.css'
import Authbutton from '@/components/button';
import FSL_start from '@/assets/svgs/FSL_start.svg'
const getStartedBG = require('@/assets/images/getStartedBG.png')



 
export default function getStarted() {
    const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
  
  });
  return (
    

    <SafeAreaView style ={styles.container}>
        <View className='mt-28' >
              <FSL_start/>
        </View>
        <View className='flex justify-center items-center flex-col'>
            <Text className='text-2xl'>Start Learning</Text>
            <Text className='font-bold text-3xl'>Filipino Sign Language</Text>
        </View>

        <View className=' w-11/12'>

            <Authbutton content='Get Started' onPress={()=> router.push('./register')}/>
            <TouchableOpacity
              onPress={() => router.push('./login')}
                className='w-full p-4 bg-[#FAF3E0] rounded-md border-[4px]  border-[#FB990F] '
            >
              <Text className='text-2xl text-center text-[#FB990F] font-bold'>I have already an account</Text>
            </TouchableOpacity>
            
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
     container: {
    flex: 1,
    backgroundColor: "#FAF3E0",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
    
    fontStyle:{
        fontFamily : 'Poppins-Regular'
    },

   
})