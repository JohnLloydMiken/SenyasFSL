import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import LevelHeader from '@/components/levelHeader'
export default function index() {
  return (
    <View className='bg-white flex-1 items-center '>
        <Image source={require('../../assets/images/phBG.png')} className='absolute top-0 left-0 w-full h-full'/>
        <LevelHeader title='Learn The Alphabets' section={1} level={1}/>
    </View>
  )
}

const styles = StyleSheet.create({})