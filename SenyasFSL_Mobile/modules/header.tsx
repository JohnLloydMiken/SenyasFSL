// components/SectionHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { SectionHeaderProps } from './types/interface';

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  } as ViewStyle,
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  } as TextStyle,
});

export default SectionHeader;