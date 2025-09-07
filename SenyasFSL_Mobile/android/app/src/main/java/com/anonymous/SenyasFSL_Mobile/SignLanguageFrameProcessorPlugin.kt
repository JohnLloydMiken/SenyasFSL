package com.anonymous.SenyasFSL_Mobile

import android.util.Log
import com.mrousavy.camera.frameprocessors.Frame
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin
import com.mrousavy.camera.frameprocessors.VisionCameraProxy

class SignLanguageFrameProcessorPlugin(
  proxy: VisionCameraProxy,
  options: Map<String, Any>?
) : FrameProcessorPlugin() {

  override fun callback(frame: Frame, params: Map<String, Any>?): Any? {
    return try {
      Log.d("SignLanguagePlugin", "📸 Frame received: ${frame.width}x${frame.height}, ts=${frame.timestamp}")

      mapOf(
        "width" to frame.width,
        "height" to frame.height,
        "timestamp" to frame.timestamp
      )
    } catch (e: Exception) {
      Log.e("SignLanguagePlugin", "❌ Error in frame processor", e)
      null
    }
  }
}
