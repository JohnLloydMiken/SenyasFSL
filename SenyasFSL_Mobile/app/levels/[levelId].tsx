import { StyleSheet, Text, View,  } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
export default function LevelContent() {
  const {levelId} = useLocalSearchParams()
  return (
    <SafeAreaView >
            <Text>Level { levelId } Content </Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})