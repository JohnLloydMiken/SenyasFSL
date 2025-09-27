import { View, Text, } from 'react-native'
import React from 'react'
import LevelBg from "@/assets/svgs/LevelBG.svg";
import LevelContentBtn from '../GameBtns/LevelContentBtn';

interface indexProp{
    onPress: ()=> void;
}

const Instruction: React.FC<indexProp> = ({onPress}) => {
  return (
    <View className='flex-1 bg-white justify-start items-center'>
      
      <View  className='flex bg-white justify-start items-center gap-4 p-4  min-h-20 mb-5'>
          <Text className='font-PoppinsBold text-3xl md:text-4xl text-orange-400'>FOR THIS  LEVEL!</Text>
        <Text className='font-PoppinsBold text-7xl text-center md:text-8xl'>QUIZ SURVIVAL</Text>
        <Text className='self-start font-PoppinsBold text-2xl md:text-3xl'>How it works?</Text>
        <Text className='font-PoppinsMedium text-lg md:text-2xl text-justify'> • In this round, you'll face a series of FSL questions to test everything you've learned so far. But there's a twist: you only get 5 hearts (lives) for the entire quiz.</Text>
        <Text className='font-PoppinsMedium text-lg md:text-2xl text-justify'> • Each time you answer incorrectly, you lose a heart. Run out of hearts, and you’ll have to retry the level from the beginning.</Text>
      </View>

   
          <Text className='text-center text-red-600 font-PoppinsBold text-xl md:text-3xl'>Reminder: Ensure you survive all throughout the game to move on and unlock new content!</Text>
      

         <View className="absolute bottom-16 w-56 md:w-64 left-1/2 -translate-x-1/2 z-50">
        <LevelContentBtn text="Next" onPress={onPress} />
      </View>

        <View className="absolute w-full bottom-0 z-10">
    
          <LevelBg />
    
      </View>
    </View>
  )
}

export default Instruction