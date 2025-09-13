// src/services/MediaPipeHandService.ts
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

export interface HandDetectionResult {
  landmarks: HandLandmark[];
  handedness: string;
  confidence: number;
}

export type HandDetectionCallback = (result: HandDetectionResult | null) => void;

class MediaPipeHandService {
  private hands: Hands;
  private camera: Camera | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private onResults: HandDetectionCallback;
  private isInitialized: boolean = false;

  constructor(onHandDetected: HandDetectionCallback) {
    this.onResults = onHandDetected;
    this.hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });
  }

  async initialize(): Promise<boolean> {
    try {
      // Configure MediaPipe Hands
      this.hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      // Set up result handler
      this.hands.onResults((results: Results) => {
        this.handleResults(results);
      });

      this.isInitialized = true;
      console.log('✅ MediaPipe Hands initialized');
      return true;
    } catch (error) {
      console.error('❌ MediaPipe initialization failed:', error);
      return false;
    }
  }

  private handleResults(results: Results): void {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      const handedness = results.multiHandedness?.[0]?.label || 'Unknown';
      const confidence = results.multiHandedness?.[0]?.score || 0;

      // Convert MediaPipe landmarks to our format
      const handLandmarks: HandLandmark[] = landmarks.map((landmark) => ({
        x: landmark.x,
        y: landmark.y,
        z: landmark.z || 0
      }));

      const result: HandDetectionResult = {
        landmarks: handLandmarks,
        handedness,
        confidence
      };

      this.onResults(result);
    } else {
      // No hand detected
      this.onResults(null);
    }
  }

  async startCamera(videoElement: HTMLVideoElement): Promise<boolean> {
    if (!this.isInitialized) {
      console.error('❌ MediaPipe not initialized');
      return false;
    }

    try {
      this.videoElement = videoElement;
      
      // Initialize camera
      this.camera = new Camera(videoElement, {
        onFrame: async () => {
          if (this.hands && this.videoElement) {
            await this.hands.send({ image: this.videoElement });
          }
        },
        width: 640,
        height: 480
      });

      await this.camera.start();
      console.log('✅ Camera started with MediaPipe');
      return true;
    } catch (error) {
      console.error('❌ Camera start failed:', error);
      return false;
    }
  }

  stopCamera(): void {
    if (this.camera) {
      this.camera.stop();
      this.camera = null;
      console.log('📷 Camera stopped');
    }
  }

  // Helper method to flatten landmarks for API
  static flattenLandmarks(landmarks: HandLandmark[]): number[] {
    if (landmarks.length !== 21) {
      throw new Error(`Expected 21 landmarks, got ${landmarks.length}`);
    }
    
    return landmarks.flatMap(point => [point.x, point.y, point.z]);
  }

  // Helper method to validate landmarks
  static validateLandmarks(landmarks: HandLandmark[]): boolean {
    if (landmarks.length !== 21) return false;
    
    return landmarks.every(point => 
      typeof point.x === 'number' && 
      typeof point.y === 'number' && 
      typeof point.z === 'number' &&
      point.x >= 0 && point.x <= 1 &&
      point.y >= 0 && point.y <= 1
    );
  }

  destroy(): void {
    this.stopCamera();
    if (this.hands) {
      this.hands.close();
    }
    this.isInitialized = false;
    console.log('🧹 MediaPipe service destroyed');
  }
}

export default MediaPipeHandService;