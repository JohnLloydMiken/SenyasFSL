import React, { JSX, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { usePredictionStore } from "@/utils/store";
interface PredictionResponse {
  prediction: string;
  confidence: number;
}

export default function SignLangRecogWebView(): JSX.Element {
const prediction = usePredictionStore((state: { prediction: any; }) => state.prediction);
const setPrediction = usePredictionStore((state: { setPrediction: any; }) => state.setPrediction)
  const handleMessage = (event: WebViewMessageEvent) => {
    const message = event.nativeEvent.data;

    try {
      const data: PredictionResponse = JSON.parse(message);

      if (data && typeof data.prediction === 'string') {
        const confidenceText = (data.confidence * 100).toFixed(1);
        setPrediction(`${data.prediction}`);
      } else {
        setPrediction(message);
      }
    } catch {
      // if message is not JSON (just text), display raw message
      setPrediction(message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: 'https://johnlloydmiken.github.io/SenyasFSL_Webview/' }} // 👈 replace with your actual URL
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
    backgroundColor: 'black',
  },
  overlay: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#000a',
    padding: 10,
    borderRadius: 10,
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
});