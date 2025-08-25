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
            val model = loadModelFile("fsl_letter_model_fp16.tflite")
            interpreter = Interpreter(model)
            promise.resolve("Model loaded successfully")
        } catch (e: Exception) {
            promise.reject("LOAD_ERROR", e)
        }
    }

    @ReactMethod
    fun predict(landmarks: ReadableArray, promise: Promise) {
        try {
            val input = FloatArray(landmarks.size()) {
                landmarks.getDouble(it).toFloat()
            }

            val output = Array(1) { FloatArray(NUM_CLASSES) }
            interpreter?.run(input, output)

            // find max class
            val maxIdx = output[0].indices.maxByOrNull { output[0][it] } ?: -1
            promise.resolve(maxIdx)
        } catch (e: Exception) {
            promise.reject("PREDICT_ERROR", e)
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
        const val NUM_CLASSES = 28 // adjust to your dataset
    }
}
