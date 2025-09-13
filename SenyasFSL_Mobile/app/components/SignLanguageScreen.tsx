import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Camera } from 'expo-camera'; // or your camera library
import FSLApiService, { PredictionResponse, LandmarkPoint } from './FSLApiService';

const { width, height } = Dimensions.get('window');

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

const FSLRecognition: React.FC<FSLRecognitionProps> = ({ 
  apiUrl = 'http://192.168.0.107:5000' 
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
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

  // Request camera permission
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Check server connection on mount
  useEffect(() => {
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

  // This would be called when MediaPipe detects hand landmarks
  const onHandLandmarksDetected = async (landmarks: LandmarkPoint[]): Promise<void> => {
    try {
      if (!state.serverConnected) return;

      // Flatten landmarks to match model input format
      const flattenedLandmarks = FSLApiService.flattenLandmarks(landmarks);
      landmarkBuffer.current.push(flattenedLandmarks);

      // Keep only last 30 frames
      if (landmarkBuffer.current.length > 30) {
        landmarkBuffer.current = landmarkBuffer.current.slice(-30);
      }

      // Only predict when we have exactly 30 frames and cooldown has passed
      if (landmarkBuffer.current.length === 30) {
        const currentTime = Date.now();
        
        if (currentTime - lastPredictionTime.current < predictionCooldown) {
          return;
        }

        setState(prev => ({ ...prev, isLoading: true, status: 'Analyzing gesture...' }));

        try {
          const prediction: PredictionResponse = await apiService.current.predictSign(
            landmarkBuffer.current
          );

          if (prediction.is_confident && prediction.predicted_letter) {
            setState(prev => ({
              ...prev,
              prediction: prediction.predicted_letter,
              confidence: prediction.confidence,
              status: `Recognized: ${prediction.predicted_letter}`,
              isLoading: false,
            }));
            
            lastPredictionTime.current = currentTime;
            
            console.log(`🎯 Prediction: ${prediction.predicted_letter} (${(prediction.confidence * 100).toFixed(1)}%)`);
          } else {
            setState(prev => ({
              ...prev,
              status: 'Gesture not recognized clearly',
              isLoading: false,
            }));
          }
        } catch (predictionError) {
          console.error('Prediction error:', predictionError);
          setState(prev => ({
            ...prev,
            status: 'Prediction failed',
            isLoading: false,
          }));
        }
      } else {
        setState(prev => ({
          ...prev,
          status: `Collecting gesture data... (${landmarkBuffer.current.length}/30)`,
        }));
      }
    } catch (error) {
      console.error('Landmark processing error:', error);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera View */}
      <View style={styles.cameraContainer}>
        {/* Your camera component here */}
        {/* This is where you'd integrate with MediaPipe */}
        <View style={styles.cameraPlaceholder}>
          <Text style={styles.placeholderText}>Camera View</Text>
          <Text style={styles.placeholderText}>
            (Integrate with MediaPipe here)
          </Text>
        </View>
      </View>

      {/* Status and Results */}
      <View style={styles.resultsContainer}>
        <View style={styles.statusRow}>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: state.serverConnected ? '#4CAF50' : '#F44336' }
          ]} />
          <Text style={styles.statusText}>
            {state.serverConnected ? 'Server Connected' : 'Server Disconnected'}
          </Text>
        </View>

        {state.isLoading && (
          <ActivityIndicator size="small" color="#2196F3" style={styles.loader} />
        )}

        <Text style={styles.statusText}>{state.status}</Text>

        {state.prediction && (
          <View style={styles.predictionContainer}>
            <Text style={styles.predictionLabel}>Recognized Sign:</Text>
            <Text style={styles.predictionText}>{state.prediction}</Text>
            <Text style={styles.confidenceText}>
              Confidence: {(state.confidence * 100).toFixed(1)}%
            </Text>
          </View>
        )}
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