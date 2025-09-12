package com.anonymous.SenyasFSL_Mobile.xyzframeprocessor

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.ImageFormat
import android.graphics.Rect
import android.graphics.YuvImage
import android.media.Image
import android.util.Log
import androidx.annotation.Nullable
import com.google.mediapipe.framework.image.BitmapImageBuilder
import com.google.mediapipe.framework.image.MPImage
import com.google.mediapipe.tasks.core.BaseOptions
import com.google.mediapipe.tasks.vision.core.RunningMode
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarker
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarkerResult
import com.mrousavy.camera.frameprocessors.Frame
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin
import com.mrousavy.camera.frameprocessors.VisionCameraProxy
import java.io.ByteArrayOutputStream
import java.nio.ByteBuffer

class XyzFrameProcessorPlugin(
    proxy: VisionCameraProxy,
    @Nullable options: Map<String, Any>?
) : FrameProcessorPlugin() {

    companion object {
        private const val TAG = "HandLandmarksPlugin"
        private const val MODEL_ASSET_PATH = "hand_landmarker.task"
    }

    private var handLandmarker: HandLandmarker? = null

    init {
        try {
            val baseOptions = BaseOptions.builder()
                .setModelAssetPath(MODEL_ASSET_PATH)
                .build()

            val handLandmarkerOptions = HandLandmarker.HandLandmarkerOptions.builder()
                .setBaseOptions(baseOptions)
                .setMinHandDetectionConfidence(0.5f)
                .setMinTrackingConfidence(0.5f)
                .setMinHandPresenceConfidence(0.5f)
                .setNumHands(1)  // Detect one hand (e.g., right hand for FSL)
                .setRunningMode(RunningMode.VIDEO)
                .build()

            handLandmarker = HandLandmarker.createFromOptions(proxy.context, handLandmarkerOptions)
            Log.d(TAG, "HandLandmarker initialized successfully")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to initialize HandLandmarker: ${e.message}")
        }
    }

    @Nullable
    override fun callback(frame: Frame, @Nullable arguments: Map<String, Any>?): Any? {
        if (handLandmarker == null) {
            Log.e(TAG, "HandLandmarker not initialized")
            return null
        }

        val image = frame.image
        val bitmap = yuvToRgbBitmap(image)

        if (bitmap == null) {
            Log.e(TAG, "Failed to convert frame to Bitmap")
            return null
        }

        val mpImage = BitmapImageBuilder(bitmap).build()
        val timestampMs = System.currentTimeMillis()
        val result: HandLandmarkerResult? = handLandmarker?.detectForVideo(mpImage, timestampMs)

        if (result == null || result.landmarks().isEmpty()) {
            Log.d(TAG, "No hands detected")
            return null
        }

        val landmarks = result.landmarks()[0]
        val landmarkList = ArrayList<Array<Double>>()
        for (landmark in landmarks) {
            landmarkList.add(arrayOf(landmark.x().toDouble(), landmark.y().toDouble(), landmark.z().toDouble()))
        }

        Log.d(TAG, "Detected ${landmarkList.size} landmarks")
        return landmarkList
    }

    private fun yuvToRgbBitmap(image: Image): Bitmap? {
        try {
            val yBuffer = image.planes[0].buffer
            val uBuffer = image.planes[1].buffer
            val vBuffer = image.planes[2].buffer

            val ySize = yBuffer.remaining()
            val uSize = uBuffer.remaining()
            val vSize = vBuffer.remaining()

            val nv21 = ByteArray(ySize + uSize + vSize)
            yBuffer.get(nv21, 0, ySize)
            vBuffer.get(nv21, ySize, vSize)
            uBuffer.get(nv21, ySize + vSize, uSize)

            val yuvImage = YuvImage(nv21, ImageFormat.NV21, image.width, image.height, null)
            val out = ByteArrayOutputStream()
            yuvImage.compressToJpeg(Rect(0, 0, image.width, image.height), 100, out)
            val imageBytes = out.toByteArray()
            return BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
        } catch (e: Exception) {
            Log.e(TAG, "YUV to RGB conversion failed: ${e.message}")
            return null
        }
    }
}