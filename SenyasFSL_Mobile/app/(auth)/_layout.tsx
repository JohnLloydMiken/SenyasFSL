import { Stack } from "expo-router";
import GoBackBTN from "@/components/GoBackBTN";
import { View, Text } from "react-native";
export default  function GetStartedLayout(){

    return (
        <Stack initialRouteName="index">
            <Stack.Screen name="index" 
            options={{
                headerShown: false
            }}
             />
            <Stack.Screen name="register" 
             options={({ navigation }) => ({
                                            headerTitle: "",
                                            headerLeft: () => (
                                                <GoBackBTN onPress={()=>navigation.replace("index")}/>
                                            ),
                                            headerStyle: {
                                            backgroundColor: "#FAF3E0",
                                            },
                                            headerShadowVisible: false,
                                        })}
             />

             <Stack.Screen name="login"

             options={({ navigation }) => ({
                                           headerTitle: "",
                                            headerLeft: () => (
                                                <GoBackBTN onPress={()=>navigation.replace("index")}/>
                                            ),
                                            headerStyle: {
                                            backgroundColor: "#FAF3E0",
                                            },
                                            headerShadowVisible: false,
                                        })}
             />
             
             <Stack.Screen name="register_whyFSL"

             options={({ navigation }) => ({
                                             headerTitle: ()=>(
                                                <View style = {{width: 280, height: 20, backgroundColor: "#FFEEB9", borderRadius: 20, marginLeft: 8}}>
                                                    <View style={{height:20, width: 70, backgroundColor: '#FB990F', borderRadius: 20}}></View>
                                                </View>
                                            ),
                                            headerLeft: () => (
                                                <GoBackBTN onPress={()=>navigation.replace("register")}/>
                                            ),
                                       
                                            headerRight: ()=>(
                                                <Text style ={{color: "#5B5B5B", fontWeight: 'bold', fontSize: 14}}>1/4</Text>
                                            )
                                            ,
                                            headerStyle: {
                                            backgroundColor: "#FAF3E0",
                                            },
                                            headerShadowVisible: false,
                                            
                                        })}
             />
                <Stack.Screen name="register_how"

             options={({ navigation }) => ({
                                             headerTitle: ()=>(
                                                <View style = {{width: 280, height: 20, backgroundColor: "#FFEEB9", borderRadius: 20, marginLeft: 8}}>
                                                    <View style={{height:20, width: 140, backgroundColor: '#FB990F', borderRadius: 20}}></View>
                                                </View>
                                            ),
                                            headerLeft: () => (
                                                <GoBackBTN onPress={()=>navigation.replace("register")}/>
                                            ),
                                       
                                            headerRight: ()=>(
                                                <Text style ={{color: "#5B5B5B", fontWeight: 'bold', fontSize: 14}}>2/4</Text>
                                            )
                                            ,
                                            headerStyle: {
                                            backgroundColor: "#FAF3E0",
                                            },
                                            headerShadowVisible: false,
                                            
                                        })}
             />
                  <Stack.Screen name="register_last"

             options={({ navigation }) => ({
                                             headerTitle: ()=>(
                                                <View style = {{width: 280, height: 20, backgroundColor: "#FFEEB9", borderRadius: 20, marginLeft: 8}}>
                                                    <View style={{height:20, width: 210, backgroundColor: '#FB990F', borderRadius: 20}}></View>
                                                </View>
                                            ),
                                            headerLeft: () => (
                                                <GoBackBTN onPress={()=>navigation.replace("register")}/>
                                            ),
                                       
                                            headerRight: ()=>(
                                                <Text style ={{color: "#5B5B5B", fontWeight: 'bold', fontSize: 14}}>3/4</Text>
                                            )
                                            ,
                                            headerStyle: {
                                            backgroundColor: "#FAF3E0",
                                            },
                                            headerShadowVisible: false,
                                            
                                        })}
             />
             </Stack>
    )
}