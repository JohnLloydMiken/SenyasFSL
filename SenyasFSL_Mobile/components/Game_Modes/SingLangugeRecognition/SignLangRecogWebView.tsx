import React, { JSX } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { usePredictionStore } from "@/utils/store/store";

interface PredictionResponse {
  prediction: string;
  confidence: number;
}

interface SignLangRecogWebViewProps {
  modelName: string; // "letters" | "numbers" | "ordinals"
  handMode: string;  // "one" | "two" etc.
}

export default function SignLangRecogWebView({
  modelName,
  handMode,
}: SignLangRecogWebViewProps): JSX.Element {
  const prediction = usePredictionStore((state: { prediction: string }) => state.prediction);
 
const setPrediction = usePredictionStore((state) => state.setPrediction);
const setCameraStatus = usePredictionStore((state) => state.setCameraStatus); // ✅ Add this
 const handleMessage = (event: WebViewMessageEvent) => {
  const message = event.nativeEvent.data;
  console.log("Raw message:", message);
  
  try {
    const data: PredictionResponse = JSON.parse(message);
    
    // ✅ If it's a valid prediction response with confidence
    if (data && typeof data.prediction === "string" && typeof data.confidence === "number") {
      console.log("Parsed prediction:", data);
      setPrediction(data.prediction, data.confidence);
      setCameraStatus("Processing...");
    } else {
      // Handle other JSON that doesn't match our structure
      setPrediction(message);
    }
  } catch {
    // ✅ Not JSON - treat as status message
    if (message.includes("Camera ready")) {
      setCameraStatus("Show Hand");
    } else if (message.includes("Using model")) {
      setCameraStatus("Initializing...");
    } else if (message.includes("error")) {
      setCameraStatus("Error");
    } else {
      // Fallback: set as camera status
      setCameraStatus(message);
    }
  }
};

  // Construct your URL dynamically with props
  const webviewUrl = `https://johnlloydmiken.github.io/SenyasFSL_Webview/?model=${modelName}&hand=${handMode}`;

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: webviewUrl }}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        mixedContentMode="always"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
