import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { 
  Camera, 
  useCameraDevices, 
  useCameraPermission, 
  CameraDevice,
  PhotoFile 
} from 'react-native-vision-camera';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Configure your Flask server URL
const SERVER_URL = 'http://192.168.0.106:5000'; // Replace with your local IP
// For Android emulator, use: 'http://10.0.2.2:5000'

// Type definitions
interface PredictionResponse {
  status?: 'collecting';
  frames_collected?: number;
  predicted_letter?: string;
  confidence?: number;
  frames_used?: number;
  is_confident?: boolean;
  prediction_time_ms?: number;
  error?: string;
}

interface HealthResponse {
  status: string;
  model_loaded: boolean;
  timestamp: number;
}

type ConnectionStatus = 'connecting' | 'connected' | 'error';

const SignLanguageRecognition: React.FC = () => {
  const camera = useRef<Camera>(null);
  const { hasPermission, requestPermission } = useCameraPermission();
  const devices = useCameraDevices();
  const device: CameraDevice | undefined = devices.find(d => d.position === 'front'); // Use front camera for sign language

  // State management
  const [isActive, setIsActive] = useState<boolean>(true);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [framesCollected, setFramesCollected] = useState<number>(0);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');

  // Refs for intervals
  const captureInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const isCapturing = useRef<boolean>(false);

  // Check server health on mount
  useEffect(() => {
    checkServerHealth();
  }, []);

  // Start/stop frame capture based on camera state
  useEffect(() => {
    if (hasPermission && device && isActive) {
      startFrameCapture();
    } else {
      stopFrameCapture();
    }

    return () => stopFrameCapture();
  }, [hasPermission, device, isActive]);

  const checkServerHealth = async (): Promise<void> => {
    try {
      const response = await fetch(`${SERVER_URL}/health`);
      if (response.ok) {
        const data: HealthResponse = await response.json();
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('error');
      }
    } catch (error) {
      console.error('Server health check failed:', error);
      setConnectionStatus('error');
    }
  };

  const startFrameCapture = (): void => {
    if (captureInterval.current) return;

    console.log('Starting frame capture...');
    captureInterval.current = setInterval(async () => {
      if (!isCapturing.current && camera.current && isActive) {
        await captureAndSendFrame();
      }
    }, 150); // Capture every 150ms (~6.7 FPS)
  };

  const stopFrameCapture = (): void => {
    if (captureInterval.current) {
      clearInterval(captureInterval.current);
      captureInterval.current = null;
      console.log('Frame capture stopped');
    }
  };

  const captureAndSendFrame = async (): Promise<void> => {
    if (isCapturing.current || !camera.current) return;
    
    isCapturing.current = true;
    setIsProcessing(true);

    try {
      // Capture photo
      const photo: PhotoFile = await camera.current.takePhoto();

      // Send to Flask server
      await sendFrameToServer(photo);

    } catch (error) {
      console.error('Frame capture error:', error);
    } finally {
      isCapturing.current = false;
      setIsProcessing(false);
    }
  };

  const sendFrameToServer = async (photo: PhotoFile): Promise<void> => {
    try {
      const formData = new FormData();
      
      // Create a proper blob-like object for React Native
      const fileData = {
        uri: `file://${photo.path}`,
        type: 'image/jpeg',
        name: 'frame.jpg',
      };
      
      // @ts-ignore - React Native FormData accepts this format
      formData.append('frame', fileData);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${SERVER_URL}/predict_frame`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const result: PredictionResponse = await response.json();

      if (response.ok) {
        handlePredictionResponse(result);
      } else {
        console.error('Server error:', result.error);
      }

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('Request timeout');
      } else {
        console.error('Network error:', error);
      }
      setConnectionStatus('error');
    }
  };

  const handlePredictionResponse = (result: PredictionResponse): void => {
    if (result.status === 'collecting' && result.frames_collected !== undefined) {
      // Still collecting frames
      setFramesCollected(result.frames_collected);
      setPrediction(null);
    } else if (result.predicted_letter) {
      // Got a prediction
      setPrediction(result.predicted_letter);
      setConfidence(result.confidence || 0);
      setFramesCollected(result.frames_used || 0);
    } else if (result.error === 'No hand detected') {
      // No hand detected
      setPrediction('No hand detected');
      setConfidence(0);
    }
  };

  // Request permission on mount
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  // Render different states
  if (!hasPermission) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Camera permission required</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No camera device found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera View */}
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={isActive}
        photo={true}
        video={false}
      />

      {/* Overlay UI */}
      <View style={styles.overlay}>
        {/* Connection Status */}
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: connectionStatus === 'connected' ? '#4CAF50' : '#F44336' }
          ]} />
          <Text style={styles.statusText}>
            {connectionStatus === 'connected' ? 'Connected' : 'Connection Error'}
          </Text>
        </View>

        {/* Frames Collection Status */}
        <View style={styles.framesContainer}>
          <Text style={styles.framesText}>
            Frames: {framesCollected}/30
          </Text>
          {framesCollected < 30 && (
            <View style={styles.progressContainer}>
              <View 
                style={[styles.progressBar, { width: `${(framesCollected/30) * 100}%` }]} 
              />
            </View>
          )}
        </View>

        {/* Prediction Display */}
        <View style={styles.predictionContainer}>
          {isProcessing && <ActivityIndicator size="small" color="#FFF" />}
          
          {prediction && prediction !== 'No hand detected' ? (
            <>
              <Text style={styles.predictionText}>{prediction}</Text>
              <Text style={styles.confidenceText}>
                {Math.round(confidence * 100)}% confident
              </Text>
            </>
          ) : (
            <Text style={styles.instructionText}>
              {framesCollected < 30 
                ? 'Show your hand and make a sign...' 
                : prediction || 'Make a sign language gesture'}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  framesContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  framesText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  progressContainer: {
    width: 120,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginTop: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  predictionContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  predictionText: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  confidenceText: {
    color: '#4CAF50',
    fontSize: 16,
    marginTop: 5,
    textAlign: 'center',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SignLanguageRecognition;