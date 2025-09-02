package com.anonymous.SenyasFSL_Mobile

import android.content.res.AssetFileDescriptor
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import org.tensorflow.lite.Interpreter
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarker
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarkerResult
import com.google.mediapipe.tasks.core.BaseOptions
import com.google.mediapipe.framework.image.MPImage
import com.google.mediapipe.framework.image.BitmapImageBuilder
import android.graphics.Bitmap
import java.io.FileInputStream
import java.nio.MappedByteBuffer
import java.nio.channels.FileChannel
import java.util.*

class SignLanguageModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private lateinit var interpreter: Interpreter
    private lateinit var handLandmarker: HandLandmarker

    private val landmarkBuffer: ArrayDeque<FloatArray> = ArrayDeque()
    private val labels = listOf(
        "A","B","C","D","E","F","G","H","I",
        "K","L","M","N","O","P","Q","R","S",
        "T","U","V","W","X","Y",
        "J","Enye","NG","Z"
    )

    override fun getName(): String = "SignLanguage"

    @ReactMethod
    fun initialize(promise: Promise) {
        try {
            // Load TFLite model
            val model = loadModelFile("FSL_Letter_model.tflite")
            interpreter = Interpreter(model)

            // Build BaseOptions
            val baseOptions = BaseOptions.builder()
                .setModelAssetPath("hand_landmarker.task")
                .build()

            // Initialize MediaPipe hand landmarker
            val options = HandLandmarker.HandLandmarkerOptions.builder()
                .setBaseOptions(baseOptions)
                .setNumHands(1)
                .build()
            handLandmarker = HandLandmarker.createFromOptions(reactContext, options)

            promise.resolve("SignLanguage initialized")
        } catch (e: Exception) {
            promise.reject("INIT_ERROR", e)
        }
    }

    private fun loadModelFile(modelName: String): MappedByteBuffer {
        val fileDescriptor: AssetFileDescriptor = reactContext.assets.openFd(modelName)
        val inputStream = FileInputStream(fileDescriptor.fileDescriptor)
        val fileChannel: FileChannel = inputStream.channel
        val startOffset = fileDescriptor.startOffset
        val declaredLength = fileDescriptor.declaredLength
        return fileChannel.map(FileChannel.MapMode.READ_ONLY, startOffset, declaredLength)
    }

    // Process each camera frame
    fun processFrame(bitmap: Bitmap) {
        val mpImage: MPImage = BitmapImageBuilder(bitmap).build()
        val result: HandLandmarkerResult = handLandmarker.detect(mpImage)

        if (result.landmarks().isNotEmpty()) {
            val hand = result.landmarks()[0]
            val flatLandmarks = hand.flatMap { listOf(it.x(), it.y(), it.z()) }.toFloatArray()

            // Maintain buffer of 30 frames
            if (landmarkBuffer.size == 30) landmarkBuffer.removeFirst()
            landmarkBuffer.addLast(flatLandmarks)

            if (landmarkBuffer.size == 30) {
                runInference()
            }
        }
    }

    private fun runInference() {
        val input = Array(1) { Array(30) { FloatArray(63) } }
        landmarkBuffer.forEachIndexed { i, frame ->
            input[0][i] = frame
        }

        val output = Array(1) { FloatArray(labels.size) }
        interpreter.run(input, output)

        val prediction = output[0]
        val maxIdx = prediction.indices.maxByOrNull { prediction[it] } ?: -1
        val confidence = prediction[maxIdx]

        if (confidence > 0.8f) {
            val label = labels[maxIdx]
            sendEvent("onPrediction", label)
        }
    }

    private fun sendEvent(event: String, data: String) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(event, data)
    }
}
