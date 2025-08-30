package com.anonymous.SenyasFSL_Mobile

import com.facebook.react.bridge.*
import org.tensorflow.lite.Interpreter
import android.content.res.AssetFileDescriptor
import java.io.FileInputStream
import java.nio.MappedByteBuffer
import java.nio.channels.FileChannel
import com.google.mediapipe.framework.image.BitmapImageBuilder
import com.google.mediapipe.framework.image.MPImage
import com.google.mediapipe.tasks.core.BaseOptions
import com.google.mediapipe.tasks.core.Delegate
import com.google.mediapipe.tasks.vision.core.RunningMode
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarker
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarkerResult
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarker.HandLandmarkerOptions
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageAnalysis
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.core.content.ContextCompat
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import android.graphics.YuvImage
import android.graphics.ImageFormat
import android.graphics.Rect
import android.graphics.BitmapFactory
import java.io.ByteArrayOutputStream
import android.graphics.Bitmap
import android.graphics.Matrix

class SignLanguageModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var interpreter: Interpreter? = null
    private var handLandmarker: HandLandmarker? = null
    private var cameraExecutor: ExecutorService? = null
    private var cameraProvider: ProcessCameraProvider? = null
    private val landmarkBuffer = mutableListOf<FloatArray>()  // Buffer for 30 frames of 63 features
    private var frameTimestampMs: Long = 0  // For MediaPipe timestamps

    override fun getName(): String = "SignLanguage"

    @ReactMethod
    fun loadModel(promise: Promise) {
        try {
            val model = loadModelFile("FSL_Letter_model.tflite")
            interpreter = Interpreter(model)
            
            val inputShape = interpreter?.getInputTensor(0)?.shape()
            val outputShape = interpreter?.getOutputTensor(0)?.shape()
            android.util.Log.d("SignLanguage", "Input shape: ${inputShape?.contentToString()}")
            android.util.Log.d("SignLanguage", "Output shape: ${outputShape?.contentToString()}")
            
            promise.resolve("Model loaded successfully")
        } catch (e: Exception) {
            android.util.Log.e("SignLanguage", "Load error", e)
            promise.reject("LOAD_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun predict(landmarks: ReadableArray, promise: Promise) {
        try {
            if (interpreter == null) {
                promise.reject("MODEL_ERROR", "Model not loaded. Call loadModel first.")
                return
            }

            if (landmarks.size() != SEQUENCE_LENGTH * FEATURES_PER_FRAME) {
                promise.reject("INPUT_ERROR", 
                    "Expected ${SEQUENCE_LENGTH * FEATURES_PER_FRAME} landmarks, got ${landmarks.size()}")
                return
            }

            val input = Array(1) { Array(SEQUENCE_LENGTH) { FloatArray(FEATURES_PER_FRAME) } }
            for (i in 0 until SEQUENCE_LENGTH) {
                for (j in 0 until FEATURES_PER_FRAME) {
                    val index = i * FEATURES_PER_FRAME + j
                    input[0][i][j] = landmarks.getDouble(index).toFloat()
                }
            }

            val output = Array(1) { FloatArray(NUM_CLASSES) }
            interpreter?.run(input, output)

            val probabilities = output[0]
            val maxIdx = probabilities.indices.maxByOrNull { probabilities[it] } ?: -1
            val confidence = if (maxIdx >= 0) probabilities[maxIdx] else 0.0f

            val result = WritableNativeMap().apply {
                putInt("prediction", maxIdx)
                putDouble("confidence", confidence.toDouble())
                putArray("probabilities", WritableNativeArray().apply {
                    probabilities.forEach { pushDouble(it.toDouble()) }
                })
            }
            
            promise.resolve(result)
        } catch (e: Exception) {
            android.util.Log.e("SignLanguage", "Prediction error", e)
            promise.reject("PREDICT_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun initHandLandmarker(promise: Promise) {
        try {
            val baseOptions = BaseOptions.builder()
                .setModelAssetPath("hand_landmarker.task")
                .setDelegate(Delegate.GPU)
                .build()

            val options = HandLandmarkerOptions.builder()
                .setBaseOptions(baseOptions)
                .setRunningMode(RunningMode.LIVE_STREAM)
                .setNumHands(1)
                .setMinHandDetectionConfidence(0.5f)
                .setMinHandPresenceConfidence(0.5f)
                .setMinTrackingConfidence(0.5f)
                .setResultListener { result, inputImage -> processLandmarkerResult(result) }
                .setErrorListener { error -> android.util.Log.e("SignLanguage", "HandLandmarker error", error) }
                .build()

            handLandmarker = HandLandmarker.createFromOptions(reactApplicationContext, options)
            promise.resolve("HandLandmarker initialized")
        } catch (e: Exception) {
            android.util.Log.e("SignLanguage", "Init error", e)
            promise.reject("INIT_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun startCamera(promise: Promise) {
        try {
            if (handLandmarker == null) {
                promise.reject("INIT_ERROR", "Initialize HandLandmarker first")
                return
            }

            cameraExecutor = Executors.newSingleThreadExecutor()
            val cameraProviderFuture = ProcessCameraProvider.getInstance(reactApplicationContext)
            cameraProviderFuture.addListener({
                cameraProvider = cameraProviderFuture.get()

                val imageAnalysis = ImageAnalysis.Builder()
                    .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                    .build()
                    .also {
                        it.setAnalyzer(cameraExecutor!!) { imageProxy ->
                            processCameraFrame(imageProxy)
                        }
                    }

                val cameraSelector = CameraSelector.DEFAULT_FRONT_CAMERA  // Changed to front camera

                cameraProvider?.unbindAll()
                try {
                    cameraProvider?.bindToLifecycle(
                        currentActivity as androidx.lifecycle.LifecycleOwner,
                        cameraSelector,
                        imageAnalysis
                    )
                    promise.resolve("Camera started")
                } catch (e: Exception) {
                    promise.reject("CAMERA_BIND_ERROR", "Failed to bind camera: ${e.message}", e)
                }
            }, ContextCompat.getMainExecutor(reactApplicationContext))
        } catch (e: Exception) {
            android.util.Log.e("SignLanguage", "Camera start error", e)
            promise.reject("CAMERA_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun stopCamera(promise: Promise) {
        try {
            cameraProvider?.unbindAll()
            cameraExecutor?.shutdown()
            cameraExecutor?.awaitTermination(1000, TimeUnit.MILLISECONDS)
            landmarkBuffer.clear()
            promise.resolve("Camera stopped")
        } catch (e: Exception) {
            android.util.Log.e("SignLanguage", "Stop camera error", e)
            promise.reject("STOP_CAMERA_ERROR", e.message, e)
        }
    }

    private fun processCameraFrame(imageProxy: androidx.camera.core.ImageProxy) {
        val rotationDegrees = imageProxy.imageInfo.rotationDegrees
        val bitmap = imageProxy.toBitmap()
        val rotatedBitmap = if (rotationDegrees != 0) {
            val matrix = Matrix().apply { postRotate(rotationDegrees.toFloat()) }
            Bitmap.createBitmap(bitmap, 0, 0, bitmap.width, bitmap.height, matrix, true)
        } else {
            bitmap
        }
        val mpImage = BitmapImageBuilder(rotatedBitmap).build()

        frameTimestampMs += 1000L / 30
        handLandmarker?.detectAsync(mpImage, frameTimestampMs)
        imageProxy.close()
    }

    private fun loadModelFile(modelPath: String): MappedByteBuffer {
        val fileDescriptor: AssetFileDescriptor = reactApplicationContext.assets.openFd(modelPath)
        val inputStream = FileInputStream(fileDescriptor.fileDescriptor)
        val fileChannel: FileChannel = inputStream.channel
        val startOffset: Long = fileDescriptor.startOffset
        val declaredLength: Long = fileDescriptor.declaredLength
        return fileChannel.map(FileChannel.MapMode.READ_ONLY, startOffset, declaredLength)
    }

    private fun androidx.camera.core.ImageProxy.toBitmap(): Bitmap? {
        val nv21Buffer = yuv420ToNv21(this)
        val yuvImage = YuvImage(nv21Buffer, ImageFormat.NV21, width, height, null)
        val out = ByteArrayOutputStream()
        yuvImage.compressToJpeg(Rect(0, 0, width, height), 100, out)
        val imageBytes = out.toByteArray()
        return BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
    }

    private fun yuv420ToNv21(imageProxy: androidx.camera.core.ImageProxy): ByteArray {
        val planes = imageProxy.planes
        val width = imageProxy.width
        val height = imageProxy.height
        val yBytes = ByteArray(width * height)
        val uBytes = ByteArray(width * height / 4)
        val vBytes = ByteArray(width * height / 4)
        val nv21 = ByteArray(width * height * 3 / 2)

        planes[0].buffer.get(yBytes)
        planes[1].buffer.get(uBytes)
        planes[2].buffer.get(vBytes)

        System.arraycopy(yBytes, 0, nv21, 0, yBytes.size)
        for (i in uBytes.indices) {
            nv21[yBytes.size + (i * 2) + 1] = uBytes[i]  // U
            nv21[yBytes.size + (i * 2)] = vBytes[i]      // V (VU interleaved for NV21)
        }
        return nv21
    }

    private fun processLandmarkerResult(result: HandLandmarkerResult?) {
        if (result == null || result.landmarks().isEmpty()) {
            android.util.Log.d("SignLanguage", "No hand detected")
            return
        }

        val landmarks = result.landmarks()[0]
        val features = FloatArray(FEATURES_PER_FRAME)
        var idx = 0
        for (landmark in landmarks) {
            features[idx++] = landmark.x()
            features[idx++] = landmark.y()
            features[idx++] = landmark.z()
        }

        landmarkBuffer.add(features)
        if (landmarkBuffer.size >= SEQUENCE_LENGTH) {
            val flatLandmarks = FloatArray(SEQUENCE_LENGTH * FEATURES_PER_FRAME)
            for (i in 0 until SEQUENCE_LENGTH) {
                System.arraycopy(landmarkBuffer[i], 0, flatLandmarks, i * FEATURES_PER_FRAME, FEATURES_PER_FRAME)
            }

            val input = Array(1) { Array(SEQUENCE_LENGTH) { FloatArray(FEATURES_PER_FRAME) } }
            for (i in 0 until SEQUENCE_LENGTH) {
                System.arraycopy(landmarkBuffer[i], 0, input[0][i], 0, FEATURES_PER_FRAME)
            }
            val output = Array(1) { FloatArray(NUM_CLASSES) }
            interpreter?.run(input, output)

            val probabilities = output[0]
            val maxIdx = probabilities.indices.maxByOrNull { probabilities[it] } ?: -1
            val confidence = if (maxIdx >= 0) probabilities[maxIdx] else 0.0f
            val prediction = if (maxIdx >= 0) CLASS_NAMES[maxIdx] else "Unknown"

            val event = WritableNativeMap().apply {
                putString("letter", prediction)
                putDouble("confidence", confidence.toDouble())
            }
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("onPrediction", event)

            landmarkBuffer.removeAt(0)
        }
    }

    companion object {
        const val NUM_CLASSES = 28
        const val SEQUENCE_LENGTH = 30
        const val FEATURES_PER_FRAME = 63
        
        val CLASS_NAMES = arrayOf(
            "A", "B", "C", "D", "E", "F", "G", "H", "I",
            "K", "L", "M", "N", "O", "P", "Q", "R", "S",
            "T", "U", "V", "W", "X", "Y", "J", "Ñ", "NG", "Z"
        )
    }
}