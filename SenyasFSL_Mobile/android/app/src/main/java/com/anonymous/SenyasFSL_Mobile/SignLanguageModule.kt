package com.anonymous.SenyasFSL_Mobile

import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import org.tensorflow.lite.Interpreter
import java.io.FileInputStream
import java.nio.MappedByteBuffer
import java.nio.channels.FileChannel
import java.util.ArrayDeque

// MediaPipe Tasks Vision
import com.google.mediapipe.tasks.core.BaseOptions
import com.google.mediapipe.tasks.vision.core.RunningMode
import com.google.mediapipe.tasks.vision.core.ImageProcessingOptions
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarker
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarkerResult
import com.google.mediapipe.framework.image.BitmapImageBuilder
import com.google.mediapipe.framework.image.MPImage
import android.graphics.Bitmap

// Interface called by CameraView
interface FrameProcessor {
    fun processFrame(bitmap: Bitmap, rotationDegrees: Int, timestampMs: Long)
}

class SignLanguageModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), LifecycleEventListener, FrameProcessor {

    override fun getName(): String = "SignLanguageModule"

    private var interpreter: Interpreter? = null
    private var handLandmarker: HandLandmarker? = null
    private val landmarkBuffer: ArrayDeque<FloatArray> = ArrayDeque()

    private val labels = arrayOf(
        "A","B","C","D","E","F","G","H","I",
        "K","L","M","N","O","P","Q","R","S",
        "T","U","V","W","X","Y",
        "J","Enye","NG","Z"
    )

    private val SEQUENCE_LENGTH = 30
    private val CONFIDENCE_THRESHOLD = 0.8f
    private val MP_HAND_LANDMARKER_TASK = "hand_landmarker.task"

    private var jsListenerCount = 0

    companion object {
        private var instance: SignLanguageModule? = null
        fun getInstance(): SignLanguageModule? = instance
        private fun setInstance(m: SignLanguageModule) { instance = m }
    }

    init {
        reactContext.addLifecycleEventListener(this)
        setInstance(this)
    }

    // ---- RN emitter stubs (prevents warnings / throttling) ----
    @ReactMethod fun addListener(eventName: String) { jsListenerCount += 1 }
    @ReactMethod fun removeListeners(count: Int) { jsListenerCount = (jsListenerCount - count).coerceAtLeast(0) }
    // -----------------------------------------------------------

    @ReactMethod
    fun initialize(promise: Promise) {
        try {
            interpreter = Interpreter(loadModelFile("FSL_Letter_Model.tflite"))

            val baseOptions = BaseOptions.builder()
                .setModelAssetPath(MP_HAND_LANDMARKER_TASK)
                .build()

            val options = HandLandmarker.HandLandmarkerOptions.builder()
                .setBaseOptions(baseOptions)
                .setMinHandDetectionConfidence(0.5f)
                .setMinTrackingConfidence(0.5f)
                .setMinHandPresenceConfidence(0.5f)
                .setNumHands(1)
                .setRunningMode(RunningMode.LIVE_STREAM)
                .setResultListener(this::onHandResult)
                .setErrorListener { err -> Log.e("SignLanguageModule", "MP error: ${err.message}", err) }
                .build()

            handLandmarker = HandLandmarker.createFromOptions(reactContext, options)
            promise.resolve(true)
        } catch (e: Exception) {
            Log.e("SignLanguageModule", "initialize failed", e)
            promise.reject("INIT_ERROR", e)
        }
    }

    // Called each frame by the CameraView (with rotation from CameraX)
    override fun processFrame(bitmap: Bitmap, rotationDegrees: Int, timestampMs: Long) {
        try {
            val mpImage = BitmapImageBuilder(bitmap).build()
            val imgOpts = ImageProcessingOptions.builder()
                .setRotationDegrees(rotationDegrees)
                .build()
            handLandmarker?.detectAsync(mpImage, imgOpts, timestampMs)
        } catch (e: Exception) {
            Log.e("SignLanguageModule", "processFrame failed", e)
        }
    }

