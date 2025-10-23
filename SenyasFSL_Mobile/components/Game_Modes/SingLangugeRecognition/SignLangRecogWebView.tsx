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
  const setPrediction = usePredictionStore((state: { setPrediction: (value: string) => void }) => state.setPrediction);

  const handleMessage = (event: WebViewMessageEvent) => {
    const message = event.nativeEvent.data;
    console.log(prediction)
    try {
      const data: PredictionResponse = JSON.parse(message);
      if (data && typeof data.prediction === "string") {
        setPrediction(data.prediction);
      } else {
        setPrediction(message);
      }
    } catch {
      // if not JSON, just set raw message
      setPrediction(message);
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
