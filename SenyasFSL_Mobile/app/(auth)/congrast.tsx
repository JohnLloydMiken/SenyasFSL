// (auth)/congrast.tsx
import { StyleSheet, Text, View , StatusBar} from 'react-native'
import FSL_Hi from '@/assets/svgs/FSL_Hi.svg'
import React from 'react'
import Authbutton from '@/components/authentication/button'
import { router } from 'expo-router'
import { fslIconSize } from '@/utils/sizes'
export default function congrast() {

  return (
    <View className='flex-1 bg-[#FAF3E0] items-center justify-start flex-col gap-8' style={{paddingTop: StatusBar.currentHeight}}>
        <View className='w-11/12  mt-4'>
            <Text className='text-3xl md:text-4xl font-PoppinsBold text-center'>Congratulations!</Text>
            <Text className='text-2xl md:text-3xl font-PoppinsSemiBold text-[#FB990F] text-center'>You've successfully signed up</Text>
        </View>
        <FSL_Hi width={fslIconSize()} height={fslIconSize()}/>
         <View className='w-10/12 '>
            {/* ✅ Updated Text */}
            <Text className='text-center text-lg md:text-2xl'>
              We just sent a verification link to your email.
              Please check your inbox to activate your account!
            </Text>
        </View>
         <View className='w-11/12 absolute bottom-12'>
              {/* ✅ Updated button text and navigation */}
              <Authbutton content='Back to Home' onPress={()=>router.replace('/')}></Authbutton>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({})