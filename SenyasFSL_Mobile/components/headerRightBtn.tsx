import { StyleSheet, Text, View , TouchableOpacity, Image} from 'react-native'
import React from 'react'
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
type  headerBtnProps = {
    achievementCount: number,
    streakCount: number
}
 const headerRightBtn: React.FC<headerBtnProps> =({achievementCount, streakCount})=> {
  return (
    <View className='flex flex-row justify-center items-center gap-4 mr-4'>
        <TouchableOpacity className='flex flex-row justify-center items-center'>
            <Image source={require('../assets/images/Achievements.png')}/>
             <MaskedView
                  maskElement={
                    <Text style={styles.text}>
                      {achievementCount}
                    </Text>
                  }
                >
                  <LinearGradient
                    colors={['#2DE2E2', '#0922A0']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {/* Invisible text only to preserve size */}
                    <Text style={[styles.text, { opacity: 0 }]}>
                      {achievementCount}
                    </Text>
                  </LinearGradient>
                </MaskedView>
        </TouchableOpacity>

        <TouchableOpacity>
            <Image source={require('../assets/images/Leaderboard.png')}/>
        </TouchableOpacity>

          <TouchableOpacity className='flex flex-row justify-center items-center'>
            <Image source={require('../assets/images/Streak.png')}/>
             <MaskedView
                  maskElement={
                    <Text style={styles.text}>
                      {streakCount}
                    </Text>
                  }
                >
                  <LinearGradient
                    colors={['#FB990F', '#EA0505']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {/* Invisible text only to preserve size */}
                    <Text style={[styles.text, { opacity: 0 }]}>
                      {streakCount}
                    </Text>
                  </LinearGradient>
                </MaskedView>
        </TouchableOpacity>

    </View>
  )
}
export default headerRightBtn

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});