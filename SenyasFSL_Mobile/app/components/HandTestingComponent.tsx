import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, DeviceEventEmitter } from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import { NativeModules } from "react-native";

const { SignLanguage } = NativeModules;

export default function SignLanguageScreen() {
  const devices = useCameraDevices();
 const frontCamera = devices.find(d => d.position === 'front');
  const [prediction, setPrediction] = useState<string>("Waiting...");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await SignLanguage.initialize();
        setInitialized(true);
      } catch (err) {
        console.error("Init failed:", err);
      }
    };
    init();

    const sub = DeviceEventEmitter.addListener("onPrediction", (label: string) => {
      setPrediction(label);
    });

    return () => sub.remove();
  }, []);

  if (frontCamera == null) return <View><Text>Loading camera...</Text></View>;

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={frontCamera}
        isActive={initialized}
      />
      <View style={styles.overlay}>
        <Text style={styles.prediction}>{prediction}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  overlay: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 12,
    borderRadius: 8,
  },
  prediction: { fontSize: 24, color: "white", fontWeight: "bold" },
});
