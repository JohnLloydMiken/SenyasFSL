import React, { useState, useEffect } from "react";
import { View, Text, PermissionsAndroid } from "react-native";
import { WebView } from "react-native-webview";

const RecognizerScreen = () => {
  const [prediction, setPrediction] = useState("Detecting...");

  useEffect(() => {
    requestCameraPermission();
  }, []);

  async function requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message: "App needs access to your camera",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }

  const mediapipeHTML = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0; overflow:hidden;">
      <video id="video" autoplay playsinline style="width:100%; height:100%; object-fit:cover; background:black;"></video>
      <canvas id="output" style="position:absolute; top:0; left:0; width:100%; height:100%;"></canvas>

      <script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"></script>
      <script>
        const videoElement = document.getElementById('video');
        const canvasElement = document.getElementById('output');
        const canvasCtx = canvasElement.getContext('2d');

        const hands = new Hands({locateFile: (file) => {
          return 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/' + file;
        }});
        hands.setOptions({
          maxNumHands: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.7
        });

        hands.onResults(results => {
          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
          canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
          if (results.multiHandLandmarks) {
            for (const landmarks of results.multiHandLandmarks) {
              drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                             {color: '#00FF00', lineWidth: 2});
              drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 1});
            }
          }
          canvasCtx.restore();
        });

        const camera = new Camera(videoElement, {
          onFrame: async () => { await hands.send({image: videoElement}); },
          width: 640,
          height: 480
        });
        camera.start();
      </script>
    </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: mediapipeHTML }}
        javaScriptEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.prediction) {
              setPrediction(data.prediction);
            } else {
              setPrediction(JSON.stringify(data));
            }
          } catch (e) {
            console.log("Message parse error:", e);
          }
        }}
      />

      <Text
        style={{
          position: "absolute",
          bottom: 40,
          alignSelf: "center",
          backgroundColor: "#444",
          color: "white",
          padding: 8,
          borderRadius: 8,
        }}
      >
        {prediction}
      </Text>
    </View>
  );
};

export default RecognizerScreen;
