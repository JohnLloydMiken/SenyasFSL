import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

type CurrencyProps = {
  number: number;
};

const Currency: React.FC<CurrencyProps> = ({ number }) => {
  return (
   <View className='flex flex-row items-center  justify-center ml-4'>
        <Image source={require('../assets/images/Currency.png')}/>
    <MaskedView
      maskElement={
        <Text style={styles.text}>
          {number}
        </Text>
      }
    >
      <LinearGradient
        colors={['#FB990F', '#EA0505']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.8 }}
      >
        {/* Invisible text only to preserve size */}
        <Text style={[styles.text, { opacity: 0 }]}>
          {number}
        </Text>
      </LinearGradient>
    </MaskedView>
   </View>
  );
};

export default Currency;

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
