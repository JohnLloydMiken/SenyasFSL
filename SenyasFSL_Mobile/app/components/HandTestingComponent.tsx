import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { Camera, CameraDevice } from 'react-native-vision-camera';
import { NativeModules, DeviceEventEmitter } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const { SignLanguage } = NativeModules;

const HandTestingComponent: React.FC = () => {
  const [cameraDevice, setCameraDevice] = useState<CameraDevice | null>(null);
  const [prediction, setPrediction] = useState<string>('');
  const [isRecognizing, setIsRecognizing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Request camera permission
  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      const result = await check(PERMISSIONS.ANDROID.CAMERA);
      if (result === RESULTS.GRANTED) return true;
      const requestResult = await request(PERMISSIONS.ANDROID.CAMERA);
      if (requestResult === RESULTS.GRANTED) return true;
      Alert.alert('Permission Denied', 'Camera access is required for sign language recognition.');
      return false;
    } catch (error) {
      console.error('Permission error:', error);
      Alert.alert('Error', 'Failed to request camera permission');
      return false;
    }
  };

  // Initialize model, hand landmarker, and camera device
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        // Initialize native module
        await SignLanguage.loadModel();
        await SignLanguage.initHandLandmarker();
        console.log('Model and HandLandmarker initialized');

        // Check front camera availability
        const devices = await Camera.getAvailableCameraDevices();
        const frontCamera = devices.find((d) => d.position === 'front');
        if (frontCamera) {
          setCameraDevice(frontCamera);
        } else {
          Alert.alert('Error', 'No front camera available on this device');
        }
      } catch (error) {
        console.error('Initialization error:', error);
        Alert.alert('Error', 'Failed to initialize model or hand landmarker');
      } finally {
        setIsLoading(false);
      }
    };
    init();

    // Listen for predictions
    const subscription = DeviceEventEmitter.addListener('onPrediction', (data) => {
      setPrediction(`${data.letter} (${(data.confidence * 100).toFixed(2)}%)`);
    });

    // Cleanup
    return () => {
      subscription.remove();
      SignLanguage.stopCamera().catch((error: Error) => console.error('Stop camera error:', error));
    };
  }, []);

  // Start/stop recognition
  const toggleRecognition = async () => {
    if (isRecognizing) {
      try {
        await SignLanguage.stopCamera();
        setIsRecognizing(false);
        setPrediction('');
      } catch (error) {
        console.error('Stop camera error:', error);
        Alert.alert('Error', 'Failed to stop camera');
      }
    } else {
      const hasPermission = await requestCameraPermission();
      if (hasPermission && cameraDevice) {
        try {
          await SignLanguage.startCamera();
          setIsRecognizing(true);
        } catch (error) {
          console.error('Camera start error:', error);
          Alert.alert('Error', 'Failed to start camera');
        }
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading model...</Text>
      </View>
    );
  }

  if (!cameraDevice) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No front camera available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        device={cameraDevice}
        isActive={isRecognizing}
        preview={true}
      />
      <View style={styles.overlay}>
        <Text style={styles.prediction}>
          {prediction || 'No prediction yet'}
        </Text>
        <Button
          title={isRecognizing ? 'Stop Recognition' : 'Start Recognition'}
          onPress={toggleRecognition}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  prediction: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default HandTestingComponent;