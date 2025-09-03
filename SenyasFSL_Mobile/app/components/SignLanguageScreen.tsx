import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  NativeModules,
  NativeEventEmitter,
  requireNativeComponent,
} from "react-native";

const { SignLanguageModule } = NativeModules;

// ✅ Define native camera view props
type SignLanguageCameraProps = {
  startCamera?: boolean;
  style?: object;
};

// ✅ Require the native view with props
const SignLanguageCamera = requireNativeComponent<SignLanguageCameraProps>(
  "SignLanguageCameraView"
);

const SignLanguageScreen: React.FC = () => {
  const [prediction, setPrediction] = useState<string>(
    "Waiting for gesture..."
  );

  useEffect(() => {
    // Initialize module
    SignLanguageModule.initialize();

    // Subscribe to predictions from native side
    const eventEmitter = new NativeEventEmitter(SignLanguageModule);
    const subscription = eventEmitter.addListener(
      "onPrediction",
      (prediction: string) => {
        // Change to string
        setPrediction(prediction);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* ✅ Pass startCamera={true} */}
      <SignLanguageCamera style={styles.camera} startCamera={true} />
      <Text style={styles.prediction}>{prediction}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  prediction: {
    position: "absolute",
    bottom: 30,
    fontSize: 20,
    fontWeight: "bold",
    color: "lime",
    textAlign: "center",
  },
});

export default SignLanguageScreen;
