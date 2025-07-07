import { StyleSheet, Text, View, ScrollView, TouchableOpacity , Image} from 'react-native'
import React from 'react'
import Facts from '@/json_files/facts.json'
import Awards from '@/json_files/awards.json'
import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'

export default function index() {

  const imageMap: { [key: string]: any } ={
    
    "award_lock.png": require('../../assets/images/award_lock.png'),
    "fact_locked.png": require('../../assets/images/fact_locked.png')
    
  }

  const [isUnlocked, setIsUnlocked] = useState(true) 
  const unlockedFacts = Facts.filter(f => f.unlocked).length;

  return (
    <ScrollView 
    >
      <View>
         <View className='ml-4 mt-4'>
          <MaskedView
        
              maskElement={
                <Text className='text-2xl font-PoppinsBold' >
                  Awards {`(0)`}
                </Text>
              }
            >
              <LinearGradient
                colors={['#FB990F', '#EA0505']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                {/* Invisible text only to preserve size */}
                 <Text style={{opacity: 0}} className='text-2xl font-PoppinsBold'>
                  Awards {`(0)`}
                </Text>
              </LinearGradient>
            </MaskedView>
         </View>
          <View className='w-full flex flex-row flex-wrap items-center justify-center gap-y-4 mt-4 px-4'>
                {Awards.map((item, index) =>
                  <TouchableOpacity key={index} className='w-1/3 mb-4  flex flex-col items-center'>
                    <Image source={imageMap[item.AwardImage]}/>
                    <Text>{item.award_title}</Text>
                  </TouchableOpacity>
                )}
          </View>
      </View>


      <View>
         <View className='ml-4 mt-4'>
          <MaskedView
        
              maskElement={
                <Text className='text-2xl font-PoppinsBold' >
                  Facts {`(${unlockedFacts})`}
                </Text>
              }
            >
              <LinearGradient
                colors={['#FB990F', '#EA0505']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                {/* Invisible text only to preserve size */}
                 <Text style={{opacity: 0}} className='text-2xl font-PoppinsBold'>
                  Facts {`(0)`}
                </Text>
              </LinearGradient>
            </MaskedView>
         </View>
          <View className='w-full flex flex-row flex-wrap items-center justify-center gap-y-4 mt-4 px-4'>
                {Facts.map((item, index) =>
                  <TouchableOpacity key={index} className='w-1/3 mb-4  flex flex-col items-center' >
                    <Image source={item.unlocked ? require("../../assets/images/fact_folder.png"): imageMap["fact_locked.png"]}/>
                    <Text>{item.Fact_title}</Text>
                  </TouchableOpacity>
                )}
          </View>
      </View>
     
    </ScrollView>
  )
}

const styles = StyleSheet.create({

})