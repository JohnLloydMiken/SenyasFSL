package com.anonymous.SenyasFSL_Mobile

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.ImageFormat
import android.graphics.Matrix
import android.graphics.Rect
import android.graphics.YuvImage
import android.util.Log
import com.mrousavy.camera.frameprocessors.Frame
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin
import com.mrousavy.camera.frameprocessors.VisionCameraProxy
import java.io.ByteArrayOutputStream
import java.nio.ByteBuffer

class HandDetectionFrameProcessorPlugin(proxy: VisionCameraProxy, options: Map<String, Any>?) : FrameProcessorPlugin() {
    
    private var handLandmarkerHelper: HandLandmarkerHelper? = null
    
    init {
        handLandmarkerHelper = HandLandmarkerHelper(
            context = proxy.context,
            handLandmarkerHelperListener = object : HandLandmarkerHelper.LandmarkerListener {
                override fun onError(error: String, errorCode: Int) {
                    Log.e("HandDetection", "Error: $error")
                }
                
                override fun onResults(resultBundle: HandLandmarkerHelper.ResultBundle) {
                    // Fixed: Use handLandmarks() method correctly
                    val handsCount = resultBundle.results.firstOrNull()?.landmarks()?.size ?: 0
                    Log.d("HandDetection", "Hands detected: $handsCount")
                }
            }
        )
    }

    override fun callback(frame: Frame, arguments: Map<String, Any>?): Any? {
        try {
            // Convert frame to bitmap using Frame properties
            val bitmap = convertFrameToBitmap(frame)
            
            // Process with MediaPipe
            handLandmarkerHelper?.detectLiveStream(bitmap)
            
            return mapOf("handsDetected" to true)
        } catch (e: Exception) {
            Log.e("HandDetection", "Error processing frame: ${e.message}")
            return null
        }
    }
    
    private fun convertFrameToBitmap(frame: Frame): Bitmap {
        return try {
            // Use Frame's direct properties instead of ImageProxy
            val buffer = frame.image.planes[0].buffer
            val pixelStride = frame.image.planes[0].pixelStride
            val rowStride = frame.image.planes[0].rowStride
            val rowPadding = rowStride - pixelStride * frame.width
            
            // Create bitmap from buffer
            val bitmap = Bitmap.createBitmap(
                frame.width + rowPadding / pixelStride,
                frame.height,
                Bitmap.Config.ARGB_8888
            )
            
            bitmap.copyPixelsFromBuffer(buffer)
            
            // Crop to actual frame size if needed
            if (rowPadding != 0) {
                Bitmap.createBitmap(bitmap, 0, 0, frame.width, frame.height)
            } else {
                bitmap
            }
        } catch (e: Exception) {
            Log.w("HandDetection", "Error converting frame: ${e.message}")
            // Fallback - create a simple bitmap for testing
            Bitmap.createBitmap(frame.width, frame.height, Bitmap.Config.ARGB_8888)
        }
    }
}