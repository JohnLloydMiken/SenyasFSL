import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Camera,
  Frame,
  useCameraDevice,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { runOnJS } from 'react-native-reanimated';  // <-- needed to cross into JS

export default function FSLTest() {
  const device = useCameraDevice('front');
  const [handsDetected, setHandsDetected] = useState(false);

  useEffect(() => {
    Camera.requestCameraPermission().then(status =>
      console.log('Camera permission:', status),
    );
  }, []);

  const frameProcessor = useFrameProcessor((frame: Frame) => {
    'worklet';
    try {
      // ← calls your native plugin
      const { handsDetected: detected } = detectHands(frame);
      runOnJS(setHandsDetected)(detected);
    } catch (error) {
      // error will now be a real exception if the native plugin
      // registration failed—inspect it in Metro’s console
      runOnJS(console.error)('Frame processor error:', error);
    }
  }, []);

  if (!device) return <Text>Loading camera…</Text>;

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive
        frameProcessor={frameProcessor}
        // You can throttle how many fps you send to the plugin:
       
      />
      <View style={styles.overlay}>
        <Text style={styles.text}>
          Hands detected: {handsDetected ? 'Yes' : 'No'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 4,
  },
  text: { color: 'white', fontSize: 16 },
});