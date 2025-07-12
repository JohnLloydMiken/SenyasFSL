import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native'
import { useState } from 'react';
import {Video} from 'expo-av'
import Item from '@/components/items';
import Item_function from '@/json_files/item_function.json'
export default function treasure() {

  const [haveChest, setHaveChest] = useState(false)
  const[ isShown, setIsShown] = useState(false)

  return (
  <View className='bg-white flex-1 items-center relative'>
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
            {/* Tutorial Button */}
        <TouchableOpacity className='absolute bottom-4 left-4' onPress={()=> setIsShown(!isShown)}>
            <Image source={require('../../assets/images/Tutorial.png')}/>
        </TouchableOpacity>

                 {isShown && ( <View className='absolute top-0 left-0 right-0 bottom-0 bg-black/60 z-40' /> )}

              {isShown ? (
                <View className=' bg-[#FAF3E0] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 p-4 z-50 rounded-2xl' > 
                    <View className='flex flex-row justify-between items-center border-b-2 border-b-[#F2C484]'>
                      <Text className='font-PoppinsBold text-xl'>Items Function</Text>
                      <TouchableOpacity className='bg-[#B2AFAB]  w-8 h-8 rounded-full flex justify-center items-center mb-2' onPress={() => setIsShown(false)}>
                        <Text className='font-PoppinsBold text-white text-sm'>X</Text>
                      </TouchableOpacity>
                    </View>
                    <FlatList
                    data={Item_function}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item})=> (
                      <Text className='text-justify my-2'>🔹<Text className='font-PoppinsSemiBold'>{item.item_name}</Text> - {item.item_description}</Text>
                    )}
                    
                    />
                    <TouchableOpacity className='w-1/3 p-3 border border-black mx-auto mt-2 rounded-lg' onPress={()=> setIsShown(!isShown)}>
                        <Text className='font-PoppinsRegular text-center'>OK</Text>
                    </TouchableOpacity>
                </View>
              ): null}

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