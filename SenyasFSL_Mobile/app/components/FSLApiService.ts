interface LandmarkPoint {
  x: number;
  y: number;
  z: number;
}

interface PredictionRequest {
  landmarks: number[][];
}

interface PredictionResponse {
  predicted_letter: string | null;
  confidence: number;
  all_predictions: Record<string, number>;
  is_confident: boolean;
  prediction_time_ms: number;
  threshold: number;
  error?: string;
}

interface ModelInfoResponse {
  model_loaded: boolean;
  input_shape: string;
  output_shape: string;
  labels: string[];
  num_classes: number;
  confidence_threshold: number;
  error?: string;
}

interface HealthResponse {
  status: string;
  model_loaded: boolean;
  timestamp: number;
}

class FSLApiService {
  private baseUrl: string;
  private timeout: number;

 constructor(baseUrl: string = 'http://192.168.0.107:5000', timeout: number = 10000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  // Update base URL for production deployment
  updateBaseUrl(newUrl: string): void {
    this.baseUrl = newUrl;
  }

  // Health check
  async checkHealth(): Promise<HealthResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json() as HealthResponse;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // Get model information
  async getModelInfo(): Promise<ModelInfoResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}/model-info`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json() as ModelInfoResponse;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // Main prediction method
  async predictSign(landmarkBuffer: number[][]): Promise<PredictionResponse> {
    try {
      // Validate input
      if (!landmarkBuffer || landmarkBuffer.length !== 30) {
        throw new Error(`Expected 30 frames, got ${landmarkBuffer.length}`);
      }

      // Validate each frame has 63 landmarks
      for (let i = 0; i < landmarkBuffer.length; i++) {
        if (landmarkBuffer[i].length !== 63) {
          throw new Error(`Frame ${i} has ${landmarkBuffer[i].length} landmarks, expected 63`);
        }
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const requestBody: PredictionRequest = {
        landmarks: landmarkBuffer
      };

      const response = await fetch(`${this.baseUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const result = await response.json() as PredictionResponse;
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return result;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // Helper method to flatten MediaPipe landmarks
  static flattenLandmarks(landmarks: LandmarkPoint[]): number[] {
    if (landmarks.length !== 21) {
      throw new Error(`Expected 21 hand landmarks, got ${landmarks.length}`);
    }
    
    return landmarks.flatMap(point => [point.x, point.y, point.z]);
  }

  // Helper method to validate landmark buffer
  static validateLandmarkBuffer(buffer: number[][]): boolean {
    if (buffer.length !== 30) return false;
    
    for (const frame of buffer) {
      if (frame.length !== 63) return false;
    }
    
    return true;
  }
}

export default FSLApiService;
export type {
  LandmarkPoint,
  PredictionRequest,
  PredictionResponse,
  ModelInfoResponse,
  HealthResponse
};