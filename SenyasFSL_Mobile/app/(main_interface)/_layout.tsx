import { Image } from 'react-native';
import { Tabs } from 'expo-router';
import Curency from '@/components/curency';
import HeaderRightBtn from '@/components/headerRightBtn';
import HomeIcon from '@/components/homeIcon';
import ProfileIcon from '@/components/profileIcon';
import DictionaryIcon from '@/components/dictionaryIcon';
import TreasureIcon from '@/components/treasureIcon';
export default function RootLayout() {
  
  return (

    <Tabs 
    initialRouteName='index'
    screenOptions={
        {
        headerTitle: "",
            headerLeft: ()=>(
                <Curency number={100}/>
            ),
            headerRight: ()=>(
                <HeaderRightBtn achievementCount={0} streakCount={0}/>
            ),
            headerStyle:{
                borderBottomWidth: 0.5,
                 borderBottomColor: "black",
                backgroundColor: "#fff", // optional for visibility
            },
            headerShadowVisible: false,
             tabBarActiveTintColor: "#EA0505",
           tabBarInactiveTintColor: "#8B8B8B",
           
        }
        
    }
    
    > 
        <Tabs.Screen 
        name='index'
        
        options={{
           tabBarIcon: ({focused}) => <HomeIcon focused ={focused}/>,
           title: "Home",
           tabBarLabelStyle:{
            fontWeight: "bold",
            fontSize: 12,
            
           },
           
          
        }}
        
        />
            <Tabs.Screen 
        name='treasure'
        
        options={{
           tabBarIcon: ({focused}) => <TreasureIcon focused ={focused}/>,
           title: "Treasure",
           tabBarLabelStyle:{
            fontWeight: "bold",
            fontSize: 12
           },
           
          
        }}
        
        />
            <Tabs.Screen 
        name='dictionary'
        
        options={{
           tabBarIcon: ({focused}) => <DictionaryIcon focused ={focused}/>,
           title: "Dictionary",
           tabBarLabelStyle:{
            fontWeight: "bold",
            fontSize: 12
           }
          
        }}
        
        />
            <Tabs.Screen 
        name='profile'
        
        options={{
           tabBarIcon: ({focused}) => <ProfileIcon focused ={focused}/>,
           title: "Profile",
           tabBarLabelStyle:{
            fontWeight: "bold",
            fontSize: 12
           }
          
        }}
        
        />

    </Tabs>
  )
}