    @ReactMethod
    fun getStatus(promise: Promise) {
        try {
            promise.resolve(Arguments.createMap().apply {
                putBoolean("initialized", interpreter != null && handLandmarker != null)
                putBoolean("interpreterReady", interpreter != null)
                putBoolean("handLandmarkerReady", handLandmarker != null)
                putInt("bufferSize", landmarkBuffer.size)
                putInt("maxBufferSize", SEQUENCE_LENGTH)
                putInt("listeners", jsListenerCount)
            })
        } catch (e: Exception) {
            promise.reject("STATUS_ERROR", e)
        }
    }

    private fun onHandResult(result: HandLandmarkerResult, @Suppress("UNUSED_PARAMETER") inputImage: MPImage) {
        try {
            val hands = result.landmarks()
            if (hands.isEmpty()) {
                if (landmarkBuffer.size > 0) landmarkBuffer.removeFirst()
                Log.d("SignLanguageModule", "No hands detected")
                return
            }
            Log.d("SignLanguageModule", "Hands detected: ${hands.size}")

            val lmks = hands[0]
            if (lmks.size < 21) return

            val flat = FloatArray(63)
            for (i in lmks.indices) {
                val l = lmks[i]
                flat[i*3] = l.x()
                flat[i*3 + 1] = l.y()
                flat[i*3 + 2] = l.z()
            }

            synchronized(landmarkBuffer) {
                landmarkBuffer.add(flat)
                if (landmarkBuffer.size > SEQUENCE_LENGTH) landmarkBuffer.removeFirst()
                Log.d("SignLanguageModule", "buffer size=${landmarkBuffer.size}")

                if (landmarkBuffer.size == SEQUENCE_LENGTH) {
                    val inputArr = Array(1) { Array(SEQUENCE_LENGTH) { FloatArray(63) } }
                    var idx = 0
                    for (arr in landmarkBuffer) inputArr[0][idx++] = arr

                    val output = Array(1) { FloatArray(labels.size) }
                    try {
                        interpreter?.run(inputArr, output)
                    } catch (e: Exception) {
                        Log.e("SignLanguageModule", "TFLite inference error", e)
                        return
                    }

                    val probs = output[0]
                    var maxIdx = 0
                    var maxVal = probs[0]
                    for (i in 1 until probs.size) { if (probs[i] > maxVal) { maxVal = probs[i]; maxIdx = i } }

                    if (maxVal >= CONFIDENCE_THRESHOLD) {
                        emitPrediction(labels[maxIdx], maxVal)
                        landmarkBuffer.clear() // gate next stable sequence
                    } else {
                        Log.d("SignLanguageModule", "Low confidence: $maxVal")
                    }
                }
            }
        } catch (e: Exception) {
            Log.e("SignLanguageModule", "onHandResult error", e)
        }
    }

    private fun emitPrediction(label: String, conf: Float) {
        if (jsListenerCount <= 0) return
        try {
            val map = Arguments.createMap().apply {
                putString("label", label)
                putDouble("confidence", conf.toDouble())
            }
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("onPrediction", map)
        } catch (e: Exception) {
            Log.e("SignLanguageModule", "emitPrediction failed", e)
        }
    }

    private fun loadModelFile(filename: String): MappedByteBuffer {
        val fd = reactContext.assets.openFd(filename)
        val inputStream = FileInputStream(fd.fileDescriptor)
        val channel = inputStream.channel
        return channel.map(FileChannel.MapMode.READ_ONLY, fd.startOffset, fd.declaredLength)
    }

    override fun onHostResume() {}
    override fun onHostPause() {}
    override fun onHostDestroy() {
    try {
        interpreter?.close()
        handLandmarker?.close()
        instance = null // ✅ no "companion."
    } catch (e: Exception) {
        Log.e("SignLanguageModule", "onHostDestroy error", e)
    }
}
}
