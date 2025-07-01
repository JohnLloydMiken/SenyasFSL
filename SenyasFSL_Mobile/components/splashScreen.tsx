import { StyleSheet, SafeAreaView, View , Image} from 'react-native'
import React from 'react'

export default function splashScreen() {

 const icon2 = require("../assets/images/splash-icon2.png");

  return (
      <SafeAreaView style = {styles.container}>
     <View >
        <Image source={icon2} style ={styles.image}/>
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
  image: {
    
    width: 380,
    height: 150,
    marginRight: 20
  },
})