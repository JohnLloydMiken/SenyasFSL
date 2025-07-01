
import { View, StyleSheet, Image, SafeAreaView } from "react-native";

// Replace with actual path to your images
const icon1 = require("../assets/images/icon.png");


export default function Index() {

  


  return (
  <SafeAreaView style = {styles.container}>
     <View >
        <Image source={icon1} style ={styles.image}/>
    </View>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FB990F",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 300,
  },
});
