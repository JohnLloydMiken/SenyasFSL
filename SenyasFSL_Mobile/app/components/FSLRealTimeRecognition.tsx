import React, { useEffect, useState, useRef } from "react";
import { View, Text } from "react-native";
import { Camera, useCameraDevices, useCameraPermission } from "react-native-vision-camera";

export default function CameraScreen() {
  const [prediction, setPrediction] = useState("");
  const { hasPermission, requestPermission } = useCameraPermission();
  const devices = useCameraDevices();
  const device = devices.find((d) => d.position === "front");
  const camera = useRef<Camera>(null);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  useEffect(() => {
    if (!camera.current) return;

    const interval = setInterval(async () => {
      try {
        if (!camera.current) return;

        const photo = await camera.current.takePhoto({ flash: "off" });

        const formData = new FormData();
        formData.append("frame", {
          uri: "file://" + photo.path,
          name: "frame.jpg",
          type: "image/jpeg",
        } as any);

        const res = await fetch("http://192.168.0.107:5000/predict_frame", {
          method: "POST",
          body: formData,
        });

        const json = await res.json();
        if (json.predicted_letter) {
          setPrediction(
            `${json.predicted_letter} (${Math.round(
              json.confidence * 100
            )}%)`
          );
        }
      } catch (err) {
        console.log("Frame upload error:", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [camera]);

  if (!device) return <Text>Loading camera...</Text>;
  if (!hasPermission) return <Text>No camera permission</Text>;

  return (
    <View style={{ flex: 1 }}>
      <Camera
        ref={camera}
        style={{ flex: 1 }}
        device={device}
        isActive={true}
        photo={true}
      />
      <View
        style={{
          position: "absolute",
          bottom: 40,
          left: 0,
          right: 0,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 24, color: "black" }}>
          {prediction || "Waiting for prediction..."}
        </Text>
      </View>
    </View>
  );
}
