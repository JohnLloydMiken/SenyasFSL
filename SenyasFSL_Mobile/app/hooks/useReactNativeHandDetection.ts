// hooks/useReactNativeHandDetection.ts
import { useState, useRef, useCallback } from 'react';

interface DetectionState {
  currentFrame: number;
  isReady: boolean;
  isProcessing: boolean;
}

export const useReactNativeHandDetection = () => {
  const [detectionState, setDetectionState] = useState<DetectionState>({
    currentFrame: 0,
    isReady: false,
    isProcessing: false
  });

  const landmarkSequence = useRef<number[][]>([]);
  
  const SEQUENCE_LENGTH = 30;
  const FEATURES_PER_FRAME = 63; // 21 landmarks × 3 coordinates

  // Simulate hand landmark extraction from camera frame
  // In a real implementation, this would use TensorFlow.js or a native module
  const extractLandmarksFromFrame = useCallback((frame: any): number[] | null => {
    // 🚧 TEMPORARY: Generate dummy landmarks for testing
    // In production, replace this with actual hand detection
    
    // Simulate detection success/failure (80% success rate)
    if (Math.random() < 0.8) {
      // Generate realistic-looking dummy landmarks
      const landmarks: number[] = [];
      
      // Generate 21 hand landmarks with 3 coordinates each
      for (let i = 0; i < 21; i++) {
        // Simulate hand landmarks in normalized coordinates (0-1)
        const x = 0.3 + Math.random() * 0.4; // Keep hand in center area
        const y = 0.3 + Math.random() * 0.4;
        const z = Math.random() * 0.1 - 0.05; // Small depth variation
        
        landmarks.push(x, y, z);
      }
      
      return landmarks;
    }
    
    return null; // No hand detected
  }, []);

  // Process camera frame
  const processFrame = useCallback(async (frame: any) => {
    if (detectionState.isProcessing) return;
    
    try {
      setDetectionState(prev => ({ ...prev, isProcessing: true }));
      
      // Extract landmarks from frame
      const frameData = extractLandmarksFromFrame(frame);
      
      if (frameData && frameData.length === FEATURES_PER_FRAME) {
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
          isProcessing: false
        });

        // Debug logging
        if (currentCount % 5 === 0) {
          console.log(`📊 Collected ${currentCount}/${SEQUENCE_LENGTH} frames`);
        }

        if (isComplete) {
          console.log("🎯 30 frames collected! Ready for prediction.");
        }
      } else {
        setDetectionState(prev => ({ ...prev, isProcessing: false }));
        // console.log("👋 No hand detected in current frame");
      }
      
    } catch (error) {
      console.error("❌ Frame processing error:", error);
      setDetectionState(prev => ({ ...prev, isProcessing: false }));
    }
  }, [detectionState.isProcessing, extractLandmarksFromFrame]);

  // Get flattened data for prediction
  const getFlattenedData = useCallback((): number[] => {
    if (landmarkSequence.current.length !== SEQUENCE_LENGTH) {
      throw new Error(`Not enough frames. Have ${landmarkSequence.current.length}, need ${SEQUENCE_LENGTH}`);
    }
    
    const flattened = landmarkSequence.current.flat();
    console.log(`📦 Flattened data: ${flattened.length} values`);
    return flattened;
  }, []);

  // Reset sequence
  const resetSequence = useCallback(() => {
    landmarkSequence.current = [];
    setDetectionState({
      currentFrame: 0,
      isReady: false,
      isProcessing: false
    });
    console.log("🔄 Sequence reset");
  }, []);

  // Initialize (no external library needed now)
  const initialize = useCallback(async (): Promise<boolean> => {
    console.log("✅ Hand detection initialized (using dummy data for testing)");
    return true;
  }, []);

  return {
    detectionState,
    initialize,
    processFrame,
    getFlattenedData,
    resetSequence,
    isInitialized: true // Always true since no external dependencies
  };
};