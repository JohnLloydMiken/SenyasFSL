// vision-camera-detectHands.d.ts

import type { Frame } from 'react-native-vision-camera';

declare global {
  /**
   * Injected by HandDetectionFrameProcessorPluginPackage().
   * Runs inside the VisionCamera worklet.
   */
  function detectHands(frame: Frame): { handsDetected: boolean };
}

// This ensures the file is treated as a module
export {};