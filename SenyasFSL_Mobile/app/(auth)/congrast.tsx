import { StyleSheet, Text, View , useWindowDimensions, StatusBar} from 'react-native'
import FSL_Hi from '@/assets/svgs/FSL_Hi.svg'
import React from 'react'
import Authbutton from '@/components/button'
import { router } from 'expo-router'
export default function congrast() {
  const {width} = useWindowDimensions()
  const svgSize = width < 768 ? 450 : 500;
  return (
    <View className='flex-1 bg-[#FAF3E0] items-center justify-start flex-col gap-8' style={{paddingTop: StatusBar.currentHeight}}>
        <View className='w-11/12  mt-4'>
            <Text className='text-3xl md:text-4xl font-PoppinsBold text-center'>Congratulations!</Text>
            <Text className='text-2xl md:text-3xl font-PoppinsSemiBold text-[#FB990F] text-center'>You've successfully signed up</Text>
        </View>
        <FSL_Hi width={svgSize} height={svgSize}/>
         <View className='w-10/12 '>
            <Text className='text-center text-lg md:text-2xl'>We’re excited to see you join our mission to bridge language barriers through FSL.</Text>
            
        </View>
         <View className='w-11/12 absolute bottom-12'>
              <Authbutton content='Get Started' onPress={()=>router.push('/')}></Authbutton>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({})