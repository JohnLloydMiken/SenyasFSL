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
        <Text className='font-PoppinsBold text-7xl text-center md:text-8xl'>MATCH THE SIGN</Text>
        <Text className='self-start font-PoppinsBold text-2xl md:text-3xl'>How it works?</Text>
        <Text className='font-PoppinsMedium text-lg md:text-2xl text-justify'> • You’ll be shown a prompt — this could be a letter, word, or picture that represents a specific Filipino Sign Language (FSL) sign.</Text>
        <Text className='font-PoppinsMedium text-lg md:text-2xl text-justify'> • Your task is to perform the correct hand gesture in front of your camera. The app uses gesture recognition technology to detect your sign and check if it matches the correct one.</Text>
      </View>

   
          <Text className='text-center text-red-600 font-PoppinsBold text-lg md:text-3xl w-11/12'>Reminder: Ensure your camera can clearly see your hands and that you have good lighting for accurate gesture recognition.</Text>
      

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