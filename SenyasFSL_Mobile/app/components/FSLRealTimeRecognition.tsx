// src/components/WorkingFSLDemo.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import FSLApiService, { PredictionResponse } from './FSLApiService';

const { width, height } = Dimensions.get('window');

interface RecognitionState {
  isActive: boolean;
  serverConnected: boolean;
  currentPrediction: string | null;
  confidence: number;
  status: string;
  isProcessing: boolean;
  predictionCount: number;
}

const WorkingFSLDemo: React.FC = () => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [state, setState] = useState<RecognitionState>({
    isActive: false,
    serverConnected: false,
    currentPrediction: null,
    confidence: 0,
    status: 'Initializing...',
    isProcessing: false,
    predictionCount: 0,
  });

  // API Service
  const apiService = useRef(new FSLApiService('http://192.168.0.107:5000'));
  
  // Prediction timer
  const predictionTimer = useRef<NodeJS.Timeout | null>(null);

  // Camera setup
  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'front');

  useEffect(() => {
    requestCameraPermission();
    initializeServer();
    
    return () => {
      if (predictionTimer.current) {
        clearTimeout(predictionTimer.current);
      }
    };
  }, []);

  const requestCameraPermission = async (): Promise<void> => {
    try {
      const permission = await Camera.requestCameraPermission();
      setHasPermission(permission === 'granted');
      
      if (permission !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Camera access is needed for sign language recognition.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Camera permission error:', error);
      setHasPermission(false);
    }
  };

  const initializeServer = async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, status: 'Connecting to server...' }));

      const health = await apiService.current.checkHealth();
      const modelInfo = await apiService.current.getModelInfo();

      if (health.model_loaded && modelInfo.model_loaded) {
        setState(prev => ({
          ...prev,
          serverConnected: true,
          status: 'Ready! Tap "Start Recognition" to begin demo.',
        }));
        console.log('✅ Server connected successfully');
        console.log(`📋 Available signs: ${modelInfo.labels.join(', ')}`);
      } else {
        throw new Error('Model not loaded on server');
      }
    } catch (error) {
      console.error('Server connection error:', error);
      setState(prev => ({
        ...prev,
        serverConnected: false,
        status: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }));
    }
  };

  // Generate realistic test landmarks with variations
  const generateVariedLandmarks = (predictionNum: number): number[][] => {
    const frames: number[][] = [];
    
    // Create different gesture patterns based on prediction number
    const gestureVariations = [
      { centerX: 0.4, centerY: 0.4, spread: 0.05 }, // Closed fist-like
      { centerX: 0.6, centerY: 0.5, spread: 0.12 }, // Open hand-like  
      { centerX: 0.5, centerY: 0.3, spread: 0.08 }, // Pointing-like
      { centerX: 0.3, centerY: 0.6, spread: 0.15 }, // Wide spread-like
    ];
    
    const variation = gestureVariations[predictionNum % gestureVariations.length];
    
    for (let frame = 0; frame < 30; frame++) {
      const landmarks: number[] = [];
      
      // Simulate hand movement over time
      const timeOffset = frame * 0.02;
      
      // 21 hand landmarks × 3 coordinates = 63 values
      for (let point = 0; point < 21; point++) {
        const fingerIndex = Math.floor(point / 4); // Group into fingers
        const jointIndex = point % 4; // Joint within finger
        
        // Create finger-like patterns
        const angle = (fingerIndex * Math.PI * 2 / 5) + timeOffset;
        const radius = variation.spread * (1 + jointIndex * 0.3);
        
        const x = Math.max(0, Math.min(1, 
          variation.centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 0.01
        ));
        const y = Math.max(0, Math.min(1, 
          variation.centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 0.01
        ));
        const z = (Math.random() - 0.5) * 0.005; // Small depth variation
        
        landmarks.push(x, y, z);
      }
      
      frames.push(landmarks);
    }
    
    return frames;
  };

  const makePrediction = async (): Promise<void> => {
    if (!state.isActive || !state.serverConnected) return;

    setState(prev => ({ 
      ...prev, 
      isProcessing: true,
      status: `Analyzing gesture... (${prev.predictionCount + 1})`,
    }));

    try {
      const testLandmarks = generateVariedLandmarks(state.predictionCount);
      
      console.log(`🔄 Making prediction #${state.predictionCount + 1}`);
      const prediction: PredictionResponse = await apiService.current.predictSign(testLandmarks);

      const newCount = state.predictionCount + 1;

      if (prediction.is_confident && prediction.predicted_letter) {
        setState(prev => ({
          ...prev,
          currentPrediction: prediction.predicted_letter,
          confidence: prediction.confidence,
          status: `✅ Recognized: "${prediction.predicted_letter}" (${(prediction.confidence * 100).toFixed(1)}%)`,
          isProcessing: false,
          predictionCount: newCount,
        }));

        console.log(`🎯 Prediction ${newCount}: ${prediction.predicted_letter} (${(prediction.confidence * 100).toFixed(1)}%)`);
      } else {
        setState(prev => ({
          ...prev,
          status: `❓ Gesture unclear (${(prediction.confidence * 100).toFixed(1)}% confidence)`,
          isProcessing: false,
          predictionCount: newCount,
        }));

        console.log(`❓ Prediction ${newCount}: Low confidence (${(prediction.confidence * 100).toFixed(1)}%)`);
      }

      // Schedule next prediction if still active
      if (state.isActive) {
        predictionTimer.current = setTimeout(() => {
          makePrediction();
        }, 2000); // Wait 2 seconds between predictions
      }

    } catch (error) {
      console.error('Prediction error:', error);
      setState(prev => ({
        ...prev,
        status: `❌ Prediction failed: ${error}`,
        isProcessing: false,
        predictionCount: prev.predictionCount + 1,
      }));
    }
  };

  const toggleRecognition = (): void => {
    if (!state.serverConnected) {
      Alert.alert('Server Not Connected', 'Please wait for server connection.');
      return;
    }

    const newActiveState = !state.isActive;
    
    setState(prev => ({
      ...prev,
      isActive: newActiveState,
      currentPrediction: null,
      confidence: 0,
      predictionCount: 0,
      status: newActiveState 
        ? '🚀 Demo started! Simulating hand gestures...' 
        : '⏸️ Demo stopped',
      isProcessing: false,
    }));

    // Clear any existing timer
    if (predictionTimer.current) {
      clearTimeout(predictionTimer.current);
      predictionTimer.current = null;
    }

    if (newActiveState) {
      console.log('🚀 Starting FSL recognition demo');
      // Start first prediction after 1 second
      predictionTimer.current = setTimeout(() => {
        makePrediction();
      }, 1000);
    } else {
      console.log('⏸️ Stopping FSL recognition demo');
    }
  };

  const makeManualPrediction = (): void => {
    if (!state.serverConnected) return;
    
    if (state.isProcessing) {
      Alert.alert('Please Wait', 'A prediction is already in progress.');
      return;
    }

    console.log('👆 Manual prediction triggered');
    makePrediction();
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Camera permission required</Text>
        <TouchableOpacity style={styles.button} onPress={requestCameraPermission}>
          <Text style={styles.buttonText}>Request Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Front camera not available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          device={device}
          isActive={hasPermission}
        />
        
        {/* Recognition status indicator */}
        <View style={[
          styles.statusIndicator,
          { backgroundColor: state.isActive ? '#4CAF50' : '#666' }
        ]}>
          <Text style={styles.statusIndicatorText}>
            {state.isActive ? '🔴 DEMO ACTIVE' : '⚫ DEMO STOPPED'}
          </Text>
        </View>

        {/* Prediction counter */}
        <View style={styles.predictionCounter}>
          <Text style={styles.predictionCounterText}>
            Predictions: {state.predictionCount}
          </Text>
        </View>
      </View>

      {/* Control Panel Overlay */}
      <View style={styles.overlayContainer}>
        {/* Server Status */}
        <View style={styles.statusRow}>
          <View style={[
            styles.statusDot,
            { backgroundColor: state.serverConnected ? '#4CAF50' : '#F44336' }
          ]} />
          <Text style={styles.statusText}>
            {state.serverConnected ? '✅ Server Ready' : '❌ Server Disconnected'}
          </Text>
        </View>

        {/* Current Status */}
        <Text style={styles.currentStatus}>{state.status}</Text>

        {/* Loading Indicator */}
        {state.isProcessing && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="#2196F3" />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        )}

        {/* Prediction Result */}
        {state.currentPrediction && (
          <View style={styles.predictionContainer}>
            <Text style={styles.predictionLabel}>Latest Recognition:</Text>
            <Text style={styles.predictionText}>{state.currentPrediction}</Text>
            <Text style={styles.confidenceText}>
              Confidence: {(state.confidence * 100).toFixed(1)}%
            </Text>
          </View>
        )}

        {/* Control Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.mainButton,
              { 
                backgroundColor: state.isActive ? '#F44336' : '#4CAF50',
                opacity: state.serverConnected ? 1 : 0.5,
              }
            ]}
            onPress={toggleRecognition}
            disabled={!state.serverConnected}
          >
            <Text style={styles.mainButtonText}>
              {state.isActive ? '⏹️ Stop Demo' : '▶️ Start Demo'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { opacity: state.serverConnected && !state.isProcessing ? 1 : 0.5 }]}
            onPress={makeManualPrediction}
            disabled={!state.serverConnected || state.isProcessing}
          >
            <Text style={styles.secondaryButtonText}>🔄 Single Prediction</Text>
          </TouchableOpacity>
        </View>

        {/* Demo Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>📱 Demo Mode</Text>
          <Text style={styles.infoText}>
            This demonstrates the server integration with simulated hand gestures.
            Real MediaPipe hand detection will replace this simulation.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  statusIndicator: {
    position: 'absolute',
    top: 20,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusIndicatorText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  predictionCounter: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
  },
  predictionCounterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  currentStatus: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  loadingText: {
    color: '#2196F3',
    fontSize: 14,
    marginLeft: 8,
  },
  predictionContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  predictionLabel: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  predictionText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
  },
  confidenceText: {
    color: '#4CAF50',
    fontSize: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 20,
  },
  mainButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#2196F3',
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    margin: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  infoTitle: {
    color: '#FFC107',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoText: {
    color: '#FFC107',
    fontSize: 12,
    lineHeight: 16,
  },
  errorText: {
    color: '#F44336',
    fontSize: 18,
    textAlign: 'center',
    margin: 20,
  },
});

export default WorkingFSLDemo;