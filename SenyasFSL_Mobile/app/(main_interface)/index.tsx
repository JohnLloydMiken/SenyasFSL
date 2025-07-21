import { StyleSheet, Text, View, useWindowDimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import LevelHeader from '@/components/levelHeader'
import BG from '@/assets/svgs/bg 1.svg'
import Tutorial from "@/assets/svgs/Tutorial.svg";
import Settings from '@/assets/svgs/Settings.svg';
import Slider from '@react-native-community/slider';
export default function index() {
  return (
    <View className='bg-white flex-1 items-center '>
        <View className='w-full h-full absolute top-0 left-0 '><BG width={'100%'} height={'100%'} scaleX={1.2} scaleY={1.2} /></View>
        <LevelHeader title='Learn The Alphabets' section={1} level={1} />
        
<Slider
  style={{width: 200, height: 40}}
  minimumValue={0}
  maximumValue={1}
  minimumTrackTintColor="#FFFFFF"
  maximumTrackTintColor="#000000"
/>
        <View className='flex-col justify-center items-center absolute bottom-2 left-2 gap-2'>
            <TouchableOpacity>
              <Tutorial/>
            </TouchableOpacity>
            <TouchableOpacity>
              <Settings/>
            </TouchableOpacity>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({})