import { Stack } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import BackBTN from '@/components/headeroptionBackBTN'
import { View } from "react-native";
export default function LeaderboardsLayout(){

    const router = useRouter()
    return(
        <Stack>
            <Stack.Screen
            name="index"
            options={{
                headerTitle: "Achievement",
                  
                headerBackground: ()=>(
                     <LinearGradient
                        colors={['#2DE2E2', '#0922A0']} // blue shades top to bottom
                        style={{ flex: 1, position: 'relative' }}
                        start={{ x: 0, y: -0.1 }}
                        end={{ x: 0, y: 1 }}
                    />
                )
                ,
                headerLeft: ()=> <BackBTN onPress={()=> router.replace('../(main_interface)/')}/>,
                headerRight: () => <View style={{ width: 50 }} />,
                headerTitleStyle: {
                    fontFamily: 'Poppins-Bold',
                    color: 'white'
                    
                },
                
              
            }}
            />
             <Stack.Screen
              name="leaderboards"
            options={{
                headerTitle: "Leaderboards",
                headerStyle:{
                    backgroundColor: '#4D2300'
                },
                headerLeft: ()=> <BackBTN onPress={()=> router.replace('../(main_interface)/')}/>,
                headerRight: () => <View style={{ width: 50 }} />,
                headerTitleStyle: {
                    fontFamily: 'Poppins-Bold',
                    color: 'white'
                    
                },
                headerShadowVisible: true,
            
              
            }}/>
             <Stack.Screen
            name="streak"/>
        </Stack>
    )
}