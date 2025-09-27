import { View, Text, useWindowDimensions } from 'react-native'
import React from 'react'
import FSL_Like from '@/assets/svgs/FSL_Like.svg'
import LevelBg from "@/assets/svgs/LevelBG.svg";
import LevelContentBtn from '../GameBtns/LevelContentBtn';

interface ConsecutiveProps{
    correctAnswer: number;
    firstMessage: string,
    secondMessage: string
    onPress: ()=> void
}

const Consecutive: React.FC<ConsecutiveProps> = ({correctAnswer, firstMessage, secondMessage, onPress}) => {
    const {width} = useWindowDimensions()
    const svgSize = width < 768 ? 400 : 500
  return (
    <View className='flex-1 items-center bg-white relative justify-center'>
      <FSL_Like width={svgSize} height={svgSize}/>
      <View className=' flex-col justify-center items-center'>
        <Text className='font-PoppinsBold text-xl md:text-2xl'><Text className='text-orange-400'>{correctAnswer}</Text> correct questions in a row!</Text>
        <Text className='font-NunitoBold text-sm md:text-lg' >{firstMessage}</Text>
         <Text className='font-NunitoBold text-xs md:text-sm'>{secondMessage}</Text>
      </View>
      <View className='absolute bottom-16 w-56 md:w-64 left-1/2 -translate-x-1/2 z-50'>
        <LevelContentBtn text='Next' onPress={onPress}/>
      </View>
      <View className= {`absolute bottom-0`}>
        <LevelBg/>
      </View>
    </View>
  )
}

export default Consecutive