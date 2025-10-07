import React, { JSX, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

interface PredictionResponse {
  prediction: string;
  confidence: number;
}

export default function MediapipeWebView(): JSX.Element {
  const [prediction, setPrediction] = useState<string | null>(null);

  const handleMessage = (event: WebViewMessageEvent) => {
    const message = event.nativeEvent.data;

    try {
      const data: PredictionResponse = JSON.parse(message);

      if (data && typeof data.prediction === 'string') {
        const confidenceText = (data.confidence * 100).toFixed(1);
        setPrediction(`${data.prediction} (${confidenceText}%)`);
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

      <View style={styles.overlay}>
        <Text style={styles.text}>
          {prediction ? `🧠 ${prediction}` : 'Detecting hands...'}
        </Text>
      </View>
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




/*

 const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    async function requestCameraPermission() {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'App needs access to the camera to display it in WebView',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setHasPermission(true);
          } else {
            Alert.alert('Camera permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        setHasPermission(true);
      }
    }
    requestCameraPermission();
  }, []);

  if (!hasPermission) {
    return <View />; // or a loading placeholder
  }
*/ 