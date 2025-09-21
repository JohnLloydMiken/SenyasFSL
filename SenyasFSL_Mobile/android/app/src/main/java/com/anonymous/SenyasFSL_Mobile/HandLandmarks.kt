// HandLandmarks.kt (corrected version)
package com.anonymous.SenyasFSL_Mobile

import android.content.Context
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.mediapipe.framework.image.BitmapImageBuilder
import com.google.mediapipe.framework.image.MPImage
import com.google.mediapipe.tasks.core.BaseOptions
import com.google.mediapipe.tasks.core.OutputHandler
import com.google.mediapipe.tasks.vision.core.RunningMode
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarker
import com.google.mediapipe.tasks.vision.handlandmarker.HandLandmarkerResult

class HandLandmarks(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    private lateinit var fslClassifier: FSLClassifier
    private val landmarkBuffer = LandmarkBuffer(30)
    
    override fun getName(): String = "HandLandmarks"
    
    init {
        // Initialize FSL classifier
        fslClassifier = FSLClassifier(reactContext)
    }
    
    private fun sendEvent(eventName: String, params: WritableMap?) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    @ReactMethod
    fun initModel() {
        // Check if the HandLandmarker has already been initialized
        if (HandLandmarkerHolder.handLandmarker != null) {
            // Model is already initialized, send a status update to JavaScript
            val alreadyInitializedParams = Arguments.createMap()
            alreadyInitializedParams.putString("status", "Model already initialized")
            sendEvent("onHandLandmarksStatus", alreadyInitializedParams)
            return
        }

        // Define the result listener (ONLY ONE - removed the duplicate)
        val resultListener = OutputHandler.ResultListener { result: HandLandmarkerResult, inputImage: MPImage ->
            Log.d("HandLandmarksFrameProcessor", "Detected ${result.landmarks().size} hands")
            
            // Process for FSL classification first
            processHandLandmarks(result)
            
            // Then prepare the data to be sent back to JavaScript (original functionality)
            val landmarksArray = Arguments.createArray()

            for (handLandmarks in result.landmarks()) {
                val handMap = Arguments.createArray()
                for ((index, handmark) in handLandmarks.withIndex()) {
                    val landmarkMap = Arguments.createMap()
                    landmarkMap.putInt("keypoint", index)
                    landmarkMap.putDouble("x", handmark.x().toDouble())
                    landmarkMap.putDouble("y", handmark.y().toDouble())
                    landmarkMap.putDouble("z", handmark.z().toDouble())
                    handMap.pushMap(landmarkMap)
                }
                landmarksArray.pushArray(handMap)
            }

            var handName = ""
            for(hand in result.handedness()) {
                for(handProps in hand){
                    handName = handProps.categoryName()
                }
            }

            val params = Arguments.createMap()
            params.putArray("landmarks", landmarksArray)
            params.putString("hand", handName)
            // Send the landmarks data back to JavaScript
            sendEvent("onHandLandmarksDetected", params)
        }

        // Initialize the Hand Landmarker
        try {
            val context: Context = reactApplicationContext
            val baseOptions = BaseOptions.builder()
                    .setModelAssetPath("hand_landmarker.task")
                    .build()

            val handLandmarkerOptions = HandLandmarker.HandLandmarkerOptions.builder()
                    .setBaseOptions(baseOptions)
                    .setNumHands(1)
                    .setRunningMode(RunningMode.LIVE_STREAM)
                    .setResultListener(resultListener)
                    .build()

            HandLandmarkerHolder.handLandmarker = HandLandmarker.createFromOptions(context, handLandmarkerOptions)

            // Send success event to JS
            val successParams = Arguments.createMap()
            successParams.putString("status", "Model initialized successfully")
            sendEvent("onHandLandmarksStatus", successParams)

        } catch (e: Exception) {
            Log.e("HandLandmarksFrameProcessor", "Error initializing HandLandmarker", e)

            // Send error event to JS
            val errorParams = Arguments.createMap()
            errorParams.putString("error", e.message)
            sendEvent("onHandLandmarksError", errorParams)
        }
    }
    
    private fun processHandLandmarks(result: HandLandmarkerResult) {
        if (result.landmarks().isEmpty()) return
        
        // Get the first hand's landmarks
        val handLandmarks = result.landmarks()[0]
        
        // Convert to flat array (63 features: 21 landmarks × 3 coordinates)
        val landmarkArray = FloatArray(63)
        var index = 0
        for (landmark in handLandmarks) {
            landmarkArray[index++] = landmark.x()
            landmarkArray[index++] = landmark.y()
            landmarkArray[index++] = landmark.z()
        }
        
        // Add to buffer
        landmarkBuffer.addFrame(landmarkArray)
        
        // Classify when buffer is full
        if (landmarkBuffer.isFull()) {
            val sequence = landmarkBuffer.getSequence()
            sequence?.let {
                val prediction = fslClassifier.classify(it)
                prediction?.let { sign ->
                    Log.d("FSL_Recognition", "Detected sign: $sign")
                    
                    // Send to React Native
                    val params = Arguments.createMap()
                    params.putString("prediction", sign)
                    sendEvent("onSignLanguageDetected", params)
                }
            }
        }
    }
}