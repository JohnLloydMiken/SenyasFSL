// FSLClassifier.kt
package com.anonymous.SenyasFSL_Mobile

import android.content.Context
import org.tensorflow.lite.Interpreter
import java.io.FileInputStream
import java.nio.MappedByteBuffer
import java.nio.channels.FileChannel
import java.nio.ByteBuffer
import java.nio.ByteOrder

class FSLClassifier(context: Context) {
    private var interpreter: Interpreter? = null
    private val inputSize = 30 * 63 // 30 frames, 63 features
    private val outputSize = 28 // 28 classes
    
    // Add your sign language labels here
    private val signLabels = arrayOf(
        "A", "B", "C", "D", "E", "F", "G", "H", "I",
    "K", "L", "M", "N", "O", "P", "Q", "R", "S",
    "T", "U", "V", "W", "X", "Y",
    "J", "Enye", "NG", "Z"
    )
    
    init {
        loadModel(context)
    }
    
    private fun loadModel(context: Context) {
        try {
            val modelBuffer = loadModelFile(context, "FSL_Letter_Model.tflite")
            interpreter = Interpreter(modelBuffer)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
    
    private fun loadModelFile(context: Context, modelPath: String): MappedByteBuffer {
        val fileDescriptor = context.assets.openFd(modelPath)
        val inputStream = FileInputStream(fileDescriptor.fileDescriptor)
        val fileChannel = inputStream.channel
        val startOffset = fileDescriptor.startOffset
        val declaredLength = fileDescriptor.declaredLength
        return fileChannel.map(FileChannel.MapMode.READ_ONLY, startOffset, declaredLength)
    }
    
    fun classify(sequence: Array<FloatArray>): String? {
        if (interpreter == null || sequence.size != 30) return null
        
        try {
            // Prepare input buffer
            val inputBuffer = ByteBuffer.allocateDirect(inputSize * 4)
            inputBuffer.order(ByteOrder.nativeOrder())
            
            // Fill input buffer with sequence data
            for (frame in sequence) {
                for (value in frame) {
                    inputBuffer.putFloat(value)
                }
            }
            
            // Prepare output buffer
            val outputBuffer = ByteBuffer.allocateDirect(outputSize * 4)
            outputBuffer.order(ByteOrder.nativeOrder())
            
            // Run inference
            interpreter?.run(inputBuffer, outputBuffer)
            
            // Parse output
            outputBuffer.rewind()
            val probabilities = FloatArray(outputSize)
            for (i in 0 until outputSize) {
                probabilities[i] = outputBuffer.getFloat()
            }
            
            // Get prediction with highest confidence
            val maxIndex = probabilities.indices.maxByOrNull { probabilities[it] } ?: -1
            val confidence = probabilities[maxIndex]
            
            // Return result only if confidence is above threshold
            return if (confidence > 0.7f) { // Adjust threshold as needed
                "${signLabels[maxIndex]} (${String.format("%.2f", confidence)})"
            } else {
                null
            }
            
        } catch (e: Exception) {
            e.printStackTrace()
            return null
        }
    }
    
    fun close() {
        interpreter?.close()
    }
}