package com.anonymous.SenyasFSL_Mobile

import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import org.tensorflow.lite.Interpreter
import java.io.FileInputStream
import java.nio.MappedByteBuffer
import java.nio.channels.FileChannel
import java.util.ArrayDeque

// Updated MediaPipe Tasks Vision imports
import com.google.mediapipe.tasks.core.BaseOptions
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarker
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarkerResult
import com.google.mediapipe.framework.image.BitmapImageBuilder
import com.google.mediapipe.framework.image.MPImage
import com.google.mediapipe.tasks.vision.core.RunningMode
import android.graphics.Bitmap

// Define the interface in the module file to avoid import issues
interface FrameProcessor {
    fun processFrame(bitmap: Bitmap, timestampMs: Long)
}

/**
 * SignLanguageModule (Updated for MediaPipe Tasks Vision API)
 * - Loads TFLite model from assets
 * - Initializes MediaPipe HandLandmarker
 * - Processes landmark results and runs inference
 * - Emits predictions to React Native
 */
class SignLanguageModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), LifecycleEventListener, FrameProcessor {

    override fun getName(): String = "SignLanguageModule"

    private var interpreter: Interpreter? = null
    private var handLandmarker: HandLandmarker? = null
    private val landmarkBuffer: ArrayDeque<FloatArray> = ArrayDeque()

    private val labels = arrayOf(
        "A", "B", "C", "D", "E", "F", "G", "H", "I",
        "K", "L", "M", "N", "O", "P", "Q", "R", "S",
        "T", "U", "V", "W", "X", "Y",
        "J", "Enye", "NG", "Z"
    )

    // Tuning parameters
    private val SEQUENCE_LENGTH = 30
    private val CONFIDENCE_THRESHOLD = 0.8f
    
    // MediaPipe model file - you need to download this and place in assets folder
    private val MP_HAND_LANDMARKER_TASK = "hand_landmarker.task"

    // Static reference for camera view to access this module
    companion object {
        private var instance: SignLanguageModule? = null
        
        fun getInstance(): SignLanguageModule? = instance
        
        private fun setInstance(module: SignLanguageModule) {
            instance = module
        }
    }

    init {
        reactContext.addLifecycleEventListener(this)
        // Set this instance for camera view access
        setInstance(this)
    }

    @ReactMethod
    fun initialize(promise: Promise) {
        try {
            // Load TFLite model
            interpreter = Interpreter(loadModelFile("FSL_Letter_Model.tflite"))

            // Initialize MediaPipe HandLandmarker with Tasks Vision API
            val baseOptionsBuilder = BaseOptions.builder()
                .setModelAssetPath(MP_HAND_LANDMARKER_TASK)
            val baseOptions = baseOptionsBuilder.build()

            val optionsBuilder = HandLandmarker.HandLandmarkerOptions.builder()
                .setBaseOptions(baseOptions)
                .setMinHandDetectionConfidence(0.5f)
                .setMinTrackingConfidence(0.5f)
                .setMinHandPresenceConfidence(0.5f)
                .setNumHands(1)
                .setRunningMode(RunningMode.LIVE_STREAM)
                .setResultListener(this::processHandLandmarkerResult)
                .setErrorListener { error ->
                    Log.e("SignLanguageModule", "MediaPipe error: ${error.message}", error)
                }

            val options = optionsBuilder.build()
            handLandmarker = HandLandmarker.createFromOptions(reactContext, options)

            promise.resolve(true)
        } catch (e: Exception) {
            Log.e("SignLanguageModule", "initialize failed", e)
            promise.reject("INIT_ERROR", e)
        }
    }

    // Implementation of FrameProcessor interface
    override fun processFrame(bitmap: Bitmap, timestampMs: Long) {
        try {
            val mpImage = BitmapImageBuilder(bitmap).build()
            handLandmarker?.detectAsync(mpImage, timestampMs)
        } catch (e: Exception) {
            Log.e("SignLanguageModule", "processFrame failed", e)
        }
    }

