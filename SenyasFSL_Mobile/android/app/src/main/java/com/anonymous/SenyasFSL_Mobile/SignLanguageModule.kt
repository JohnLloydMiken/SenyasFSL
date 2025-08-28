package com.anonymous.SenyasFSL_Mobile

import com.facebook.react.bridge.*
import org.tensorflow.lite.Interpreter
import android.content.res.AssetFileDescriptor
import java.io.FileInputStream
import java.nio.MappedByteBuffer
import java.nio.channels.FileChannel

class SignLanguageModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var interpreter: Interpreter? = null

    override fun getName(): String = "SignLanguage"

    @ReactMethod
    fun loadModel(promise: Promise) {
        try {
            // ✅ Fixed filename to match your renamed file
            val model = loadModelFile("FSL_Letter_model.tflite")
            interpreter = Interpreter(model)
            
            // Optional: Log input/output shapes for debugging
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

            // ✅ Check if input size is correct (should be 30 * 63 = 1890)
            if (landmarks.size() != SEQUENCE_LENGTH * FEATURES_PER_FRAME) {
                promise.reject("INPUT_ERROR", 
                    "Expected ${SEQUENCE_LENGTH * FEATURES_PER_FRAME} landmarks, got ${landmarks.size()}")
                return
            }

            // ✅ Create proper 3D input array: (1, 30, 63)
            val input = Array(1) { Array(SEQUENCE_LENGTH) { FloatArray(FEATURES_PER_FRAME) } }
            
            // Fill the input array
            for (i in 0 until SEQUENCE_LENGTH) {
                for (j in 0 until FEATURES_PER_FRAME) {
                    val index = i * FEATURES_PER_FRAME + j
                    input[0][i][j] = landmarks.getDouble(index).toFloat()
                }
            }

            // ✅ Create output array: (1, 28)
            val output = Array(1) { FloatArray(NUM_CLASSES) }
            
            // Run inference
            interpreter?.run(input, output)

            // Find the class with highest probability
            val probabilities = output[0]
            val maxIdx = probabilities.indices.maxByOrNull { probabilities[it] } ?: -1
            val confidence = if (maxIdx >= 0) probabilities[maxIdx] else 0.0f

            // ✅ Return both prediction and confidence
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

    private fun loadModelFile(modelPath: String): MappedByteBuffer {
        val fileDescriptor: AssetFileDescriptor = reactApplicationContext.assets.openFd(modelPath)
        val inputStream = FileInputStream(fileDescriptor.fileDescriptor)
        val fileChannel: FileChannel = inputStream.channel
        val startOffset: Long = fileDescriptor.startOffset
        val declaredLength: Long = fileDescriptor.declaredLength
        return fileChannel.map(FileChannel.MapMode.READ_ONLY, startOffset, declaredLength)
    }

    companion object {
        const val NUM_CLASSES = 28           // Your 28 FSL letters
        const val SEQUENCE_LENGTH = 30       // 30 time steps
        const val FEATURES_PER_FRAME = 63    // 63 features per frame
        
        // Optional: Add class names for debugging
        val CLASS_NAMES = arrayOf(
            "A", "B", "C", "D", "E", "F", "G", "H", "I",
            "K", "L", "M", "N", "O", "P", "Q", "R", "S",
            "T", "U", "V", "W", "X", "Y", "J", "Ñ", "NG", "Z"
        )
    }
}