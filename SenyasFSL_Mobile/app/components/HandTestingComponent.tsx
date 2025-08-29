// components/HandTestingComponent.tsx
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { 
  Camera, 
  useCameraDevices, 
  useFrameProcessor 
} from 'react-native-vision-camera';
import { NativeModules } from 'react-native';
import { useReactNativeHandDetection } from '@/app/hooks/useReactNativeHandDetection';

// Types for SignLanguage module
interface SignLanguageModule {
  loadModel(): Promise<string>;
  predict(landmarks: number[]): Promise<{
    prediction: number;
    confidence: number;
    probabilities: number[];
  }>;
}

interface NativeModulesType {
  SignLanguage: SignLanguageModule;
}

const { SignLanguage } = NativeModules as NativeModulesType;

const CLASS_NAMES = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I",
  "K", "L", "M", "N", "O", "P", "Q", "R", "S",
  "T", "U", "V", "W", "X", "Y", "J", "Ñ", "NG", "Z"
];

export default function HandTestingComponent() {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [testingMode, setTestingMode] = useState(false);
  
  const devices = useCameraDevices();
  const frontCamera = devices.find(device => device.position === 'front');
  
  // Get available formats for the front camera
  const cameraFormat = frontCamera?.formats.find(format => 
    format.maxFps >= 30
  ) || frontCamera?.formats[0]; // Fallback to first available format

  const {
    detectionState,
    initialize,
    processFrame,
    getFlattenedData,
    resetSequence,
    isInitialized
  } = useReactNativeHandDetection();

  const predictionInProgress = useRef(false);
  const frameCounter = useRef(0);
  const processingInterval = useRef<NodeJS.Timeout | null>(null);

  // Handle frame processing on JS thread (separate from worklet)
  useEffect(() => {
    if (testingMode && !detectionState.isProcessing) {
      // Process frames periodically when in testing mode
      processingInterval.current = setInterval(() => {
        processFrame(null); // Pass null since we're using dummy data anyway
      }, 100); // Process every 100ms
      
      return () => {
        if (processingInterval.current) {
          clearInterval(processingInterval.current);
        }
      };
    } else {
      if (processingInterval.current) {
        clearInterval(processingInterval.current);
      }
    }
  }, [testingMode, detectionState.isProcessing, processFrame]);

  // Request camera permission
  useEffect(() => {
    const requestPermission = async () => {
      const permission = await Camera.requestCameraPermission();
      setHasPermission(permission === 'granted');
      
      if (permission === 'denied') {
        Alert.alert(
          'Camera Permission', 
          'Camera access is required for hand detection. Please grant permission in settings.'
        );
      }
    };
    
    requestPermission();
  }, []);

  // Load ML model
  useEffect(() => {
    const loadModel = async () => {
      try {
        const result = await SignLanguage.loadModel();
        setIsModelLoaded(true);
        console.log("✅ ML Model loaded:", result);
      } catch (error) {
        console.error("❌ Failed to load ML model:", error);
        Alert.alert("Model Error", "Failed to load sign language model");
      }
    };

    loadModel();
  }, []);

  // Initialize hand detection
  useEffect(() => {
    const init = async () => {
      const success = await initialize();
      if (!success) {
        Alert.alert("Detection Error", "Failed to initialize hand detection");
      }
    };
    
    init();
  }, [initialize]);

  // Auto-predict when ready and in testing mode
  useEffect(() => {
    if (
      detectionState.isReady && 
      isModelLoaded && 
      testingMode && 
      !predictionInProgress.current
    ) {
      makePrediction();
    }
  }, [detectionState.isReady, isModelLoaded, testingMode]);

  // Frame processor for Vision Camera
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    
    if (testingMode && !detectionState.isProcessing) {
      frameCounter.current++;
      
      // Process every 3rd frame to avoid overwhelming the system
      if (frameCounter.current % 3 === 0) {
        // Note: In a real implementation, you'd extract actual landmarks here
        // For now, we'll trigger processing on the JS thread
        console.log('Frame captured for processing');
      }
    }
  }, [testingMode, detectionState.isProcessing]);

  const makePrediction = async () => {
    if (predictionInProgress.current) return;
    
    try {
      predictionInProgress.current = true;
      console.log("🔮 Making prediction...");
      
      const flattenedData = getFlattenedData();
      const result = await SignLanguage.predict(flattenedData);
      
      const predictedLetter = CLASS_NAMES[result.prediction];
      const confidence = (result.confidence * 100).toFixed(1);
      
      // 🎯 CONSOLE LOGGING (as requested)
      console.log("====== PREDICTION RESULT ======");
      console.log(`🔤 Predicted Letter: ${predictedLetter}`);
      console.log(`📊 Confidence: ${confidence}%`);
      console.log(`📈 Class Index: ${result.prediction}`);
      console.log("🔝 Top 3 Predictions:");
      
      // Show top 3 predictions
      const topPredictions = result.probabilities
        .map((prob, index) => ({ 
          class: CLASS_NAMES[index], 
          probability: prob * 100, 
          index 
        }))
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 3);
      
      topPredictions.forEach((pred, i) => {
        console.log(`   ${i + 1}. ${pred.class}: ${pred.probability.toFixed(1)}%`);
      });
      
      console.log("🤖 NOTE: Using dummy landmark data for testing");
      console.log("================================");
      
      // Auto-reset for continuous testing
      setTimeout(() => {
        resetSequence();
        predictionInProgress.current = false;
      }, 2000);
      
    } catch (error) {
      console.error("❌ Prediction failed:", error);
      predictionInProgress.current = false;
    }
  };

  const startTesting = () => {
    setTestingMode(true);
    setIsActive(true);
    resetSequence();
    frameCounter.current = 0;
    console.log("🎬 Testing started with DUMMY landmark data!");
    console.log("📝 This will test your ML model with simulated hand landmarks");
  };

  const stopTesting = () => {
    setTestingMode(false);
    setIsActive(false);
    resetSequence();
    predictionInProgress.current = false;
    console.log("⏹️ Testing stopped");
  };

  // Show loading screen while waiting for setup
  if (!hasPermission || !frontCamera || !isModelLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          {!hasPermission ? "Requesting camera permission..." :
           !frontCamera ? "Front camera not found..." :
           !isModelLoaded ? "Loading ML model..." :
           "Setting up..."}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Front Camera View */}
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          device={frontCamera}
          isActive={isActive}
          frameProcessor={frameProcessor}
          format={cameraFormat}
          fps={30}
        />
        
        {/* Status Overlay */}
        <View style={styles.statusOverlay}>
          <Text style={styles.statusText}>
            📊 Frames: {detectionState.currentFrame}/30
          </Text>
          <Text style={styles.statusText}>
            🤖 Mode: Dummy Data Testing
          </Text>
          {testingMode && (
            <Text style={styles.statusText}>
              {detectionState.isReady ? "🎯 Ready for prediction!" : "⏳ Collecting frames..."}
            </Text>
          )}
        </View>
      </View>

      {/* Simple Controls */}
      <View style={styles.controlsContainer}>
        <Text style={styles.instructionText}>
          {testingMode ? 
            "Testing with dummy data - Check console for results" : 
            "Press Start to test ML model with simulated landmarks"
          }
        </Text>
        
        <Text style={styles.warningText}>
          ⚠️ Currently using simulated hand landmarks for testing
        </Text>
        
        {!testingMode ? (
          <TouchableOpacity
            style={[styles.button, styles.startButton]}
            onPress={startTesting}
          >
            <Text style={styles.buttonText}>Start Testing</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.stopButton]}
            onPress={stopTesting}
          >
            <Text style={styles.buttonText}>Stop Testing</Text>
          </TouchableOpacity>
        )}
        
        <Text style={styles.debugText}>
          Model: {isModelLoaded ? "✅" : "❌"} | 
          Detection: {isInitialized ? "✅" : "❌"} |
          Camera: {frontCamera ? "✅" : "❌"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  statusOverlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 15,
    borderRadius: 10,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  controlsContainer: {
    backgroundColor: '#FAF3E0',
    padding: 20,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  warningText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#FF6600',
    fontWeight: 'bold',
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
    minWidth: 150,
    alignItems: 'center',
    marginBottom: 15,
  },
  startButton: {
    backgroundColor: '#FB990F',
  },
  stopButton: {
    backgroundColor: '#FF4444',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
});