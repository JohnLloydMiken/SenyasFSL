
import { View, StyleSheet, Image, SafeAreaView } from "react-native";

// Replace with actual path to your images
import FSL_sign from '@/assets/svgs/FSL_sign.svg'


export default function Index() {

  


  return (
  <SafeAreaView style = {styles.container}>
     <View >
       <FSL_sign width={300} height={300} />
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
 
});
