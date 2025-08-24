import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  NativeModules,
  TouchableOpacity,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

const { SignLanguageModule } = NativeModules;

interface PredictionResult {
  status: string;
  prediction?: string;
  confidence?: number;
  message?: string;
}

const SignLanguageScreen: React.FC = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [prediction, setPrediction] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const [status, setStatus] = useState<string>('Initializing...');
  
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // Test function to verify the native module works
  const testPrediction = async (): Promise<void> => {
    try {
      setStatus('Testing model...');
      
      // Create dummy landmarks for testing (63 values: 21 landmarks * 3 coordinates)
      const dummyLandmarks: number[] = Array(63).fill(0).map(() => Math.random());
      
      // Add landmarks to buffer (simulate 30 frames)
      for (let i = 0; i < 30; i++) {
        await SignLanguageModule.addLandmarks(dummyLandmarks);
      }
      
      // Make prediction
      const result: PredictionResult = await SignLanguageModule.predict();
      console.log('Prediction result:', result);
      
      if (result.status === 'success') {
        setPrediction(result.prediction || '');
        setConfidence(result.confidence || 0);
        setStatus('Test completed - Model working!');
      } else if (result.status === 'waiting') {
        setStatus(result.message || 'Waiting for more frames...');
      } else {
        setStatus('Low confidence detection');
      }
    } catch (error) {
      console.error('Test error:', error);
      setStatus('Test failed - Check native module');
    }
  };

  const clearBuffer = async (): Promise<void> => {
    try {
      await SignLanguageModule.clearBuffer();
      setPrediction('');
      setConfidence(0);
      setStatus('Buffer cleared');
    } catch (error) {
      console.error('Clear buffer error:', error);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.statusText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.statusText}>Camera permission not granted</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing="front"
      >
        <View style={styles.overlay}>
          <Text style={styles.statusText}>{status}</Text>
          
          {prediction && (
            <View style={styles.predictionContainer}>
              <Text style={styles.predictionText}>
                Sign: {prediction}
              </Text>
              <Text style={styles.confidenceText}>
                Confidence: {(confidence * 100).toFixed(1)}%
              </Text>
            </View>
          )}
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.testButton} onPress={testPrediction}>
              <Text style={styles.buttonText}>Test Model</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.clearButton} onPress={clearBuffer}>
              <Text style={styles.buttonText}>Clear Buffer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
};

// You need to implement this function using MediaPipe or ML Kit
const extractHandLandmarks = (frame: any) => {
  // This is where you'd process the frame and extract hand landmarks
  // Return array of 63 values (21 landmarks * 3 coordinates each)
  return null; // Placeholder
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  statusText: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 8,
    textAlign: 'center',
    marginTop: 50,
  },
  predictionContainer: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  predictionText: {
    fontSize: 24,
    color: '#00ff00',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  confidenceText: {
    fontSize: 16,
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 50,
  },
  testButton: {
    backgroundColor: 'rgba(0,100,200,0.9)',
    padding: 15,
    borderRadius: 8,
    minWidth: 120,
  },
  clearButton: {
    backgroundColor: 'rgba(200,100,0,0.9)',
    padding: 15,
    borderRadius: 8,
    minWidth: 120,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: 'rgba(0,100,200,0.9)',
    padding: 20,
    borderRadius: 10,
    margin: 20,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});


export default SignLanguageScreen;