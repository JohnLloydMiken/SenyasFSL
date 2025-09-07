import { useEffect } from "react";
import { Text, View } from "react-native";

export default function App() {
  useEffect(() => {
    const ws = new WebSocket("ws://192.168.0.108:8000/ws");

    ws.onopen = () => {
      console.log("✅ Connected to backend");

      // Send 30 dummy frames (simulate 30 camera frames)
      let frameCount = 0;
      const interval = setInterval(() => {
        if (frameCount >= 30) {
          clearInterval(interval);
          return;
        }

        const dummy = Array(63).fill(0.5); // fake landmarks
        ws.send(JSON.stringify(dummy));
        console.log(`📤 Sent frame ${frameCount + 1}`);
        frameCount++;
      }, 100); // 100ms per frame (~10 fps)
    };

    ws.onmessage = (event) => {
      console.log("📩 Message from server:", event.data);
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("🔌 WebSocket closed");
    };

    return () => ws.close();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Check Metro logs for WebSocket messages</Text>
    </View>
  );
}
