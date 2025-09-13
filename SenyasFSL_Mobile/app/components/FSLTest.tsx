import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import FSLApiService from './FSLApiService';

const FSLTest: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const apiService = new FSLApiService('http://192.168.0.107:5000');

  const testConnection = async () => {
    setIsLoading(true);
    try {
      const health = await apiService.checkHealth();
      setResult(`Health: ${JSON.stringify(health, null, 2)}`);
    } catch (error) {
      setResult(`Error: ${error}`);
    }
    setIsLoading(false);
  };

  const testPrediction = async () => {
    setIsLoading(true);
    try {
      // Generate random test data (30 frames × 63 landmarks)
      const testData: number[][] = [];
      for (let i = 0; i < 30; i++) {
        const frame: number[] = [];
        for (let j = 0; j < 63; j++) {
          frame.push(Math.random());
        }
        testData.push(frame);
      }

      const prediction = await apiService.predictSign(testData);
      setResult(`Prediction: ${JSON.stringify(prediction, null, 2)}`);
    } catch (error) {
      setResult(`Error: ${error}`);
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FSL API Test</Text>
      
      <Button 
        title="Test Connection" 
        onPress={testConnection}
        disabled={isLoading}
      />
      
      <Button 
        title="Test Prediction" 
        onPress={testPrediction}
        disabled={isLoading}
      />
      
      <Text style={styles.result}>{result}</Text>
      
      {isLoading && <Text>Loading...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  result: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    fontSize: 12,
  },
});

export default FSLTest;