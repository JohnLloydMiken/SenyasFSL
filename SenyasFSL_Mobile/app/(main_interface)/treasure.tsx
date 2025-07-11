import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { useState } from 'react';
import {Video} from 'expo-av'
import Item from '@/components/items';

export default function treasure() {

  const [haveChest, setHaveChest] = useState(false)

  return (
  <View className='bg-white flex-1 items-center '>
        <Image source={require('../../assets/images/phBG.png')} className='absolute top-0 left-0 w-full h-full'/>
        <View className='w-11/12 h-max mx-auto my-0 flex justify-center  items-center  flex-col mb-4'>
            <Text className='font-PoppinsBold text-xl text-center'>You have no chests  right now, get 7 questions right in a row to open 1!</Text>
            {haveChest ? (
                <Video
                  source={require('../../assets/videos/Treasure.mp4')} // or local file
                  rate={1.0}
                  volume={1.0}
                  isMuted={false}
                  resizeMode = 'cover'
                  shouldPlay
                  isLooping
                  style={{ width: 175, height: 175,marginRight: 12,  }}
                />
            ) : <Image source={require('../../assets/images/Treasure_Locked.png')} className='w-44 h-36 mr-3'/>}
            <TouchableOpacity className='w-2/3 p-4 bg-[#27D700] rounded-xl mt-4'>
              <Text className='font-PoppinsBold text-white text-xl text-center'>{haveChest? "Claim Chest" : "Start a lesson"}</Text>
            </TouchableOpacity>
        </View>
              {/* Item row 1*/}
        <View className='flex-row justify-center gap-24 mb-4'>
            <Item itemName='XP Multiply' itemCost={350} itemIcon='potion'/>
            <Item itemName='Bomb' itemCost={20} itemIcon='bomb'/>
        </View>
          {/* Item row 2*/}
        <View className='flex-row justify-center gap-24 mb-4'>
            <Item itemName='Skip' itemCost={50} itemIcon='next'/>
            <Item itemName='2x Try' itemCost={25} itemIcon='retry'/>
        </View>
          {/* Item row 3*/}
        <View className='flex-row justify-center gap-4 mb-4'>
            <Item itemName='Streak Protection' itemCost={500} itemIcon='streakProtection'/>
         
        </View>
    </View>
  )
}

export const iconMap: Record<string, any> = {
  potion: require('../../assets/images/potion.png'),
  bomb: require('../../assets/images/bomb.png'),
  next: require('../../assets/images/Next.png'),
  retry: require('../../assets/images/retry.png'),
   streakProtection: require('../../assets/images/streakProtection.png'),
};

const styles = StyleSheet.create({

});