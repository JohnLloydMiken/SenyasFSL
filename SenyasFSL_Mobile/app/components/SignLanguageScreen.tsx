import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { 
  Camera, 
  useCameraDevice, 
  useCameraPermission, 
  useFrameProcessor 
} from 'react-native-vision-camera';
import { VisionCameraProxy } from 'react-native-vision-camera';
import 'react-native-worklets-core'; // Import for worklets
import FSLApiService, { PredictionResponse, LandmarkPoint } from './FSLApiService';

const { width, height } = Dimensions.get('window');
type LandmarkData = [number, number, number][];
interface FSLRecognitionProps {
  apiUrl?: string;
}

interface RecognitionState {
  isLoading: boolean;
  serverConnected: boolean;
  prediction: string | null;
  confidence: number;
  status: string;
}

const plugin = VisionCameraProxy.initFrameProcessorPlugin('XyzFrameProcessorPlugin', {}); // From native plugin

const FSLRecognition: React.FC<FSLRecognitionProps> = ({ 
  apiUrl = 'http://localhost:5000' 
}) => {
  const device = useCameraDevice('front');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [state, setState] = useState<RecognitionState>({
    isLoading: false,
    serverConnected: false,
    prediction: null,
    confidence: 0,
    status: 'Initializing...',
  });

  const apiService = useRef(new FSLApiService(apiUrl));
  const landmarkBuffer = useRef<number[][]>([]);
  const lastPredictionTime = useRef<number>(0);
  const predictionCooldown = 1500; // 1.5 seconds

  useEffect(() => {
    requestPermission();
    checkServerConnection();
  }, []);

  const checkServerConnection = async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, status: 'Connecting to server...' }));
      
      const health = await apiService.current.checkHealth();
      const modelInfo = await apiService.current.getModelInfo();
      
      if (health.model_loaded && modelInfo.model_loaded) {
        setState(prev => ({
          ...prev,
          serverConnected: true,
          status: 'Ready to recognize signs',
          isLoading: false,
        }));
        console.log('✅ Server connected and model loaded');
      } else {
        throw new Error('Model not loaded on server');
      }
    } catch (error) {
      console.error('❌ Server connection failed:', error);
      setState(prev => ({
        ...prev,
        serverConnected: false,
        status: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isLoading: false,
      }));
      
      Alert.alert(
        'Connection Error',
        'Failed to connect to the sign recognition server. Please check if the server is running.',
        [{ text: 'OK' }]
      );
    }
  };


const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    if (!frame || !plugin) {
      return; // Exit if frame or plugin is not available
    }

    const landmarksData = plugin.call(frame) as unknown as LandmarkData | null; // Cast to expected type
    if (landmarksData && Array.isArray(landmarksData) && landmarksData.length === 21) {
      const wrist = landmarksData[0];
      const normalized = landmarksData.map(point => ({
        x: point[0] - wrist[0],
        y: point[1] - wrist[1],
        z: point[2] - wrist[2],
      }));
      const flattened = FSLApiService.flattenLandmarks(normalized);
      landmarkBuffer.current.push(flattened);
      if (landmarkBuffer.current.length > 30) {
        landmarkBuffer.current.shift();
      }
    } else {
      landmarkBuffer.current = [];
    }
  }, []);

  // Effect to handle prediction outside worklet
  useEffect(() => {
    const interval = setInterval(async () => {
      if (landmarkBuffer.current.length === 30 && state.serverConnected) {
        try {
          setState(prev => ({ ...prev, isLoading: true, status: 'Analyzing gesture...' }));
          const prediction = await apiService.current.predictSign(landmarkBuffer.current);
          if (prediction.is_confident && prediction.predicted_letter) {
            setState(prev => ({
              ...prev,
              prediction: prediction.predicted_letter,
              confidence: prediction.confidence,
              status: `Recognized: ${prediction.predicted_letter}`,
              isLoading: false,
            }));
            lastPredictionTime.current = Date.now();
          } else {
            setState(prev => ({ ...prev, status: 'Gesture not recognized clearly', isLoading: false }));
          }
          landmarkBuffer.current = []; // Reset after prediction
        } catch (e) {
          setState(prev => ({ ...prev, status: 'Prediction failed', isLoading: false }));
        }
      }
    }, 500); // Poll buffer
    return () => clearInterval(interval);
  }, [state.serverConnected]);

  if (!hasPermission) return <View style={styles.container}><Text>No camera permission</Text></View>;
  if (device == null) return <View style={styles.container}><Text>No device</Text></View>;

  return (
    <View style={styles.container}>
      <Camera
        style={styles.cameraContainer}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        pixelFormat="rgb" // Or 'yuv' for Android
        fps={30} // For performance
      />
      {/* Status and Results - unchanged */}
    </View>
  );
};

// Styles unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 8,
  },
  resultsContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    padding: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  loader: {
    alignSelf: 'flex-start',
    marginVertical: 4,
  },
  predictionContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  predictionLabel: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
  },
  predictionText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
  },
  confidenceText: {
    color: '#4CAF50',
    fontSize: 12,
    textAlign: 'center',
  },
});


export default FSLRecognition;