    // Method to connect camera view to this module
    @ReactMethod
    fun connectCameraView(promise: Promise) {
        try {
            promise.resolve("Camera connection method ready")
        } catch (e: Exception) {
            promise.reject("CONNECTION_ERROR", e)
        }
    }

    // Method to check module status
    @ReactMethod
    fun getStatus(promise: Promise) {
        try {
            promise.resolve(Arguments.createMap().apply {
                putBoolean("initialized", interpreter != null && handLandmarker != null)
                putBoolean("interpreterReady", interpreter != null)
                putBoolean("handLandmarkerReady", handLandmarker != null)
                putInt("bufferSize", landmarkBuffer.size)
                putInt("maxBufferSize", SEQUENCE_LENGTH)
            })
        } catch (e: Exception) {
            promise.reject("STATUS_ERROR", e)
        }
    }

    // Updated result handler for new API
  private fun processHandLandmarkerResult(result: HandLandmarkerResult, inputImage: MPImage) {
    try {
        if (result.landmarks().isEmpty()) {
            Log.d("SignLanguageModule", "No hands detected")
            return
        }
        Log.d("SignLanguageModule", "Hands detected: ${result.landmarks().size}")

        val landmarks = result.landmarks()[0] // Get first hand
        if (landmarks.size < 21) return

        val flat = FloatArray(63) // 21 landmarks * 3 coordinates (x, y, z)
        for (i in landmarks.indices) {
            val landmark = landmarks[i]
            flat[i * 3] = landmark.x()
            flat[i * 3 + 1] = landmark.y()
            flat[i * 3 + 2] = landmark.z()
        }

        synchronized(landmarkBuffer) {
            landmarkBuffer.add(flat)
            Log.d("SignLanguageModule", "Added to buffer, size: ${landmarkBuffer.size}")
            if (landmarkBuffer.size > SEQUENCE_LENGTH) {
                landmarkBuffer.removeFirst()
            }

            if (landmarkBuffer.size == SEQUENCE_LENGTH) {
                val input = Array(1) { Array(SEQUENCE_LENGTH) { FloatArray(63) } }
                var idx = 0
                for (arr in landmarkBuffer) {
                    input[0][idx++] = arr
                }

                val output = Array(1) { FloatArray(labels.size) }
                try {
                    interpreter?.run(input, output)
                    Log.d("SignLanguageModule", "Inference run, output: ${output[0].joinToString()}")
                } catch (e: Exception) {
                    Log.e("SignLanguageModule", "TFLite inference error", e)
                    return
                }

                val predIdx = output[0].indices.maxByOrNull { output[0][it] } ?: -1
                val confidence = if (predIdx >= 0) output[0][predIdx] else 0f

                if (predIdx >= 0 && confidence > CONFIDENCE_THRESHOLD) {
                    Log.d("SignLanguageModule", "Prediction: ${labels[predIdx]}, confidence: $confidence")
                    sendEvent("onPrediction", labels[predIdx])
                } else {
                    Log.d("SignLanguageModule", "Low confidence: $confidence")
                }
            }
        }
    } catch (e: Exception) {
        Log.e("SignLanguageModule", "processHandLandmarkerResult error", e)
    }
}

    private fun loadModelFile(filename: String): MappedByteBuffer {
        val fd = reactContext.assets.openFd(filename)
        val inputStream = FileInputStream(fd.fileDescriptor)
        val fileChannel = inputStream.channel
        return fileChannel.map(FileChannel.MapMode.READ_ONLY, fd.startOffset, fd.declaredLength)
    }

    private fun sendEvent(event: String, data: String) {
        try {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(event, data)
        } catch (e: Exception) {
            Log.e("SignLanguageModule", "sendEvent failed", e)
        }
    }

    // Lifecycle cleanup
    override fun onHostResume() {}
    override fun onHostPause() {}
    override fun onHostDestroy() {
        try {
            interpreter?.close()
            handLandmarker?.close()
            instance = null // Clear the static reference
        } catch (e: Exception) {
            Log.e("SignLanguageModule", "onHostDestroy error", e)
        }
    }
}