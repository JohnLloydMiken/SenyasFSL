import React, { useEffect, useState } from "react";
import {
  PermissionsAndroid,
  Platform,
  Alert,
  View,
  Text,
  StyleSheet,
  NativeModules,
  NativeEventEmitter,
} from "react-native";

const { SignLanguageModule } = NativeModules;

interface PredictionData {
  label: string;
  confidence: number;
}

const SignLanguageScreen: React.FC = () => {
  const [prediction, setPrediction] = useState("Waiting for gesture...");
  const [isInitialized, setIsInitialized] = useState(false);
  const [cameraRunning, setCameraRunning] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  // ✅ Request camera permissions
  const requestCameraPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "This app needs access to camera to detect sign language",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Camera permission granted");
          setHasPermission(true);
          return true;
        } else {
          console.log("Camera permission denied");
          Alert.alert("Permission Required", "Camera permission is required.");
          return false;
        }
      } catch (err) {
        console.warn("Permission request error:", err);
        return false;
      }
    } else {
      setHasPermission(true);
      return true;
    }
  };

  // ✅ Initialize and start camera (headless)
  useEffect(() => {
    const initializeApp = async () => {
      const permissionGranted = await requestCameraPermission();
      if (!permissionGranted) return;

      try {
        console.log("Initializing SignLanguageModule...");
        await SignLanguageModule.initialize();
        console.log("SignLanguageModule initialized ✅");
        setIsInitialized(true);

        const status = await SignLanguageModule.getStatus();
        console.log("Module status:", status);

        // 🚀 Start camera after initialization
        await SignLanguageModule.startCamera();
        console.log("Camera started (headless) ✅");
        setCameraRunning(true);
      } catch (err) {
        console.error("Initialization error ❌", err);
        Alert.alert("Initialization Error", "Failed to start recognition.");
      }
    };

    initializeApp();

    return () => {
      if (cameraRunning) {
        SignLanguageModule.stopCamera();
        console.log("Camera stopped 🛑");
      }
    };
  }, []);

  // ✅ Subscribe to predictions
  useEffect(() => {
    if (!isInitialized) return;

    const eventEmitter = new NativeEventEmitter(SignLanguageModule);
    const subscription = eventEmitter.addListener(
      "onPrediction",
      (data: PredictionData) => {
        console.log("Prediction received:", data);
        if (data?.label) {
          const confidence = Math.round((data.confidence || 0) * 100);
          setPrediction(`${data.label} (${confidence}%)`);

          setTimeout(() => {
            setPrediction("Waiting for gesture...");
          }, 2000);
        }
      }
    );

    return () => subscription.remove();
  }, [isInitialized]);

  // ✅ UI
  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Camera permission required</Text>
      </View>
    );
  }

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Initializing sign language detection...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Status indicator */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Module: {isInitialized ? "✅" : "⏳"}</Text>
        <Text style={styles.statusText}>Camera: {cameraRunning ? "✅" : "⏳"}</Text>
      </View>

      {/* Prediction display */}
      <View style={styles.predictionContainer}>
        <Text style={styles.prediction}>{prediction}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black", justifyContent: "center" },
  predictionContainer: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 15,
    margin: 20,
    borderRadius: 10,
  },
  prediction: {
    fontSize: 24,
    fontWeight: "bold",
    color: "lime",
    textAlign: "center",
  },
  statusContainer: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 10,
    borderRadius: 5,
  },
  statusText: { color: "white", fontSize: 12, marginVertical: 2 },
  errorText: { color: "red", fontSize: 18, textAlign: "center" },
  loadingText: { color: "white", fontSize: 18, textAlign: "center" },
});

export default SignLanguageScreen;
