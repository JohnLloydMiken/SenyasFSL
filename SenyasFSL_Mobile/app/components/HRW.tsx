import React, { useRef, useState } from "react";
import { View, Button, Alert, StyleSheet } from "react-native";
import { Camera, useCameraDevices, CameraDevice } from "react-native-vision-camera";

export default function GestureRecorder() {
  const camera = useRef<Camera>(null);
   const devices = useCameraDevices();
   const device: CameraDevice | undefined = devices.find(d => d.position === 'front');
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    if (!camera.current || !device) return;

    setIsRecording(true);

    await camera.current.startRecording({
      flash: "off",
      onRecordingFinished: async (video) => {
  setIsRecording(false);
  console.log("Video file:", video.path);

  const formData = new FormData();
  formData.append("video", {
    // Ensure file:// prefix
    uri: video.path.startsWith("file://") ? video.path : `file://${video.path}`,
    type: "video/mp4",
    name: "gesture.mp4",
  } as any);

  try {
    const res = await fetch("http://192.168.0.106:5000/predict_video", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const json = await res.json();
    console.log("Server response:", json);

    if (json.error) {
      Alert.alert("Error", json.error);
    } else {
      Alert.alert(
        "Prediction",
        `${json.predicted_letter} (confidence: ${json.confidence.toFixed(2)})`
      );
    }
  } catch (err) {
    console.error("Upload error:", err);
    Alert.alert("Error", "Failed to upload video");
  }
}
,
      onRecordingError: (err) => {
        console.error("Recording error:", err);
        setIsRecording(false);
      },
    });

    // Auto stop after 2 seconds
    setTimeout(() => {
      camera.current?.stopRecording();
    }, 2000);
  };

  if (!device) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={true}
        video={true}
      />
      <Button
        title={isRecording ? "Recording..." : "Record Gesture"}
        onPress={startRecording}
        disabled={isRecording}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
});
