// LandmarkBuffer.kt
package com.anonymous.SenyasFSL_Mobile

class LandmarkBuffer(private val maxSize: Int = 30) {
    private val buffer = mutableListOf<FloatArray>()
    
    fun addFrame(landmarks: FloatArray) {
        if (buffer.size >= maxSize) {
            buffer.removeAt(0)
        }
        buffer.add(landmarks)
    }
    
    fun isFull(): Boolean = buffer.size == maxSize
    
    fun getSequence(): Array<FloatArray>? {
        return if (isFull()) buffer.toTypedArray() else null
    }
    
    fun clear() {
        buffer.clear()
    }
}