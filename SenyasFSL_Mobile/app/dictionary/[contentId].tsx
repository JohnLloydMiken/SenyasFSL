import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import Alphabets from '@/components/main_interface/Alphabets'
const DictionaryContent = () => {
    const {contentId} = useLocalSearchParams()

    const renderWords = ()=>{

      switch(contentId){
        case "1" : return <Alphabets/>
      }

    }
  return renderWords()
}

export default DictionaryContent