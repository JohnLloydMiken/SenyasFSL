import React, { useEffect, useState, useRef } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { Camera, useCameraDevices, useFrameProcessor } from "react-native-vision-camera";
import { runOnJS } from "react-native-reanimated";

// 👇 Safety: check if VisionCamera plugin registry exists
declare global {
  var __frameProcessorPlugins: any;
}

const Recognizer: React.FC = () => {
  const [prediction, setPrediction] = useState("Waiting for prediction...");
  const [hasPermission, setHasPermission] = useState(false);
  const lastPredictionTime = useRef(0);

  const devices = useCameraDevices();
  const device = devices.find((d) => d.position === "front");

  // ✅ Ask for camera permission
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === "granted");
    })();
  }, []);

  // ✅ Safe frame processor (only if plugin exists)
  const frameProcessor = useFrameProcessor((frame) => {
    "worklet";
    try {
      if (global.__frameProcessorPlugins?.signLanguage) {
        const result = global.__frameProcessorPlugins.signLanguage(frame);
        if (result) {
          runOnJS(handlePrediction)(result);
        }
      }
    } catch (err) {
      console.error("FrameProcessor error:", err);
    }
  }, []);

  const handlePrediction = (data: any) => {
    if (data?.width && data?.height) {
      setPrediction(`Frame: ${data.width}x${data.height}, ts=${data.timestamp}`);
      lastPredictionTime.current = Date.now();
    }
  };

  if (!hasPermission) return <Text>No camera permission</Text>;
  if (!device) return <Text>Loading camera...</Text>;

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
 
      />
      <View style={styles.overlay}>
        <Text style={styles.prediction}>{prediction}</Text>
        <Button title="Reset" onPress={() => setPrediction("Waiting for prediction...")} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  camera: { ...StyleSheet.absoluteFillObject },
  overlay: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  prediction: {
    fontSize: 18,
    fontWeight: "bold",
    color: "lime",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default Recognizer;
