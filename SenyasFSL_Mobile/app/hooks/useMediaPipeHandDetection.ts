import { useState, useRef, useCallback } from 'react';
import { MediapipeCamera } from 'react-native-mediapipe';

interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

interface DetectionState {
  currentFrame: number;
  isReady: boolean;
  isProcessing: boolean;
  lastDetectionTime: number;
}

export const useMediaPipeHandDetection = () => {
  const [detectionState, setDetectionState] = useState<DetectionState>({
    currentFrame: 0,
    isReady: false,
    isProcessing: false,
    lastDetectionTime: 0
  });

  const landmarkSequence = useRef<number[][]>([]);
  const SEQUENCE_LENGTH = 30;
  const FEATURES_PER_FRAME = 63; // 21 landmarks × 3 coordinates

  // Convert MediaPipe landmarks to your model's format
  const convertLandmarksToModelFormat = useCallback((landmarks: HandLandmark[]): number[] => {
    if (landmarks.length !== 21) {
      console.warn(`Expected 21 landmarks, got ${landmarks.length}`);
      return [];
    }
    
    const flattened: number[] = [];
    for (const landmark of landmarks) {
      flattened.push(landmark.x, landmark.y, landmark.z);
    }
    
    return flattened;
  }, []);

  // Process MediaPipe results
  const processMediaPipeResults = useCallback((results: any) => {
    if (detectionState.isProcessing) return;
    
    try {
      setDetectionState(prev => ({ ...prev, isProcessing: true }));
      
      // Check if hand landmarks are detected
      if (results?.landmarks && results.landmarks.length > 0) {
        const handLandmarks = results.landmarks[0]; // First hand
        
        if (handLandmarks.length === 21) {
          const frameData = convertLandmarksToModelFormat(handLandmarks);
          
          if (frameData.length === FEATURES_PER_FRAME) {
            landmarkSequence.current.push(frameData);
            
            // Keep only last 30 frames
            if (landmarkSequence.current.length > SEQUENCE_LENGTH) {
              landmarkSequence.current.shift();
            }

            const currentCount = landmarkSequence.current.length;
            const isComplete = currentCount === SEQUENCE_LENGTH;

            setDetectionState({
              currentFrame: currentCount,
              isReady: isComplete,
              isProcessing: false,
              lastDetectionTime: Date.now()
            });

            if (currentCount % 5 === 0) {
              console.log(`📊 MediaPipe landmarks: ${currentCount}/${SEQUENCE_LENGTH}`);
            }

            if (isComplete) {
              console.log("🎯 30 frames with REAL MediaPipe landmarks ready!");
            }
          }
        }
      } else {
        setDetectionState(prev => ({ ...prev, isProcessing: false }));
      }
      
    } catch (error) {
      console.error("❌ MediaPipe processing error:", error);
      setDetectionState(prev => ({ ...prev, isProcessing: false }));
    }
  }, [detectionState.isProcessing, convertLandmarksToModelFormat]);

  const getFlattenedData = useCallback((): number[] => {
    if (landmarkSequence.current.length !== SEQUENCE_LENGTH) {
      throw new Error(`Not enough frames. Have ${landmarkSequence.current.length}, need ${SEQUENCE_LENGTH}`);
    }
    
    const flattened = landmarkSequence.current.flat();
    console.log(`📦 MediaPipe landmark data: ${flattened.length} values`);
    return flattened;
  }, []);

  const resetSequence = useCallback(() => {
    landmarkSequence.current = [];
    setDetectionState({
      currentFrame: 0,
      isReady: false,
      isProcessing: false,
      lastDetectionTime: 0
    });
    console.log("🔄 MediaPipe sequence reset");
  }, []);

  const initialize = useCallback(async (): Promise<boolean> => {
    console.log("✅ MediaPipe hand detection initialized");
    return true;
  }, []);

  return {
    detectionState,
    initialize,
    processMediaPipeResults,
    getFlattenedData,
    resetSequence,
    isInitialized: true
  };
};