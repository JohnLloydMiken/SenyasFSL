import { StyleSheet, SafeAreaView, View , Image} from 'react-native'
import React from 'react'
import FSL_loading_screen from '@/assets/svgs/FSL_loading_screen.svg'
export default function splashScreen() {


  return (
      <SafeAreaView style = {styles.container}>
     <View >
      <FSL_loading_screen width={400} height={300} style={{marginRight: 20}}/>
    </View>
  </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: "#FB990F",
    justifyContent: "center",
    alignItems: "center",
  },
 
})